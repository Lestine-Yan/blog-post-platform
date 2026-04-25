// @ts-ignore
const Database = require('better-sqlite3');

// 数据库文件路径
const dbPath = './data/users.db';

// 初始化数据库
const db = new Database(dbPath);

// 创建用户表
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// 初始化数据库
initDatabase();

// 数据库操作方法
export const userDb = {
  // 添加用户
  addUser: (username: string, password: string, email: string) => {
    const stmt = db.prepare('INSERT INTO users (username, password, email) VALUES (?, ?, ?)');
    return stmt.run(username, password, email);
  },

  // 根据用户名查询用户
  getUserByUsername: (username: string) => {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  },

  // 根据邮箱查询用户
  getUserByEmail: (email: string) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  // 获取所有用户
  getAllUsers: () => {
    const stmt = db.prepare('SELECT * FROM users');
    return stmt.all();
  },

  // 更新用户信息
  updateUser: (id: number, data: { username?: string; password?: string; email?: string }) => {
    const fields = [];
    const values = [];

    if (data.username) {
      fields.push('username = ?');
      values.push(data.username);
    }
    if (data.password) {
      fields.push('password = ?');
      values.push(data.password);
    }
    if (data.email) {
      fields.push('email = ?');
      values.push(data.email);
    }

    if (fields.length === 0) {
      return null;
    }

    values.push(id);
    const stmt = db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`);
    return stmt.run(...values);
  },

  // 删除用户
  deleteUser: (id: number) => {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(id);
  }
};

export default db;