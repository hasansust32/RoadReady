import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Lightbulb,
  RefreshCw,
  Settings2,
  Shuffle,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import { weekMeta } from "@/data/content";
import type { Language, Question, WeekData } from "@/types";

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

interface QuestionWithWeek extends Question { week: string }

interface Props {
  weeks: WeekData[];
  language: Language;
  bookmarks: string[];
  mistakes: string[];
  onToggleBookmark: (id: string) => void;
  onAnswer: (question: QuestionWithWeek, correct: boolean) => void;
}

export default function PracticeView({ weeks, language, bookmarks, mistakes, onToggleBookmark, onAnswer }: Props) {
  const [topic, setTopic] = useState("all");
  const [count, setCount] = useState(20);
  const [source, setSource] = useState<"all" | "mistakes" | "bookmarks">("all");
  const [session, setSession] = useState<QuestionWithWeek[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const pool = useMemo(() => weeks.flatMap((week) => week.questions.map((question) => ({ ...question, week: week.week }))), [weeks]);

  const available = pool.filter((question) => {
    if (topic !== "all" && question.week !== topic) return false;
    if (source === "mistakes" && !mistakes.includes(question.id)) return false;
    if (source === "bookmarks" && !bookmarks.includes(question.id)) return false;
    return true;
  });

  const start = () => {
    setSession(shuffle(available).slice(0, Math.min(count, available.length)));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const question = session[index];
  const week = question ? weeks.find((item) => item.week === question.week) : undefined;
  const rule = question && week ? week.rules[question.rule_id] : undefined;

  const answer = (option: number) => {
    if (selected !== null) return;
    setSelected(option);
    const correct = option === question.correct_index;
    if (correct) setScore((value) => value + 1);
    onAnswer(question, correct);
  };

  const next = () => {
    if (index === session.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  };

  if (!session.length) {
    return (
      <div className="page-stack narrow-page">
        <section className="page-intro practice-intro"><div><span className="section-kicker">SMART PRACTICE</span><h1>Build your own practice set</h1><p>আপনার দুর্বলতা অনুযায়ী topic, language mode ও প্রশ্নসংখ্যা বেছে নিন।</p></div><span className="intro-art"><Settings2 /></span></section>
        <section className="setup-card">
          <div className="setup-section"><label>1. Question source / প্রশ্নের ধরন</label><div className="segmented wide">
            <button className={source === "all" ? "active" : ""} onClick={() => setSource("all")}>All questions <small>সব প্রশ্ন</small></button>
            <button className={source === "mistakes" ? "active" : ""} onClick={() => setSource("mistakes")}>My mistakes <small>{mistakes.length} saved</small></button>
            <button className={source === "bookmarks" ? "active" : ""} onClick={() => setSource("bookmarks")}>Bookmarks <small>{bookmarks.length} saved</small></button>
          </div></div>
          <div className="setup-section"><label>2. Topic / বিষয়</label><div className="topic-picker">
            <button className={topic === "all" ? "active" : ""} onClick={() => setTopic("all")}><Shuffle size={18} /><span><b>Mixed topics</b><small>সব week থেকে</small></span></button>
            {weeks.map((item) => <button key={item.week} className={topic === item.week ? "active" : ""} onClick={() => setTopic(item.week)}><span className="tiny-week" style={{ background: weekMeta[item.week].accent }}>{item.week === "2026" ? "NEW" : `W${item.week}`}</span><span><b>{weekMeta[item.week].short}</b><small>{weekMeta[item.week].shortBn}</small></span></button>)}
          </div></div>
          <div className="setup-section"><label>3. Number of questions / প্রশ্নসংখ্যা</label><div className="count-picker">{[10, 20, 40, 80].map((item) => <button key={item} className={count === item ? "active" : ""} onClick={() => setCount(item)}><b>{item}</b><small>questions</small></button>)}</div></div>
          {available.length === 0 ? <div className="notice warning"><CircleAlert size={18} />এই source-এ এখন কোনো প্রশ্ন নেই। আগে practice করে mistake বা bookmark save করুন।</div> : <div className="setup-footer"><div><Target /><span><b>{Math.min(count, available.length)} questions ready</b><small>Instant feedback + rule explanation</small></span></div><button className="btn btn-primary btn-large" onClick={start}>Start practice <ArrowRight size={18} /></button></div>}
        </section>
      </div>
    );
  }

  if (finished) {
    const percent = Math.round((score / session.length) * 100);
    return (
      <div className="result-page">
        <div className={`result-orb ${percent >= 86 ? "pass" : ""}`}><Trophy /><strong>{percent}%</strong></div>
        <span className="section-kicker">SESSION COMPLETE</span>
        <h1>{percent >= 86 ? "Excellent—test-ready pace!" : percent >= 70 ? "Good progress—review weak rules" : "Keep building your foundation"}</h1>
        <p lang="bn">আপনি {session.length}টির মধ্যে {score}টি সঠিক উত্তর দিয়েছেন। ভুল প্রশ্নগুলো স্বয়ংক্রিয়ভাবে Mistakes-এ রাখা হয়েছে।</p>
        <div className="result-stats"><div><strong>{score}</strong><span>Correct</span></div><div><strong>{session.length - score}</strong><span>Review</span></div><div><strong>{percent}%</strong><span>Accuracy</span></div></div>
        <div className="result-actions"><button className="btn btn-primary" onClick={start}><RefreshCw size={17} /> Try another set</button><button className="btn btn-ghost" onClick={() => setSession([])}><Settings2 size={17} /> Change setup</button></div>
      </div>
    );
  }

  const chosenCorrectly = selected === question.correct_index;
  return (
    <div className="quiz-shell">
      <div className="quiz-topbar">
        <button className="icon-button" onClick={() => setSession([])} aria-label="Exit practice"><ArrowLeft /></button>
        <div className="quiz-progress"><div><span>Practice</span><b>{index + 1} / {session.length}</b></div><span><i style={{ width: `${((index + (selected !== null ? 1 : 0)) / session.length) * 100}%` }} /></span></div>
        <div className="live-score"><CheckCircle2 size={17} /> {score}</div>
      </div>

      <article className="question-card">
        <header>
          <span className="question-topic" style={{ color: weekMeta[question.week].accent }}>W{question.week} · {weekMeta[question.week].short}</span>
          <button className={`bookmark-button ${bookmarks.includes(question.id) ? "saved" : ""}`} onClick={() => onToggleBookmark(question.id)} aria-label="Bookmark question"><Bookmark size={20} fill={bookmarks.includes(question.id) ? "currentColor" : "none"} /></button>
        </header>
        <div className="question-copy">
          {language !== "bn" && <h2>{question.question_en}</h2>}
          {language !== "en" && <p lang="bn">{question.question_bn}</p>}
        </div>
        <div className="answer-list">
          {question.options.map((option, optionIndex) => {
            const [en, bn] = option.split(" — ");
            const correct = optionIndex === question.correct_index;
            const wrongSelection = selected === optionIndex && !correct;
            const state = selected !== null && correct ? "correct" : wrongSelection ? "wrong" : "";
            return (
              <button key={optionIndex} className={`answer-option ${state}`} disabled={selected !== null} onClick={() => answer(optionIndex)}>
                <span className="answer-letter">{String.fromCharCode(65 + optionIndex)}</span>
                <span>{language !== "bn" && <b>{en}</b>}{language !== "en" && <small lang="bn">{bn ?? en}</small>}</span>
                {state === "correct" && <CheckCircle2 className="answer-state" />}{state === "wrong" && <XCircle className="answer-state" />}
              </button>
            );
          })}
        </div>

        {selected !== null && rule && (
          <div className={`feedback-card ${chosenCorrectly ? "positive" : "negative"}`}>
            <div className="feedback-title">{chosenCorrectly ? <CheckCircle2 /> : <Lightbulb />}<span><b>{chosenCorrectly ? "Correct — ভালো করেছেন!" : "Review this rule"}</b><small>{rule.title}</small></span></div>
            {language !== "bn" && <p>{rule.explanation_en}</p>}
            {language !== "en" && <p lang="bn">{rule.explanation_bn}</p>}
          </div>
        )}
      </article>

      <div className="quiz-footer">
        <span>{selected === null ? "Choose the safest legal answer · সবচেয়ে নিরাপদ আইনসম্মত উত্তর বাছুন" : `${score}/${index + 1} correct so far`}</span>
        <button className="btn btn-primary" disabled={selected === null} onClick={next}>{index === session.length - 1 ? "Finish" : "Next question"} <ChevronRight size={18} /></button>
      </div>
    </div>
  );
}
