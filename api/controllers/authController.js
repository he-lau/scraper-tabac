const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const SALT_ROUNDS = 10;

const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email et mot de passe requis" });

  const existing = await userModel.findByEmail(email);
  if (existing) return res.status(409).json({ error: "Email déjà utilisé" });

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userModel.create(email, hashed);

  res.status(201).json({ user });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email et mot de passe requis" });

  const user = await userModel.findByEmail(email);
  if (!user) return res.status(401).json({ error: "Identifiants invalides" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Identifiants invalides" });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.json({ token, user: { id: user.id, email: user.email } });
};

const me = (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, me };
