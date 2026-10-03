const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../data/preferences.json');

class Database {
  constructor() {
    this.dataDir = path.dirname(DB_FILE);
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    this.load();
  }

  load() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } catch (err) {
        this.initSeed();
      }
    } else {
      this.initSeed();
    }
  }

  initSeed() {
    this.data = {
      userPreferences: {
        'user_123': 'light',
        'user_456': 'dark'
      }
    };
    this.save();
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error guardando DB de preferencias:', err);
    }
  }

  reset() {
    this.initSeed();
  }
}

const db = new Database();

module.exports = db;
