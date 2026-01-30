import React, { useState, useEffect } from 'react';
import { Heart, Stars, Camera, Calendar, Sparkles, Quote, X, ChevronRight, Send, Inbox, Lock, User, MessageCircle, Gamepad2, Trophy, RefreshCw, Dices, Layers, LogIn, ShieldCheck, Globe, Plane, MapPin, Compass, Map, MessageSquareHeart, MousePointer2, Menu } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, updateDoc, doc, Timestamp } from 'firebase/firestore';

// --- Firebase Setup ---
// Replace the empty object {} with your actual Firebase SDK config from Firebase Console
const firebaseConfig = {}; 

const app = Object.keys(firebaseConfig).length > 0 ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const appId = "shimu-special-site";

// --- Static Data ---
const COMPLIMENTS = [
  "Shimu, you are the brightest star in my sky.",
  "Your beauty is more captivating than a midnight sky full of stars.",
  "Ruhid loves you more than there are stars in the universe.",
  "Every second with you feels like a dream I never want to wake up from."
];

const MILESTONES = [
  { 
    date: "The Beginning", 
    title: "Where it all started", 
    desc: "The day the stars aligned and I first met you, Shimu.",
    details: "I still remember the exact feeling when our paths first crossed. It felt like a missing piece of my life finally clicked into place."
  },
  { 
    date: "First Date", 
    title: "The Spark", 
    desc: "That nervous walk, the endless talking, and knowing you were special.",
    details: "I was so nervous that day, Shimu! But the moment I saw you, all my worries disappeared."
  },
  { 
    date: "Forever", 
    title: "The Promise", 
    desc: "Choosing you every single day, through every high and low.",
    details: "This is my lifelong commitment to you. You are my universe, Shimu."
  }
];

const DESTINATIONS = [
  { place: "Sajek Valley", title: "Above the Clouds", desc: "To watch the sunrise from the peaks of Sajek with you.", tag: "Priority 1" },
  { place: "Cox's Bazar", title: "Infinite Shorelines", desc: "Walking on the world's longest beach at dusk.", tag: "Priority 2" },
  { place: "India", title: "A World of Wonders", desc: "Exploring the Taj Mahal and Kolkata together.", tag: "Priority 3" },
  { place: "Chottogram", title: "Hills & Harbors", desc: "Exploring the hidden trails of the hills in my hometown.", tag: "Priority 4" }
];

const CAT_MESSAGES = [
  "Purrr... Shimu is so pretty!",
  "Meow! Ruhid loves you 3000.",
  "*Nuzzles* You're the best, Shimu!",
  "Shimu + Ruhid = Forever ❤️"
];

// --- Components ---

const StarField = () => {
  const [stars, setStars] = useState([]);
  useEffect(() => {
    const starCount = 40; 
    const newStars = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map(star => (
        <div key={star.id} className="absolute bg-white rounded-full animate-pulse opacity-30" style={{ left: star.left, top: star.top, width: `${star.size}px`, height: `${star.size}px`, animationDelay: `${star.delay}s`, animationDuration: `${star.duration}s` }} />
      ))}
    </div>
  );
};

const SectionTitle = ({ title, subtitle, icon: Icon }) => (
  <div className="text-center mb-10 md:mb-16 space-y-3 px-4">
    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-1">
      {Icon && <Icon className="text-indigo-400 w-5 h-5 md:w-6 md:h-6" />}
    </div>
    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">{title}</h2>
    <p className="text-indigo-300 font-medium tracking-widest uppercase text-[10px]">{subtitle}</p>
  </div>
);

const CelestialCat = () => {
  const [message, setMessage] = useState("");
  const [isHappy, setIsHappy] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  const handlePet = () => {
    const randomMsg = CAT_MESSAGES[Math.floor(Math.random() * CAT_MESSAGES.length)];
    setMessage(randomMsg);
    setIsHappy(true);
    setShowBubble(true);
    setTimeout(() => { setIsHappy(false); setShowBubble(false); }, 3000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col items-end pointer-events-none">
      <div className={`mb-2 px-3 py-2 bg-white rounded-2xl rounded-br-none text-indigo-950 text-[10px] font-bold shadow-xl transition-all duration-300 transform ${showBubble ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90'}`}>
        {message}
      </div>
      <div onClick={handlePet} className="pointer-events-auto cursor-pointer group relative active:scale-90 transition-transform">
        {isHappy && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><Heart size={10} className="text-pink-500 animate-bounce fill-current" /></div>}
        <svg width="50" height="50" viewBox="0 0 100 100">
          <circle cx="50" cy="55" r="35" fill="#FFFFFF" />
          <circle cx="40" cy="50" r="4" fill="#1E293B" />
          <circle cx="60" cy="50" r="4" fill="#1E293B" />
          <circle cx="50" cy="62" r="2.5" fill="#FDA4AF" />
        </svg>
      </div>
    </div>
  );
};

// --- Mini Games ---
const LoveLudo = () => {
  const [dice, setDice] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [shimuPos, setShimuPos] = useState(0);
  const [ruhidPos, setRuhidPos] = useState(0);
  const [turn, setTurn] = useState('Shimu');
  const [msg, setMsg] = useState("Shimu's roll!");

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    setTimeout(() => {
      const val = Math.floor(Math.random() * 6) + 1;
      setDice(val);
      setIsRolling(false);
      if (turn === 'Shimu') {
        const next = Math.min(shimuPos + val, 20);
        setShimuPos(next);
        if (next === 20) setMsg("Shimu Wins! ❤️"); else { setTurn('Ruhid'); setMsg("Ruhid's turn!"); }
      } else {
        const next = Math.min(ruhidPos + val, 20);
        setRuhidPos(next);
        if (next === 20) setMsg("Ruhid Wins! ❤️"); else { setTurn('Shimu'); setMsg("Shimu's turn!"); }
      }
    }, 600);
  };

  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-[1.5rem] text-center">
      <h4 className="text-sm font-bold text-white mb-3">Star Path Ludo</h4>
      <div className="relative h-12 bg-white/5 rounded-lg mb-4">
        <div className="absolute transition-all" style={{ left: `${(shimuPos/20)*80 + 10}%`, top: '10%' }}><Heart size={14} fill="#ec4899" /></div>
        <div className="absolute transition-all" style={{ left: `${(ruhidPos/20)*80 + 10}%`, top: '50%' }}><Stars size={14} fill="#6366f1" /></div>
      </div>
      <button onClick={rollDice} className="w-12 h-12 bg-indigo-600/40 rounded-xl text-2xl text-white">{dice}</button>
      <p className="text-[10px] text-indigo-300 mt-2">{msg}</p>
    </div>
  );
};

const MemoryMatch = () => {
    const ICONS = ['❤️', '✨', '💍', '🌸', '🏠', '✈️'];
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
  
    const start = () => {
      const doubled = [...ICONS, ...ICONS].sort(() => Math.random() - 0.5);
      setCards(doubled);
      setFlipped([]);
      setSolved([]);
    };
  
    useEffect(() => {
      if (flipped.length === 2) {
        if (cards[flipped[0]] === cards[flipped[1]]) {
          setSolved(prev => [...prev, flipped[0], flipped[1]]);
        }
        setTimeout(() => setFlipped([]), 800);
      }
    }, [flipped]);
  
    if (cards.length === 0) return <button onClick={start} className="w-full min-h-[150px] bg-white/5 border border-white/10 rounded-[1.5rem] text-white font-bold">Start Memory Match</button>;
  
    return (
      <div className="bg-white/5 border border-white/10 p-4 rounded-[1.5rem]">
        <div className="grid grid-cols-4 gap-2">
          {cards.map((icon, i) => (
            <button 
              key={i} 
              onClick={() => flipped.length < 2 && !flipped.includes(i) && !solved.includes(i) && setFlipped([...flipped, i])}
              className={`aspect-square rounded-xl flex items-center justify-center text-xl transition-all ${flipped.includes(i) || solved.includes(i) ? 'bg-indigo-500/30' : 'bg-white/10'}`}
            >
              {(flipped.includes(i) || solved.includes(i)) ? icon : ''}
            </button>
          ))}
        </div>
      </div>
    );
  };

// --- Main App ---

const LoginPage = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if ((user.toLowerCase() === 'shimu' || user.toLowerCase() === 'ruhid') && pass === '132720062007') {
      onLogin(user.toLowerCase());
    } else {
      setErr('Wrong secret, my love.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center p-4">
      <StarField />
      <div className="relative z-10 w-full max-w-sm bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-10 text-center">
        <Heart size={40} className="text-indigo-400 mx-auto mb-6" />
        <h1 className="text-2xl font-serif font-bold text-white mb-8">Celestial Portal</h1>
        <form onSubmit={submit} className="space-y-4">
          <input type="text" placeholder="Identity" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none" onChange={e => setUser(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none" onChange={e => setPass(e.target.value)} />
          {err && <p className="text-pink-500 text-[10px] uppercase font-bold">{err}</p>}
          <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold">Enter Universe</button>
        </form>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");

  useEffect(() => {
    if (!db || !isLoggedIn) return;
    const q = query(collection(db, 'questions'));
    const unsub = onSnapshot(q, (snap) => {
      setQuestions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [isLoggedIn]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !db) return;
    await addDoc(collection(db, 'questions'), { text: newQuestion, createdAt: Timestamp.now(), reply: "" });
    setNewQuestion("");
  };

  if (!isLoggedIn) return <LoginPage onLogin={(u) => { setCurrentUser(u); setIsLoggedIn(true); }} />;

  return (
    <div className="min-h-screen bg-[#050510] text-slate-300 selection:bg-indigo-500/30">
      <StarField />
      <CelestialCat />
      
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 text-center">
        <div className="z-10 space-y-6">
          <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-[10px] font-bold uppercase tracking-widest">
            Welcome, {currentUser}
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-white leading-tight">
            My Whole <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Universe.</span>
          </h1>
          <p className="max-w-md mx-auto text-slate-400">Shimu, you are the gravity that keeps me grounded.</p>
        </div>
      </section>

      {/* Arcade */}
      <section id="arcade" className="py-20 bg-[#08081a]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle title="Star Arcade" subtitle="Interactive Love Games" icon={Gamepad2} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LoveLudo />
            <MemoryMatch />
          </div>
        </div>
      </section>

      {/* Travel */}
      <section id="travel" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle title="Bucket List" subtitle="Our Travels" icon={Globe} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DESTINATIONS.map((d, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                <h3 className="text-xl font-bold text-white mb-2">{d.place}</h3>
                <p className="text-sm text-slate-400">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Message Box */}
      <section id="wish" className="py-20">
        <div className="max-w-2xl mx-auto px-6">
          <SectionTitle title="Wish Wall" subtitle="Send a Message" icon={MessageSquareHeart} />
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <form onSubmit={handleAsk} className="flex flex-col gap-4">
              <textarea 
                value={newQuestion} 
                onChange={e => setNewQuestion(e.target.value)}
                placeholder="Make a wish..." 
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-white h-24 outline-none"
              />
              <button className="bg-indigo-600 py-3 rounded-xl font-bold text-white">Send to Ruhid</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="py-20 text-center border-t border-white/5">
        <Heart className="mx-auto text-pink-500 fill-current animate-pulse mb-4" />
        <p className="text-[10px] tracking-[0.5em] uppercase">Forever Yours • 2026</p>
      </footer>
    </div>
  );
}