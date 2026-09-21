import { useState, useMemo, useRef, useEffect } from "react";
import {
  Mail, UserPlus, UserCheck, Code2, Image as ImageIcon,
  Link2, LogOut, CheckCircle2, MessageCircle, Bell, Home,
  User as UserIcon, Heart, Share2, Flag, Type, Palette, Lock, Eye,
  Send, Mic, Terminal, MoreVertical, Square, Search, PlayCircle,
  Copy, Check, X, SlidersHorizontal, Plus, Upload, ArrowLeft,
  Bold, Italic, Wifi, WifiOff, Smile, Paperclip, Info, Reply,
  Camera, ExternalLink, ShieldCheck, Video, Globe
} from "lucide-react";

const ADMIN_HANDLES = ["@admin", "@nicolsalbn_devfeel"];

const GRADIENTS = {
  arcoiris: "linear-gradient(90deg,#ff5f6d,#ffc371,#f7ff00,#47e08e,#3ac1e0,#a06bff)",
  atardecer: "linear-gradient(90deg,#ff6b6b,#feca57)",
  oceano: "linear-gradient(90deg,#00c3ff,#7b2ff7)",
  espana: "linear-gradient(90deg,#AA151B 0%,#AA151B 25%,#F1BF00 25%,#F1BF00 75%,#AA151B 75%,#AA151B 100%)",
  argentina: "linear-gradient(90deg,#75AADB 0%,#75AADB 33%,#FFFFFF 33%,#FFFFFF 66%,#75AADB 66%,#75AADB 100%)",
  colombia: "linear-gradient(90deg,#FCD116 0%,#FCD116 50%,#003893 50%,#003893 75%,#CE1126 75%,#CE1126 100%)",
  mexico: "linear-gradient(90deg,#006341 0%,#006341 33%,#FFFFFF 33%,#FFFFFF 66%,#CE1126 66%,#CE1126 100%)",
  brasil: "linear-gradient(90deg,#009739,#FEDD00,#009739)",
};
const SOLID_COLORS = ["#E8B84B", "#6FCF97", "#EB5757", "#56CCF2", "#BB6BD9", "#F5F4EE"];
const STICKERS = ["😂","🔥","🚀","👀","💀","🙌","😅","🤝","👌","🐛","☕","💡"];
const TYPE_OPTIONS = [
  { id: "code", icon: Code2, label: "Código" },
  { id: "image", icon: ImageIcon, label: "Imagen" },
  { id: "video", icon: Video, label: "Video" },
  { id: "link", icon: Link2, label: "Link" },
  { id: "interactive", icon: PlayCircle, label: "Demo" },
];

const SECTIONS = [
  { id: "informativo", es: "Informativo", en: "Informative", pt: "Informativo" },
  { id: "feel", es: "Feel", en: "Feel", pt: "Feel" },
  { id: "humor", es: "Humor", en: "Humor", pt: "Humor" },
  { id: "proyecto", es: "Proyecto", en: "Project", pt: "Projeto" },
  { id: "pregunta", es: "Pregunta", en: "Question", pt: "Pergunta" },
];
function sectionLabel(id, lang) {
  const s = SECTIONS.find(x => x.id === id);
  if (!s) return id;
  return s[lang] || s.es;
}

const DEMO_TEMPLATES = [
  { name: "contador", html: "<body style='margin:0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#0E0F0C;color:#F5F4EE;'><div style='text-align:center'><div id='n' style='font-size:48px;font-weight:700;margin-bottom:12px;'>0</div><button onclick='document.getElementById(\"n\").innerText=parseInt(document.getElementById(\"n\").innerText)+1' style='background:#E8B84B;border:none;padding:10px 22px;border-radius:9999px;font-weight:600;cursor:pointer;'>+1</button></div></body>" },
  { name: "paleta", html: "<body style='margin:0;display:flex;gap:10px;align-items:center;justify-content:center;height:100vh;background:#0E0F0C;'><div onclick=\"this.style.background='#EB5757'\" style='width:50px;height:50px;border-radius:12px;background:#6FCF97;cursor:pointer;'></div><div onclick=\"this.style.background='#56CCF2'\" style='width:50px;height:50px;border-radius:12px;background:#BB6BD9;cursor:pointer;'></div><div onclick=\"this.style.background='#E8B84B'\" style='width:50px;height:50px;border-radius:12px;background:#F5F4EE;cursor:pointer;'></div></body>" },
];

const STATIC_DEVS = [
  { name: "Marcos Ile", handle: "@marcosile", bio: "Backend & sistemas distribuidos. Rust por las noches.", followers: 3200, isDev: true, acceptsMsgs: true, isBot: true, links: {} },
  { name: "Luz Herrera", handle: "@luzh", bio: "Diseñadora que aprendió a programar por accidente.", followers: 890, isDev: false, acceptsMsgs: true, isBot: true, links: {} },
  { name: "Dev Anónimo", handle: "@anon_dev", bio: "Testing evangelist. No confío en código sin tests.", followers: 5400, isDev: true, acceptsMsgs: false, isBot: true, links: {} },
  { name: "Sara Q.", handle: "@saraq", bio: "Frontend, cafeína y teclados mecánicos.", followers: 1500, isDev: true, acceptsMsgs: true, isBot: true, links: {} },
];

const INITIAL_POSTS = [
  { id: 1, author: "Marcos Ile", handle: "@marcosile", isDev: true, title: "", section: null,
    content: "", codeContent: "const cache = new Map();\nfunction memo(fn) {\n  return (...a) => cache.get(a) ?? fn(...a);\n}", codeLang: "javascript",
    fontSize: 15, textStyle: { mode: "gradient", value: "oceano" }, bold: false, italic: false, tags: ["javascript"], likes: 42, likedBy: [], reports: 0, sensitive: false,
    comments: [{ from: "Sara Q.", fromHandle: "@saraq", text: "esto me salvó la semana pasada jaja", likes: 2, likedBy: [], replies: [] }] },
  { id: 2, author: "Luz Herrera", handle: "@luzh", isDev: false, title: "Rediseño de portafolio", section: "proyecto",
    content: "Rediseñé mi portafolio este fin de semana 👀", linkUrl: "https://ejemplo.dev/mi-portafolio",
    fontSize: 16, textStyle: { mode: "default" }, bold: false, italic: false, tags: ["portafolio"], likes: 18, likedBy: [], reports: 0, sensitive: false,
    comments: [] },
  { id: 3, author: "Dev Anónimo", handle: "@anon_dev", isDev: true, title: "", section: "informativo",
    content: "Nadie habla de lo mucho que ayuda escribir el test antes de saber si el bug es real o imaginario.",
    fontSize: 20, textStyle: { mode: "gradient", value: "arcoiris" }, bold: false, italic: false, tags: ["testing"], likes: 91, likedBy: [], reports: 0, sensitive: false,
    comments: [{ from: "Marcos Ile", fromHandle: "@marcosile", text: "verdad absoluta", likes: 5, likedBy: [], replies: [{ from: "Sara Q.", fromHandle: "@saraq", text: "+1", likes: 0, likedBy: [] }] }, { from: "Sara Q.", fromHandle: "@saraq", text: "guardando esto", likes: 1, likedBy: [], replies: [] }] },
  { id: 4, author: "Sara Q.", handle: "@saraq", isDev: true, title: "Mini contador", section: "feel",
    content: "Hice este mini contador para probar el nuevo tipo de post interactivo 🎛️",
    demo: DEMO_TEMPLATES[0], fontSize: 16, textStyle: { mode: "solid", value: "#6FCF97" }, bold: false, italic: false, tags: ["demo", "ui"], likes: 34, likedBy: [], reports: 0, sensitive: false,
    comments: [] },
  { id: 5, author: "Sara Q.", handle: "@saraq", isDev: true, title: "", section: "feel",
    content: "Probando el DevFeed 🎬 #shorts", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    fontSize: 16, textStyle: { mode: "default" }, bold: false, italic: false, tags: ["ui", "demo"], likes: 12, likedBy: [], reports: 0, sensitive: false,
    comments: [] },
];

import { loadShared, saveShared } from "./storage";
const STORAGE_AVAILABLE = true;

function convKey(a, b) { return [a, b].sort().join("::"); }
function initials(name) { return (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2); }
function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function sanitizeHandle(v) { return (v || "").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 9); }
function validateHandleLength(h) { const len = h.replace("@", "").length; return len >= 5 && len <= 9; }
function hashCode(str) { let h = 0; for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; } return Math.abs(h); }
function stableJitter(id, spread) { return (hashCode(String(id)) % 100) / 100 * spread; }
function followerCountFor(handle, followsMap, base) {
  let count = base || 0;
  Object.values(followsMap || {}).forEach(arr => { if (Array.isArray(arr) && arr.includes(handle)) count++; });
  return count;
}

const TRANSLATIONS = {
  es: { feed: "Feed", perfil: "Perfil", chat: "Chat", ajustes: "Ajustes", moderacion: "Moderación",
    buscarPlaceholder: "Buscar usuarios, #hashtags o palabras...", publicarAlgo: "Publicar algo",
    paraTi: "Para ti", siguiendoTab: "Siguiendo", seguir: "Seguir", siguiendoBtn: "Siguiendo",
    publicaciones: "publicaciones", siguiendoStat: "siguiendo", seguidores: "seguidores",
    developersEnDevfeel: "Developers en DevFeel", developersEncontrados: "Developers encontrados",
    volver: "Volver", enviarMensaje: "Enviar mensaje", cuenta: "Cuenta", apodoLabel: "Apodo", usuarioLabel: "Usuario",
    modoClaro: "Modo claro", recibirMensajes: "Recibir mensajes directos", idioma: "Idioma",
    guardarCambios: "Guardar cambios", solicitarVerificacion: "Solicitar verificación", pendiente: "Pendiente",
    bienvenido: "Bienvenido a DevFeel", crearPerfil: "Creá tu perfil", entrarDevfeel: "Entrar a DevFeel",
    iniciarSesion: "Iniciar sesión", yaTengoCuenta: "¿Ya tenés cuenta? Iniciar con usuario y contraseña",
    contraseña: "Contraseña", entrar: "Entrar", todas: "Todas", noHayResultados: "No hay resultados." },
  en: { feed: "Feed", perfil: "Profile", chat: "Chat", ajustes: "Settings", moderacion: "Moderation",
    buscarPlaceholder: "Search users, #hashtags or words...", publicarAlgo: "Post something",
    paraTi: "For you", siguiendoTab: "Following", seguir: "Follow", siguiendoBtn: "Following",
    publicaciones: "posts", siguiendoStat: "following", seguidores: "followers",
    developersEnDevfeel: "Developers on DevFeel", developersEncontrados: "Developers found",
    volver: "Back", enviarMensaje: "Send message", cuenta: "Account", apodoLabel: "Nickname", usuarioLabel: "Username",
    modoClaro: "Light mode", recibirMensajes: "Receive direct messages", idioma: "Language",
    guardarCambios: "Save changes", solicitarVerificacion: "Request verification", pendiente: "Pending",
    bienvenido: "Welcome to DevFeel", crearPerfil: "Create your profile", entrarDevfeel: "Enter DevFeel",
    iniciarSesion: "Log in", yaTengoCuenta: "Already have an account? Log in with username & password",
    contraseña: "Password", entrar: "Log in", todas: "All", noHayResultados: "No results." },
  pt: { feed: "Feed", perfil: "Perfil", chat: "Chat", ajustes: "Ajustes", moderacion: "Moderação",
    buscarPlaceholder: "Buscar usuários, #hashtags ou palavras...", publicarAlgo: "Publicar algo",
    paraTi: "Para você", siguiendoTab: "Seguindo", seguir: "Seguir", siguiendoBtn: "Seguindo",
    publicaciones: "publicações", siguiendoStat: "seguindo", seguidores: "seguidores",
    developersEnDevfeel: "Developers no DevFeel", developersEncontrados: "Developers encontrados",
    volver: "Voltar", enviarMensaje: "Enviar mensagem", cuenta: "Conta", apodoLabel: "Apelido", usuarioLabel: "Usuário",
    modoClaro: "Modo claro", recibirMensajes: "Receber mensagens diretas", idioma: "Idioma",
    guardarCambios: "Salvar alterações", solicitarVerificacion: "Solicitar verificação", pendiente: "Pendente",
    bienvenido: "Bem-vindo ao DevFeel", crearPerfil: "Crie seu perfil", entrarDevfeel: "Entrar no DevFeel",
    iniciarSesion: "Entrar", yaTengoCuenta: "Já tem conta? Entrar com usuário e senha",
    contraseña: "Senha", entrar: "Entrar", todas: "Todas", noHayResultados: "Sem resultados." },
};
function makeT(lang) { return (key) => (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS.es[key] || key; }

function TextStyled({ text, fontSize, textStyle, bold, italic, as: Tag = "p" }) {
  const base = { fontSize, whiteSpace: "pre-wrap", lineHeight: 1.5, fontWeight: bold ? 700 : (textStyle?.mode === "gradient" ? 500 : 400), fontStyle: italic ? "italic" : "normal" };
  if (textStyle?.mode === "gradient") return <Tag style={{ ...base, backgroundImage: GRADIENTS[textStyle.value], WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{text}</Tag>;
  if (textStyle?.mode === "solid") return <Tag style={{ ...base, color: textStyle.value }}>{text}</Tag>;
  return <Tag style={{ ...base, color: "var(--ink)" }}>{text}</Tag>;
}

const LOGO_URL = "https://res.cloudinary.com/j33vbfuy/image/upload/f_auto,q_auto/DevFeel_Logo-pnginvisible_ahpphu";

function BrandLogo() {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="brand-mark">{"</>"} DevFeel</div>;
  return <img src={LOGO_URL} alt="DevFeel" className="brand-logo" onError={() => setFailed(true)} />;
}

function HeaderMark() {
  return (
    <div className="header-mark">
      <span className="header-mark-icon"><Code2 size={15}/></span>
      <span className="header-mark-text">DevFeel</span>
    </div>
  );
}

function Avatar({ name, url, size = "md" }) {
  const cls = "avatar" + (size === "big" ? " big" : size === "tiny" ? " tiny" : "");
  if (url) return <img src={url} alt="" className={cls} style={{ objectFit: "cover" }} />;
  return <div className={cls}>{initials(name)}</div>;
}

function EmojiPicker({ onPick }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button type="button" className="tool-btn" title="Emojis y stickers" onClick={() => setOpen(o => !o)}><Smile size={15}/></button>
      {open && (
        <div className="emoji-pop">
          {STICKERS.map(s => <button key={s} onClick={() => { onPick(s); setOpen(false); }}>{s}</button>)}
        </div>
      )}
    </div>
  );
}

/* ---------- SEARCH ---------- */
function SearchBar({ query, setQuery, allDevs, posts, onSelectUser, onSelectHashtag, placeholder, t }) {
  const [focused, setFocused] = useState(false);
  const q = query.trim().toLowerCase().replace(/^#/, "");
  const userMatches = q ? allDevs.filter(d => d.name.toLowerCase().includes(q) || d.handle.toLowerCase().includes(q)).slice(0, 5) : [];
  const hashtagCounts = useMemo(() => {
    const counts = {};
    posts.forEach(p => (p.tags || []).forEach(tag => { const k = tag.toLowerCase(); counts[k] = (counts[k] || 0) + 1; }));
    return counts;
  }, [posts]);
  const hashtagMatches = q ? Object.keys(hashtagCounts).filter(tag => tag.includes(q)).sort((a, b) => hashtagCounts[b] - hashtagCounts[a]).slice(0, 5) : [];
  const showDropdown = focused && q.length > 0;
  const noResults = showDropdown && userMatches.length === 0 && hashtagMatches.length === 0;
  return (
    <div className="search-box-wrap">
      <div className="search-box"><Search size={14}/><input placeholder={placeholder} value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)} /></div>
      {showDropdown && (
        <div className="search-dropdown">
          {userMatches.length > 0 && <div className="search-group-label">Usuarios</div>}
          {userMatches.map(d => (
            <div key={d.handle} className="search-suggestion-row" onMouseDown={() => onSelectUser(d.handle)}>
              <Avatar name={d.name} url={d.avatarUrl} size="tiny"/>
              <span className="search-sugg-name">{d.name}</span><span className="search-sugg-handle">{d.handle}</span>
            </div>
          ))}
          {hashtagMatches.length > 0 && <div className="search-group-label">Hashtags</div>}
          {hashtagMatches.map(tag => (
            <div key={tag} className="search-suggestion-row" onMouseDown={() => onSelectHashtag(tag)}>
              <span className="search-hash-icon">#</span><span>{tag}</span><span className="search-sugg-count">{hashtagCounts[tag]}</span>
            </div>
          ))}
          {noResults && <div className="search-empty">{t("noHayResultados")}</div>}
        </div>
      )}
    </div>
  );
}

/* ---------- LOGIN ---------- */
function LoginScreen({ onLogin, existingHandles, onClaimRequest, onRegisterCredentials, onLoginWithPassword, t }) {
  const [step, setStep] = useState("options");
  const [pendingVia, setPendingVia] = useState("");
  const [nickname, setNickname] = useState("");
  const [handleInput, setHandleInput] = useState("");
  const [handleTouched, setHandleTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [claimSent, setClaimSent] = useState(false);
  const [loginHandleInput, setLoginHandleInput] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const goToNameStep = (via) => { setPendingVia(via); setStep("name"); };
  const handleEmailContinue = () => { if (!isValidEmail(email)) { setError("Ingresa un correo electrónico válido."); return; } setError(""); setSent(true); };

  const onNicknameChange = (e) => {
    const val = e.target.value.slice(0, 20);
    setNickname(val); setError(""); setClaimSent(false);
    if (!handleTouched) setHandleInput(sanitizeHandle(val));
  };
  const onHandleChange = (e) => { setHandleInput(sanitizeHandle(e.target.value)); setHandleTouched(true); setError(""); setClaimSent(false); };

  const trimmedNick = nickname.trim();
  const desiredHandle = "@" + handleInput;
  const isTaken = handleInput !== "" && existingHandles.includes(desiredHandle);
  const suffix = "_" + Math.floor(Math.random() * 90 + 10);
  const suggestedBase = handleInput.slice(0, Math.max(1, 9 - suffix.length));
  const suggestedHandle = "@" + suggestedBase + suffix;

  const finish = (handleOverride) => {
    if (!trimmedNick) { setError("Escribe un apodo para continuar."); return; }
    if (trimmedNick.length > 20) { setError("El apodo puede tener máximo 20 caracteres."); return; }
    if (handleInput === "") { setError("Elegí un @usuario (solo letras, números y guion bajo)."); return; }
    const finalHandle = handleOverride || desiredHandle;
    const isReserved = ADMIN_HANDLES.includes(finalHandle);
    if (!isReserved && !validateHandleLength(finalHandle)) { setError("El @usuario debe tener entre 5 y 9 caracteres."); return; }
    if (isTaken && !handleOverride) { setError("Ese @usuario ya está en uso."); return; }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    if (password !== password2) { setError("Las contraseñas no coinciden."); return; }
    setError("");
    onRegisterCredentials(finalHandle, password);
    onLogin({ name: trimmedNick, handle: finalHandle, via: pendingVia });
  };
  const useSuggested = () => finish(suggestedHandle);
  const sendClaim = () => { onClaimRequest(desiredHandle, trimmedNick, pendingVia); setClaimSent(true); };

  const submitLogin = async () => {
    const h = "@" + sanitizeHandle(loginHandleInput);
    if (h === "@") { setLoginError("Escribí tu @usuario."); return; }
    if (!loginPassword) { setLoginError("Ingresá tu contraseña."); return; }
    const result = await onLoginWithPassword(h, loginPassword);
    if (!result) { setLoginError("Usuario o contraseña incorrectos."); return; }
    onLogin(result);
  };

  if (step === "login") {
    return (
      <div className="login-wrap"><div className="login-card">
        <BrandLogo />
        <h2>{t("iniciarSesion")}</h2>
        <p className="sub">Entrá con tu @usuario y contraseña.</p>
        <div className="email-row"><span style={{ color: "var(--ink-faint)", fontWeight: 700 }}>@</span><input placeholder="tu_usuario" value={loginHandleInput} onChange={e => { setLoginHandleInput(sanitizeHandle(e.target.value)); setLoginError(""); }} /></div>
        <div className="email-row"><Lock size={16} /><input type="password" placeholder={t("contraseña")} value={loginPassword} onChange={e => { setLoginPassword(e.target.value); setLoginError(""); }} onKeyDown={e => e.key === "Enter" && submitLogin()} /></div>
        {loginError && <p className="error-text">{loginError}</p>}
        <button className="pill-btn-solid" onClick={submitLogin}>{t("entrar")}</button>
        <button className="pill-btn-outline" style={{ width: "100%", marginTop: 10, justifyContent: "center" }} onClick={() => setStep("options")}>{t("volver")}</button>
      </div></div>
    );
  }

  if (step === "name") {
    return (
      <div className="login-wrap"><div className="login-card">
        <BrandLogo />
        <h2>{t("crearPerfil")}</h2>
        <p className="sub">El apodo es lo que ven los demás (emojis y espacios permitidos, máx. 20). El @usuario te identifica, es único (5-9 caracteres) y no se podrá cambiar después.</p>
        <div style={{ position: "relative" }}>
          <div className="email-row"><Smile size={16} style={{ opacity: 0.55, flexShrink: 0 }} /><input placeholder="Apodo, ej: Cami ✨" value={nickname} onChange={onNicknameChange} autoFocus /></div>
          <div style={{ position: "absolute", right: 8, top: 6 }}><EmojiPicker onPick={(e) => setNickname(n => (n + e).slice(0, 20))} /></div>
        </div>
        <div className="email-row"><span style={{ color: "var(--ink-faint)", fontWeight: 700 }}>@</span><input placeholder="usuario_9" value={handleInput} onChange={onHandleChange} /></div>
        <p className="handle-preview">5 a 9 caracteres: minúsculas, números y guion bajo ( _ ).</p>
        <div className="email-row"><Lock size={16} /><input type="password" placeholder={t("contraseña") + " (mín. 6)"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }} /></div>
        <div className="email-row"><Lock size={16} /><input type="password" placeholder="Repetí la contraseña" value={password2} onChange={e => { setPassword2(e.target.value); setError(""); }} /></div>
        {isTaken && !claimSent && (
          <div className="taken-box">
            <p className="error-text">⚠️ {desiredHandle} ya está en uso por otra persona.</p>
            <button className="pill-btn-outline" style={{ width: "100%", marginBottom: 8 }} onClick={useSuggested}>Usar {suggestedHandle} en su lugar</button>
            <button className="pill-btn-outline" style={{ width: "100%" }} onClick={sendClaim}>Enviar solicitud de derechos sobre este usuario</button>
          </div>
        )}
        {isTaken && claimSent && (
          <div className="sent-box"><CheckCircle2 size={18} /><span>Solicitud enviada a moderación. Mientras la revisan, podés entrar con {suggestedHandle}.</span>
            <button className="pill-btn-solid" onClick={useSuggested}>Entrar con {suggestedHandle}</button></div>
        )}
        {error && <p className="error-text">{error}</p>}
        {!isTaken && <button className="pill-btn-solid" onClick={() => finish()}>{t("entrarDevfeel")}</button>}
      </div></div>
    );
  }
  return (
    <div className="login-wrap"><div className="login-card">
      <BrandLogo />
      <h2>{t("bienvenido")}</h2>
      <p className="sub">Donde los developers comparten lo que construyen.</p>
      <button className="oauth-btn" onClick={() => goToNameStep("GitHub")}><Code2 size={18}/> Continuar con GitHub</button>
      <button className="oauth-btn" onClick={() => goToNameStep("Google")}>
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continuar con Google
      </button>
      <div className="divider"><span>o con tu correo</span></div>
      {!sent ? (
        <>
          <div className="email-row"><Mail size={16} /><input type="email" placeholder="tú@correo.com" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} /></div>
          {error && <p className="error-text">{error}</p>}
          <button className="pill-btn-solid" onClick={handleEmailContinue}>Enviar enlace de acceso</button>
        </>
      ) : (
        <div className="sent-box"><CheckCircle2 size={18} /><span>Enlace enviado a {email}.</span>
          <button className="pill-btn-outline" onClick={() => goToNameStep("correo")}>(Demo) Simular clic en el enlace</button></div>
      )}
      <div className="divider"><span>o</span></div>
      <button className="pill-btn-outline" style={{ width: "100%", justifyContent: "center" }} onClick={() => setStep("login")}>{t("yaTengoCuenta")}</button>
      <p className="fine-print">El registro es obligatorio: así llevamos un conteo real de personas y cada @usuario es único. Al continuar aceptas nuestras normas de comunidad y moderación de contenido.</p>
    </div></div>
  );
}

/* ---------- COMMENTS ---------- */
function CommentsPanel({ post, onAddComment, onLikeComment, myHandle, onViewProfile }) {
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const submit = () => { if (!text.trim()) return; onAddComment(post.id, text.trim(), null); setText(""); };
  const submitReply = (ci) => { if (!replyText.trim()) return; onAddComment(post.id, replyText.trim(), ci); setReplyText(""); setReplyingTo(null); };
  const go = (handle) => { if (handle) onViewProfile(handle); };
  return (
    <div className="comments-panel">
      {post.comments.length === 0 && <p className="no-comments">Sé el primero en comentar.</p>}
      {post.comments.map((c, ci) => {
        const liked = (c.likedBy || []).includes(myHandle);
        return (
          <div key={ci} className="comment-thread">
            <div className="comment-row">
              <div className="clickable" onClick={() => go(c.fromHandle)}><Avatar name={c.from} size="tiny"/></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="comment-from clickable" onClick={() => go(c.fromHandle)}>{c.from}</span>
                <p className="comment-text">{c.text}</p>
                <div className="comment-actions">
                  <button className="comment-action-btn" onClick={() => onLikeComment(post.id, ci)}><Heart size={11} fill={liked ? "currentColor" : "none"}/> {c.likes || 0}</button>
                  <button className="comment-action-btn" onClick={() => setReplyingTo(replyingTo === ci ? null : ci)}>Responder</button>
                </div>
                {(c.replies || []).map((r, ri) => {
                  const rLiked = (r.likedBy || []).includes(myHandle);
                  return (
                    <div key={ri} className="comment-reply-row">
                      <div className="clickable" onClick={() => go(r.fromHandle)}><Avatar name={r.from} size="tiny"/></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span className="comment-from clickable" onClick={() => go(r.fromHandle)}>{r.from}</span>
                        <p className="comment-text">{r.text}</p>
                        <button className="comment-action-btn" onClick={() => onLikeComment(post.id, ci, ri)}><Heart size={10} fill={rLiked ? "currentColor" : "none"}/> {r.likes || 0}</button>
                      </div>
                    </div>
                  );
                })}
                {replyingTo === ci && (
                  <div className="comment-input-row" style={{ marginTop: 8 }}>
                    <input placeholder={"Responder a " + c.from + "..."} value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === "Enter" && submitReply(ci)} autoFocus />
                    <button className="send-btn small" onClick={() => submitReply(ci)}><Send size={12}/></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div className="comment-input-row">
        <EmojiPicker onPick={(e) => setText(t => t + e)} />
        <input placeholder="Escribe un comentario..." value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
        <button className="send-btn small" onClick={submit}><Send size={13}/></button>
      </div>
    </div>
  );
}

/* ---------- SHARE ---------- */
function ShareMenu({ post, contacts, onSendToChat }) {
  const [open, setOpen] = useState(false);
  const [picking, setPicking] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [sentTo, setSentTo] = useState(null);
  const btnRef = useRef(null);
  const fakeUrl = "https://devfeel.app/post/" + post.id;

  const openMenu = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) {
      const popW = 230;
      const left = Math.min(rect.left, window.innerWidth - popW - 12);
      setPos({ top: rect.bottom + 6, left: Math.max(12, left) });
    }
    setPicking(false);
    setSentTo(null);
    setOpen(o => !o);
  };
  const closeAll = () => { setOpen(false); setPicking(false); };
  const externalShare = () => {
    if (navigator.share) navigator.share({ title: "DevFeel", text: post.content.slice(0, 80), url: fakeUrl }).catch(() => {});
    else { navigator.clipboard?.writeText(fakeUrl); }
    closeAll();
  };
  const pickContact = async (c) => {
    setSentTo(c.handle);
    await onSendToChat(c.handle, fakeUrl, post.content);
    setTimeout(closeAll, 500);
  };
  return (
    <div className="comments-block">
      <button ref={btnRef} className="icon-btn" onClick={openMenu}><Share2 size={16}/></button>
      {open && (
        <>
          <div className="overlay-catcher" onClick={closeAll} />
          {!picking ? (
            <div className="comments-list floating" style={{ top: pos.top, left: pos.left }}>
              <button className="pill-btn-outline" style={{ width: "100%", marginBottom: 8 }} onClick={externalShare}><ExternalLink size={13} style={{ marginRight: 6 }}/>Compartir enlace</button>
              <button className="pill-btn-outline" style={{ width: "100%" }} onClick={() => setPicking(true)}><MessageCircle size={13} style={{ marginRight: 6 }}/>Enviar a un chat</button>
            </div>
          ) : (
            <div className="comments-list floating" style={{ top: pos.top, left: pos.left }}>
              <div className="notif-head"><span>Enviar a...</span><button onClick={closeAll}><X size={14}/></button></div>
              {contacts.map(c => (
                <div key={c.handle} className="contact-pick-row" onClick={() => pickContact(c)}>
                  <Avatar name={c.name} url={c.avatarUrl} size="tiny"/><span>{c.name}</span>
                  {sentTo === c.handle && <Check size={13} style={{ marginLeft: "auto", color: "var(--accent)" }}/>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ---------- FEED ---------- */
function CodeBlock({ content, lang, textStyle, bold, italic }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(content).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <div className="terminal">
      <div className="terminal-bar"><span/><span/><span/><span className="fname">{lang}</span>
        <button className="copy-btn" onClick={copy}>{copied ? <Check size={12}/> : <Copy size={12}/>}{copied ? "copiado" : "copiar"}</button></div>
      <div className="terminal-body"><TextStyled text={content} fontSize={13} textStyle={textStyle} bold={bold} italic={italic} as="pre" /></div>
    </div>
  );
}

function PostCard({ post, following, onToggleFollow, onLike, onReport, onAddComment, onLikeComment, onViewProfile, myHandle, contacts, onSendToChat, resolveAuthor, lang, t }) {
  const [revealed, setRevealed] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const liked = (post.likedBy || []).includes(myHandle);
  const live = resolveAuthor ? resolveAuthor(post.handle) : null;
  const displayName = live?.name || post.author;
  const displayAvatar = live?.avatarUrl || post.avatarUrl;
  const displayIsDev = live ? !!live.isDev : post.isDev;
  return (
    <div className="card">
      <div className="card-head">
        <div onClick={() => onViewProfile(post.handle)} className="clickable"><Avatar name={displayName} url={displayAvatar} /></div>
        <div style={{ flex: 1 }}>
          <div className="author-row"><span className="author-name clickable" onClick={() => onViewProfile(post.handle)}>{displayName}</span>{displayIsDev && <span className="dev-badge">DEV</span>}</div>
          <span className="handle">{post.handle}</span>
        </div>
        {post.handle !== myHandle && (
          <button className={"follow-btn" + (following ? " following" : "")} onClick={() => onToggleFollow(post.handle)}>
            {following ? <UserCheck size={14} /> : <UserPlus size={14} />}{following ? t("siguiendoBtn") : t("seguir")}
          </button>
        )}
      </div>
      {(post.reports >= 3 || post.sensitive) && !revealed ? (
        <div className="blur-gate"><Eye size={18} /><p>Contenido marcado como sensible</p><button className="pill-btn-outline" onClick={() => setRevealed(true)}>Ver de todas formas</button></div>
      ) : (
        <div className="card-body">
          {post.section && <span className="section-chip">{sectionLabel(post.section, lang)}</span>}
          {post.title && <h3 className="post-title">{post.title}</h3>}
          {post.content && <TextStyled text={post.content} fontSize={post.fontSize} textStyle={post.textStyle} bold={post.bold} italic={post.italic} />}
          {post.codeContent && <CodeBlock content={post.codeContent} lang={post.codeLang} textStyle={post.textStyle} bold={post.bold} italic={post.italic} />}
          {post.imageUrl && <img src={post.imageUrl} alt="" className="post-media" />}
          {post.videoUrl && <video src={post.videoUrl} controls className="post-media" />}
          {post.linkUrl && <a href={post.linkUrl} target="_blank" rel="noreferrer" className="link-card"><Link2 size={14} /><span>{post.linkUrl}</span></a>}
          {post.demo && (
            <div className="demo-frame"><div className="terminal-bar"><span/><span/><span/><span className="fname"><PlayCircle size={12} style={{ verticalAlign: "-2px", marginRight: 4 }}/>demo en vivo</span></div>
              <iframe title={"demo-" + post.id} srcDoc={post.demo.html} sandbox="allow-scripts" className="demo-iframe" /></div>
          )}
          <div className="tags-row">{post.tags.map(t2 => <span key={t2} className="tag">#{t2}</span>)}</div>
        </div>
      )}
      <div className="card-footer">
        <button className="icon-btn" onClick={() => onLike(post.id)}><Heart size={16} fill={liked ? "currentColor" : "none"}/> {post.likes}</button>
        <button className="icon-btn" onClick={() => setCommentsOpen(o => !o)}><MessageCircle size={16}/> {post.comments.length}</button>
        <ShareMenu post={post} contacts={contacts} onSendToChat={onSendToChat} />
        <button className="icon-btn report" onClick={() => onReport(post.id)}><Flag size={14}/> reportar</button>
      </div>
      {commentsOpen && <CommentsPanel post={post} onAddComment={onAddComment} onLikeComment={onLikeComment} myHandle={myHandle} onViewProfile={onViewProfile} />}
    </div>
  );
}

function FeedScreen({ posts, likePost, reportPost, addComment, likeComment, publishPost, following, toggleFollow, isDeveloper, searchQuery, onViewProfile, myHandle, contacts, onSendToChat, resolveAuthor, affinity, lang, t }) {
  const [composerOpen, setComposerOpen] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [sectionDraft, setSectionDraft] = useState(null);
  const [draft, setDraft] = useState("");
  const [selectedTypes, setSelectedTypes] = useState(() => new Set());
  const [fontSize, setFontSize] = useState(16);
  const [colorMode, setColorMode] = useState("default");
  const [solidColor, setSolidColor] = useState(SOLID_COLORS[0]);
  const [gradient, setGradient] = useState("arcoiris");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [markSensitive, setMarkSensitive] = useState(false);
  const [feedTab, setFeedTab] = useState("paraTi");
  const [sectionFilter, setSectionFilter] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [codeContent, setCodeContent] = useState("");
  const [codeLang, setCodeLang] = useState("javascript");
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const hasType = (id) => selectedTypes.has(id);
  const toggleType = (id) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); return next; }
      if (!isDeveloper) return new Set([id]);
      if (id === "video") return new Set(["video"]);
      if (next.has("video")) next.delete("video");
      next.add(id);
      return next;
    });
  };
  const handleImgUpload = (e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setImageUrl(reader.result); reader.readAsDataURL(file); };
  const handleVidUpload = (e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setVideoUrl(reader.result); reader.readAsDataURL(file); };

  const resetComposer = () => {
    setDraft(""); setTitleDraft(""); setSectionDraft(null); setSelectedTypes(new Set()); setMarkSensitive(false);
    setImageUrl(""); setVideoUrl(""); setLinkUrl(""); setCodeContent(""); setCodeLang("javascript");
    setComposerOpen(false); setTagsInput(""); setBold(false); setItalic(false);
  };
  const publish = () => {
    const hasImage = hasType("image"), hasVideo = hasType("video"), hasCode = hasType("code"), hasLink = hasType("link"), hasDemo = hasType("interactive");
    if (!draft.trim() && !hasCode && !hasImage && !hasVideo && !hasLink && !hasDemo) return;
    if (hasLink && !linkUrl.trim()) return;
    if (hasVideo && !videoUrl.trim()) return;
    if (hasCode && !codeContent.trim()) return;
    const textStyle = colorMode === "gradient" ? { mode: "gradient", value: gradient } : colorMode === "solid" ? { mode: "solid", value: solidColor } : { mode: "default" };
    const tags = tagsInput.split(",").map(t2 => t2.trim().replace(/^#/, "")).filter(Boolean);
    publishPost({
      title: titleDraft.trim() || undefined, section: sectionDraft || null, content: draft,
      imageUrl: hasImage ? (imageUrl || undefined) : undefined,
      videoUrl: hasVideo ? (videoUrl || undefined) : undefined,
      linkUrl: hasLink ? (linkUrl || undefined) : undefined,
      codeContent: hasCode ? codeContent : undefined,
      codeLang: hasCode ? codeLang : undefined,
      demo: hasDemo ? DEMO_TEMPLATES[Math.floor(Math.random() * DEMO_TEMPLATES.length)] : undefined,
      fontSize, textStyle, bold, italic, tags, sensitive: markSensitive,
    });
    resetComposer();
  };

  const orderedForYou = useMemo(() => {
    return [...posts].map(p => {
      const tagScore = (p.tags || []).reduce((s, tag) => s + (affinity[tag.toLowerCase()] || 0), 0);
      return { p, score: tagScore * 3 + stableJitter(p.id, 1.5) };
    }).sort((a, b) => b.score - a.score).map(x => x.p);
  }, [posts, affinity]);

  const visiblePosts = useMemo(() => {
    let list = feedTab === "siguiendo" ? posts.filter(p => following.has(p.handle) || p.handle === myHandle) : orderedForYou;
    if (sectionFilter) list = list.filter(p => p.section === sectionFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().replace(/^#/, "");
      list = list.filter(p => p.author.toLowerCase().includes(q) || p.handle.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) || (p.title || "").toLowerCase().includes(q) || p.tags.some(t2 => t2.toLowerCase().includes(q)));
    }
    return list;
  }, [posts, orderedForYou, feedTab, following, searchQuery, myHandle, sectionFilter]);
  const previewText = draft.trim() ? draft : "Así se verá tu texto mientras escribes...";
  const previewStyle = colorMode === "gradient" ? { mode: "gradient", value: gradient } : colorMode === "solid" ? { mode: "solid", value: solidColor } : { mode: "default" };

  return (
    <div>
      {!composerOpen ? (
        <button className="new-post-fab" title={t("publicarAlgo")} onClick={() => setComposerOpen(true)}><Plus size={16}/> {t("publicarAlgo")}</button>
      ) : (
        <div className="composer">
          <div className="composer-head"><span>Nueva publicación</span><button className="icon-only-btn" onClick={resetComposer}><X size={14}/></button></div>
          <input className="title-input" placeholder="Título (opcional)" value={titleDraft} onChange={e => setTitleDraft(e.target.value)} />
          <div style={{ position: "relative" }}>
            <textarea placeholder="¿Qué construiste hoy?" value={draft} onChange={e => setDraft(e.target.value)} />
            <div style={{ position: "absolute", right: 8, bottom: 22 }}><EmojiPicker onPick={(e) => setDraft(d => d + e)} /></div>
          </div>
          <div className="type-row">
            {TYPE_OPTIONS.map(t2 => (
              <button key={t2.id} className={"type-btn" + (hasType(t2.id) ? " active" : "")} onClick={() => toggleType(t2.id)}><t2.icon size={14} /> {t2.label}</button>
            ))}
          </div>
          {isDeveloper ? (
            <p className="hint-text">Como developer verificado podés combinar varios tipos (menos video, que va solo).</p>
          ) : (
            <p className="hint-text"><Lock size={11} style={{ verticalAlign: "-1px" }}/> Solo developers verificados pueden combinar varios tipos a la vez.</p>
          )}
          <div className="row"><label>Sección</label>
            {SECTIONS.map(s => (
              <button key={s.id} className={"type-btn" + (sectionDraft === s.id ? " active" : "")} onClick={() => setSectionDraft(v => v === s.id ? null : s.id)}>{sectionLabel(s.id, lang)}</button>
            ))}
          </div>
          {hasType("code") && (
            <div className="upload-row" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <input className="url-input" style={{ maxWidth: 200, marginBottom: 8 }} placeholder="Lenguaje (ej: javascript)" value={codeLang} onChange={e => setCodeLang(e.target.value)} />
              <textarea placeholder="Pegá tu código..." value={codeContent} onChange={e => setCodeContent(e.target.value)} style={{ fontFamily: "monospace", fontSize: 13, minHeight: 90 }} />
            </div>
          )}
          {hasType("image") && (
            <div className="upload-row">
              <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleImgUpload} />
              <button className="type-btn" onClick={() => fileInputRef.current?.click()}><Upload size={14}/> Subir imagen</button>
              <span className="hint-inline">o pega una URL:</span>
              <input type="text" placeholder="https://..." value={imageUrl.startsWith("data:") ? "" : imageUrl} onChange={e => setImageUrl(e.target.value)} className="url-input" />
              {imageUrl && <img src={imageUrl} alt="" className="upload-preview" />}
            </div>
          )}
          {hasType("video") && (
            <div className="upload-row">
              <input type="file" accept="video/*" ref={videoInputRef} style={{ display: "none" }} onChange={handleVidUpload} />
              <button className="type-btn" onClick={() => videoInputRef.current?.click()}><Upload size={14}/> Subir video</button>
              <span className="hint-inline">o pega una URL (mp4, YouTube...):</span>
              <input type="text" placeholder="https://..." value={videoUrl.startsWith("data:") ? "" : videoUrl} onChange={e => setVideoUrl(e.target.value)} className="url-input" />
              {videoUrl && <video src={videoUrl} controls className="upload-preview" />}
              <p className="hint-text" style={{ width: "100%" }}>Los archivos de video grandes pueden no sincronizar entre dispositivos (límite ~5MB). Mejor pegá un link. Aparece en la pestaña DevFeed.</p>
            </div>
          )}
          {hasType("link") && <div className="upload-row"><input type="text" placeholder="https://tu-link.com (obligatorio)" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="url-input" style={{ flex: 1 }} /></div>}
          {hasType("interactive") && <p className="hint-text">Se adjuntará una mini demo interactiva de ejemplo (contador o paleta de colores).</p>}
          <div className="row"><label><Type size={13}/> Tamaño de letra</label><input type="range" min="13" max="28" value={fontSize} onChange={e => setFontSize(+e.target.value)} /><span style={{ fontSize: 12, color: "var(--ink-muted)" }}>{fontSize}px</span></div>
          <div className="row"><label>Estilo</label><button className={"type-btn" + (bold ? " active" : "")} onClick={() => setBold(b => !b)}><Bold size={13}/> Negrita</button><button className={"type-btn" + (italic ? " active" : "")} onClick={() => setItalic(i => !i)}><Italic size={13}/> Cursiva</button></div>
          <div className="row"><label><Palette size={13}/> Color de texto</label>
            {isDeveloper ? (<><button className="type-btn" style={{ padding: "5px 10px" }} onClick={() => setColorMode("default")}>Predeterminado</button><button className="type-btn" style={{ padding: "5px 10px" }} onClick={() => setColorMode("solid")}>Sólido</button><button className="type-btn" style={{ padding: "5px 10px" }} onClick={() => setColorMode("gradient")}>Degradado</button></>)
              : <span className="dev-lock"><Lock size={12}/> función solo para developers verificados (pedí verificación en Ajustes)</span>}
          </div>
          {isDeveloper && colorMode === "solid" && <div className="row"><div className="swatch-row">{SOLID_COLORS.map(c => <div key={c} className={"swatch" + (solidColor === c ? " selected" : "")} style={{ background: c }} onClick={() => setSolidColor(c)} />)}</div></div>}
          {isDeveloper && colorMode === "gradient" && <div className="row"><div className="swatch-row wrap">{Object.entries(GRADIENTS).map(([key, val]) => <div key={key} className={"grad-swatch" + (gradient === key ? " selected" : "")} style={{ backgroundImage: val }} onClick={() => setGradient(key)} title={key} />)}</div></div>}
          <div className="row"><label>Etiquetas</label><input type="text" placeholder="javascript, react, ui..." value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="url-input" style={{ flex: 1 }} /></div>
          <div className="preview-box"><div className="preview-label">Vista previa en vivo</div>{titleDraft.trim() && <h3 className="post-title">{titleDraft}</h3>}<TextStyled text={previewText} fontSize={fontSize} textStyle={previewStyle} bold={bold} italic={italic} /></div>
          <div className="row"><label style={{ cursor: "pointer" }}><input type="checkbox" checked={markSensitive} onChange={e => setMarkSensitive(e.target.checked)} /> Marcar como contenido sensible (+18)</label></div>
          <button className="publish-btn" onClick={publish}>Publicar</button>
          <div style={{ clear: "both" }} />
        </div>
      )}
      <div className="subtab-row">
        <button className={"subtab" + (feedTab === "paraTi" ? " active" : "")} onClick={() => setFeedTab("paraTi")}>{t("paraTi")}</button>
        <button className={"subtab" + (feedTab === "siguiendo" ? " active" : "")} onClick={() => setFeedTab("siguiendo")}>{t("siguiendoTab")} ({following.size})</button>
      </div>
      <div className="chip-row">
        <button className={"chip" + (!sectionFilter ? " active" : "")} onClick={() => setSectionFilter(null)}>{t("todas")}</button>
        {SECTIONS.map(s => <button key={s.id} className={"chip" + (sectionFilter === s.id ? " active" : "")} onClick={() => setSectionFilter(s.id)}>{sectionLabel(s.id, lang)}</button>)}
      </div>
      {visiblePosts.length === 0 && <p className="no-comments" style={{ padding: "20px 0" }}>No hay publicaciones que coincidan.</p>}
      {visiblePosts.map(p => <PostCard key={p.id} post={p} following={following.has(p.handle)} onToggleFollow={toggleFollow} onLike={likePost} onReport={reportPost} onAddComment={addComment} onLikeComment={likeComment} onViewProfile={onViewProfile} myHandle={myHandle} contacts={contacts} onSendToChat={onSendToChat} resolveAuthor={resolveAuthor} lang={lang} t={t} />)}
    </div>
  );
}

/* ---------- DEVFEED (shorts) ---------- */
function DevFeedScreen({ posts, likePost, reportPost, addComment, likeComment, onViewProfile, myHandle, resolveAuthor, affinity, contacts, onSendToChat, t, lang }) {
  const [openCommentsId, setOpenCommentsId] = useState(null);
  const videos = useMemo(() => {
    const vids = posts.filter(p => p.videoUrl);
    return vids.map(p => {
      const tagScore = (p.tags || []).reduce((s, tag) => s + (affinity[tag.toLowerCase()] || 0), 0);
      return { p, score: tagScore * 3 + (p.likes || 0) * 0.1 + stableJitter(p.id, 2) };
    }).sort((a, b) => b.score - a.score).map(x => x.p);
  }, [posts, affinity]);

  if (videos.length === 0) return <p className="no-comments" style={{ padding: "40px 0", textAlign: "center" }}>Todavía no hay videos. ¡Subí el primero desde Feed!</p>;

  return (
    <div className="devfeed-scroll">
      {videos.map(v => {
        const live = resolveAuthor ? resolveAuthor(v.handle) : null;
        const displayName = live?.name || v.author;
        const liked = (v.likedBy || []).includes(myHandle);
        return (
          <div className="devfeed-item" key={v.id}>
            <video src={v.videoUrl} className="devfeed-video" controls loop playsInline />
            <div className="devfeed-overlay">
              <div className="devfeed-info">
                <span className="author-name clickable devfeed-author" onClick={() => onViewProfile(v.handle)}>{displayName}</span>
                {v.title && <p className="devfeed-caption">{v.title}</p>}
                {v.content && <p className="devfeed-caption">{v.content}</p>}
                <div className="tags-row">{v.tags.map(tg => <span key={tg} className="tag devfeed-tag">#{tg}</span>)}</div>
              </div>
              <div className="devfeed-actions">
                <button className="devfeed-action-btn" onClick={() => likePost(v.id)}><Heart size={22} fill={liked ? "currentColor" : "none"}/><span>{v.likes}</span></button>
                <button className="devfeed-action-btn" onClick={() => setOpenCommentsId(id => id === v.id ? null : v.id)}><MessageCircle size={22}/><span>{v.comments.length}</span></button>
                <ShareMenu post={v} contacts={contacts} onSendToChat={onSendToChat} />
                <button className="devfeed-action-btn" onClick={() => reportPost(v.id)}><Flag size={18}/></button>
              </div>
            </div>
            {openCommentsId === v.id && (
              <div className="devfeed-comments">
                <div className="notif-head"><span>Comentarios</span><button onClick={() => setOpenCommentsId(null)}><X size={14}/></button></div>
                <CommentsPanel post={v} onAddComment={addComment} onLikeComment={likeComment} myHandle={myHandle} onViewProfile={onViewProfile} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- PERFIL ---------- */
function DevRow({ dev, following, onToggle, onViewProfile, followsMap, t }) {
  const count = followerCountFor(dev.handle, followsMap, dev.followers || 0);
  return (
    <div className="dev-row">
      <div className="clickable" onClick={() => onViewProfile(dev.handle)}><Avatar name={dev.name} url={dev.avatarUrl} /></div>
      <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => onViewProfile(dev.handle)}>
        <div className="author-row"><span className="author-name">{dev.name}</span>{dev.isDev && <span className="dev-badge">DEV</span>}</div>
        <p className="dev-bio">{dev.bio || "Nuevo en DevFeel."}</p>
        <span className="handle">{dev.handle} · {count.toLocaleString()} {t("seguidores")}</span>
      </div>
      <button className={"follow-btn" + (following ? " following" : "")} onClick={() => onToggle(dev.handle)}>{following ? <UserCheck size={14} /> : <UserPlus size={14} />}{following ? t("siguiendoBtn") : t("seguir")}</button>
    </div>
  );
}

function ProfileScreen({ user, following, toggleFollow, myPostsCount, bio, searchQuery, isDeveloper, onViewProfile, allDevs, followsMap, avatarUrl, t }) {
  const filteredDevs = useMemo(() => {
    if (!searchQuery.trim()) return allDevs;
    const q = searchQuery.toLowerCase().replace(/^#/, "");
    return allDevs.filter(d => d.name.toLowerCase().includes(q) || d.handle.toLowerCase().includes(q) || (d.bio || "").toLowerCase().includes(q));
  }, [searchQuery, allDevs]);
  const myFollowers = followerCountFor(user.handle, followsMap, 0);
  return (
    <div>
      <div className="profile-card">
        <div className="profile-head">
          <Avatar name={user.name} url={avatarUrl} size="big" />
          <div style={{ flex: 1 }}><div className="author-row"><h2 style={{ margin: 0 }}>{user.name}</h2>{isDeveloper && <span className="dev-badge">DEV</span>}</div><span className="handle">{user.handle}</span></div>
        </div>
        <p className="bio-text">{bio}</p>
        <div className="stats-row"><div><strong>{myPostsCount}</strong><span>{t("publicaciones")}</span></div><div><strong>{following.size}</strong><span>{t("siguiendoStat")}</span></div><div><strong>{myFollowers}</strong><span>{t("seguidores")}</span></div></div>
      </div>
      {searchQuery.trim() && filteredDevs.length === 0 && <p className="no-comments">{t("noHayResultados")}</p>}
      <h3 style={{ fontSize: 16, margin: "24px 0 12px" }}>{searchQuery.trim() ? t("developersEncontrados") : t("developersEnDevfeel")}</h3>
      {filteredDevs.map(dev => <DevRow key={dev.handle} dev={dev} following={following.has(dev.handle)} onToggle={toggleFollow} onViewProfile={onViewProfile} followsMap={followsMap} t={t} />)}
    </div>
  );
}

function OtherProfileScreen({ dev, following, toggleFollow, posts, onBack, onMessage, followsMap, canChatWith, t, lang }) {
  const isFollowing = following.has(dev.handle);
  const devPosts = posts.filter(p => p.handle === dev.handle);
  const count = followerCountFor(dev.handle, followsMap, dev.followers || 0);
  const chatAllowed = canChatWith(dev);
  const linkEntries = Object.entries(dev.links || {}).filter(([, v]) => v);
  return (
    <div>
      <button className="back-btn" onClick={onBack}><ArrowLeft size={16}/> {t("volver")}</button>
      <div className="profile-card">
        <div className="profile-head">
          <Avatar name={dev.name} url={dev.avatarUrl} size="big" />
          <div style={{ flex: 1 }}><div className="author-row"><h2 style={{ margin: 0 }}>{dev.name}</h2>{dev.isDev && <span className="dev-badge">DEV</span>}</div><span className="handle">{dev.handle}</span></div>
        </div>
        <p className="bio-text">{dev.bio || "Nuevo en DevFeel."}</p>
        {linkEntries.length > 0 && (
          <div className="links-row">{linkEntries.map(([k, v]) => (
            <a key={k} href={v} target="_blank" rel="noreferrer" className="social-link"><ExternalLink size={12}/> {k}</a>
          ))}</div>
        )}
        <div className="stats-row"><div><strong>{devPosts.length}</strong><span>{t("publicaciones")}</span></div><div><strong>{count}</strong><span>{t("seguidores")}</span></div></div>
        <div className="row" style={{ marginTop: 16 }}>
          <button className={"follow-btn" + (isFollowing ? " following" : "")} onClick={() => toggleFollow(dev.handle)}>{isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}{isFollowing ? t("siguiendoBtn") : t("seguir")}</button>
          {chatAllowed ? <button className="pill-btn-outline" onClick={() => onMessage(dev)}><MessageCircle size={13} style={{ verticalAlign: "-2px", marginRight: 4 }}/>{t("enviarMensaje")}</button> : <span className="dev-lock"><Lock size={12}/> {dev.isBot ? "no acepta mensajes" : "deben seguirse mutuamente para chatear"}</span>}
        </div>
      </div>
      <h3 style={{ fontSize: 16, margin: "24px 0 12px" }}>Publicaciones de {dev.name}</h3>
      {devPosts.length === 0 && <p className="no-comments">Todavía no ha publicado nada.</p>}
      {devPosts.map(p => (
        <div key={p.id} className="card"><div className="card-body" style={{ paddingTop: 16 }}>
          {p.section && <span className="section-chip">{sectionLabel(p.section, lang)}</span>}
          {p.title && <h3 className="post-title">{p.title}</h3>}
          {p.content && <TextStyled text={p.content} fontSize={p.fontSize} textStyle={p.textStyle} bold={p.bold} italic={p.italic} />}
          {p.codeContent && <CodeBlock content={p.codeContent} lang={p.codeLang} textStyle={p.textStyle} bold={p.bold} italic={p.italic} />}
          {p.imageUrl && <img src={p.imageUrl} alt="" className="post-media" />}
          {p.videoUrl && <video src={p.videoUrl} controls className="post-media" />}
          {p.linkUrl && <a href={p.linkUrl} target="_blank" rel="noreferrer" className="link-card"><Link2 size={14} /><span>{p.linkUrl}</span></a>}
        </div></div>
      ))}
    </div>
  );
}

/* ---------- MODERACIÓN ---------- */
function ModerationScreen({ users, requests, claims, onToggleVerified, onResolveRequest, onDismissClaim }) {
  return (
    <div>
      <div className="settings-card">
        <h3 style={{ fontSize: 16, marginBottom: 10 }}><ShieldCheck size={15} style={{ verticalAlign: "-3px", marginRight: 6 }}/>Solicitudes de verificación</h3>
        {requests.length === 0 && <p className="no-comments">No hay solicitudes pendientes.</p>}
        {requests.map(r => (
          <div key={r.handle} className="setting-row">
            <div><strong>{r.name}</strong><p>{r.handle}</p></div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="pill-btn-outline" onClick={() => onResolveRequest(r.handle, true)}>Aprobar</button>
              <button className="pill-btn-outline" onClick={() => onResolveRequest(r.handle, false)}>Rechazar</button>
            </div>
          </div>
        ))}
      </div>
      <div className="settings-card">
        <h3 style={{ fontSize: 16, marginBottom: 10 }}>Usuarios registrados ({users.length})</h3>
        {users.length === 0 && <p className="no-comments">Todavía no hay usuarios registrados.</p>}
        {users.map(u => (
          <div key={u.handle} className="setting-row">
            <div><strong>{u.name}</strong><p>{u.handle}{u.isDev ? " · verificado" : ""}</p></div>
            <button className={"toggle" + (u.isDev ? " on" : "")} onClick={() => onToggleVerified(u.handle, !u.isDev)}><span/></button>
          </div>
        ))}
      </div>
      <div className="settings-card">
        <h3 style={{ fontSize: 16, marginBottom: 10 }}>Nombres de usuario en disputa</h3>
        {claims.length === 0 && <p className="no-comments">No hay solicitudes en disputa.</p>}
        {claims.map((c, i) => (
          <div key={i} className="setting-row">
            <div><strong>{c.name}</strong><p>quiere {c.handle} · vía {c.via}</p></div>
            <button className="pill-btn-outline" onClick={() => onDismissClaim(i)}>Marcar revisado</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- AJUSTES ---------- */
function SettingsScreen({ isDeveloper, hasPendingVerification, onRequestVerification, acceptsMsgs, setAcceptsMsgs, theme, setTheme, lang, setLang, nickname, handle, onSaveNickname, bio, setBio, avatarUrl, setAvatarUrl, links, setLinks, t }) {
  const [localBio, setLocalBio] = useState(bio);
  const [localLinks, setLocalLinks] = useState(links);
  const [localNickname, setLocalNickname] = useState(nickname);
  const fileInputRef = useRef(null);
  const handleAvatar = (e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setAvatarUrl(reader.result); reader.readAsDataURL(file); };
  const saveAll = () => { setBio(localBio); setLinks(localLinks); onSaveNickname(localNickname.slice(0, 20)); };
  return (
    <div>
      <div className="settings-card">
        <h3 style={{ fontSize: 16, marginBottom: 14 }}>Foto de perfil</h3>
        <div className="row">
          <Avatar name="?" url={avatarUrl} size="big" />
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleAvatar} />
          <button className="type-btn" onClick={() => fileInputRef.current?.click()}><Camera size={14}/> Subir foto</button>
          {avatarUrl && <button className="pill-btn-outline" onClick={() => setAvatarUrl("")}>Quitar</button>}
        </div>
      </div>
      <div className="settings-card">
        <h3 style={{ fontSize: 16, marginBottom: 14 }}>Identidad</h3>
        <div style={{ position: "relative", marginBottom: 6 }}>
          <label style={{ fontSize: 12, color: "var(--ink-muted)", display: "block", marginBottom: 6 }}>{t("apodoLabel")} (máx. 20)</label>
          <input className="url-input" style={{ width: "100%", paddingRight: 42 }} maxLength={20} value={localNickname} onChange={e => setLocalNickname(e.target.value.slice(0, 20))} />
          <div style={{ position: "absolute", right: 6, top: 26 }}><EmojiPicker onPick={e => setLocalNickname(n => (n + e).slice(0, 20))} /></div>
        </div>
        <p className="hint-text">Podés usar emojis y espacios, y cambiarlo cuando quieras.</p>
        <div className="row" style={{ marginTop: 8 }}><label><Lock size={12}/> {t("usuarioLabel")}</label><span className="handle" style={{ fontSize: 13 }}>{handle}</span></div>
        <p className="hint-text" style={{ margin: "-4px 0 0" }}>El @usuario es tu identificador único (5-9 caracteres) y no se puede cambiar.</p>
      </div>
      <div className="settings-card">
        <h3 style={{ fontSize: 16, marginBottom: 14 }}>{t("cuenta")}</h3>
        <div className="setting-row">
          <div><strong>Cuenta developer verificada</strong><p>{isDeveloper ? "Verificada por moderación: ya podés usar colores, combinar tipos de contenido, etc." : "Solo moderación puede otorgar esta insignia."}</p></div>
          {isDeveloper ? <span className="dev-badge">DEV</span> : hasPendingVerification ? <span className="pending-pill">{t("pendiente")}</span> : <button className="pill-btn-outline" onClick={onRequestVerification}>{t("solicitarVerificacion")}</button>}
        </div>
        <div className="setting-row"><div><strong>{t("recibirMensajes")}</strong><p>Solo podrán escribirte quienes te sigan y a quienes sigas.</p></div><button className={"toggle" + (acceptsMsgs ? " on" : "")} onClick={() => setAcceptsMsgs(v => !v)}><span/></button></div>
        <div className="setting-row"><div><strong>{t("modoClaro")}</strong><p>Cambia la apariencia visual de toda la app.</p></div><button className={"toggle" + (theme === "light" ? " on" : "")} onClick={() => setTheme(t2 => t2 === "dark" ? "light" : "dark")}><span/></button></div>
        <div className="setting-row">
          <div><strong><Globe size={13} style={{ verticalAlign: "-2px", marginRight: 4 }}/>{t("idioma")}</strong><p>Cambia el idioma de la interfaz.</p></div>
          <div style={{ display: "flex", gap: 6 }}>
            {[["es", "ES"], ["en", "EN"], ["pt", "PT"]].map(([code, label]) => (
              <button key={code} className={"type-btn" + (lang === code ? " active" : "")} style={{ padding: "5px 10px" }} onClick={() => setLang(code)}>{label}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="settings-card">
        <h3 style={{ fontSize: 16, marginBottom: 10 }}>Biografía</h3>
        <textarea className="bio-edit" value={localBio} onChange={e => setLocalBio(e.target.value)} rows={3} />
      </div>
      <div className="settings-card">
        <h3 style={{ fontSize: 16, marginBottom: 10 }}>Redes y enlaces</h3>
        {["GitHub", "YouTube", "TikTok", "Instagram/Facebook"].map(k => (
          <div className="row" key={k} style={{ marginBottom: 10 }}>
            <label style={{ width: 130 }}>{k}</label>
            <input type="text" placeholder={"https://..."} className="url-input" style={{ flex: 1 }}
              value={localLinks[k] || ""} onChange={e => setLocalLinks(prev => ({ ...prev, [k]: e.target.value }))} />
          </div>
        ))}
      </div>
      <button className="publish-btn" style={{ float: "none", width: "100%" }} onClick={saveAll}>{t("guardarCambios")}</button>
      <div className="settings-card" style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: 16, marginBottom: 10 }}>Moderación de contenido</h3>
        <p style={{ fontSize: 13, color: "var(--ink-muted)" }}>Las publicaciones marcadas como sensibles, o con 3+ reportes de la comunidad, se difuminan automáticamente hasta que decidas verlas.</p>
      </div>
      {!STORAGE_AVAILABLE && (
        <div className="settings-card">
          <h3 style={{ fontSize: 16, marginBottom: 10 }}><WifiOff size={15} style={{ verticalAlign: "-3px", marginRight: 6 }}/>Modo local</h3>
          <p style={{ fontSize: 13, color: "var(--ink-muted)" }}>Corriendo fuera de Claude.ai: cada dispositivo queda aislado. Para probar con dos dispositivos a la vez, abre este artifact directamente en Claude.ai en ambos.</p>
        </div>
      )}
    </div>
  );
}

/* ---------- CHAT ---------- */
function MessageBubble({ msg, myName, onReply }) {
  const mine = msg.from === myName;
  return (
    <div className={"msg-row" + (mine ? " mine" : "")}>
      <div className={"bubble" + (mine ? " mine" : "")} onDoubleClick={() => onReply(msg)}>
        {msg.replyTo && <div className="reply-quote">{msg.replyTo}</div>}
        {msg.type === "text" && <span>{msg.content}</span>}
        {msg.type === "sticker" && <span style={{ fontSize: 34 }}>{msg.content}</span>}
        {msg.type === "image" && <img src={msg.url} alt="" className="chat-img" />}
        {msg.type === "code" && <div className="chat-terminal"><div className="chat-terminal-bar"><span/><span/><span/></div><pre>{msg.content}</pre></div>}
        {msg.type === "audio" && <audio controls src={msg.url} className="audio-player" />}
        {msg.type === "link" && <a href={msg.url} target="_blank" rel="noreferrer" className="chat-link"><Link2 size={13} /> {msg.url}</a>}
      </div>
    </div>
  );
}

function useAudioRecorder(onDone) {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const start = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => onDone(reader.result);
        reader.readAsDataURL(blob);
        streamRef.current?.getTracks().forEach(t2 => t2.stop());
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    } catch (e) {
      setError("No se pudo acceder al micrófono. Revisá los permisos del navegador.");
    }
  };
  const stop = () => { recorderRef.current?.stop(); setRecording(false); };
  return { recording, error, start, stop };
}

function ChatScreen({ contacts, activeHandle, setActiveHandle, messages, sendMessage, myName, onViewProfile, canChatWith, chatStateFor, sendChatRequest, acceptChatRequest }) {
  const [draft, setDraft] = useState("");
  const [requestDraft, setRequestDraft] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const fileInputRef = useRef(null);
  const active = contacts.find(c => c.handle === activeHandle) || contacts[0];
  const state = active ? chatStateFor(active) : "none";
  const canMessage = state === "direct" || state === "accepted";

  const doSend = (msgPart) => {
    const withReply = replyTo ? { ...msgPart, replyTo: (replyTo.from === myName ? "Tú" : replyTo.from) + ": " + (replyTo.content || replyTo.type) } : msgPart;
    sendMessage(active.handle, withReply);
    setReplyTo(null);
  };
  const recorder = useAudioRecorder((dataUrl) => doSend({ type: "audio", url: dataUrl }));
  const sendText = () => { if (!draft.trim() || !canMessage) return; const isLink = /^https?:\/\//.test(draft.trim()); doSend(isLink ? { type: "link", url: draft.trim() } : { type: "text", content: draft.trim() }); setDraft(""); };
  const sendCodePrompt = () => canMessage && doSend({ type: "code", content: "// prompt compartido\nExplica qué hace este hook:\nuseEffect(() => {...}, [dep])" });
  const handleImageUpload = (e) => { const file = e.target.files?.[0]; if (!file || !canMessage) return; const reader = new FileReader(); reader.onload = () => doSend({ type: "image", url: reader.result }); reader.readAsDataURL(file); };
  const submitRequest = () => { if (!requestDraft.trim()) return; sendChatRequest(active, requestDraft.trim()); setRequestDraft(""); };

  const attachments = messages.filter(m => m.type === "image" || m.type === "link");
  const statusLabel = (c) => { const s = chatStateFor(c); return s === "direct" || s === "accepted" ? "podés escribirle" : s === "pending-sent" ? "solicitud enviada" : s === "pending-received" ? "quiere chatear con vos" : "seguíanse para chatear"; };

  return (
    <div className={"chat-shell" + (mobileShowChat ? " show-chat" : "")}>
      <div className="contacts-col">
        <h4>Mensajes</h4>
        {contacts.map(c => (
          <div key={c.handle} className={"contact-item" + (c.handle === activeHandle ? " active" : "")} onClick={() => { setActiveHandle(c.handle); setMobileShowChat(true); }}>
            <Avatar name={c.name} url={c.avatarUrl} />
            <div><div className="contact-name">{c.name}</div><div className="contact-sub">{statusLabel(c)}</div></div>
            {chatStateFor(c) === "pending-received" && <span className="badge-dot" style={{ position: "static", marginLeft: "auto" }}>!</span>}
          </div>
        ))}
      </div>
      <div className="chat-col">
        {active && (
          <div className="chat-head">
            <button className="tool-btn mobile-back" onClick={() => setMobileShowChat(false)}><ArrowLeft size={15}/></button>
            <div className="clickable" onClick={() => onViewProfile(active.handle)}><Avatar name={active.name} url={active.avatarUrl} /></div>
            <div style={{ flex: 1, cursor: "pointer" }} onClick={() => onViewProfile(active.handle)}><div className="name">{active.name}</div><div className="status">{active.handle}</div></div>
            <button className="tool-btn" title="Archivos compartidos" onClick={() => setShowInfo(s => !s)}><Info size={15}/></button>
          </div>
        )}
        {showInfo && (
          <div className="attachments-panel">
            <div className="notif-head"><span>Archivos compartidos</span><button onClick={() => setShowInfo(false)}><X size={14}/></button></div>
            {attachments.length === 0 && <p className="no-comments">Todavía no hay imágenes ni links en esta conversación.</p>}
            {attachments.map((a, i) => a.type === "image" ? <img key={i} src={a.url} alt="" className="attach-thumb" /> : <a key={i} href={a.url} target="_blank" rel="noreferrer" className="chat-link" style={{ display: "block", marginBottom: 6 }}>{a.url}</a>)}
          </div>
        )}

        {state === "pending-received" && (
          <div className="request-banner">
            <span><strong>{active.name}</strong> quiere chatear con vos.</span>
            <button className="pill-btn-solid" style={{ width: "auto", padding: "6px 16px" }} onClick={() => acceptChatRequest(active)}>Aceptar</button>
          </div>
        )}

        <div className="messages">
          {messages.length === 0 && state !== "none" && <p className="no-comments" style={{ textAlign: "center", marginTop: 20 }}>Todavía no hay mensajes. Decí hola 👋</p>}
          {messages.map((m, i) => <MessageBubble key={i} msg={m} myName={myName} onReply={setReplyTo} />)}
        </div>

        {state === "direct" || state === "accepted" ? (
          <>
            {replyTo && <div className="reply-bar"><Reply size={13}/> Respondiendo a {replyTo.from === myName ? "vos mismo" : replyTo.from} <button onClick={() => setReplyTo(null)}><X size={12}/></button></div>}
            {recorder.error && <div className="reply-bar" style={{ color: "#EB5757" }}>{recorder.error}</div>}
            <div className="composer-row">
              <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageUpload} />
              <button className="tool-btn" title="Enviar imagen" onClick={() => fileInputRef.current?.click()}><Paperclip size={15}/></button>
              <button className="tool-btn" title="Compartir prompt/código" onClick={sendCodePrompt}><Terminal size={15}/></button>
              <EmojiPicker onPick={(e) => doSend({ type: "sticker", content: e })} />
              <button className={"tool-btn" + (recorder.recording ? " recording" : "")} title="Grabar audio" onClick={recorder.recording ? recorder.stop : recorder.start}><Mic size={15}/></button>
              <input placeholder={recorder.recording ? "Grabando audio… tocá el micrófono para enviar" : "Escribe un mensaje o pega un link…"} value={draft} disabled={recorder.recording} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && sendText()} />
              <button className="send-btn" onClick={sendText}><Send size={15}/></button>
            </div>
          </>
        ) : state === "pending-sent" ? (
          <div className="blocked-banner"><Lock size={13}/> Solicitud enviada. Vas a poder chatear libremente cuando {active?.name} la acepte.</div>
        ) : state === "pending-received" ? (
          <div className="blocked-banner"><Lock size={13}/> Aceptá la solicitud arriba para poder responder.</div>
        ) : active?.isBot ? (
          <div className="blocked-banner"><Lock size={13}/> {active.name} no acepta mensajes directos.</div>
        ) : (
          <div className="request-compose">
            <p className="hint-text" style={{ margin: "0 0 8px" }}>No se siguen mutuamente todavía. Enviale una solicitud de chat — si la acepta, van a poder hablar libremente.</p>
            <div className="composer-row" style={{ padding: 0, borderTop: "none" }}>
              <input placeholder={"Escribile algo a " + (active?.name || "") + "..."} value={requestDraft} onChange={e => setRequestDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && submitRequest()} />
              <button className="send-btn" onClick={submitRequest}><Send size={15}/></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationsDropdown({ notifications, onClose, onClickNotif }) {
  return (
    <div className="notif-dropdown">
      <div className="notif-head"><span>Notificaciones</span><button onClick={onClose}><X size={14}/></button></div>
      {notifications.length === 0 && <p className="no-comments">Todavía no tenés notificaciones.</p>}
      {notifications.map(n => <div key={n.id} className={"notif-row clickable" + (n.read ? "" : " unread")} onClick={() => onClickNotif(n)}>{n.text}</div>)}
    </div>
  );
}

/* ---------- APP ---------- */
export default function DevFeelApp() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("feed");
  const [acceptsMsgs, setAcceptsMsgs] = useState(true);
  const [bio, setBio] = useState("Construyendo cosas pequeñas y compartiéndolas acá.");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [links, setLinks] = useState({});
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("es");
  const [followsMap, setFollowsMap] = useState({});
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [realUsers, setRealUsers] = useState([]);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [claims, setClaims] = useState([]);
  const [affinity, setAffinity] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [viewedProfile, setViewedProfile] = useState(null);
  const [activeChatHandle, setActiveChatHandle] = useState("@marcosile");
  const [messagesMap, setMessagesMap] = useState({});
  const [chatStatuses, setChatStatuses] = useState({});
  const seededPostsRef = useRef(false);

  const t = makeT(lang);
  const isAdmin = !!user && ADMIN_HANDLES.includes(user.handle);
  const myStoredEntry = realUsers.find(u => u.handle === user?.handle);
  const isDeveloper = isAdmin || !!myStoredEntry?.isDev;
  const hasPendingVerification = !!user && verificationRequests.some(r => r.handle === user.handle);

  const following = useMemo(() => new Set(followsMap[user?.handle] || []), [followsMap, user]);
  const allDevs = useMemo(() => { const others = realUsers.filter(u => u.handle !== user?.handle); return [...STATIC_DEVS, ...others]; }, [realUsers, user]);
  const myPostsCount = posts.filter(p => p.handle === user?.handle).length;
  const unreadCount = notifications.filter(n => !n.read).length;

  const resolveDev = (handle) => {
    if (user && handle === user.handle) return { name: user.name, avatarUrl, isDev: isDeveloper };
    const dev = allDevs.find(d => d.handle === handle);
    return dev ? { name: dev.name, avatarUrl: dev.avatarUrl, isDev: dev.isDev } : null;
  };

  const isMutual = (dev) => {
    if (!dev || !user) return false;
    const iFollow = (followsMap[user.handle] || []).includes(dev.handle);
    const theyFollow = (followsMap[dev.handle] || []).includes(user.handle);
    return iFollow && theyFollow;
  };
  const chatStateFor = (dev) => {
    if (!dev || !user) return "none";
    if (dev.isBot) return dev.acceptsMsgs ? "direct" : "none";
    if (isMutual(dev)) return "direct";
    const status = chatStatuses[convKey(user.handle, dev.handle)];
    if (!status) return "none";
    if (status.status === "accepted") return "accepted";
    if (status.status === "pending") return status.initiator === user.handle ? "pending-sent" : "pending-received";
    return "none";
  };
  const canChatWith = (dev) => { const s = chatStateFor(dev); return s === "direct" || s === "accepted"; };

  useEffect(() => {
    let live = true;
    const pull = async () => {
      const remotePosts = await loadShared("devfeel:posts", null);
      if (live) {
        if (remotePosts) {
          setPosts(prev => JSON.stringify(prev) === JSON.stringify(remotePosts) ? prev : remotePosts);
        } else if (!seededPostsRef.current) {
          seededPostsRef.current = true;
          await saveShared("devfeel:posts", INITIAL_POSTS);
        }
      }
      const remoteUsers = await loadShared("devfeel:users", []);
      if (live) setRealUsers(prev => JSON.stringify(prev) === JSON.stringify(remoteUsers) ? prev : remoteUsers);
      const remoteFollows = await loadShared("devfeel:follows", {});
      if (live) setFollowsMap(prev => JSON.stringify(prev) === JSON.stringify(remoteFollows) ? prev : remoteFollows);
      const remoteChatStatus = await loadShared("devfeel:chatstatus", {});
      if (live) setChatStatuses(prev => JSON.stringify(prev) === JSON.stringify(remoteChatStatus) ? prev : remoteChatStatus);
      const remoteVerifReqs = await loadShared("devfeel:verification_requests", []);
      if (live) setVerificationRequests(prev => JSON.stringify(prev) === JSON.stringify(remoteVerifReqs) ? prev : remoteVerifReqs);
      const remoteClaims = await loadShared("devfeel:claims", []);
      if (live) setClaims(prev => JSON.stringify(prev) === JSON.stringify(remoteClaims) ? prev : remoteClaims);
    };
    pull();
    const interval = setInterval(pull, 4000);
    return () => { live = false; clearInterval(interval); };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let live = true;
    const pull = async () => {
      const remoteMsgs = await loadShared("devfeel:messages:" + convKey(user.handle, activeChatHandle), []);
      if (live) setMessagesMap(prev => ({ ...prev, [convKey(user.handle, activeChatHandle)]: remoteMsgs }));
      const remoteNotifs = await loadShared("devfeel:notifications:" + user.handle, []);
      if (live) setNotifications(remoteNotifs.slice().reverse());
      const remoteAffinity = await loadShared("devfeel:affinity:" + user.handle, {});
      if (live) setAffinity(remoteAffinity);
    };
    pull();
    const interval = setInterval(pull, 4000);
    return () => { live = false; clearInterval(interval); };
  }, [user, activeChatHandle]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const users = await loadShared("devfeel:users", []);
      const idx = users.findIndex(u => u.handle === user.handle);
      const existingIsDev = idx !== -1 ? users[idx].isDev : false;
      const entry = { name: user.name, handle: user.handle, bio, isDev: isAdmin ? true : existingIsDev, acceptsMsgs, avatarUrl, links, isBot: false };
      const updated = idx === -1 ? [...users, entry] : users.map((u, i) => i === idx ? entry : u);
      await saveShared("devfeel:users", updated);
      setRealUsers(updated);
    })();
  }, [user, acceptsMsgs, bio, avatarUrl, links, isAdmin]);

  const pushNotification = async (targetHandle, text, kind, meta) => {
    if (user && targetHandle === user.handle) return;
    const list = await loadShared("devfeel:notifications:" + targetHandle, []);
    const next = [...list, { id: Date.now() + Math.random(), text, kind, meta, read: false }];
    await saveShared("devfeel:notifications:" + targetHandle, next);
  };

  const registerCredentials = async (handle, password) => {
    const creds = await loadShared("devfeel:credentials", {});
    const next = { ...creds, [handle]: password };
    await saveShared("devfeel:credentials", next);
  };
  const verifyCredentials = async (handle, password) => {
    const creds = await loadShared("devfeel:credentials", {});
    if (creds[handle] !== password) return null;
    const users = await loadShared("devfeel:users", []);
    const found = users.find(u => u.handle === handle);
    if (found) return { name: found.name, handle: found.handle, via: "usuario y contraseña" };
    if (ADMIN_HANDLES.includes(handle)) return { name: "Admin", handle, via: "usuario y contraseña" };
    return null;
  };

  const submitOwnershipClaim = async (handle, name, via) => {
    const list = await loadShared("devfeel:claims", []);
    const next = [...list, { handle, name, via, ts: Date.now() }];
    await saveShared("devfeel:claims", next);
    setClaims(next);
    await pushNotification(ADMIN_HANDLES[0], name + " pidió derechos sobre " + handle, "claim", { handle });
  };
  const dismissClaim = async (index) => {
    const list = await loadShared("devfeel:claims", []);
    const next = list.filter((_, i) => i !== index);
    await saveShared("devfeel:claims", next);
    setClaims(next);
  };

  const sendVerificationRequest = async () => {
    const list = await loadShared("devfeel:verification_requests", []);
    if (list.some(r => r.handle === user.handle)) return;
    const next = [...list, { handle: user.handle, name: user.name, ts: Date.now() }];
    await saveShared("devfeel:verification_requests", next);
    setVerificationRequests(next);
    await pushNotification(ADMIN_HANDLES[0], user.name + " solicitó verificación de developer", "verifyrequest", { handle: user.handle });
  };
  const toggleUserVerified = async (handle, value) => {
    const users = await loadShared("devfeel:users", []);
    const updated = users.map(u => u.handle === handle ? { ...u, isDev: value } : u);
    await saveShared("devfeel:users", updated);
    setRealUsers(updated);
    await pushNotification(handle, value ? "¡Tu cuenta fue verificada como developer!" : "Tu verificación de developer fue retirada.", "verified", {});
  };
  const resolveVerification = async (handle, approve) => {
    await toggleUserVerified(handle, approve);
    const list = await loadShared("devfeel:verification_requests", []);
    const next = list.filter(r => r.handle !== handle);
    await saveShared("devfeel:verification_requests", next);
    setVerificationRequests(next);
  };

  const savePosts = async (next) => { setPosts(next); await saveShared("devfeel:posts", next); };
  const likePost = (id) => {
    const post = posts.find(p => p.id === id); if (!post) return;
    const likedBy = post.likedBy || []; const already = likedBy.includes(user.handle);
    savePosts(posts.map(p => p.id === id ? { ...p, likedBy: already ? likedBy.filter(h => h !== user.handle) : [...likedBy, user.handle], likes: already ? p.likes - 1 : p.likes + 1 } : p));
    if (!already) {
      if (post.handle) pushNotification(post.handle, "A " + user.name + " le gustó tu publicación", "like", {});
      if ((post.tags || []).length) {
        (async () => {
          const current = await loadShared("devfeel:affinity:" + user.handle, {});
          const next = { ...current };
          post.tags.forEach(tag => { const k = tag.toLowerCase(); next[k] = (next[k] || 0) + 2; });
          await saveShared("devfeel:affinity:" + user.handle, next);
          setAffinity(next);
        })();
      }
    }
  };
  const reportPost = (id) => savePosts(posts.map(p => p.id === id ? { ...p, reports: p.reports + 1 } : p));
  const addComment = (id, text, parentIndex) => {
    const post = posts.find(p => p.id === id); if (!post) return;
    let updatedComments;
    if (parentIndex === null || parentIndex === undefined) {
      updatedComments = [...post.comments, { from: user.name, fromHandle: user.handle, text, likes: 0, likedBy: [], replies: [] }];
    } else {
      updatedComments = post.comments.map((c, i) => i === parentIndex ? { ...c, replies: [...(c.replies || []), { from: user.name, fromHandle: user.handle, text, likes: 0, likedBy: [] }] } : c);
    }
    savePosts(posts.map(p => p.id === id ? { ...p, comments: updatedComments } : p));
    if (post.handle) {
      const msg = (parentIndex === null || parentIndex === undefined)
        ? user.name + " comentó tu publicación: \"" + text.slice(0, 40) + "\""
        : user.name + " respondió un comentario en tu publicación: \"" + text.slice(0, 40) + "\"";
      pushNotification(post.handle, msg, "comment", {});
    }
  };
  const likeComment = (id, commentIndex, replyIndex) => {
    const post = posts.find(p => p.id === id); if (!post) return;
    const updatedComments = post.comments.map((c, i) => {
      if (i !== commentIndex) return c;
      if (replyIndex === null || replyIndex === undefined) {
        const likedBy = c.likedBy || []; const already = likedBy.includes(user.handle);
        return { ...c, likedBy: already ? likedBy.filter(h => h !== user.handle) : [...likedBy, user.handle], likes: already ? (c.likes || 0) - 1 : (c.likes || 0) + 1 };
      }
      const replies = (c.replies || []).map((r, ri) => {
        if (ri !== replyIndex) return r;
        const likedBy = r.likedBy || []; const already = likedBy.includes(user.handle);
        return { ...r, likedBy: already ? likedBy.filter(h => h !== user.handle) : [...likedBy, user.handle], likes: already ? (r.likes || 0) - 1 : (r.likes || 0) + 1 };
      });
      return { ...c, replies };
    });
    savePosts(posts.map(p => p.id === id ? { ...p, comments: updatedComments } : p));
  };
  const publishPost = (partial) => savePosts([{ id: Date.now(), author: user.name, handle: user.handle, avatarUrl, isDev: isDeveloper, likes: 0, likedBy: [], reports: 0, sensitive: false, comments: [], tags: [], ...partial }, ...posts]);

  const toggleFollow = async (handle) => {
    const mine = new Set(followsMap[user.handle] || []);
    const wasFollowing = mine.has(handle);
    wasFollowing ? mine.delete(handle) : mine.add(handle);
    const next = { ...followsMap, [user.handle]: [...mine] };
    setFollowsMap(next);
    await saveShared("devfeel:follows", next);
    if (!wasFollowing) { const dev = allDevs.find(d => d.handle === handle); if (dev && !dev.isBot) pushNotification(dev.handle, user.name + " empezó a seguirte", "follow", { handle: user.handle }); }
  };

  const sendMessage = async (otherHandle, msg) => {
    const key = convKey(user.handle, otherHandle);
    const current = messagesMap[key] || [];
    const next = [...current, { ...msg, from: user.name, ts: Date.now() }];
    setMessagesMap(prev => ({ ...prev, [key]: next }));
    await saveShared("devfeel:messages:" + key, next);
    pushNotification(otherHandle, "Nuevo mensaje de " + user.name, "message", { handle: otherHandle });
  };

  const sendChatRequest = async (dev, text) => {
    const key = convKey(user.handle, dev.handle);
    const remoteStatus = await loadShared("devfeel:chatstatus", {});
    const nextStatus = { ...remoteStatus, [key]: { status: "pending", initiator: user.handle } };
    setChatStatuses(nextStatus);
    await saveShared("devfeel:chatstatus", nextStatus);
    await sendMessage(dev.handle, { type: "text", content: text });
    pushNotification(dev.handle, user.name + " quiere chatear con vos", "chatrequest", { handle: dev.handle });
  };

  const acceptChatRequest = async (dev) => {
    const key = convKey(user.handle, dev.handle);
    const remoteStatus = await loadShared("devfeel:chatstatus", {});
    const existing = remoteStatus[key] || {};
    const nextStatus = { ...remoteStatus, [key]: { ...existing, status: "accepted" } };
    setChatStatuses(nextStatus);
    await saveShared("devfeel:chatstatus", nextStatus);
    pushNotification(dev.handle, user.name + " aceptó tu solicitud de chat", "message", { handle: dev.handle });
  };
  const sendPostToChat = async (otherHandle, url, preview) => {
    await sendMessage(otherHandle, { type: "link", url, content: preview });
    setActiveChatHandle(otherHandle);
    setTab("chat");
  };

  const openProfile = (handle) => {
    if (!handle) return;
    if (handle === user.handle) { setTab("perfil"); setViewedProfile(null); return; }
    const dev = allDevs.find(d => d.handle === handle);
    if (dev) setViewedProfile(dev);
  };
  const openChatWith = (dev) => { setActiveChatHandle(dev.handle); setTab("chat"); setViewedProfile(null); };
  const handleNotifClick = async (n) => {
    const list = await loadShared("devfeel:notifications:" + user.handle, []);
    const updated = list.map(x => x.id === n.id ? { ...x, read: true } : x);
    await saveShared("devfeel:notifications:" + user.handle, updated);
    setNotifications(updated.slice().reverse());
    if (n.kind === "follow" && n.meta?.handle) openProfile(n.meta.handle);
    if (n.kind === "message" && n.meta?.handle) { setActiveChatHandle(n.meta.handle); setTab("chat"); setViewedProfile(null); }
    setShowNotifs(false);
  };

  const activeConvKey = user ? convKey(user.handle, activeChatHandle) : "";
  const contactsList = useMemo(() => allDevs, [allDevs]);
  const existingHandles = useMemo(() => [...realUsers.map(u => u.handle), ...STATIC_DEVS.map(d => d.handle)], [realUsers]);

  return (
    <div className={"app-root" + (theme === "light" ? " light" : "")}>
      <style>{`
        .app-root{ --canvas:#0E0F0C; --surface:#171813; --surface-alt:#1F2119; --border:#2A2C22; --accent:#E8B84B; --accent-ink:#3A2C0A; --ink:#F5F4EE; --ink-muted:#9A9C8E; --ink-faint:#6B6D62; --shadow:0 6px 20px rgba(0,0,0,0.35);
          background:var(--canvas); color:var(--ink); font-family:'Inter',sans-serif; max-width:680px; margin:0 auto; border-radius:16px; overflow:hidden; position:relative; }
        .app-root.light{ --canvas:#F7F7F5; --surface:#FFFFFF; --surface-alt:#F0F0EC; --border:#DEDDD6; --accent:#C6841A; --accent-ink:#FFFFFF; --ink:#141414; --ink-muted:#55534C; --ink-faint:#83817A; --shadow:0 2px 14px rgba(20,20,20,0.07); }
        .app-root, .app-root *{ transition:background-color .18s ease, border-color .18s ease, color .18s ease, box-shadow .18s ease, transform .12s ease; }
        .app-root input::placeholder, .app-root textarea::placeholder{ color:var(--ink-faint); opacity:1; }
        .header-mark{ display:flex; align-items:center; gap:7px; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:15px; color:var(--ink); flex-shrink:0; }
        .header-mark-icon{ display:flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:8px; background:var(--accent); color:var(--accent-ink); flex-shrink:0; }
        @media (max-width:420px){ .header-mark-text{ display:none; } }
        .overlay-catcher{ position:fixed; inset:0; z-index:38; background:transparent; }
        .comments-list.floating{ position:fixed !important; right:auto !important; z-index:40; }
        .comment-thread{ margin-bottom:12px; }
        .comment-actions{ display:flex; gap:12px; margin-top:2px; }
        .comment-action-btn{ background:none; border:none; color:var(--ink-faint); font-size:11px; cursor:pointer; display:flex; align-items:center; gap:4px; padding:0; }
        .comment-action-btn:hover{ color:var(--accent); }
        .comment-reply-row{ display:flex; gap:8px; margin:8px 0 0 20px; padding-left:10px; border-left:2px solid var(--border); }
        .comment-from.clickable:hover{ text-decoration:underline; color:var(--accent); }
        .search-box-wrap{ position:relative; flex:1 1 140px; margin:0 10px; min-width:0; }
        .search-dropdown{ position:absolute; top:calc(100% + 6px); left:0; right:0; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:8px; z-index:30; box-shadow:0 12px 32px rgba(0,0,0,0.25); max-height:320px; overflow-y:auto; }
        .search-group-label{ font-size:10px; text-transform:uppercase; letter-spacing:0.06em; color:var(--ink-faint); padding:6px 8px 2px; }
        .search-suggestion-row{ display:flex; align-items:center; gap:8px; padding:8px; border-radius:8px; cursor:pointer; font-size:13px; }
        .search-suggestion-row:hover{ background:var(--surface-alt); }
        .search-sugg-name{ font-weight:600; margin-right:6px; }
        .search-sugg-handle{ color:var(--ink-faint); font-size:12px; }
        .search-hash-icon{ width:22px; height:22px; border-radius:50%; background:var(--surface-alt); display:flex; align-items:center; justify-content:center; font-weight:700; color:var(--accent); flex-shrink:0; }
        .search-sugg-count{ margin-left:auto; font-size:11px; color:var(--ink-faint); }
        .search-empty{ padding:10px 8px; font-size:12px; color:var(--ink-faint); }
        .devfeed-scroll{ height:560px; overflow-y:scroll; scroll-snap-type:y mandatory; margin:-18px; }
        .devfeed-item{ position:relative; height:560px; scroll-snap-align:start; background:#000; display:flex; align-items:center; justify-content:center; overflow:hidden; }
        .devfeed-video{ width:100%; height:100%; object-fit:contain; background:#000; }
        .devfeed-overlay{ position:absolute; inset:0; display:flex; justify-content:space-between; align-items:flex-end; padding:16px; pointer-events:none; background:linear-gradient(to top, rgba(0,0,0,0.7), transparent 45%); }
        .devfeed-info{ flex:1; color:#fff; pointer-events:auto; padding-right:12px; min-width:0; }
        .devfeed-author{ color:#fff !important; font-weight:700; font-size:14px; }
        .devfeed-caption{ font-size:13px; margin:4px 0; color:#fff; }
        .devfeed-tag{ color:#fff; border-color:rgba(255,255,255,0.4); background:rgba(255,255,255,0.12); }
        .devfeed-actions{ display:flex; flex-direction:column; gap:16px; align-items:center; pointer-events:auto; flex-shrink:0; }
        .devfeed-action-btn{ background:none; border:none; color:#fff; display:flex; flex-direction:column; align-items:center; gap:2px; font-size:11px; cursor:pointer; }
        .devfeed-comments{ position:absolute; bottom:0; left:0; right:0; max-height:55%; overflow-y:auto; background:var(--surface); border-top-left-radius:16px; border-top-right-radius:16px; padding:14px; z-index:5; }
        .app-root h2,.app-root h3{ font-family:'Space Grotesk',sans-serif; letter-spacing:-0.02em; }
        .login-wrap{ display:flex; justify-content:center; padding:40px 16px; }
        .login-card{ background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:32px; width:100%; max-width:380px; text-align:center; }
        .brand-mark{ font-family:'JetBrains Mono',monospace; color:var(--accent); font-size:16px; margin-bottom:16px; }
        .brand-logo{ height:56px; width:auto; margin:0 auto 16px; display:block; }
        .login-card h2{ font-size:22px; margin-bottom:6px; } .login-card .sub{ font-size:13px; color:var(--ink-muted); margin-bottom:24px; }
        .oauth-btn{ width:100%; display:flex; align-items:center; justify-content:center; gap:10px; padding:11px; border-radius:9999px; font-size:14px; font-weight:600; border:1px solid var(--border); background:var(--surface-alt); color:var(--ink); cursor:pointer; margin-bottom:10px; }
        .divider{ display:flex; align-items:center; gap:10px; margin:18px 0; color:var(--ink-faint); font-size:12px; } .divider::before,.divider::after{ content:''; flex:1; height:1px; background:var(--border); }
        .email-row{ display:flex; align-items:center; gap:8px; background:var(--surface-alt); border:1px solid var(--border); border-radius:9999px; padding:10px 16px; margin-bottom:8px; } .email-row input{ background:none; border:none; outline:none; color:var(--ink); font-size:14px; flex:1; }
        .error-text{ color:#EB5757; font-size:12px; text-align:left; margin-bottom:10px; }
        .pill-btn-solid{ width:100%; background:var(--accent); color:var(--accent-ink); font-weight:600; border:none; border-radius:9999px; padding:11px; font-size:14px; cursor:pointer; }
        .pill-btn-outline{ background:transparent; border:1px solid var(--border); color:var(--ink); border-radius:9999px; padding:8px 16px; font-size:12px; cursor:pointer; display:flex; align-items:center; }
        .sent-box{ display:flex; flex-direction:column; align-items:center; gap:10px; color:var(--ink-muted); font-size:13px; background:var(--surface-alt); border-radius:12px; padding:16px; }
        .fine-print{ font-size:11px; color:var(--ink-faint); margin-top:20px; }
        .top-bar{ display:flex; justify-content:space-between; align-items:center; gap:10px; padding:14px 18px; border-bottom:1px solid var(--border); flex-wrap:wrap; }
        .top-bar .right{ display:flex; align-items:center; gap:8px; position:relative; }
        .search-box{ display:flex; align-items:center; gap:8px; background:var(--surface-alt); border:1px solid var(--border); border-radius:9999px; padding:7px 14px; min-width:0; }
        .search-box input{ background:none; border:none; outline:none; color:var(--ink); font-size:13px; flex:1; min-width:0; }
        .icon-only-btn{ background:var(--surface-alt); border:1px solid var(--border); color:var(--ink-muted); border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; position:relative; }
        .badge-dot{ position:absolute; top:-2px; right:-2px; background:#EB5757; color:white; font-size:9px; width:15px; height:15px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; }
        .notif-dropdown{ position:absolute; top:40px; right:0; width:270px; max-height:320px; overflow-y:auto; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:12px; z-index:30; box-shadow:0 12px 32px rgba(0,0,0,0.5); }
        .notif-head{ display:flex; justify-content:space-between; align-items:center; font-size:13px; font-weight:600; margin-bottom:8px; }
        .notif-head button{ background:none; border:none; color:var(--ink-muted); cursor:pointer; }
        .notif-row{ font-size:12px; color:var(--ink-muted); padding:8px 6px; border-bottom:1px solid var(--border); }
        .notif-row.unread{ color:var(--ink); position:relative; padding-left:14px; }
        .notif-row.unread::before{ content:''; position:absolute; left:0; top:13px; width:6px; height:6px; border-radius:50%; background:var(--accent); }
        .conn-pill{ display:flex; align-items:center; gap:6px; font-size:11px; color:var(--ink-faint); padding:6px; border:1px solid var(--border); border-radius:9999px; }
        .tab-bar{ display:flex; justify-content:center; gap:6px; padding:0; border-bottom:1px solid var(--border); }
        .tab-btn{ display:flex; align-items:center; gap:6px; background:none; border:none; border-bottom:2px solid transparent; color:var(--ink-muted); border-radius:0; padding:14px 16px; font-size:13px; font-weight:600; cursor:pointer; }
        .tab-btn.active{ background:none; color:var(--ink); border-bottom-color:var(--accent); }
        .tab-label{ line-height:1; }
        .subtab-row{ display:flex; gap:0; margin-bottom:14px; border-bottom:1px solid var(--border); }
        .subtab{ flex:1; background:none; border:none; border-bottom:3px solid transparent; color:var(--ink-muted); border-radius:0; padding:13px 10px; font-size:14px; font-weight:700; cursor:pointer; }
        .subtab.active{ background:none; color:var(--ink); border-bottom-color:var(--accent); border-color:var(--accent); }
        .chip-row{ display:flex; gap:6px; flex-wrap:wrap; margin-bottom:16px; }
        .chip{ background:var(--surface-alt); border:1px solid var(--border); color:var(--ink-muted); border-radius:9999px; padding:6px 13px; font-size:12px; cursor:pointer; }
        .chip.active{ background:var(--accent); color:var(--accent-ink); border-color:var(--accent); font-weight:600; }
        .screen{ padding:18px; max-height:640px; overflow-y:auto; }
        .new-post-fab{ display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border); color:var(--ink-muted); border-radius:9999px; padding:12px 20px; font-size:14px; font-weight:600; cursor:pointer; margin-bottom:22px; width:100%; justify-content:center; }
        .new-post-fab:hover{ border-color:var(--accent); color:var(--accent); }
        .composer{ background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:18px; margin-bottom:22px; }
        .composer-head{ display:flex; justify-content:space-between; align-items:center; font-size:13px; font-weight:600; margin-bottom:12px; }
        .composer textarea{ width:100%; background:var(--surface-alt); border:1px solid var(--border); border-radius:10px; color:var(--ink); padding:12px; font-family:inherit; font-size:14px; resize:vertical; min-height:60px; margin-bottom:14px; }
        .hint-text{ font-size:12px; color:var(--ink-faint); margin:-6px 0 14px; }
        .hint-inline{ font-size:12px; color:var(--ink-faint); }
        .upload-row{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:14px; }
        .url-input{ background:var(--surface-alt); border:1px solid var(--border); border-radius:9999px; padding:8px 14px; color:var(--ink); font-size:13px; outline:none; flex:1; min-width:140px; }
        .upload-preview{ max-width:100%; max-height:140px; border-radius:10px; margin-top:8px; display:block; }
        .type-row{ display:flex; gap:8px; margin-bottom:14px; flex-wrap:wrap; }
        .type-btn{ display:flex; align-items:center; gap:6px; background:var(--surface-alt); border:1px solid var(--border); color:var(--ink-muted); border-radius:9999px; padding:8px 14px; font-size:13px; cursor:pointer; }
        .type-btn.active{ background:var(--accent); color:var(--accent-ink); border-color:var(--accent); font-weight:600; }
        .row{ display:flex; align-items:center; gap:14px; margin-bottom:14px; flex-wrap:wrap; } .row label{ font-size:12px; color:var(--ink-muted); display:flex; align-items:center; gap:6px; }
        .swatch-row{ display:flex; gap:6px; } .swatch-row.wrap{ flex-wrap:wrap; } .swatch{ width:22px; height:22px; border-radius:50%; cursor:pointer; border:2px solid transparent; } .swatch.selected{ border-color:var(--ink); }
        .grad-swatch{ width:44px; height:22px; border-radius:9999px; cursor:pointer; border:2px solid transparent; } .grad-swatch.selected{ border-color:var(--ink); }
        .dev-lock{ display:flex; align-items:center; gap:6px; font-size:12px; color:var(--ink-faint); background:var(--surface-alt); padding:6px 12px; border-radius:9999px; }
        .preview-box{ background:var(--surface-alt); border:1px dashed var(--border); border-radius:10px; padding:14px; margin-bottom:14px; }
        .preview-label{ font-size:11px; text-transform:uppercase; letter-spacing:0.06em; color:var(--ink-faint); margin-bottom:6px; }
        .publish-btn{ background:var(--accent); color:var(--accent-ink); font-weight:600; border:none; border-radius:9999px; padding:10px 22px; font-size:14px; cursor:pointer; float:right; }
        .card{ background:var(--surface); border:1px solid var(--border); border-radius:16px; margin-bottom:18px; }
        .card-head{ display:flex; align-items:center; gap:10px; padding:14px 16px 10px; }
        .avatar{ width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; flex-shrink:0; background:linear-gradient(135deg, var(--surface-alt), var(--border)); }
        .clickable{ cursor:pointer; }
        .avatar.big{ width:56px; height:56px; font-size:16px; } .avatar.tiny{ width:24px; height:24px; font-size:9px; }
        .author-row{ display:flex; align-items:center; gap:6px; } .author-name{ font-size:14px; font-weight:600; }
        .author-name.clickable:hover{ text-decoration:underline; color:var(--accent); }
        .dev-badge{ font-size:9px; font-family:'JetBrains Mono',monospace; background:var(--accent); color:var(--accent-ink); padding:2px 6px; border-radius:4px; font-weight:700; }
        .handle{ font-size:12px; color:var(--ink-faint); }
        .follow-btn{ display:flex; align-items:center; gap:6px; background:transparent; border:1px solid var(--border); color:var(--ink); border-radius:9999px; padding:6px 12px; font-size:12px; cursor:pointer; flex-shrink:0; }
        .follow-btn.following{ color:var(--ink-muted); }
        .card-body{ padding:0 16px 14px; }
        .terminal{ margin-top:10px; border:1px solid var(--border); border-radius:10px; overflow:hidden; }
        .terminal-bar{ display:flex; align-items:center; gap:5px; padding:8px 12px; border-bottom:1px solid var(--border); } .terminal-bar span:not(.fname):not(.copy-btn){ width:8px; height:8px; border-radius:50%; background:var(--surface-alt); }
        .fname{ margin-left:6px; font-size:11px; color:var(--ink-faint); font-family:'JetBrains Mono',monospace; flex:1; } .terminal-body{ padding:14px; overflow-x:auto; }
        .copy-btn{ display:flex; align-items:center; gap:4px; background:var(--surface-alt); border:1px solid var(--border); color:var(--ink-muted); font-size:10px; padding:3px 8px; border-radius:6px; cursor:pointer; }
        .demo-frame{ margin-top:10px; background:var(--canvas); border:1px solid var(--border); border-radius:10px; overflow:hidden; }
        .demo-iframe{ width:100%; height:160px; border:none; display:block; }
        .post-media{ width:100%; border-radius:10px; margin-top:10px; max-height:320px; object-fit:cover; display:block; }
        .link-card{ display:flex; align-items:center; gap:8px; background:var(--surface-alt); border:1px solid var(--border); border-radius:10px; padding:10px 14px; margin-top:10px; font-size:13px; color:var(--accent); word-break:break-all; }
        .tags-row{ display:flex; gap:6px; flex-wrap:wrap; margin-top:12px; } .tag{ font-size:11px; font-family:'JetBrains Mono',monospace; background:var(--surface-alt); color:var(--ink-muted); padding:3px 10px; border-radius:9999px; border:1px solid var(--border); }
        .card-footer{ display:flex; align-items:center; gap:18px; padding:10px 16px; border-top:1px solid var(--border); flex-wrap:wrap; }
        .icon-btn{ display:flex; align-items:center; gap:5px; background:none; border:none; color:var(--ink-muted); font-size:13px; cursor:pointer; } .icon-btn.report{ margin-left:auto; color:var(--ink-faint); }
        .comments-block{ position:relative; }
        .comments-panel{ border-top:1px solid var(--border); padding:14px 16px; }
        .comments-list{ position:absolute; top:28px; right:0; width:220px; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:10px; z-index:15; box-shadow:0 12px 32px rgba(0,0,0,0.5); }
        .contact-pick-row{ display:flex; align-items:center; gap:8px; padding:8px 4px; cursor:pointer; font-size:13px; }
        .contact-pick-row:hover{ background:var(--surface-alt); border-radius:8px; }
        .no-comments{ font-size:12px; color:var(--ink-faint); }
        .comment-row{ display:flex; gap:8px; margin-bottom:10px; }
        .comment-from{ font-size:12px; font-weight:600; } .comment-text{ font-size:12px; color:var(--ink-muted); margin:0; }
        .comment-input-row{ display:flex; gap:6px; margin-top:6px; align-items:center; }
        .comment-input-row input{ flex:1; background:var(--surface-alt); border:1px solid var(--border); border-radius:9999px; padding:7px 12px; color:var(--ink); font-size:12px; outline:none; }
        .send-btn{ background:var(--accent); color:var(--accent-ink); border:none; border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; }
        .send-btn.small{ width:26px; height:26px; }
        .blur-gate{ display:flex; flex-direction:column; align-items:center; gap:8px; padding:36px 16px; background:var(--surface-alt); color:var(--ink-muted); font-size:13px; }
        .profile-card, .settings-card{ background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:20px; margin-bottom:16px; }
        .profile-head{ display:flex; align-items:center; gap:14px; margin-bottom:14px; }
        .bio-text{ font-size:14px; color:var(--ink-muted); margin-bottom:12px; }
        .links-row{ display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px; }
        .social-link{ display:flex; align-items:center; gap:5px; font-size:12px; background:var(--surface-alt); border:1px solid var(--border); padding:5px 12px; border-radius:9999px; color:var(--accent); }
        .bio-edit{ width:100%; background:var(--surface-alt); border:1px solid var(--border); border-radius:10px; color:var(--ink); padding:10px; font-family:inherit; font-size:13px; resize:vertical; }
        .stats-row{ display:flex; gap:24px; border-top:1px solid var(--border); padding-top:14px; } .stats-row div{ display:flex; flex-direction:column; font-size:13px; } .stats-row strong{ font-size:16px; } .stats-row span{ color:var(--ink-faint); font-size:11px; }
        .dev-row{ display:flex; align-items:center; gap:12px; padding:14px 0; border-bottom:1px solid var(--border); } .dev-bio{ font-size:12px; color:var(--ink-muted); margin:2px 0; }
        .back-btn{ display:flex; align-items:center; gap:6px; background:none; border:none; color:var(--ink-muted); font-size:13px; cursor:pointer; margin-bottom:16px; }
        .setting-row{ display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid var(--border); gap:16px; }
        .setting-row strong{ font-size:13px; } .setting-row p{ font-size:12px; color:var(--ink-faint); margin:2px 0 0; }
        .toggle{ width:40px; height:22px; border-radius:9999px; background:var(--surface-alt); border:1px solid var(--border); position:relative; cursor:pointer; flex-shrink:0; }
        .toggle span{ position:absolute; top:2px; left:2px; width:16px; height:16px; border-radius:50%; background:var(--ink-muted); transition:left .15s; }
        .toggle.on{ background:var(--accent); border-color:var(--accent); } .toggle.on span{ left:20px; background:var(--accent-ink); }
        .emoji-pop{ position:absolute; bottom:38px; right:0; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:8px; display:grid; grid-template-columns:repeat(4,1fr); gap:4px; z-index:25; box-shadow:0 12px 32px rgba(0,0,0,0.5); }
        .emoji-pop button{ background:none; border:none; font-size:20px; cursor:pointer; padding:4px; border-radius:6px; }
        .emoji-pop button:hover{ background:var(--surface-alt); }
        .chat-shell{ display:grid; grid-template-columns:180px 1fr; height:480px; margin:-18px; }
        .contacts-col{ border-right:1px solid var(--border); overflow-y:auto; } .contacts-col h4{ font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:var(--ink-faint); padding:14px 14px 8px; }
        .contact-item{ display:flex; align-items:center; gap:8px; padding:10px 14px; cursor:pointer; } .contact-item.active{ background:var(--surface); } .contact-item:hover{ background:var(--surface-alt); }
        .contact-name{ font-size:13px; font-weight:600; } .contact-sub{ font-size:11px; color:var(--ink-faint); }
        .chat-col{ display:flex; flex-direction:column; min-width:0; } .chat-head{ display:flex; align-items:center; gap:10px; padding:12px 16px; border-bottom:1px solid var(--border); }
        .chat-head .name{ font-size:14px; font-weight:600; } .chat-head .status{ font-size:11px; color:var(--ink-faint); }
        .mobile-back{ display:none; }
        .attachments-panel{ border-bottom:1px solid var(--border); padding:12px 16px; max-height:160px; overflow-y:auto; }
        .attach-thumb{ width:56px; height:56px; border-radius:8px; object-fit:cover; margin:0 6px 6px 0; display:inline-block; }
        .messages{ flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:10px; }
        .msg-row{ display:flex; } .msg-row.mine{ justify-content:flex-end; }
        .bubble{ background:var(--surface); border:1px solid var(--border); border-radius:14px 14px 14px 4px; padding:9px 13px; max-width:75%; font-size:14px; cursor:pointer; }
        .bubble.mine{ background:var(--accent); color:var(--accent-ink); border-radius:14px 14px 4px 14px; border:none; font-weight:500; }
        .reply-quote{ font-size:11px; opacity:0.75; border-left:2px solid currentColor; padding-left:6px; margin-bottom:4px; }
        .reply-bar{ display:flex; align-items:center; gap:6px; font-size:12px; color:var(--ink-muted); padding:6px 16px; border-top:1px solid var(--border); }
        .reply-bar button{ margin-left:auto; background:none; border:none; color:var(--ink-faint); cursor:pointer; }
        .chat-img{ max-width:200px; border-radius:10px; display:block; }
        .chat-terminal{ border:1px solid var(--border); border-radius:8px; overflow:hidden; min-width:200px; }
        .chat-terminal-bar{ display:flex; gap:4px; padding:6px 8px; border-bottom:1px solid var(--border); } .chat-terminal-bar span{ width:7px; height:7px; border-radius:50%; background:var(--surface-alt); }
        .chat-terminal pre{ padding:10px; font-family:'JetBrains Mono',monospace; font-size:12px; white-space:pre-wrap; margin:0; color:var(--ink); }
        .chat-link{ display:flex; align-items:center; gap:6px; text-decoration:underline; }
        .composer-row{ display:flex; align-items:center; gap:8px; padding:12px; border-top:1px solid var(--border); }
        .composer-row input{ flex:1; background:var(--surface-alt); border:1px solid var(--border); border-radius:9999px; padding:9px 16px; color:var(--ink); font-size:14px; outline:none; min-width:0; }
        .tool-btn{ background:var(--surface-alt); border:1px solid var(--border); color:var(--ink-muted); border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; }
        .tool-btn.recording{ background:#EB5757; color:white; border-color:#EB5757; }
        .blocked-banner{ display:flex; align-items:center; gap:8px; justify-content:center; padding:14px; color:var(--ink-faint); font-size:13px; border-top:1px solid var(--border); text-align:center; }
        .request-banner{ display:flex; align-items:center; justify-content:space-between; gap:10px; background:var(--surface-alt); padding:12px 16px; border-bottom:1px solid var(--border); font-size:13px; }
        .request-compose{ padding:14px 16px; border-top:1px solid var(--border); }
        .audio-player{ height:36px; max-width:220px; }
        .audio-player::-webkit-media-controls-panel{ background:transparent; }
        .terminal, .chat-terminal{ --canvas:#14150F; --surface:#1B1C15; --surface-alt:#232419; --border:#33352A; --ink:#F5F4EE; --ink-muted:#B7B39E; --ink-faint:#8B8875; background:#14150F; }

        @media (max-width: 600px) {
          .app-root{ border-radius:0; max-width:100%; padding-bottom:62px; }
          .screen{ padding:12px; }
          .top-bar{ padding:10px 12px; }
          .search-box-wrap{ order:3; flex-basis:100%; margin:8px 0 0; }
          .tab-bar{ position:fixed; left:0; right:0; bottom:0; z-index:25; background:var(--surface); border-top:1px solid var(--border); border-bottom:none; justify-content:space-around; gap:0; padding:9px 4px calc(9px + env(safe-area-inset-bottom)); }
          .tab-btn{ flex-direction:column; gap:3px; padding:5px 8px; border-bottom:none; font-size:0; }
          .tab-btn.active{ border-bottom:none; }
          .tab-btn.active::after{ content:''; display:block; width:4px; height:4px; border-radius:50%; background:var(--accent); margin-top:1px; }
          .tab-label{ display:none; }
          .devfeed-scroll{ height:480px; }
          .devfeed-item{ height:480px; }
          .chat-shell{ grid-template-columns:1fr; height:520px; margin:-12px; }
          .contacts-col{ display:block; border-right:none; border-bottom:1px solid var(--border); }
          .chat-col{ display:none; }
          .chat-shell.show-chat .contacts-col{ display:none; }
          .chat-shell.show-chat .chat-col{ display:flex; }
          .mobile-back{ display:flex; }
          .card-head{ padding:12px; }
          .composer{ padding:14px; }
          .demo-iframe{ height:130px; }
        }
      `}</style>

      {!user ? <LoginScreen onLogin={setUser} existingHandles={existingHandles} onClaimRequest={submitOwnershipClaim} onRegisterCredentials={registerCredentials} onLoginWithPassword={verifyCredentials} t={t} /> : (
        <>
          <div className="top-bar">
            <HeaderMark />
            <SearchBar query={searchQuery} setQuery={setSearchQuery} allDevs={allDevs} posts={posts}
              onSelectUser={(h) => { openProfile(h); setSearchQuery(""); }}
              onSelectHashtag={(tag) => { setSearchQuery("#" + tag); setTab("feed"); setViewedProfile(null); }}
              placeholder={t("buscarPlaceholder")} t={t} />
            <div className="right">
              <span className="conn-pill" title={STORAGE_AVAILABLE ? "Sincronizado con otros dispositivos" : "Modo local, sin sincronizar"}>{STORAGE_AVAILABLE ? <Wifi size={12}/> : <WifiOff size={12}/>}</span>
              <button className="icon-only-btn" onClick={() => setShowNotifs(s => !s)}><Bell size={16}/>{unreadCount > 0 && <span className="badge-dot">{unreadCount}</span>}</button>
              {showNotifs && <NotificationsDropdown notifications={notifications} onClose={() => setShowNotifs(false)} onClickNotif={handleNotifClick} />}
              <button className="icon-only-btn" onClick={() => setUser(null)}><LogOut size={16}/></button>
            </div>
          </div>
          <div className="tab-bar">
            <button className={"tab-btn" + (tab === "feed" && !viewedProfile ? " active" : "")} onClick={() => { setTab("feed"); setViewedProfile(null); }}><Home size={18}/><span className="tab-label">{t("feed")}</span></button>
            <button className={"tab-btn" + (tab === "devfeed" && !viewedProfile ? " active" : "")} onClick={() => { setTab("devfeed"); setViewedProfile(null); }}><Video size={18}/><span className="tab-label">DevFeed</span></button>
            <button className={"tab-btn" + (tab === "perfil" && !viewedProfile ? " active" : "")} onClick={() => { setTab("perfil"); setViewedProfile(null); }}><UserIcon size={18}/><span className="tab-label">{t("perfil")}</span></button>
            <button className={"tab-btn" + (tab === "chat" && !viewedProfile ? " active" : "")} onClick={() => { setTab("chat"); setViewedProfile(null); }}><MessageCircle size={18}/><span className="tab-label">{t("chat")}</span></button>
            <button className={"tab-btn" + (tab === "ajustes" && !viewedProfile ? " active" : "")} onClick={() => { setTab("ajustes"); setViewedProfile(null); }}><SlidersHorizontal size={18}/><span className="tab-label">{t("ajustes")}</span></button>
            {isAdmin && <button className={"tab-btn" + (tab === "moderacion" && !viewedProfile ? " active" : "")} onClick={() => { setTab("moderacion"); setViewedProfile(null); }}><ShieldCheck size={18}/><span className="tab-label">{t("moderacion")}</span></button>}
          </div>
          <div className="screen">
            {viewedProfile ? (
              <OtherProfileScreen dev={viewedProfile} following={following} toggleFollow={toggleFollow} posts={posts} onBack={() => setViewedProfile(null)} onMessage={openChatWith} followsMap={followsMap} canChatWith={canChatWith} t={t} lang={lang} />
            ) : (
              <>
                {tab === "feed" && <FeedScreen posts={posts} likePost={likePost} reportPost={reportPost} addComment={addComment} likeComment={likeComment} publishPost={publishPost} following={following} toggleFollow={toggleFollow} isDeveloper={isDeveloper} searchQuery={searchQuery} onViewProfile={openProfile} myHandle={user.handle} contacts={contactsList} onSendToChat={sendPostToChat} resolveAuthor={resolveDev} affinity={affinity} lang={lang} t={t} />}
                {tab === "devfeed" && <DevFeedScreen posts={posts} likePost={likePost} reportPost={reportPost} addComment={addComment} likeComment={likeComment} onViewProfile={openProfile} myHandle={user.handle} resolveAuthor={resolveDev} affinity={affinity} contacts={contactsList} onSendToChat={sendPostToChat} t={t} lang={lang} />}
                {tab === "perfil" && <ProfileScreen user={user} following={following} toggleFollow={toggleFollow} myPostsCount={myPostsCount} bio={bio} searchQuery={searchQuery} isDeveloper={isDeveloper} onViewProfile={openProfile} allDevs={allDevs} followsMap={followsMap} avatarUrl={avatarUrl} t={t} />}
                {tab === "chat" && <ChatScreen contacts={contactsList} activeHandle={activeChatHandle} setActiveHandle={setActiveChatHandle} messages={messagesMap[activeConvKey] || []} sendMessage={sendMessage} myName={user.name} onViewProfile={openProfile} canChatWith={canChatWith} chatStateFor={chatStateFor} sendChatRequest={sendChatRequest} acceptChatRequest={acceptChatRequest} />}
                {tab === "ajustes" && <SettingsScreen isDeveloper={isDeveloper} hasPendingVerification={hasPendingVerification} onRequestVerification={sendVerificationRequest} acceptsMsgs={acceptsMsgs} setAcceptsMsgs={setAcceptsMsgs} theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} nickname={user.name} handle={user.handle} onSaveNickname={(n) => setUser(prev => ({ ...prev, name: (n || "").trim() || prev.name }))} bio={bio} setBio={setBio} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} links={links} setLinks={setLinks} t={t} />}
                {tab === "moderacion" && isAdmin && <ModerationScreen users={realUsers} requests={verificationRequests} claims={claims} onToggleVerified={toggleUserVerified} onResolveRequest={resolveVerification} onDismissClaim={dismissClaim} />}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}