import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useT } from "../lang/LanguageContext";
import apiUrl from "../utils/api";

export default function ProfilePage({ token, onUpdateUser, onLogout }) {
  const { t } = useT();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [infoSaving, setInfoSaving] = useState(false);
  const [infoMsg, setInfoMsg] = useState(null);

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);

  const [deletePwd, setDeletePwd] = useState("");
  const [showDeletePwd, setShowDeletePwd] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(({ user }) => {
        setProfile(user);
        setFirstName(user.first_name || "");
        setLastName(user.last_name || "");
      });
  }, [token]);

  const handleInfoSave = async (e) => {
    e.preventDefault();
    setInfoSaving(true);
    setInfoMsg(null);
    try {
      const res = await fetch(`${apiUrl}/api/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ firstName, lastName }),
      });
      const data = await res.json();
      if (!res.ok) return setInfoMsg({ error: data.error });
      onUpdateUser(data.user);
      setInfoMsg({ success: t.profileSaved });
    } finally {
      setInfoSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwdMsg(null);
    if (newPwd !== confirmPwd) return setPwdMsg({ error: t.authPasswordMismatch });
    setPwdSaving(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      const data = await res.json();
      if (!res.ok) return setPwdMsg({ error: data.error });
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
      setPwdMsg({ success: t.profilePwdUpdated });
    } finally {
      setPwdSaving(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleting(true);
    setDeleteMsg(null);
    try {
      const res = await fetch(`${apiUrl}/api/auth/profile`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: deletePwd }),
      });
      const data = await res.json();
      if (!res.ok) return setDeleteMsg({ error: data.error });
      onLogout();
      navigate("/login");
    } finally {
      setDeleting(false);
    }
  };

  if (!profile) return null;

  const initials = [profile.first_name, profile.last_name].filter(Boolean).map((s) => s[0].toUpperCase()).join("") || profile.email[0].toUpperCase();

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6">

      {/* Avatar + email */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#111] text-white flex items-center justify-center text-[18px] font-semibold flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-[15px] font-semibold">{[profile.first_name, profile.last_name].filter(Boolean).join(" ") || "—"}</p>
          <p className="text-[13px] text-[#888]">{profile.email}</p>
        </div>
      </div>

      {/* Infos */}
      <section className="bg-white rounded-2xl border border-[#E8E8E3] p-6">
        <h2 className="text-[13px] font-semibold mb-4">{t.profileInfo}</h2>
        <form onSubmit={handleInfoSave} className="flex flex-col gap-4">
          <div className="flex gap-3">
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
          {infoMsg?.error   && <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{infoMsg.error}</p>}
          {infoMsg?.success && <p className="text-[12px] text-green-600">{infoMsg.success}</p>}
          <button type="submit" disabled={infoSaving} className="btn-primary self-start">
            {infoSaving ? t.profileSaving : t.profileSave}
          </button>
        </form>
      </section>

      {/* Mot de passe */}
      <section className="bg-white rounded-2xl border border-[#E8E8E3] p-6">
        <h2 className="text-[13px] font-semibold mb-4">{t.profilePassword}</h2>
        <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
          {[
            { label: t.profileCurrentPwd, val: currentPwd, set: setCurrentPwd, show: showCurrentPwd, toggle: setShowCurrentPwd },
            { label: t.profileNewPwd,     val: newPwd,     set: setNewPwd,     show: showNewPwd,     toggle: setShowNewPwd },
            { label: t.profileConfirmPwd, val: confirmPwd, set: setConfirmPwd, show: showNewPwd,     toggle: setShowNewPwd },
          ].map(({ label, val, set, show, toggle }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{label}</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  required
                  minLength={label === t.profileCurrentPwd ? undefined : 6}
                  className="h-9 w-full border border-[#E5E5E0] rounded-lg px-3 pr-9 text-[13px] bg-white outline-none focus:border-[#111]"
                />
                <button type="button" onClick={() => toggle((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#111] cursor-pointer">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}
          {pwdMsg?.error   && <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{pwdMsg.error}</p>}
          {pwdMsg?.success && <p className="text-[12px] text-green-600">{pwdMsg.success}</p>}
          <button type="submit" disabled={pwdSaving} className="btn-primary self-start">
            {pwdSaving ? t.profileUpdating : t.profilePassword}
          </button>
        </form>
      </section>

      {/* Zone de danger */}
      <section className="bg-white rounded-2xl border border-red-200 p-6">
        <h2 className="text-[13px] font-semibold text-red-600 mb-1">{t.profileDanger}</h2>
        <p className="text-[12px] text-[#888] mb-4">{t.profileDeleteConfirm}</p>
        <form onSubmit={handleDelete} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.authPassword}</label>
            <div className="relative">
              <input
                type={showDeletePwd ? "text" : "password"}
                value={deletePwd}
                onChange={(e) => setDeletePwd(e.target.value)}
                required
                className="h-9 w-full border border-red-200 rounded-lg px-3 pr-9 text-[13px] bg-white outline-none focus:border-red-400"
              />
              <button type="button" onClick={() => setShowDeletePwd((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#111] cursor-pointer">
                {showDeletePwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          {deleteMsg?.error && <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{deleteMsg.error}</p>}
          <button type="submit" disabled={deleting} className="self-start px-4 py-2 rounded-lg bg-red-600 text-white text-[13px] font-medium hover:bg-red-700 disabled:opacity-50 cursor-pointer transition-colors">
            {deleting ? t.profileDeleting : t.profileDeleteAccount}
          </button>
        </form>
      </section>
    </div>
  );
}
