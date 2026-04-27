import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useT } from "../lang/LanguageContext";
import apiUrl from "../utils/api";

export default function RegisterPage({ onLogin }) {
  const { t } = useT();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);

      // Auto-login après inscription
      const loginRes = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      onLogin(loginData.token, loginData.user);
      navigate("/");
    } catch {
      setError(t.authError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F2] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E8E3] w-full max-w-sm p-8">
        <p className="text-[10px] font-mono text-[#888] tracking-[0.12em] uppercase mb-1">scraper</p>
        <h1 className="text-[20px] font-semibold tracking-tight">Tabac · Bar · FDJ</h1>
        <p className="text-[13px] text-[#888] mt-1 mb-6">{t.authRegisterTitle}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.authEmail}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-9 border border-[#E5E5E0] rounded-lg px-3 text-[13px] bg-white outline-none focus:border-[#111]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.authPassword}</label>
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
      </div>
    </div>
  );
}
