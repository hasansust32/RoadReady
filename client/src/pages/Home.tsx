import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Brain,
  Gauge,
  GraduationCap,
  Hash,
  Home as HomeIcon,
  Languages,
  Menu,
  Timer,
  TriangleAlert,
  X,
} from "lucide-react";
import Dashboard from "@/components/app/Dashboard";
import HazardView from "@/components/app/HazardView";
import LearnView from "@/components/app/LearnView";
import MockTestView from "@/components/app/MockTestView";
import NumbersView from "@/components/app/NumbersView";
import PracticeView from "@/components/app/PracticeView";
import VocabularyView from "@/components/app/VocabularyView";
import { updateWeek } from "@/data/content";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Language, Question, SavedProgress, ViewName, WeekData } from "@/types";

const initialProgress: SavedProgress = {
  learnedRules: [],
  bookmarks: [],
  mistakes: [],
  attempts: 0,
  correct: 0,
  bestMock: 0,
  completedSessions: 0,
  streak: 0,
  lastStudyDate: "",
  weekScores: {},
};

const navItems: { id: ViewName; label: string; bn: string; icon: typeof HomeIcon }[] = [
  { id: "home", label: "Home", bn: "হোম", icon: HomeIcon },
  { id: "learn", label: "Learn", bn: "নিয়ম", icon: GraduationCap },
  { id: "practice", label: "Practice", bn: "অনুশীলন", icon: Brain },
  { id: "mock", label: "Mock test", bn: "মক টেস্ট", icon: Timer },
  { id: "numbers", label: "Numbers", bn: "সংখ্যা", icon: Hash },
  { id: "vocabulary", label: "Vocabulary", bn: "শব্দ", icon: BookOpen },
  { id: "hazard", label: "Hazard", bn: "হ্যাজার্ড", icon: TriangleAlert },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function yesterday() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

export default function Home() {
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [view, setView] = useState<ViewName>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [language, setLanguage] = useLocalStorage<Language>("roadready-language", "both");
  const [progress, setProgress] = useLocalStorage<SavedProgress>("roadready-progress-v2", initialProgress);

  useEffect(() => {
    fetch("questions.json")
      .then((response) => {
        if (!response.ok) throw new Error("Could not load questions");
        return response.json() as Promise<WeekData[]>;
      })
      .then((data) => setWeeks([...data, updateWeek]))
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  const markStudyDay = (value: SavedProgress) => {
    const date = today();
    if (value.lastStudyDate === date) return value;
    return {
      ...value,
      streak: value.lastStudyDate === yesterday() ? value.streak + 1 : 1,
      lastStudyDate: date,
    };
  };

  const navigate = (next: ViewName) => {
    setView(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleRule = (key: string) => setProgress((current) => {
    const learnedRules = current.learnedRules.includes(key)
      ? current.learnedRules.filter((item) => item !== key)
      : [...current.learnedRules, key];
    return markStudyDay({ ...current, learnedRules });
  });

  const toggleBookmark = (id: string) => setProgress((current) => ({
    ...current,
    bookmarks: current.bookmarks.includes(id)
      ? current.bookmarks.filter((item) => item !== id)
      : [...current.bookmarks, id],
  }));

  const recordAnswer = (question: Question & { week: string }, correct: boolean) => setProgress((current) => {
    const previous = current.weekScores[question.week] ?? { correct: 0, total: 0 };
    const mistakes = correct
      ? current.mistakes.filter((id) => id !== question.id)
      : current.mistakes.includes(question.id) ? current.mistakes : [...current.mistakes, question.id];
    return markStudyDay({
      ...current,
      attempts: current.attempts + 1,
      correct: current.correct + (correct ? 1 : 0),
      mistakes,
      weekScores: { ...current.weekScores, [question.week]: { correct: previous.correct + (correct ? 1 : 0), total: previous.total + 1 } },
    });
  });

  const recordMock = (score: number, questions: (Question & { week: string })[], answers: Record<string, number>) => setProgress((current) => {
    const incorrect = questions.filter((question) => answers[question.id] !== question.correct_index).map((question) => question.id);
    const correctIds = questions.filter((question) => answers[question.id] === question.correct_index).map((question) => question.id);
    const mistakes = [...new Set([...current.mistakes.filter((id) => !correctIds.includes(id)), ...incorrect])];
    return markStudyDay({ ...current, attempts: current.attempts + 50, correct: current.correct + score, bestMock: Math.max(current.bestMock, score), completedSessions: current.completedSessions + 1, mistakes });
  });

  const resetProgress = () => {
    if (window.confirm("Reset all learned rules, scores, mistakes and bookmarks?")) setProgress(initialProgress);
  };

  const activeNav = useMemo(() => navItems.find((item) => item.id === view), [view]);

  if (loading) return <div className="app-loader"><div className="brand-mark"><span>R</span></div><div className="loader-road"><i /></div><p>Loading 640 bilingual questions…<small>প্রশ্নগুলো প্রস্তুত হচ্ছে</small></p></div>;
  if (loadError) return <div className="app-loader error"><Gauge /><h1>Questions could not be loaded</h1><p>Refresh the page or check that <code>questions.json</code> is available.</p><button className="btn btn-primary" onClick={() => window.location.reload()}>Reload application</button></div>;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <button className="mobile-menu" onClick={() => setMenuOpen((value) => !value)} aria-label="Open navigation">{menuOpen ? <X /> : <Menu />}</button>
          <button className="brand" onClick={() => navigate("home")}>
            <span className="brand-mark"><span>R</span><i /></span>
            <span><b>RoadReady</b><small>UK THEORY · বাংলা</small></span>
          </button>
          <nav className={menuOpen ? "open" : ""} aria-label="Main navigation">
            {navItems.map((item) => { const Icon = item.icon; return <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => navigate(item.id)}><Icon size={17} /><span>{item.label}<small>{item.bn}</small></span></button>; })}
          </nav>
          <div className="language-control" title="Question language"><Languages size={17} /><button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button><button className={language === "bn" ? "active" : ""} onClick={() => setLanguage("bn")}>বাং</button><button className={language === "both" ? "active" : ""} onClick={() => setLanguage("both")}>দুই</button></div>
        </div>
      </header>

      <main className="app-main">
        {view !== "home" && <div className="mobile-page-title"><span>{activeNav?.label}</span><small>{activeNav?.bn}</small></div>}
        {view === "home" && <Dashboard weeks={weeks} progress={progress} onNavigate={navigate} onReset={resetProgress} />}
        {view === "learn" && <LearnView weeks={weeks} language={language} learnedRules={progress.learnedRules} onToggleRule={toggleRule} />}
        {view === "practice" && <PracticeView weeks={weeks} language={language} bookmarks={progress.bookmarks} mistakes={progress.mistakes} onToggleBookmark={toggleBookmark} onAnswer={recordAnswer} />}
        {view === "mock" && <MockTestView weeks={weeks} language={language} onComplete={recordMock} />}
        {view === "numbers" && <NumbersView />}
        {view === "vocabulary" && <VocabularyView />}
        {view === "hazard" && <HazardView />}
      </main>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        {navItems.slice(0, 5).map((item) => { const Icon = item.icon; return <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => navigate(item.id)}><Icon /><span>{item.bn}</span></button>; })}
      </nav>
    </div>
  );
}
