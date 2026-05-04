const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userModel = require("../models/userModel");
const { sendVerificationEmail } = require("../services/emailService");

const SALT_ROUNDS = 10;

const register = async (req, res) => {
  const { email, password, firstName, lastName, gender } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email et mot de passe requis" });

  const existing = await userModel.findByEmail(email);
  if (existing && existing.verified) return res.status(409).json({ error: "Email déjà utilisé" });

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  if (existing && !existing.verified) {
    await userModel.updateVerificationToken(email, verificationToken, verificationTokenExpires);
  } else {
    await userModel.create(email, hashed, verificationToken, verificationTokenExpires, firstName, lastName, gender);
  }
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

const resendVerification = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email requis" });

  const user = await userModel.findByEmail(email);
  if (!user) return res.status(404).json({ error: "Aucun compte associé à cet email" });
  if (user.verified) return res.status(400).json({ error: "Ce compte est déjà vérifié" });

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await userModel.updateVerificationToken(email, verificationToken, verificationTokenExpires);
  await sendVerificationEmail(email, verificationToken);

  res.json({ message: "Email de confirmation renvoyé." });
};

const me = async (req, res) => {
  const user = await userModel.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });
  const { password, verification_token, verification_token_expires, ...safe } = user;
  res.json({ user: safe });
};

const updateProfile = async (req, res) => {
  const { firstName, lastName } = req.body;
  const updated = await userModel.updateProfile(req.user.id, firstName, lastName);
  res.json({ user: updated });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: "Champs requis" });
  if (newPassword.length < 6) return res.status(400).json({ error: "Le mot de passe doit faire au moins 6 caractères" });

  const user = await userModel.findById(req.user.id);
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return res.status(401).json({ error: "Mot de passe actuel incorrect" });

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await userModel.updatePassword(req.user.id, hashed);
  res.json({ message: "Mot de passe mis à jour" });
};

const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: "Mot de passe requis" });

    const user = await userModel.findById(req.user.id);
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Mot de passe incorrect" });

    await userModel.deleteUser(req.user.id);
    res.json({ message: "Compte supprimé" });
  } catch (err) {
    console.error("deleteAccount error:", err);
    res.status(500).json({ error: "Erreur lors de la suppression du compte" });
  }
};

module.exports = { register, login, verifyEmail, resendVerification, me, updateProfile, changePassword, deleteAccount };
