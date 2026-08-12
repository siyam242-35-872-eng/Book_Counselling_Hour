import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search, Bell, MessageSquare, User, LayoutDashboard, Users, Calendar,
  Settings, LogOut, ChevronRight, ChevronLeft, Check, X, Clock, MapPin,
  Filter, Plus, Send, Paperclip, Smile, CheckCheck, ChevronDown, Menu,
  Home, GraduationCap, BookOpen, AlertCircle, CheckCircle2, XCircle,
  Info, Mail, Phone, Building2, Briefcase, Trash2, Edit3, ArrowLeft,
  Inbox, CalendarCheck, CalendarClock, MessagesSquare, Circle
} from "lucide-react";

/* ============================== FONT ============================== */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
    @keyframes slideIn { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
    @keyframes popIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    @keyframes checkPop { 0% { transform: scale(0); } 70% { transform: scale(1.15); } 100% { transform: scale(1); } }
    .anim-slideIn { animation: slideIn 0.25s ease-out; }
    .anim-fadeUp { animation: fadeUp 0.3s ease-out; }
    .anim-popIn { animation: popIn 0.18s ease-out; }
    .anim-checkPop { animation: checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1); }
    .shimmer { background: linear-gradient(90deg, #f1f5f9 0px, #e2e8f0 40px, #f1f5f9 80px); background-size: 600px; animation: shimmer 1.4s infinite linear; }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
  `}</style>
);

/* ============================== MOCK DATA ============================== */
const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Software Engineering",
  "Electrical & Electronic Engineering",
  "Business Administration",
  "English",
];

const COURSES = {
  "Computer Science & Engineering": ["Data Structures", "Algorithms", "Database Systems", "Operating Systems"],
  "Software Engineering": ["Software Architecture", "Web Engineering", "Requirement Engineering"],
  "Electrical & Electronic Engineering": ["Circuit Theory", "Digital Electronics", "Signals & Systems"],
  "Business Administration": ["Principles of Management", "Marketing Fundamentals", "Financial Accounting"],
  "English": ["Academic Writing", "English Composition"],
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function initials(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function avatarColor(seed) {
  const palette = ["bg-indigo-600", "bg-violet-600", "bg-blue-600", "bg-slate-700", "bg-emerald-600", "bg-rose-500"];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h += seed.charCodeAt(i);
  return palette[h % palette.length];
}

const Avatar = ({ name, size = "md", online }) => {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-11 h-11 text-sm", lg: "w-16 h-16 text-lg", xl: "w-24 h-24 text-2xl" };
  return (
    <div className="relative inline-block shrink-0">
      <div className={`${sizes[size]} ${avatarColor(name)} rounded-full flex items-center justify-center text-white font-semibold`}>
        {initials(name)}
      </div>
      {online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />}
    </div>
  );
};

const TEACHERS = [
  {
    id: "t1", name: "Dr. Ahmed Rahman", designation: "Associate Professor",
    department: "Computer Science & Engineering", subjects: ["Data Structures", "Algorithms"],
    employeeId: "FAC-2041", email: "ahmed.rahman@unicounsel.edu", officeRoom: "Room 402, CSE Building",
    officeHours: "Sun–Thu, 10:00 AM – 4:00 PM", phone: "+880 1711-223344",
    bio: "Dr. Ahmed Rahman specializes in algorithm design and data structures, with over 12 years of teaching and research experience. He enjoys helping students think through problems from first principles.",
    online: true,
  },
  {
    id: "t2", name: "Dr. Nusrat Fatima", designation: "Assistant Professor",
    department: "Electrical & Electronic Engineering", subjects: ["Circuit Theory", "Digital Electronics"],
    employeeId: "FAC-2118", email: "nusrat.fatima@unicounsel.edu", officeRoom: "Room 214, EEE Building",
    officeHours: "Sun–Wed, 9:00 AM – 3:00 PM", phone: "+880 1811-556677",
    bio: "Dr. Nusrat Fatima focuses on digital systems and enjoys mentoring students on capstone projects and career planning in electronics.",
    online: false,
  },
  {
    id: "t3", name: "Prof. Kamal Hossain", designation: "Professor",
    department: "Business Administration", subjects: ["Principles of Management", "Marketing Fundamentals"],
    employeeId: "FAC-1032", email: "kamal.hossain@unicounsel.edu", officeRoom: "Room 501, Business Building",
    officeHours: "Sat–Wed, 11:00 AM – 5:00 PM", phone: "+880 1911-778899",
    bio: "Prof. Kamal Hossain has led the management department for a decade and advises students on internships and career direction.",
    online: true,
  },
  {
    id: "t4", name: "Ms. Farzana Akter", designation: "Lecturer",
    department: "English", subjects: ["Academic Writing", "English Composition"],
    employeeId: "FAC-2260", email: "farzana.akter@unicounsel.edu", officeRoom: "Room 118, Arts Building",
    officeHours: "Sun–Thu, 1:00 PM – 4:00 PM", phone: "+880 1611-334455",
    bio: "Ms. Farzana Akter helps students strengthen academic writing skills and offers guidance on thesis and report structuring.",
    online: true,
  },
  {
    id: "t5", name: "Dr. Mahbub Alam", designation: "Associate Professor",
    department: "Software Engineering", subjects: ["Software Architecture", "Web Engineering"],
    employeeId: "FAC-2077", email: "mahbub.alam@unicounsel.edu", officeRoom: "Room 315, SWE Building",
    officeHours: "Sun–Thu, 10:00 AM – 2:00 PM", phone: "+880 1511-990011",
    bio: "Dr. Mahbub Alam works on scalable software systems and is the faculty advisor for the university's software engineering club.",
    online: false,
  },
  {
    id: "t6", name: "Dr. Shirin Sultana", designation: "Assistant Professor",
    department: "Computer Science & Engineering", subjects: ["Database Systems", "Operating Systems"],
    employeeId: "FAC-2199", email: "shirin.sultana@unicounsel.edu", officeRoom: "Room 408, CSE Building",
    officeHours: "Sat–Wed, 9:00 AM – 1:00 PM", phone: "+880 1711-889900",
    bio: "Dr. Shirin Sultana researches database optimization and enjoys guiding students through independent study projects.",
    online: true,
  },
];

const STUDENT_ME = {
  id: "s1", name: "Fahmid Hasan", studentId: "201-15-3421", department: "Computer Science & Engineering",
  batch: "51st", semester: "12th Semester", email: "fahmid.hasan@student.unicounsel.edu", phone: "+880 1611-223300",
};

const OTHER_STUDENTS = [
  { id: "s2", name: "Nusrat Jahan", studentId: "201-15-3488", department: "Computer Science & Engineering", batch: "51st", semester: "12th Semester" },
  { id: "s3", name: "Rakibul Islam", studentId: "201-15-3502", department: "Computer Science & Engineering", batch: "51st", semester: "11th Semester" },
];

// Generate a realistic weekly routine per teacher: 2 classes + 2 counselling hours
function generateRoutine(teacher, idx) {
  const classDays = [DAYS[idx % 6], DAYS[(idx + 2) % 6]];
  const counsellingDays = [DAYS[(idx + 1) % 6], DAYS[(idx + 3) % 6]];
  const slots = [];
  classDays.forEach((day, i) => {
    slots.push({
      id: `${teacher.id}-${day}-class${i}`, day, start: i === 0 ? "09:00" : "13:00", end: i === 0 ? "10:30" : "14:30",
      type: "class", course: teacher.subjects[i % teacher.subjects.length], room: teacher.officeRoom.split(",")[0],
    });
  });
  counsellingDays.forEach((day, i) => {
    slots.push({
      id: `${teacher.id}-${day}-hour${i}`, day, start: i === 0 ? "11:00" : "14:00", end: i === 0 ? "12:00" : "15:00",
      type: "counselling", room: teacher.officeRoom.split(",")[0], maxStudents: 1, note: i === 0 ? "Drop-in welcome" : "Please book in advance",
    });
  });
  slots.sort((a, b) => (a.day === b.day ? a.start.localeCompare(b.start) : DAYS.indexOf(a.day) - DAYS.indexOf(b.day)));
  return slots;
}

/* ============================== DATE HELPERS ============================== */
function nextDateForWeekday(weekday, fromDate = new Date()) {
  const target = DAYS.indexOf(weekday);
  const d = new Date(fromDate);
  const cur = (d.getDay() + 6) % 7; // Mon=0
  let diff = (target - cur + 7) % 7;
  d.setDate(d.getDate() + diff);
  return d;
}
function fmtDate(d) {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}
function fmtDateShort(d) {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
function to12h(t) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${period}`;
}
function durationLabel(start, end) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = (eh * 60 + em) - (sh * 60 + sm);
  return mins >= 60 ? `${Math.floor(mins / 60)} hr${mins > 60 ? " " + (mins % 60) + " min" : ""}` : `${mins} min`;
}
function isoDate(d) { return d.toISOString().slice(0, 10); }

/* ============================== SMALL UI PRIMITIVES ============================== */
const Badge = ({ status }) => {
  const map = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
    COMPLETED: "bg-slate-100 text-slate-600 border-slate-200",
    CANCELLED: "bg-slate-100 text-slate-500 border-slate-200",
  };
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${map[status]}`}>{status}</span>;
};

const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const base = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50",
    dark: "bg-slate-900 text-white hover:bg-slate-800",
  };
  const sizes = { sm: "text-xs px-3 py-1.5", md: "text-sm px-4 py-2.5", lg: "text-sm px-6 py-3" };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
};

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center text-center py-20 px-6 anim-fadeUp">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
      <Icon size={28} className="text-slate-400" strokeWidth={1.6} />
    </div>
    <h3 className="text-slate-900 font-semibold text-base mb-1.5">{title}</h3>
    <p className="text-slate-500 text-sm max-w-sm mb-6">{description}</p>
    {actionLabel && <Button onClick={onAction}>{actionLabel}</Button>}
  </div>
);

const Skeleton = ({ className }) => <div className={`shimmer rounded-lg ${className}`} />;

const StatCard = ({ icon: Icon, label, value, sub, tone = "indigo" }) => {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tones[tone]}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900 leading-none mb-1.5">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
};

/* ============================== TOASTS ============================== */
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = (message, tone = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, message, tone }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };
  return { toasts, push };
}
const ToastStack = ({ toasts }) => (
  <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 w-80">
    {toasts.map(t => (
      <div key={t.id} className="anim-slideIn bg-slate-900 text-white rounded-xl px-4 py-3.5 shadow-lg flex items-start gap-3">
        {t.tone === "success" ? <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" /> : <Info size={18} className="text-indigo-400 mt-0.5 shrink-0" />}
        <span className="text-sm leading-snug">{t.message}</span>
      </div>
    ))}
  </div>
);

/* ============================== LOGIN PAGE ============================== */
function LoginPage({ onLogin }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-14">
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }} />
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-500 rounded-lg flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">UniCounsel</span>
        </div>
        <div className="relative z-10">
          <h1 className="text-white text-5xl font-extrabold leading-tight tracking-tight mb-6">
            Connect with your<br />teachers.<br /><span className="text-indigo-400">When it matters.</span>
          </h1>
          <p className="text-slate-400 text-base max-w-md leading-relaxed">
            Find available counselling hours, book a session, and communicate directly with your teachers.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-8 text-slate-500 text-xs">
          <div className="flex items-center gap-2"><Calendar size={14} /> Live availability</div>
          <div className="flex items-center gap-2"><MessageSquare size={14} /> Direct messaging</div>
          <div className="flex items-center gap-2"><Bell size={14} /> Instant updates</div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="text-slate-900 font-semibold text-lg">UniCounsel</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1.5">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to continue to your dashboard.</p>

          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
            {["student", "teacher"].map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={`py-2 rounded-lg text-sm font-medium transition-all duration-150 ${role === r ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {r === "student" ? "Student" : "Teacher"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@unicounsel.edu"
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••"
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all" />
            </div>
            <Button className="w-full mt-2" size="lg" onClick={() => onLogin(role)}>Sign In</Button>
          </div>

          <p className="text-xs text-slate-400 text-center mt-5">Demo prototype — any email &amp; password will work.</p>
          <p className="text-sm text-slate-500 text-center mt-6">
            Don't have an account? <span className="text-indigo-600 font-medium cursor-pointer hover:underline">Create account</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================== SHELL (Sidebar + Topbar) ============================== */
function Sidebar({ role, page, setPage, mobileOpen, setMobileOpen, onLogout }) {
  const studentNav = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "teachers", label: "Teachers", icon: Users },
    { key: "bookings", label: "My Bookings", icon: CalendarCheck },
    { key: "messages", label: "Messages", icon: MessageSquare },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];
  const teacherNav = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "requests", label: "Requests", icon: Inbox },
    { key: "routine", label: "My Routine", icon: CalendarClock },
    { key: "messages", label: "Messages", icon: MessageSquare },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];
  const nav = role === "student" ? studentNav : teacherNav;

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-200 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-100 shrink-0">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="font-semibold text-slate-900 text-base">UniCounsel</span>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1">
          {nav.map(item => {
            const active = page === item.key;
            return (
              <button key={item.key} onClick={() => { setPage(item.key); setMobileOpen(false); }}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-600 rounded-r-full" />}
                <item.icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-slate-100 space-y-1">
          <button onClick={() => setPage("profile")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${page === "profile" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}>
            <Settings size={17} /> Settings
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

function BottomNav({ role, page, setPage }) {
  const studentNav = [
    { key: "dashboard", label: "Home", icon: Home },
    { key: "teachers", label: "Teachers", icon: Users },
    { key: "bookings", label: "Bookings", icon: CalendarCheck },
    { key: "messages", label: "Messages", icon: MessageSquare },
    { key: "profile", label: "Profile", icon: User },
  ];
  const teacherNav = [
    { key: "dashboard", label: "Home", icon: Home },
    { key: "requests", label: "Requests", icon: Inbox },
    { key: "routine", label: "Routine", icon: CalendarClock },
    { key: "messages", label: "Messages", icon: MessageSquare },
    { key: "profile", label: "Profile", icon: User },
  ];
  const nav = role === "student" ? studentNav : teacherNav;
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex z-40">
      {nav.map(item => {
        const active = page === item.key;
        return (
          <button key={item.key} onClick={() => setPage(item.key)} className="flex-1 flex flex-col items-center gap-1 py-2.5">
            <item.icon size={19} className={active ? "text-indigo-600" : "text-slate-400"} />
            <span className={`text-[10px] font-medium ${active ? "text-indigo-600" : "text-slate-400"}`}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Topbar({ me, role, setMobileOpen, notifications, onOpenNotif, notifOpen, onMarkRead, setPage, onLogout, search, setSearch }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;
  return (
    <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6">
      <button className="lg:hidden text-slate-500" onClick={() => setMobileOpen(true)}><Menu size={22} /></button>
      <div className="hidden sm:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers, departments or courses..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white transition-all" />
        </div>
      </div>
      <div className="flex-1 sm:hidden" />
      <div className="flex items-center gap-1.5 relative">
        <button onClick={() => setPage("messages")} className="p-2.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors relative">
          <MessageSquare size={19} />
        </button>
        <button onClick={onOpenNotif} className="p-2.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors relative">
          <Bell size={19} />
          {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-xl shadow-lg anim-popIn overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="font-semibold text-sm text-slate-900">Notifications</span>
              {unread > 0 && <span className="text-xs text-indigo-600 font-medium">{unread} new</span>}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-400">You're all caught up.</div>
              ) : notifications.slice(0, 5).map(n => (
                <button key={n.id} onClick={() => onMarkRead(n.id)} className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 flex gap-3 transition-colors ${!n.read ? "bg-indigo-50/40" : ""}`}>
                  <NotifDot category={n.category} />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-800 leading-snug">{n.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setPage("notifications")} className="w-full text-center py-2.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors">View all notifications</button>
          </div>
        )}
        <div className="relative ml-1">
          <button onClick={() => setProfileOpen(o => !o)} className="flex items-center gap-2 pl-1.5"><Avatar name={me.name} size="sm" /></button>
          {profileOpen && (
            <div className="absolute right-0 top-11 w-52 bg-white border border-slate-200 rounded-xl shadow-lg anim-popIn overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-900 truncate">{me.name}</p>
                <p className="text-xs text-slate-400 truncate">{role === "student" ? "Student" : "Teacher"}</p>
              </div>
              <button onClick={() => { setPage("profile"); setProfileOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"><User size={15} /> Profile</button>
              <button onClick={onLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><LogOut size={15} /> Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const NotifDot = ({ category }) => {
  const map = { Booking: "bg-indigo-500", Message: "bg-blue-500", Schedule: "bg-amber-500", System: "bg-slate-400" };
  return <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${map[category] || "bg-slate-400"}`} />;
};

/* ============================== TEACHER CARD ============================== */
function TeacherCard({ teacher, onView, onBook, loading }) {
  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4"><Skeleton className="w-11 h-11 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-3.5 w-32" /><Skeleton className="h-3 w-24" /></div></div>
        <Skeleton className="h-3 w-full mb-2" /><Skeleton className="h-3 w-2/3 mb-4" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    );
  }
  const nextSlot = teacher._nextSlot;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start gap-3 mb-3">
        <Avatar name={teacher.name} size="md" online={teacher.online} />
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 text-sm truncate">{teacher.name}</h3>
          <p className="text-xs text-slate-500 truncate">{teacher.designation}</p>
          <p className="text-xs text-slate-400 truncate">{teacher.department}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mb-3">
        <span className={`w-1.5 h-1.5 rounded-full ${teacher.online ? "bg-emerald-500" : "bg-slate-300"}`} />
        <span className={`text-xs font-medium ${teacher.online ? "text-emerald-600" : "text-slate-400"}`}>{teacher.online ? "Available today" : "Not available today"}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {teacher.subjects.map(s => <span key={s} className="text-[11px] bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md">{s}</span>)}
      </div>
      <div className="bg-slate-50 rounded-lg px-3 py-2 mb-4">
        <p className="text-[11px] text-slate-400 mb-0.5">Next available</p>
        <p className="text-xs font-medium text-slate-700">{nextSlot ? `${nextSlot.dateLabel} · ${to12h(nextSlot.start)}` : "No open hours"}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" className="flex-1" onClick={() => onView(teacher.id)}>View Profile</Button>
        <Button size="sm" className="flex-1" onClick={() => onBook(teacher.id)} disabled={!nextSlot}>Book Hour</Button>
      </div>
    </div>
  );
}

/* ============================== ROUTINE VIEW ============================== */
function RoutineGrid({ slots, bookings, teacherId, onBookSlot, editable, onDelete }) {
  const grouped = DAYS.map(day => ({ day, items: slots.filter(s => s.day === day) }));
  const isSlotTaken = (slot) => bookings.some(b => b.teacherId === teacherId && b.slotId === slot.id && b.status === "accepted");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {grouped.filter(g => g.items.length > 0).map(g => (
        <div key={g.day} className="bg-white border border-slate-200 rounded-2xl p-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">{g.day}</h4>
          <div className="space-y-2.5">
            {g.items.map(slot => {
              const taken = slot.type === "counselling" && isSlotTaken(slot);
              if (slot.type === "class") {
                return (
                  <div key={slot.id} className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-500">{to12h(slot.start)} – {to12h(slot.end)}</span>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-200/70 px-1.5 py-0.5 rounded">CLASS</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700">{slot.course}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={11} /> {slot.room}</p>
                  </div>
                );
              }
              return (
                <div key={slot.id} className={`relative rounded-xl px-3.5 py-3 border ${taken ? "bg-slate-50 border-slate-200" : "bg-emerald-50 border-emerald-200"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${taken ? "text-slate-400" : "text-emerald-700"}`}>{to12h(slot.start)} – {to12h(slot.end)}</span>
                    {editable ? (
                      <button onClick={() => onDelete(slot.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                    ) : (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 ${taken ? "bg-slate-200 text-slate-500" : "bg-emerald-100 text-emerald-700"}`}>
                        <Circle size={6} fill="currentColor" /> {taken ? "BOOKED" : "AVAILABLE"}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm font-medium ${taken ? "text-slate-500" : "text-emerald-900"}`}>Counselling Hour</p>
                  <p className={`text-xs flex items-center gap-1 mt-0.5 ${taken ? "text-slate-400" : "text-emerald-700/70"}`}><MapPin size={11} /> {slot.room}</p>
                  {!editable && !taken && (
                    <button onClick={() => onBookSlot(slot)} className="mt-2.5 w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-1.5 rounded-lg transition-colors">
                      <Calendar size={12} /> Book Counselling
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================== BOOKING MODAL ============================== */
function BookingModal({ teacher, initialSlot, onClose, onSubmit, bookings }) {
  const [step, setStep] = useState(1);
  const dates = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 10; i++) { const d = new Date(); d.setDate(d.getDate() + i); arr.push(d); }
    return arr;
  }, []);
  const [selectedDate, setSelectedDate] = useState(() => initialSlot ? nextDateForWeekday(initialSlot.day) : dates[0]);
  const availableSlotsForDate = useMemo(() => {
    const weekday = DAYS[(selectedDate.getDay() + 6) % 7];
    return teacher._slots.filter(s => s.type === "counselling" && s.day === weekday);
  }, [selectedDate, teacher]);
  const isBooked = (slot) => bookings.some(b => b.teacherId === teacher.id && b.slotId === slot.id && b.status === "accepted" && b.date === isoDate(selectedDate));
  const [selectedSlot, setSelectedSlot] = useState(initialSlot || null);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedSlot && !availableSlotsForDate.find(s => s.id === selectedSlot.id)) setSelectedSlot(null);
  }, [selectedDate]); // eslint-disable-line

  const steps = ["Select Time", "Your Information", "Confirm"];

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-[90] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto anim-popIn shadow-2xl">
        {submitted ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5 anim-checkPop">
              <Check size={30} className="text-emerald-600" strokeWidth={3} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Request Sent</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">Your counselling request has been sent to {teacher.name}.</p>
            <div className="mb-6"><Badge status="PENDING" /></div>
            <Button onClick={() => onSubmit()}>View My Bookings</Button>
          </div>
        ) : (
          <>
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-semibold text-slate-900">Book Counselling — {teacher.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  {steps.map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${step === i + 1 ? "text-indigo-600" : step > i + 1 ? "text-emerald-600" : "text-slate-300"}`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${step === i + 1 ? "border-indigo-600 bg-indigo-50" : step > i + 1 ? "border-emerald-500 bg-emerald-50" : "border-slate-200"}`}>
                          {step > i + 1 ? <Check size={11} /> : String(i + 1).padStart(2, "0")}
                        </span>
                        {s}
                      </div>
                      {i < 2 && <ChevronRight size={13} className="text-slate-300" />}
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1"><X size={20} /></button>
            </div>

            <div className="p-6">
              {step === 1 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">Select Date</p>
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
                    {dates.map(d => (
                      <button key={isoDate(d)} onClick={() => setSelectedDate(d)}
                        className={`shrink-0 flex flex-col items-center px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${isoDate(d) === isoDate(selectedDate) ? "bg-indigo-600 border-indigo-600 text-white shadow-sm" : "border-slate-200 text-slate-600 hover:border-indigo-300"}`}>
                        <span className="opacity-70">{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
                        <span className="text-base font-semibold">{d.getDate()}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs font-medium text-slate-500 mb-2">Available Times</p>
                  {availableSlotsForDate.length === 0 ? (
                    <p className="text-sm text-slate-400 py-6 text-center bg-slate-50 rounded-xl">No counselling hours on this date. Try another day.</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlotsForDate.map(s => {
                        const booked = isBooked(s);
                        return (
                          <button key={s.id} disabled={booked} onClick={() => setSelectedSlot(s)}
                            className={`text-xs font-medium py-2.5 rounded-lg border transition-all ${booked ? "border-slate-100 text-slate-300 line-through cursor-not-allowed" : selectedSlot?.id === s.id ? "bg-indigo-600 border-indigo-600 text-white shadow-sm scale-[1.03]" : "border-slate-200 text-slate-700 hover:border-indigo-300"}`}>
                            {to12h(s.start)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">Reason for counselling</label>
                    <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="e.g. I'd like to discuss my final year project."
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">Optional message</label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} rows={2} placeholder="Anything else the teacher should know?"
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none" />
                  </div>
                </div>
              )}

              {step === 3 && selectedSlot && (
                <div className="bg-slate-50 rounded-xl p-5 space-y-3">
                  {[
                    ["Teacher", teacher.name],
                    ["Date", fmtDate(selectedDate)],
                    ["Time", `${to12h(selectedSlot.start)} – ${to12h(selectedSlot.end)}`],
                    ["Duration", durationLabel(selectedSlot.start, selectedSlot.end)],
                    ["Room", selectedSlot.room],
                    ["Reason", reason || "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm gap-4">
                      <span className="text-slate-400">{k}</span>
                      <span className="text-slate-800 font-medium text-right">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-between sticky bottom-0 bg-white">
              <Button variant="secondary" onClick={() => step === 1 ? onClose() : setStep(step - 1)}>
                {step === 1 ? "Cancel" : <><ChevronLeft size={15} /> Back</>}
              </Button>
              {step < 3 ? (
                <Button disabled={step === 1 && !selectedSlot} onClick={() => setStep(step + 1)}>Continue <ChevronRight size={15} /></Button>
              ) : (
                <Button onClick={() => { onSubmit({ teacherId: teacher.id, slotId: selectedSlot.id, date: isoDate(selectedDate), day: selectedSlot.day, start: selectedSlot.start, end: selectedSlot.end, room: selectedSlot.room, reason, message }); setSubmitted(true); }}>
                  Send Booking Request
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================== STUDENT: TEACHERS PAGE ============================== */
function TeachersPage({ teachers, onView, onBook, loading, search, setSearch }) {
  const [dept, setDept] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const filtered = teachers.filter(t =>
    (dept === "All" || t.department === dept) &&
    (search === "" || t.name.toLowerCase().includes(search.toLowerCase()) || t.department.toLowerCase().includes(search.toLowerCase()) || t.subjects.some(s => s.toLowerCase().includes(search.toLowerCase())))
  );
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Find a Teacher</h1>
        <p className="text-sm text-slate-500">Search for a teacher and check their available counselling hours.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers, departments or courses..."
            className="w-full border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
        </div>
        <Button variant="secondary" onClick={() => setShowFilters(f => !f)}><Filter size={15} /> Filters</Button>
      </div>
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-6 anim-fadeUp">
          {["All", ...DEPARTMENTS].map(d => (
            <button key={d} onClick={() => setDept(d)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${dept === d ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-200 text-slate-600 hover:border-indigo-300"}`}>
              {d}
            </button>
          ))}
        </div>
      )}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <TeacherCard key={i} loading />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No teachers found" description="Try a different search term or clear your filters." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(t => <TeacherCard key={t.id} teacher={t} onView={onView} onBook={onBook} />)}
        </div>
      )}
    </div>
  );
}

/* ============================== STUDENT: DASHBOARD ============================== */
function StudentDashboard({ me, teachers, bookings, notifications, loading, onView, onBook, setPage, search, setSearch }) {
  const upcoming = bookings.filter(b => b.status === "accepted");
  const pending = bookings.filter(b => b.status === "pending");
  const completed = bookings.filter(b => b.status === "completed");
  const unreadMsgs = 3;
  const featured = teachers.slice(0, 3);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Good morning, {me.name.split(" ")[0]} 👋</h1>
      <p className="text-sm text-slate-500 mb-7">Find the right time to talk to your teachers.</p>

      <div className="relative mb-4">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers, departments or courses..."
          className="w-full border border-slate-200 rounded-xl pl-11 pr-24 py-3.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm" />
        <Button size="sm" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setPage("teachers")}>Search</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-6">
        <StatCard icon={CalendarCheck} label="Upcoming Session" value={upcoming.length} sub={upcoming[0] ? `${DAYS.includes(upcoming[0].day) ? "Next" : ""} ${to12h(upcoming[0].start)}` : "None scheduled"} tone="indigo" />
        <StatCard icon={Inbox} label="Pending Requests" value={pending.length} tone="amber" />
        <StatCard icon={CheckCircle2} label="Completed Sessions" value={completed.length} tone="emerald" />
        <StatCard icon={MessageSquare} label="Unread Messages" value={unreadMsgs} tone="violet" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Find a Teacher</h2>
          <p className="text-sm text-slate-500">Search for a teacher and check their available counselling hours.</p>
        </div>
        <button onClick={() => setPage("teachers")} className="text-sm font-medium text-indigo-600 hover:underline shrink-0 flex items-center gap-1">View all <ChevronRight size={14} /></button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <TeacherCard key={i} loading />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {featured.map(t => <TeacherCard key={t.id} teacher={t} onView={onView} onBook={onBook} />)}
        </div>
      )}
    </div>
  );
}

/* ============================== TEACHER PROFILE PAGE ============================== */
function TeacherProfilePage({ teacher, bookings, onBack, onBookSlot, onMessage }) {
  const [tab, setTab] = useState("overview");
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors"><ArrowLeft size={15} /> Back to teachers</button>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <Avatar name={teacher.name} size="xl" online={teacher.online} />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900">{teacher.name}</h1>
            <p className="text-sm text-slate-500">{teacher.designation}</p>
            <p className="text-sm text-slate-400 mb-2">{teacher.department}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Mail size={12} /> {teacher.email}</span>
              <span className="flex items-center gap-1"><MapPin size={12} /> {teacher.officeRoom}</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${teacher.online ? "bg-emerald-500" : "bg-slate-300"}`} />
              <span className={`text-xs font-medium ${teacher.online ? "text-emerald-600" : "text-slate-400"}`}>{teacher.online ? "Available for counselling" : "Not available today"}</span>
            </div>
          </div>
          <div className="flex sm:flex-col gap-2 shrink-0">
            <Button variant="secondary" onClick={() => onMessage(teacher.id)}><MessageSquare size={15} /> Message</Button>
            <Button onClick={() => setTab("counselling")}><Calendar size={15} /> View Available Hours</Button>
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {[["overview", "Overview"], ["routine", "Routine"], ["counselling", "Counselling Hours"]].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === k ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">About</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-5">{teacher.bio}</p>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Subjects</h3>
            <div className="flex flex-wrap gap-2">
              {teacher.subjects.map(s => <span key={s} className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg">{s}</span>)}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Details</h3>
            {[[Briefcase, "Employee ID", teacher.employeeId], [Building2, "Office", teacher.officeRoom], [Clock, "Office Hours", teacher.officeHours], [Phone, "Phone", teacher.phone]].map(([Icon, label, val]) => (
              <div key={label} className="flex items-start gap-3">
                <Icon size={15} className="text-slate-400 mt-0.5" />
                <div><p className="text-xs text-slate-400">{label}</p><p className="text-sm text-slate-700 font-medium">{val}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "routine" && <RoutineGrid slots={teacher._slots} bookings={bookings} teacherId={teacher.id} onBookSlot={onBookSlot} editable={false} />}

      {tab === "counselling" && (
        <RoutineGrid slots={teacher._slots.filter(s => s.type === "counselling")} bookings={bookings} teacherId={teacher.id} onBookSlot={onBookSlot} editable={false} />
      )}
    </div>
  );
}

/* ============================== STUDENT: MY BOOKINGS ============================== */
function BookingCard({ booking, teacher, onOpenChat }) {
  const d = new Date(booking.date);
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <Badge status={booking.status.toUpperCase()} />
        <span className="text-xs text-slate-400">Requested {booking.createdAgo}</span>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <Avatar name={teacher.name} size="md" />
        <div><p className="font-semibold text-sm text-slate-900">{teacher.name}</p><p className="text-xs text-slate-500">{teacher.designation}</p></div>
      </div>
      <div className="space-y-1.5 mb-4 text-sm text-slate-600">
        <p className="flex items-center gap-2"><Calendar size={14} className="text-slate-400" /> {fmtDate(d)}</p>
        <p className="flex items-center gap-2"><Clock size={14} className="text-slate-400" /> {to12h(booking.start)} – {to12h(booking.end)}</p>
        <p className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> {booking.room}</p>
      </div>
      {booking.reason && (
        <div className="bg-slate-50 rounded-lg px-3 py-2.5 mb-4">
          <p className="text-xs text-slate-400 mb-0.5">Reason</p>
          <p className="text-sm text-slate-700">{booking.reason}</p>
        </div>
      )}
      {booking.status === "rejected" && booking.rejectReason && (
        <div className="bg-red-50 rounded-lg px-3 py-2.5 mb-4">
          <p className="text-xs text-red-400 mb-0.5">Reason for rejection</p>
          <p className="text-sm text-red-700">{booking.rejectReason}</p>
        </div>
      )}
      <div className="flex gap-2">
        {booking.status === "accepted" && <Button size="sm" variant="secondary" className="flex-1" onClick={() => onOpenChat(teacher.id)}><MessageSquare size={13} /> Open Chat</Button>}
        <Button size="sm" variant="ghost" className="flex-1">View Details</Button>
      </div>
    </div>
  );
}

function MyBookingsPage({ bookings, teachers, onOpenChat, setPage }) {
  const [tab, setTab] = useState("all");
  const tabs = [["all", "All"], ["pending", "Pending"], ["accepted", "Upcoming"], ["completed", "Completed"], ["rejected", "Cancelled"]];
  const filtered = tab === "all" ? bookings : bookings.filter(b => b.status === tab || (tab === "rejected" && b.status === "cancelled"));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">My Counselling Sessions</h1>
      <p className="text-sm text-slate-500 mb-6">Track requests you've sent and sessions you have scheduled.</p>
      <div className="flex gap-1 border-b border-slate-200 mb-6 overflow-x-auto">
        {tabs.map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${tab === k ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
            {label}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="No counselling sessions yet." description="Search for a teacher and book your first counselling hour." actionLabel="Find a Teacher" onAction={() => setPage("teachers")} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(b => <BookingCard key={b.id} booking={b} teacher={teachers.find(t => t.id === b.teacherId)} onOpenChat={onOpenChat} />)}
        </div>
      )}
    </div>
  );
}

/* ============================== TEACHER: DASHBOARD ============================== */
function TeacherDashboard({ me, bookings, students, setPage }) {
  const today = bookings.filter(b => b.status === "accepted").length;
  const pending = bookings.filter(b => b.status === "pending");
  const upcoming = bookings.filter(b => b.status === "accepted").length;
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Good morning, {me.name.split(" ").slice(-2).join(" ")}</h1>
      <p className="text-sm text-slate-500 mb-7">Here's what's happening with your counselling schedule.</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={CalendarCheck} label="Today's Sessions" value={today} tone="indigo" />
        <StatCard icon={Inbox} label="Pending Requests" value={pending.length} tone="amber" />
        <StatCard icon={Calendar} label="Upcoming" value={upcoming} tone="emerald" />
        <StatCard icon={MessageSquare} label="Unread Messages" value={4} tone="violet" />
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Counselling Requests</h2>
        <button onClick={() => setPage("requests")} className="text-sm font-medium text-indigo-600 hover:underline flex items-center gap-1">View all <ChevronRight size={14} /></button>
      </div>
      {pending.length === 0 ? (
        <EmptyState icon={Inbox} title="No pending counselling requests." description="New requests from students will appear here." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pending.slice(0, 2).map(b => <RequestCard key={b.id} booking={b} student={students.find(s => s.id === b.studentId)} onAccept={() => {}} onReject={() => {}} preview />)}
        </div>
      )}
    </div>
  );
}

/* ============================== TEACHER: REQUEST CARD ============================== */
function RequestCard({ booking, student, onAccept, onReject, preview }) {
  const d = new Date(booking.date);
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden">
      <span className="absolute top-0 left-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-br-lg tracking-wide">NEW REQUEST</span>
      <div className="flex items-center gap-3 mb-4 mt-3">
        <Avatar name={student.name} size="md" />
        <div>
          <p className="font-semibold text-sm text-slate-900">{student.name}</p>
          <p className="text-xs text-slate-500">{student.department.includes("Computer") ? "CSE" : student.department} · {student.semester}</p>
        </div>
      </div>
      <div className="mb-3">
        <p className="text-xs text-slate-400 mb-1">Requested</p>
        <p className="text-sm text-slate-700 font-medium flex items-center gap-2"><Calendar size={13} className="text-slate-400" /> {fmtDate(d)}</p>
        <p className="text-sm text-slate-700 font-medium flex items-center gap-2 mt-0.5"><Clock size={13} className="text-slate-400" /> {to12h(booking.start)} – {to12h(booking.end)}</p>
      </div>
      <div className="bg-slate-50 rounded-lg px-3 py-2.5 mb-2">
        <p className="text-xs text-slate-400 mb-0.5">Reason</p>
        <p className="text-sm text-slate-700">"{booking.reason || "Not specified"}"</p>
      </div>
      {booking.message && (
        <div className="bg-slate-50 rounded-lg px-3 py-2.5 mb-4">
          <p className="text-xs text-slate-400 mb-0.5">Message</p>
          <p className="text-sm text-slate-700">"{booking.message}"</p>
        </div>
      )}
      {!preview && (
        <div className="flex gap-2 mt-2">
          <Button variant="danger" className="flex-1" onClick={onReject}>Reject</Button>
          <Button className="flex-1" onClick={onAccept}>Accept Request</Button>
        </div>
      )}
    </div>
  );
}

function RejectModal({ onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 bg-slate-900/50 z-[90] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 anim-popIn shadow-2xl">
        <h3 className="font-semibold text-slate-900 mb-1">Why are you rejecting this request?</h3>
        <p className="text-xs text-slate-400 mb-4">This will be shared with the student.</p>
        <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="Optional reason"
          className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 resize-none mb-5" />
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="danger" className="flex-1 !bg-red-600 !text-white !border-red-600 hover:!bg-red-700" onClick={() => onConfirm(reason)}>Reject Request</Button>
        </div>
      </div>
    </div>
  );
}

function RequestsPage({ bookings, students, onAccept, onReject }) {
  const pending = bookings.filter(b => b.status === "pending");
  const [rejectTarget, setRejectTarget] = useState(null);
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Counselling Requests</h1>
      <p className="text-sm text-slate-500 mb-6">Review and respond to student booking requests.</p>
      {pending.length === 0 ? (
        <EmptyState icon={Inbox} title="No pending counselling requests." description="New requests from students will appear here as they come in." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pending.map(b => (
            <RequestCard key={b.id} booking={b} student={students.find(s => s.id === b.studentId)} onAccept={() => onAccept(b.id)} onReject={() => setRejectTarget(b.id)} />
          ))}
        </div>
      )}
      {rejectTarget && <RejectModal onClose={() => setRejectTarget(null)} onConfirm={(reason) => { onReject(rejectTarget, reason); setRejectTarget(null); }} />}
    </div>
  );
}

/* ============================== TEACHER: ROUTINE MANAGEMENT ============================== */
function AddHourModal({ onClose, onAdd }) {
  const [day, setDay] = useState("Monday");
  const [start, setStart] = useState("11:00");
  const [end, setEnd] = useState("12:00");
  const [room, setRoom] = useState("");
  const [max, setMax] = useState(1);
  const [note, setNote] = useState("");
  return (
    <div className="fixed inset-0 bg-slate-900/50 z-[90] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 anim-popIn shadow-2xl">
        <h3 className="font-semibold text-slate-900 mb-5">Add Counselling Hour</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Day</label>
            <select value={day} onChange={e => setDay(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30">
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-slate-600 mb-1.5 block">Start Time</label>
              <input type="time" value={start} onChange={e => setStart(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30" /></div>
            <div><label className="text-xs font-medium text-slate-600 mb-1.5 block">End Time</label>
              <input type="time" value={end} onChange={e => setEnd(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30" /></div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Room</label>
            <input value={room} onChange={e => setRoom(e.target.value)} placeholder="e.g. Room 402" className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Maximum Students</label>
            <input type="number" min={1} value={max} onChange={e => setMax(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Optional Note</label>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Bring your project draft" className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30" />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" disabled={!room} onClick={() => onAdd({ day, start, end, room, maxStudents: max, note })}>Add Available Hour</Button>
        </div>
      </div>
    </div>
  );
}

function TeacherRoutinePage({ slots, bookings, teacherId, onAdd, onDelete }) {
  const [view, setView] = useState("Week");
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">My Weekly Routine</h1>
          <p className="text-sm text-slate-500">Manage your classes and counselling availability.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-slate-100 rounded-lg">
            {["Week", "Day"].map(v => (
              <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === v ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}>{v}</button>
            ))}
          </div>
          <Button onClick={() => setModalOpen(true)}><Plus size={15} /> Add Counselling Hour</Button>
        </div>
      </div>
      <RoutineGrid slots={slots} bookings={bookings} teacherId={teacherId} editable onDelete={onDelete} onBookSlot={() => {}} />
      {modalOpen && <AddHourModal onClose={() => setModalOpen(false)} onAdd={(data) => { onAdd(data); setModalOpen(false); }} />}
    </div>
  );
}

/* ============================== MESSAGING ============================== */
function MessagesPage({ role, me, conversations, activeId, setActiveId, onSend }) {
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const active = conversations.find(c => c.id === activeId) || conversations[0];
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [active?.messages.length, typing]);

  if (conversations.length === 0) {
    return <EmptyState icon={MessagesSquare} title="No conversations yet." description="Messages with teachers and students will appear here." />;
  }

  const handleSend = () => {
    if (!text.trim() || !active) return;
    onSend(active.id, text.trim());
    setText("");
    setTyping(true);
    setTimeout(() => setTyping(false), 1600);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex h-[calc(100vh-140px)] lg:h-[calc(100vh-112px)]">
      <div className={`w-full sm:w-72 border-r border-slate-200 flex-col ${active && "hidden sm:flex"} flex`}>
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search conversations" className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/30" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(c => (
            <button key={c.id} onClick={() => setActiveId(c.id)} className={`w-full text-left px-4 py-3.5 flex gap-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${active?.id === c.id ? "bg-indigo-50/60" : ""}`}>
              <Avatar name={c.name} size="sm" online={c.online} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900 truncate">{c.name}</p>
                  <span className="text-[10px] text-slate-400 shrink-0">{c.messages.at(-1)?.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{c.messages.at(-1)?.text}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3">
            <button onClick={() => setActiveId(null)} className="sm:hidden text-slate-400"><ArrowLeft size={18} /></button>
            <Avatar name={active.name} size="sm" online={active.online} />
            <div>
              <p className="text-sm font-semibold text-slate-900">{active.name}</p>
              <p className="text-xs text-emerald-600 flex items-center gap-1">{active.online ? <><Circle size={6} fill="currentColor" /> Online</> : "Offline"}</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {active.messages.map((m, i) => (
              <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm anim-fadeUp ${m.from === "me" ? "bg-indigo-600 text-white rounded-br-md" : "bg-slate-100 text-slate-800 rounded-bl-md"}`}>
                  <p>{m.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${m.from === "me" ? "justify-end" : ""}`}>
                    <span className={`text-[10px] ${m.from === "me" ? "text-indigo-200" : "text-slate-400"}`}>{m.time}</span>
                    {m.from === "me" && <CheckCheck size={12} className="text-indigo-200" />}
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
                  {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="p-4 border-t border-slate-100 flex items-center gap-2">
            <button className="text-slate-400 hover:text-slate-600 p-2"><Paperclip size={18} /></button>
            <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Type a message..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white" />
            <button className="text-slate-400 hover:text-slate-600 p-2"><Smile size={18} /></button>
            <button onClick={handleSend} className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-full transition-colors active:scale-95"><Send size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== NOTIFICATIONS PAGE ============================== */
function NotificationsPage({ notifications, onMarkRead }) {
  const [tab, setTab] = useState("All");
  const cats = ["All", "Booking", "Message", "Schedule", "System"];
  const filtered = tab === "All" ? notifications : notifications.filter(n => n.category === tab);
  const iconFor = (cat) => ({ Booking: Calendar, Message: MessageSquare, Schedule: Clock, System: Info }[cat] || Info);
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Notifications</h1>
      <p className="text-sm text-slate-500 mb-6">Stay up to date with your counselling activity.</p>
      <div className="flex gap-1 border-b border-slate-200 mb-6 overflow-x-auto">
        {cats.map(c => (
          <button key={c} onClick={() => setTab(c)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${tab === c ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}>{c}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={Bell} title="You're all caught up." description="New booking, message, and schedule updates will show up here." />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
          {filtered.map(n => {
            const Icon = iconFor(n.category);
            const toneMap = { Booking: "bg-indigo-50 text-indigo-600", Message: "bg-blue-50 text-blue-600", Schedule: "bg-amber-50 text-amber-600", System: "bg-slate-100 text-slate-500" };
            return (
              <button key={n.id} onClick={() => onMarkRead(n.id)} className={`w-full text-left px-5 py-4 flex gap-3.5 hover:bg-slate-50 transition-colors ${!n.read ? "bg-indigo-50/30" : ""}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${toneMap[n.category]}`}><Icon size={16} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">{n.title}</p>
                    {!n.read && <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full shrink-0" />}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{n.body}</p>
                  <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================== PROFILE PAGES ============================== */
function ProfilePage({ role, me, teacher }) {
  const [editing, setEditing] = useState(false);
  const fields = role === "student"
    ? [[Mail, "Email", me.email], [Phone, "Phone", me.phone], [Building2, "Department", me.department], [GraduationCap, "Batch", me.batch], [BookOpen, "Semester", me.semester]]
    : [[Mail, "Email", teacher.email], [Phone, "Phone", teacher.phone], [Briefcase, "Employee ID", teacher.employeeId], [Building2, "Office Room", teacher.officeRoom], [Clock, "Office Hours", teacher.officeHours]];
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Profile</h1>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-5 mb-8">
          <Avatar name={me.name} size="xl" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">{me.name}</h2>
            <p className="text-sm text-slate-500">{role === "student" ? me.studentId : teacher.designation}</p>
            <p className="text-sm text-slate-400">{role === "student" ? me.department : teacher.department}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          {fields.map(([Icon, label, val]) => (
            <div key={label} className="flex items-start gap-3">
              <Icon size={15} className="text-slate-400 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                {editing ? (
                  <input defaultValue={val} className="text-sm text-slate-800 font-medium border-b border-indigo-300 outline-none bg-transparent" />
                ) : (
                  <p className="text-sm text-slate-800 font-medium truncate">{val}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        {role === "teacher" && !editing && (
          <div className="mb-8">
            <p className="text-xs text-slate-400 mb-2">Bio</p>
            <p className="text-sm text-slate-600 leading-relaxed">{teacher.bio}</p>
          </div>
        )}
        <Button onClick={() => setEditing(e => !e)}><Edit3 size={15} /> {editing ? "Save Changes" : "Edit Profile"}</Button>
      </div>
    </div>
  );
}

/* ============================== APP ROOT ============================== */
export default function App() {
  const [authRole, setAuthRole] = useState(null); // null | 'student' | 'teacher'
  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [bookingFor, setBookingFor] = useState(null); // { teacher, slot }
  const [activeConvoId, setActiveConvoId] = useState(null);
  const { toasts, push } = useToasts();

  const teachers = useMemo(() => TEACHERS.map((t, i) => ({ ...t, _slots: generateRoutine(t, i) })), []);
  const [bookings, setBookings] = useState([
    { id: "b1", studentId: "s1", teacherId: "t1", slotId: teachers[0]?._slots.find(s => s.type === "counselling")?.id, date: isoDate(nextDateForWeekday(teachers[0]?._slots.find(s => s.type === "counselling")?.day || "Wednesday")), day: teachers[0]?._slots.find(s => s.type === "counselling")?.day || "Wednesday", start: "14:00", end: "15:00", room: "Room 402, CSE Building", reason: "Project discussion", message: "", status: "accepted", createdAgo: "2 days ago" },
    { id: "b2", studentId: "s2", teacherId: "t1", slotId: "t1-x-pending1", date: isoDate(new Date(Date.now() + 3 * 86400000)), day: "Friday", start: "11:00", end: "12:00", room: "Room 402, CSE Building", reason: "I would like to discuss my final project.", message: "I need guidance regarding my thesis direction.", status: "pending", createdAgo: "1 hour ago" },
    { id: "b3", studentId: "s3", teacherId: "t1", slotId: "t1-x-pending2", date: isoDate(new Date(Date.now() + 4 * 86400000)), day: "Saturday", start: "14:00", end: "15:00", room: "Room 402, CSE Building", reason: "Struggling with algorithm complexity analysis.", message: "", status: "pending", createdAgo: "3 hours ago" },
    { id: "b4", studentId: "s1", teacherId: "t3", slotId: "t3-x-completed", date: isoDate(new Date(Date.now() - 10 * 86400000)), day: "Sunday", start: "11:00", end: "12:00", room: "Room 501, Business Building", reason: "Career guidance", message: "", status: "completed", createdAgo: "10 days ago" },
  ]);

  const [notifications, setNotifications] = useState([
    { id: "n1", role: "student", category: "Booking", title: "Booking Accepted", body: "Dr. Ahmed Rahman accepted your counselling request.", time: "2 days ago", read: false },
    { id: "n2", role: "student", category: "Message", title: "New Message from Dr. Ahmed Rahman", body: "Sure. We can discuss it during the counselling hour.", time: "1 hr ago", read: false },
    { id: "n3", role: "student", category: "Schedule", title: "Upcoming session reminder", body: "Your session with Dr. Ahmed Rahman is coming up soon.", time: "Today", read: true },
    { id: "n4", role: "teacher", category: "Booking", title: "New Counselling Request", body: "Nusrat Jahan requested a counselling hour for Friday at 11:00 AM.", time: "1 hr ago", read: false },
    { id: "n5", role: "teacher", category: "Booking", title: "New Counselling Request", body: "Rakibul Islam requested a counselling hour for Saturday at 2:00 PM.", time: "3 hrs ago", read: false },
    { id: "n6", role: "teacher", category: "System", title: "Weekly summary ready", body: "You completed 8 counselling sessions this month.", time: "Yesterday", read: true },
  ]);

  const [conversationsStudent, setConversationsStudent] = useState([
    { id: "c1", teacherId: "t1", name: "Dr. Ahmed Rahman", online: true, messages: [
      { id: 1, from: "them", text: "Hello Fahmid, how can I help?", time: "10:02 AM" },
      { id: 2, from: "me", text: "I wanted to discuss my final project.", time: "10:04 AM" },
      { id: 3, from: "them", text: "Sure. We can discuss it during the counselling hour.", time: "10:05 AM" },
    ]},
    { id: "c2", teacherId: "t3", name: "Prof. Kamal Hossain", online: false, messages: [
      { id: 1, from: "them", text: "Let's plan your internship discussion soon.", time: "Yesterday" },
    ]},
  ]);
  const [conversationsTeacher, setConversationsTeacher] = useState([
    { id: "d1", studentId: "s2", name: "Nusrat Jahan", online: true, messages: [
      { id: 1, from: "them", text: "Can we meet tomorrow?", time: "1 hr ago" },
    ]},
    { id: "d2", studentId: "s3", name: "Rakibul Islam", online: false, messages: [
      { id: 1, from: "them", text: "Okay sir, thank you.", time: "2 min ago" },
    ]},
  ]);

  useEffect(() => {
    if (authRole) { setLoading(true); const t = setTimeout(() => setLoading(false), 650); return () => clearTimeout(t); }
  }, [authRole, page]);

  if (!authRole) {
    return <><FontLoader /><LoginPage onLogin={(role) => { setAuthRole(role); setPage("dashboard"); }} /></>;
  }

  const me = authRole === "student" ? STUDENT_ME : teachers.find(t => t.id === "t1");
  const students = [STUDENT_ME, ...OTHER_STUDENTS];
  const myNotifications = notifications.filter(n => n.role === authRole);
  const myBookings = authRole === "student" ? bookings.filter(b => b.studentId === "s1") : bookings.filter(b => b.teacherId === "t1");

  // attach next-available-slot label for teacher cards
  const teachersWithNext = teachers.map(t => {
    const counsellingSlots = t._slots.filter(s => s.type === "counselling");
    let next = null;
    for (const s of counsellingSlots) {
      const d = nextDateForWeekday(s.day);
      const takenHere = bookings.some(b => b.teacherId === t.id && b.slotId === s.id && b.status === "accepted");
      if (!takenHere && (!next || d < next.d)) next = { ...s, d, dateLabel: isoDate(d) === isoDate(new Date()) ? "Today" : fmtDateShort(d) };
    }
    return { ...t, _nextSlot: next };
  });

  const markNotifRead = (id) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));

  const openBookingForTeacher = (teacherId, slot = null) => {
    const teacher = teachersWithNext.find(t => t.id === teacherId);
    setBookingFor({ teacher, slot: slot || teacher._nextSlot });
  };

  const submitBooking = (data) => {
    if (!data) { setBookingFor(null); setPage("bookings"); return; }
    const newBooking = { id: "b" + Math.random().toString(36).slice(2, 7), studentId: "s1", ...data, status: "pending", createdAgo: "just now" };
    setBookings(bs => [newBooking, ...bs]);
    const t = teachers.find(x => x.id === data.teacherId);
    setNotifications(ns => [{ id: "n" + Math.random().toString(36).slice(2, 7), role: "teacher", category: "Booking", title: "New Counselling Request", body: `Fahmid Hasan requested a counselling hour for ${fmtDate(new Date(data.date))} at ${to12h(data.start)}.`, time: "just now", read: false }, ...ns]);
    push(`Booking request sent to ${t.name}.`);
  };

  const acceptBooking = (id) => {
    const b = bookings.find(x => x.id === id);
    setBookings(bs => bs.map(x => x.id === id ? { ...x, status: "accepted" } : x));
    setNotifications(ns => [{ id: "n" + Math.random().toString(36).slice(2, 7), role: "student", category: "Booking", title: "Booking Accepted", body: `Dr. Ahmed Rahman accepted your counselling request.`, time: "just now", read: false }, ...ns]);
    push("Counselling request accepted.");
  };
  const rejectBooking = (id, reason) => {
    setBookings(bs => bs.map(x => x.id === id ? { ...x, status: "rejected", rejectReason: reason } : x));
    setNotifications(ns => [{ id: "n" + Math.random().toString(36).slice(2, 7), role: "student", category: "Booking", title: "Booking Rejected", body: `Your counselling request was rejected.`, time: "just now", read: false }, ...ns]);
    push("Request rejected.", "info");
  };

  const addHour = (data) => {
    const t = teachers.find(x => x.id === "t1");
    const newSlot = { id: "t1-" + data.day + "-" + Math.random().toString(36).slice(2, 6), day: data.day, start: data.start, end: data.end, type: "counselling", room: data.room, maxStudents: data.maxStudents, note: data.note };
    t._slots = [...t._slots, newSlot];
    push("Counselling hour added to your routine.");
    setPage("routine");
  };
  const deleteHour = (slotId) => {
    const t = teachers.find(x => x.id === "t1");
    t._slots = t._slots.filter(s => s.id !== slotId);
    push("Counselling hour removed.", "info");
  };

  const sendMessage = (convoId, text) => {
    const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const setter = authRole === "student" ? setConversationsStudent : setConversationsTeacher;
    setter(cs => cs.map(c => c.id === convoId ? { ...c, messages: [...c.messages, { id: Date.now(), from: "me", text, time }] } : c));
    setTimeout(() => {
      setter(cs => cs.map(c => c.id === convoId ? { ...c, messages: [...c.messages, { id: Date.now() + 1, from: "them", text: authRole === "student" ? "Noted — let's talk during the counselling hour." : "Thank you, sir. I'll be there.", time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) }] } : c));
    }, 1700);
  };

  const openChatWithTeacher = (teacherId) => {
    const convo = conversationsStudent.find(c => c.teacherId === teacherId);
    setActiveConvoId(convo ? convo.id : null);
    setPage("messages");
  };

  const conversations = authRole === "student" ? conversationsStudent : conversationsTeacher;

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return authRole === "student"
          ? <StudentDashboard me={me} teachers={teachersWithNext} bookings={myBookings} notifications={myNotifications} loading={loading} onView={(id) => { setSelectedTeacherId(id); setPage("teacherProfile"); }} onBook={openBookingForTeacher} setPage={setPage} search={search} setSearch={setSearch} />
          : <TeacherDashboard me={me} bookings={bookings.filter(b => b.teacherId === "t1")} students={students} setPage={setPage} />;
      case "teachers":
        return <TeachersPage teachers={teachersWithNext} loading={loading} onView={(id) => { setSelectedTeacherId(id); setPage("teacherProfile"); }} onBook={openBookingForTeacher} search={search} setSearch={setSearch} />;
      case "teacherProfile": {
        const t = teachersWithNext.find(x => x.id === selectedTeacherId) || teachersWithNext[0];
        return <TeacherProfilePage teacher={t} bookings={bookings} onBack={() => setPage("teachers")} onBookSlot={(slot) => openBookingForTeacher(t.id, slot)} onMessage={openChatWithTeacher} />;
      }
      case "bookings":
        return <MyBookingsPage bookings={myBookings} teachers={teachers} onOpenChat={openChatWithTeacher} setPage={setPage} />;
      case "requests":
        return <RequestsPage bookings={bookings.filter(b => b.teacherId === "t1")} students={students} onAccept={acceptBooking} onReject={rejectBooking} />;
      case "routine":
        return <TeacherRoutinePage slots={teachers.find(t => t.id === "t1")._slots} bookings={bookings} teacherId="t1" onAdd={addHour} onDelete={deleteHour} />;
      case "messages":
        return <MessagesPage role={authRole} me={me} conversations={conversations} activeId={activeConvoId} setActiveId={setActiveConvoId} onSend={sendMessage} />;
      case "notifications":
        return <NotificationsPage notifications={myNotifications} onMarkRead={markNotifRead} />;
      case "profile":
        return <ProfilePage role={authRole} me={authRole === "student" ? STUDENT_ME : teachers.find(t => t.id === "t1")} teacher={teachers.find(t => t.id === "t1")} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex" onClick={() => notifOpen && setNotifOpen(false)}>
      <FontLoader />
      <Sidebar role={authRole} page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} onLogout={() => setAuthRole(null)} />
      <div className="flex-1 min-w-0 flex flex-col pb-16 lg:pb-0">
        <Topbar me={me} role={authRole} setMobileOpen={setMobileOpen} notifications={myNotifications}
          onOpenNotif={(e) => { e.stopPropagation(); setNotifOpen(o => !o); }} notifOpen={notifOpen}
          onMarkRead={(id) => markNotifRead(id)} setPage={(p) => { setPage(p); setNotifOpen(false); }} onLogout={() => setAuthRole(null)}
          search={search} setSearch={setSearch} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderPage()}
        </main>
      </div>
      <BottomNav role={authRole} page={page} setPage={setPage} />
      {bookingFor && <BookingModal teacher={bookingFor.teacher} initialSlot={bookingFor.slot} bookings={bookings} onClose={() => setBookingFor(null)} onSubmit={submitBooking} />}
      <ToastStack toasts={toasts} />
    </div>
  );
}
