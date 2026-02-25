const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf8');
  }
}

function loadUsers() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
}

class User {
  constructor({ _id, firstName, lastName, email, password, amount, budgetEntries }) {
    this._id = _id || randomUUID();
    this.firstName = firstName || '';
    this.lastName = lastName || '';
    this.email = email;
    this.password = password;
    this.amount = typeof amount === 'number' ? amount : Number(amount) || 0;
    this.budgetEntries = Array.isArray(budgetEntries) ? budgetEntries : [];
  }

  static async findOne(query) {
    const users = loadUsers();
    if (query.email) {
      const found = users.find((u) => u.email === query.email);
      return found ? new User(found) : null;
    }
    return null;
  }

  static async find() {
    const users = loadUsers();
    // Do not expose password
    return users.map((u) => {
      const copy = { ...u };
      delete copy.password;
      return copy;
    });
  }

  static async findById(id) {
    const users = loadUsers();
    const found = users.find((u) => u._id === id);
    return found ? new User(found) : null;
  }

  // Convenience: get the first user in the store (used for expenses when not scoping by auth)
  static async first() {
    const users = loadUsers();
    if (!users.length) return null;
    return new User(users[0]);
  }

  static async findByIdAndUpdate(id, updates, options = {}) {
    const users = loadUsers();
    const index = users.findIndex((u) => u._id === id);
    if (index === -1) return null;

    const current = users[index];
    const updated = { ...current, ...updates, _id: current._id };
    users[index] = updated;
    saveUsers(users);

    const user = new User(updated);
    if (options.new) {
      const plain = { ...user };
      delete plain.password;
      return plain;
    }
    return null;
  }

  static async findByIdAndDelete(id) {
    const users = loadUsers();
    const index = users.findIndex((u) => u._id === id);
    if (index === -1) return null;
    const [removed] = users.splice(index, 1);
    saveUsers(users);
    const plain = { ...removed };
    delete plain.password;
    return plain;
  }

  async save() {
    const users = loadUsers();
    const index = users.findIndex((u) => u._id === this._id);

    // Hash password if it does not look hashed yet
    if (this.password && !this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    const plain = {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      amount: this.amount,
      budgetEntries: this.budgetEntries,
    };

    if (index === -1) {
      users.push(plain);
    } else {
      users[index] = plain;
    }
    saveUsers(users);
  }

  comparePassword(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
  }
}

module.exports = User;
