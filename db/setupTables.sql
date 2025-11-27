PRAGMA foreign_keys = ON;

CREATE TABLE user (
    user_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name  TEXT NOT NULL,
    last_name   TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE rfid_card (
    card_uid     TEXT PRIMARY KEY,
    user_id     INTEGER,
    authorized  INTEGER NOT NULL DEFAULT 0,  
    added_on    TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    
    FOREIGN KEY (user_id) REFERENCES user(user_id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE access_log (
    log_id         INTEGER PRIMARY KEY AUTOINCREMENT,
    card_uid       TEXT NOT NULL,
    access_time    TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    access_granted INTEGER NOT NULL,          
    note           TEXT
);
