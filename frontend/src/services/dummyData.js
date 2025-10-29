/**
 * Dummy Data for RFID Access Control System
 * Used for development and testing when backend is unavailable
 */

// Dummy Users
export const dummyUsers = [
  {
    user_id: '1',
    first_name: 'Max',
    last_name: 'Mustermann',
    created_at: '2025-01-15T10:30:00Z',
  },
  {
    user_id: '2',
    first_name: 'Anna',
    last_name: 'Schmidt',
    created_at: '2025-01-18T14:20:00Z',
  },
  {
    user_id: '3',
    first_name: 'Thomas',
    last_name: 'Weber',
    created_at: '2025-02-01T09:15:00Z',
  },
  {
    user_id: '4',
    first_name: 'Julia',
    last_name: 'Müller',
    created_at: '2025-02-05T11:45:00Z',
  },
  {
    user_id: '5',
    first_name: 'Robert',
    last_name: 'Bauer',
    created_at: '2025-02-10T16:30:00Z',
  },
]

// Dummy RFID Cards
export const dummyCards = [
  {
    card_id: '1',
    uid: 'A1:B2:C3:D4',
    user_id: '1',
    authorized: true,
    added_on: '2025-01-15T10:35:00Z',
  },
  {
    card_id: '2',
    uid: 'E5:F6:G7:H8',
    user_id: '2',
    authorized: true,
    added_on: '2025-01-18T14:25:00Z',
  },
  {
    card_id: '3',
    uid: 'I9:J0:K1:L2',
    user_id: '3',
    authorized: true,
    added_on: '2025-02-01T09:20:00Z',
  },
  {
    card_id: '4',
    uid: 'M3:N4:O5:P6',
    user_id: '1',
    authorized: false,
    added_on: '2025-02-08T13:10:00Z',
  },
  {
    card_id: '5',
    uid: 'Q7:R8:S9:T0',
    user_id: '4',
    authorized: true,
    added_on: '2025-02-05T11:50:00Z',
  },
  {
    card_id: '6',
    uid: 'U1:V2:W3:X4',
    user_id: '5',
    authorized: true,
    added_on: '2025-02-10T16:35:00Z',
  },
  {
    card_id: '7',
    uid: 'Y5:Z6:A7:B8',
    user_id: '2',
    authorized: false,
    added_on: '2025-02-20T10:00:00Z',
  },
]

// Dummy Access Logs
export const dummyLogs = [
  {
    log_id: '1',
    card_uid: 'A1:B2:C3:D4',
    access_granted: true,
    access_time: '2025-10-29T08:00:00Z',
    note: 'Zugang gewährt',
  },
  {
    log_id: '2',
    card_uid: 'E5:F6:G7:H8',
    access_granted: true,
    access_time: '2025-10-29T08:15:00Z',
    note: null,
  },
  {
    log_id: '3',
    card_uid: 'INVALID:UID',
    access_granted: false,
    access_time: '2025-10-29T08:30:00Z',
    note: 'Unbekannte Karte',
  },
  {
    log_id: '4',
    card_uid: 'M3:N4:O5:P6',
    access_granted: false,
    access_time: '2025-10-29T08:45:00Z',
    note: 'Karte nicht autorisiert',
  },
  {
    log_id: '5',
    card_uid: 'Q7:R8:S9:T0',
    access_granted: true,
    access_time: '2025-10-29T09:00:00Z',
    note: null,
  },
  {
    log_id: '6',
    card_uid: 'I9:J0:K1:L2',
    access_granted: true,
    access_time: '2025-10-29T09:15:00Z',
    note: null,
  },
  {
    log_id: '7',
    card_uid: 'U1:V2:W3:X4',
    access_granted: true,
    access_time: '2025-10-29T09:30:00Z',
    note: null,
  },
  {
    log_id: '8',
    card_uid: 'Y5:Z6:A7:B8',
    access_granted: false,
    access_time: '2025-10-29T09:45:00Z',
    note: 'Karte nicht autorisiert',
  },
  {
    log_id: '9',
    card_uid: 'A1:B2:C3:D4',
    access_granted: true,
    access_time: '2025-10-29T10:00:00Z',
    note: null,
  },
  {
    log_id: '10',
    card_uid: 'E5:F6:G7:H8',
    access_granted: true,
    access_time: '2025-10-29T10:15:00Z',
    note: null,
  },
]

// Export all dummy data
export const allDummyData = {
  users: dummyUsers,
  cards: dummyCards,
  logs: dummyLogs,
}
