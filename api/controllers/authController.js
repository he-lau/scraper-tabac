const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userModel = require("../models/userModel");
const { sendVerificationEmail } = require("../services/emailService");

const SALT_ROUNDS = 10;

const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email et mot de passe requis" });

  const existing = await userModel.findByEmail(email);
  if (existing) return res.status(409).json({ error: "Email déjà utilisé" });

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await userModel.create(email, hashed, verificationToken, verificationTokenExpires);
  await sendVerificationEmail(email, verificationToken);

  res.status(201).json({ message: "Un email de confirmation a été envoyé." });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email et mot de passe requis" });

  const user = await userModel.findByEmail(email);
  if (!user) return res.status(401).json({ error: "Identifiants invalides" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Identifiants invalides" });

  if (!user.verified) return res.status(403).json({ error: "Compte non vérifié. Consultez vos emails." });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.json({ token, user: { id: user.id, email: user.email } });
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;
  const user = await userModel.findByVerificationToken(token);

  if (!user) return res.status(400).json({ error: "Lien invalide ou déjà utilisé." });
  if (new Date() > new Date(user.verification_token_expires)) {
    return res.status(400).json({ error: "Lien expiré. Veuillez vous réinscrire." });
  }

  await userModel.markAsVerified(user.id);

  const jwtToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token: jwtToken, user: { id: user.id, email: user.email } });
};

const me = (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, verifyEmail, me };
