const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, token) => {
  const link = `${process.env.FRONTEND_URL}/verify/${token}`;
  await resend.emails.send({
    from: process.env.RESEND_FROM,
    to: email,
    subject: "Confirmez votre inscription — Tabac · Bar · FDJ",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
        <p style="font-size:10px;color:#888;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 4px">scraper</p>
        <h1 style="font-size:20px;font-weight:600;margin:0 0 24px">Tabac · Bar · FDJ</h1>
        <p style="font-size:14px;color:#333;margin:0 0 24px">
          Cliquez sur le bouton ci-dessous pour confirmer votre adresse email et activer votre compte.
          Ce lien est valable <strong>24 heures</strong>.
        </p>
        <a href="${link}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:500">
          Confirmer mon adresse email
        </a>
        <p style="font-size:12px;color:#aaa;margin-top:32px">
          Si vous n'êtes pas à l'origine de cette inscription, ignorez cet email.
        </p>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail };
