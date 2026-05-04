import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useT } from "../lang/LanguageContext";
import apiUrl from "../utils/api";

export default function VerifyPage({ onLogin }) {
  const { token } = useParams();
  const navigate = useNavigate();
  const { t } = useT();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/auth/verify/${token}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error);
          setStatus("error");
          return;
        }
        onLogin(data.token, data.user);
        setStatus("success");
        setTimeout(() => navigate("/"), 2000);
      } catch {
        setError(t.authError);
        setStatus("error");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#F4F4F2] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E8E3] w-full max-w-sm p-8 text-center">
        <p className="text-[10px] font-mono text-[#888] tracking-[0.12em] uppercase mb-1">scraper</p>
        <h1 className="text-[20px] font-semibold tracking-tight mb-6">Tabac · Bar · FDJ</h1>

        {status === "loading" && (
          <p className="text-[13px] text-[#888]">{t.authVerifying}</p>
        )}

        {status === "success" && (
          <>
            <div className="text-4xl mb-4">✓</div>
            <p className="text-[15px] font-semibold mb-2">{t.authVerified}</p>
            <p className="text-[13px] text-[#888]">{t.authVerifiedSub}</p>
          </>
        )}

        {status === "error" && (
          <>
            <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>
            <Link to="/register" className="text-[13px] text-[#111] font-medium underline underline-offset-2">
              {t.authRegisterTitle}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
