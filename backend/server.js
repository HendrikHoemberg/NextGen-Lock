const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); 
app.use(express.json());

// Database connection
const dbPath = path.join(__dirname, '../db/nextgenlock.db');
const db = new Database(dbPath);
console.log('Connected to SQLite database');

// Serial Port Configuration
let serialPort = null;
let parser = null;

// Try to find and connect to Arduino
async function connectToArduino() {
  try {
    const ports = await SerialPort.list();
    console.log('Available ports:', ports.map(p => p.path));
    
    // Look for Arduino (usually contains 'USB' or 'ACM' in path)
    const arduinoPort = ports.find(p => 
      p.path.includes('ttyACM') || 
      p.path.includes('ttyUSB') || 
      p.path.includes('COM')
    );
    
    if (arduinoPort) {
      serialPort = new SerialPort({
        path: arduinoPort.path,
        baudRate: 9600
      });
      
      parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));
      
      serialPort.on('open', () => {
        console.log(`Connected to Arduino on ${arduinoPort.path}`);
      });
      
      parser.on('data', handleArduinoData);
      
      serialPort.on('error', (err) => {
        console.error('Serial port error:', err);
      });
    } else {
      console.log('Arduino not found. Serial communication disabled.');
    }
  } catch (err) {
    console.error('Error connecting to Arduino:', err);
  }
}

// Handle incoming data from Arduino
function handleArduinoData(data) {
  const line = data.trim();
  console.log('Arduino data:', line);
  
  // Look for card UID in format "USER ID tag : XX XX XX XX"
  if (line.includes('USER ID tag :')) {
    const uid = line.split(':')[1].trim().toUpperCase();
    console.log('Card UID detected:', uid);
    
    try {
      // Check if card is authorized
      const card = db.prepare('SELECT card_uid, user_id, authorized FROM rfid_card WHERE card_uid = ?').get(uid);
      
      let accessGranted = false;
      let note = '';
      
      if (!card) {
        note = 'Karte nicht registriert';
      } else if (card.authorized === 0) {
        note = 'Karte nicht autorisiert';
      } else {
        accessGranted = true;
        note = 'Karte autorisiert';
      }
      
      // Log the access attempt
      const result = db.prepare('INSERT INTO access_log (card_uid, access_granted, note) VALUES (?, ?, ?)').run(uid, accessGranted ? 1 : 0, note);
      
      // Get the newly created log with user information
      const newLog = db.prepare(`
        SELECT al.*, u.first_name, u.last_name 
        FROM access_log al
        LEFT JOIN rfid_card rc ON al.card_uid = rc.card_uid
        LEFT JOIN user u ON rc.user_id = u.user_id
        WHERE al.log_id = ?
      `).get(result.lastInsertRowid);
      
      // Send response back to Arduino
      if (serialPort && serialPort.isOpen) {
        serialPort.write(accessGranted ? 'GRANTED\n' : 'DENIED\n');
      }
    } catch (err) {
      console.error('Database error:', err);
    }
  }
}

// Initialize serial connection
connectToArduino();

// ========== USERS ENDPOINTS ==========

// GET all users
app.get('/api/users', (request, response) => {
  try {
    const users = db.prepare('SELECT * FROM user ORDER BY created_at DESC').all();
    response.json(users);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// GET user by ID
app.get('/api/users/:id', (request, response) => {
  try {
    const user = db.prepare('SELECT * FROM user WHERE user_id = ?').get(request.params.id);
    if (!user) {
      response.status(404).json({ error: 'User not found' });
      return;
    }
    response.json(user);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// POST create user
app.post('/api/users', (request, response) => {
  const { first_name, last_name } = request.body;
  
  if (!first_name || !last_name) {
    response.status(400).json({ error: 'first_name and last_name are required' });
    return;
  }
  
  try {
    const result = db.prepare('INSERT INTO user (first_name, last_name) VALUES (?, ?)').run(first_name, last_name);
    response.status(201).json({ user_id: result.lastInsertRowid, first_name, last_name });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// PUT update user
app.put('/api/users/:id', (request, response) => {
  const { first_name, last_name } = request.body;
  
  try {
    const result = db.prepare('UPDATE user SET first_name = ?, last_name = ? WHERE user_id = ?').run(first_name, last_name, request.params.id);
    if (result.changes === 0) {
      response.status(404).json({ error: 'User not found' });
      return;
    }
    response.json({ user_id: request.params.id, first_name, last_name });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// DELETE user
app.delete('/api/users/:id', (request, response) => {
  try {
    // Set all cards linked to this user as unauthorized
    db.prepare('UPDATE rfid_card SET authorized = 0 WHERE user_id = ?').run(request.params.id);
    
    const result = db.prepare('DELETE FROM user WHERE user_id = ?').run(request.params.id);
    if (result.changes === 0) {
      response.status(404).json({ error: 'User not found' });
      return;
    }
    response.json({ message: 'User deleted' });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// ========== RFID CARDS ENDPOINTS ==========

// GET all cards
app.get('/api/cards', (request, response) => {
  try {
    const cards = db.prepare(`SELECT c.*, u.first_name, u.last_name 
     FROM rfid_card c 
     LEFT JOIN user u ON c.user_id = u.user_id 
     ORDER BY c.added_on DESC`).all();
    response.json(cards);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// GET card by ID
app.get('/api/cards/:cardId', (request, response) => {
  try {
    const card = db.prepare(`SELECT c.*, u.first_name, u.last_name 
     FROM rfid_card c 
     LEFT JOIN user u ON c.user_id = u.user_id 
     WHERE c.card_uid = ?`).get(request.params.cardId);
    if (!card) {
      response.status(404).json({ error: 'Card not found' });
      return;
    }
    response.json(card);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// GET cards by user ID
app.get('/api/users/:userId/cards', (request, response) => {
  try {
    const cards = db.prepare('SELECT * FROM rfid_card WHERE user_id = ? ORDER BY added_on DESC').all(request.params.userId);
    response.json(cards);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// POST create card
app.post('/api/cards', (request, response) => {
  const { card_uid, user_id, authorized } = request.body;
  
  if (!card_uid) {
    response.status(400).json({ error: 'card_uid is required' });
    return;
  }
  
  try {
    db.prepare('INSERT INTO rfid_card (card_uid, user_id, authorized) VALUES (?, ?, ?)').run(card_uid, user_id || null, authorized ? 1 : 0);
    response.status(201).json({ card_uid, user_id, authorized });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// PUT update card
app.put('/api/cards/:cardId', (request, response) => {
  const { user_id, authorized } = request.body;
  
  try {
    const result = db.prepare('UPDATE rfid_card SET user_id = ?, authorized = ? WHERE card_uid = ?').run(user_id || null, authorized ? 1 : 0, request.params.cardId);
    if (result.changes === 0) {
      response.status(404).json({ error: 'Card not found' });
      return;
    }
    response.json({ card_uid: request.params.cardId, user_id, authorized });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// DELETE card
app.delete('/api/cards/:cardId', (request, response) => {
  try {
    const result = db.prepare('DELETE FROM rfid_card WHERE card_uid = ?').run(request.params.cardId);
    if (result.changes === 0) {
      response.status(404).json({ error: 'Card not found' });
      return;
    }
    response.json({ message: 'Card deleted' });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// PATCH authorize card
app.patch('/api/cards/:cardId/authorize', (request, response) => {
  try {
    const result = db.prepare('UPDATE rfid_card SET authorized = 1 WHERE card_uid = ?').run(request.params.cardId);
    if (result.changes === 0) {
      response.status(404).json({ error: 'Card not found' });
      return;
    }
    response.json({ message: 'Card authorized' });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// PATCH revoke card authorization
app.patch('/api/cards/:cardId/revoke', (request, response) => {
  try {
    const result = db.prepare('UPDATE rfid_card SET authorized = 0 WHERE card_uid = ?').run(request.params.cardId);
    if (result.changes === 0) {
      response.status(404).json({ error: 'Card not found' });
      return;
    }
    response.json({ message: 'Card authorization revoked' });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// GET verify card (for manual testing)
app.get('/api/cards/:cardId/verify', (request, response) => {
  try {
    const card = db.prepare('SELECT card_uid, user_id, authorized FROM rfid_card WHERE card_uid = ?').get(request.params.cardId);
    if (!card) {
      response.json({ authorized: false, message: 'Card not registered' });
      return;
    }
    response.json({ 
      authorized: card.authorized === 1, 
      card_uid: card.card_uid,
      user_id: card.user_id 
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// ========== ACCESS LOGS ENDPOINTS ==========

// GET all logs with optional filters
app.get('/api/logs', (request, response) => {
  const { access_granted, limit, offset } = request.query;
  
  try {
    let query = `
      SELECT al.*, u.first_name, u.last_name 
      FROM access_log al
      LEFT JOIN rfid_card rc ON al.card_uid = rc.card_uid
      LEFT JOIN user u ON rc.user_id = u.user_id
      WHERE 1=1
    `;
    const params = [];
    
    if (access_granted !== undefined) {
      query += ' AND al.access_granted = ?';
      params.push(access_granted);
    }
    
    query += ' ORDER BY al.access_time DESC';
    
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }
    
    if (offset) {
      query += ' OFFSET ?';
      params.push(parseInt(offset));
    }
    
    const logs = db.prepare(query).all(...params);
    response.json(logs);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// GET recent logs
app.get('/api/logs/recent', (request, response) => {
  const limit = request.query.limit || 10;
  
  try {
    const logs = db.prepare(`
      SELECT al.*, u.first_name, u.last_name 
      FROM access_log al
      LEFT JOIN rfid_card rc ON al.card_uid = rc.card_uid
      LEFT JOIN user u ON rc.user_id = u.user_id
      ORDER BY al.access_time DESC 
      LIMIT ?
    `).all(parseInt(limit));
    response.json(logs);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// GET log by ID
app.get('/api/logs/:id', (request, response) => {
  try {
    const log = db.prepare('SELECT * FROM access_log WHERE log_id = ?').get(request.params.id);
    if (!log) {
      response.status(404).json({ error: 'Log not found' });
      return;
    }
    response.json(log);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Cleanup on exit
process.on('SIGINT', () => {
  db.close();
  if (serialPort && serialPort.isOpen) {
    serialPort.close();
  }
  console.log('\nServer stopped');
  process.exit();
});
