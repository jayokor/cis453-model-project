const Users = require("../models/users.model");
const { hashPassword, verifyPassword } = require("../utils/password");
const { signToken } = require("../utils/tokens");

async function register(req, res, next) {
  try {
    const db = req.app.locals.db;
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, and password are required" });
    }

    const existing = await Users.findUserByEmail(db, email);
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const passwordHash = await hashPassword(password);
    const userId = await Users.createUser(db, {
      name,
      email,
      passwordHash,
      role: "CUSTOMER",
    });

    const user = await Users.getUserPublicById(db, userId);
    const token = signToken({ id: user.id, role: user.role, email: user.email });

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const db = req.app.locals.db;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await Users.findUserByEmail(db, email);
    if (!user || user.is_active !== 1) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      restaurant_id: user.restaurant_id,
      is_active: user.is_active,
    };

    const token = signToken({ id: user.id, role: user.role, email: user.email });
    res.json({ user: publicUser, token });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const db = req.app.locals.db;
    const user = await Users.getUserPublicById(db, req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
