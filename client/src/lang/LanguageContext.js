import { createContext, useContext, useState } from "react";
import fr from "./fr";
import zh from "./zh";

const translations = { fr, zh };
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "fr");

  const toggle = () => {
    const next = lang === "fr" ? "zh" : "fr";
    localStorage.setItem("lang", next);
    setLang(next);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  return useContext(LanguageContext);
}
