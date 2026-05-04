import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useT } from "../lang/LanguageContext";
import apiUrl from "../utils/api";

export default function RegisterPage({ onLogin }) {
  const { t, lang, toggle } = useT();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sent, setSent] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    setResent(false);
    try {
      await fetch(`${apiUrl}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setResent(true);
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) return setError(t.authPasswordMismatch);
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName, gender }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);
      setSent(true);
    } catch {
      setError(t.authError);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-[#F4F4F2] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E8E3] w-full max-w-sm p-8 text-center">
          <p className="text-[10px] font-mono text-[#888] tracking-[0.12em] uppercase mb-1">scraper</p>
          <h1 className="text-[20px] font-semibold tracking-tight mb-6">Tabac · Bar · FDJ</h1>
          <div className="text-4xl mb-4">✉️</div>
          <p className="text-[15px] font-semibold mb-2">{t.authCheckEmail}</p>
          <p className="text-[13px] text-[#888]">{t.authCheckEmailSub} <span className="text-[#111] font-medium">{email}</span></p>
          <button
            onClick={handleResend}
            disabled={resending}
            className="mt-5 text-[12px] text-[#555] underline underline-offset-2 hover:text-[#111] disabled:opacity-50 cursor-pointer"
          >
            {resending ? t.authResending : t.authResend}
          </button>
          {resent && <p className="text-[12px] text-green-600 mt-1">{t.authResent}</p>}
          <p className="text-center mt-4">
            <Link to="/" className="text-[11px] text-[#aaa] hover:text-[#555] transition-colors">
              {t.authContinueWithout}
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F2] flex items-center justify-center px-4">
      <div className="fixed top-4 right-4 flex items-center border border-[#D8D8D3] rounded-lg overflow-hidden text-[11px] font-medium">
        {["fr", "zh"].map((l) => (
          <button
            key={l}
            onClick={() => l !== lang && toggle()}
            className={`px-2.5 py-1.5 cursor-pointer transition-colors ${lang === l ? "bg-[#111] text-white" : "bg-white text-[#888] hover:text-[#111]"}`}
          >
            {l === "fr" ? "FR" : "中文"}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E8E3] w-full max-w-sm p-8">
        <p className="text-[10px] font-mono text-[#888] tracking-[0.12em] uppercase mb-1">scraper</p>
        <h1 className="text-[20px] font-semibold tracking-tight">Tabac · Bar · FDJ</h1>
        <p className="text-[13px] text-[#888] mt-1">{t.authRegisterTitle}</p>
        <p className="text-[11px] text-[#aaa] mt-1 mb-6"><span className="text-red-400">*</span> {t.authRequired}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.authEmail} <span className="text-red-400">*</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-9 border border-[#E5E5E0] rounded-lg px-3 text-[13px] bg-white outline-none focus:border-[#111]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.authFirstName}</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-9 w-full border border-[#E5E5E0] rounded-lg px-3 text-[13px] bg-white outline-none focus:border-[#111]"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.authLastName}</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-9 w-full border border-[#E5E5E0] rounded-lg px-3 text-[13px] bg-white outline-none focus:border-[#111]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.authGender}</label>
            <div className="flex items-center border border-[#E5E5E0] rounded-lg overflow-hidden text-[13px]">
              {[["M", t.authGenderM], ["F", t.authGenderF]].map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setGender(gender === val ? "" : val)}
                  className={`flex-1 h-9 cursor-pointer transition-colors ${gender === val ? "bg-[#111] text-white" : "bg-white text-[#555] hover:text-[#111]"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.authPassword} <span className="text-red-400">*</span></label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-9 w-full border border-[#E5E5E0] rounded-lg px-3 pr-9 text-[13px] bg-white outline-none focus:border-[#111]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#111] cursor-pointer"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.authConfirmPassword} <span className="text-red-400">*</span></label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="h-9 w-full border border-[#E5E5E0] rounded-lg px-3 pr-9 text-[13px] bg-white outline-none focus:border-[#111]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#111] cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary justify-center mt-1">
            {loading ? t.authLoading : t.authCreateAccount}
          </button>
        </form>

        <p className="text-[12px] text-[#888] text-center mt-4">
          {t.authHasAccount}{" "}
          <Link to="/login" className="text-[#111] font-medium underline underline-offset-2">
            {t.authLogin}
          </Link>
        </p>
        <p className="text-center mt-2">
          <Link to="/" className="text-[11px] text-[#aaa] hover:text-[#555] transition-colors">
            {t.authContinueWithout}
          </Link>
        </p>
      </div>
    </div>
  );
}
