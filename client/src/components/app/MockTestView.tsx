import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Flag,
  Gauge,
  RotateCcw,
  ShieldCheck,
  Timer,
  Trophy,
  XCircle,
} from "lucide-react";
import type { Language, Question, WeekData } from "@/types";

interface MockQuestion extends Question { week: string }

interface Props {
  weeks: WeekData[];
  language: Language;
  onComplete: (score: number, questions: MockQuestion[], answers: Record<string, number>) => void;
}

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

function createMock(weeks: WeekData[]) {
  const groups = new Map<string, MockQuestion[]>();
  weeks.forEach((week) => week.questions.forEach((question) => {
    const key = `${week.week}:${question.rule_id}`;
    groups.set(key, [...(groups.get(key) ?? []), { ...question, week: week.week }]);
  }));
  return shuffle([...groups.values()]).slice(0, 50).map((group) => shuffle(group)[0]);
}

export default function MockTestView({ weeks, language, onComplete }: Props) {
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [remaining, setRemaining] = useState(57 * 60);
  const [finished, setFinished] = useState(false);
  const reported = useRef(false);

  const score = useMemo(() => questions.filter((question) => answers[question.id] === question.correct_index).length, [questions, answers]);
  const unanswered = questions.filter((question) => answers[question.id] === undefined).length;

  useEffect(() => {
    if (!questions.length || finished) return;
    const timer = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          setFinished(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [questions.length, finished]);

  useEffect(() => {
    if (finished && questions.length && !reported.current) {
      reported.current = true;
      onComplete(score, questions, answers);
    }
  }, [finished, questions, score, answers, onComplete]);

  const start = () => {
    setQuestions(createMock(weeks));
    setCurrent(0);
    setAnswers({});
    setFlagged([]);
    setRemaining(57 * 60);
    setFinished(false);
    reported.current = false;
  };

  const submit = () => {
    if (unanswered && !window.confirm(`You still have ${unanswered} unanswered question(s). Submit now?`)) return;
    setFinished(true);
  };

  if (!questions.length) {
    return (
      <div className="page-stack narrow-page">
        <section className="page-intro mock-intro"><div><span className="section-kicker">EXAM SIMULATION</span><h1>Full 50-question mock test</h1><p>আসল পরীক্ষার মতো timer, question flag এবং শেষে pass/fail result।</p></div><span className="intro-art"><Timer /></span></section>
        <section className="mock-setup">
          <div className="mock-sign"><span>43</span><small>PASS MARK</small></div>
          <div className="mock-rules">
            <h2>Before you begin / শুরু করার আগে</h2>
            <div><span><Clock3 /></span><p><b>57 minutes</b><small>সময় শেষ হলে test নিজে submit হবে</small></p></div>
            <div><span><Gauge /></span><p><b>50 questions</b><small>প্রতিটি core rule থেকে সর্বোচ্চ একটি version</small></p></div>
            <div><span><ShieldCheck /></span><p><b>43 correct to pass</b><small>MCQ এবং hazard—দুই অংশ আলাদাভাবে pass করতে হয়</small></p></div>
            <div className="notice"><strong>Best preparation:</strong> প্রথমে bilingual mode-এ practice করুন, পরে mock test শুধু English-এ দিন।</div>
            <button className="btn btn-primary btn-large" onClick={start}>Begin mock test <ArrowRight size={18} /></button>
          </div>
        </section>
      </div>
    );
  }

  if (finished) {
    const passed = score >= 43;
    const percent = Math.round((score / 50) * 100);
    return (
      <div className="result-page mock-result">
        <div className={`result-orb ${passed ? "pass" : "fail"}`}>{passed ? <Trophy /> : <Gauge />}<strong>{score}/50</strong></div>
        <span className="section-kicker">MOCK TEST RESULT</span>
        <h1>{passed ? "Passed — অভিনন্দন!" : "Not yet — আরেকটু revision দরকার"}</h1>
        <p>{passed ? "You reached the official MCQ pass mark of 43." : `You need ${43 - score} more correct answer${43 - score === 1 ? "" : "s"} to reach the 43/50 target.`}</p>
        <div className="result-stats"><div><strong>{score}</strong><span>Correct</span></div><div><strong>{50 - score}</strong><span>Incorrect</span></div><div><strong>{percent}%</strong><span>Score</span></div><div><strong>{Math.floor((57 * 60 - remaining) / 60)}m</strong><span>Used</span></div></div>
        <div className="review-strip"><CheckCircle2 /> ভুল প্রশ্নগুলো আপনার Mistakes deck-এ যোগ হয়েছে। Smart Practice থেকে আবার দিন।</div>
        <div className="result-actions"><button className="btn btn-primary" onClick={start}><RotateCcw size={17} /> New mock</button><button className="btn btn-ghost" onClick={() => setQuestions([])}><ArrowLeft size={17} /> Mock overview</button></div>
      </div>
    );
  }

  const question = questions[current];
  const minutes = Math.floor(remaining / 60).toString().padStart(2, "0");
  const seconds = (remaining % 60).toString().padStart(2, "0");
  const selected = answers[question.id];
  const isFlagged = flagged.includes(question.id);

  return (
    <div className="mock-shell">
      <div className="mock-bar">
        <button className="icon-button" onClick={() => { if (window.confirm("Exit this mock test? Your answers will be lost.")) setQuestions([]); }}><ArrowLeft /></button>
        <div><span>UK THEORY MOCK</span><b>Question {current + 1} of 50</b></div>
        <div className={`mock-timer ${remaining < 300 ? "urgent" : ""}`}><Clock3 size={18} /><b>{minutes}:{seconds}</b></div>
      </div>
      <div className="mock-layout">
        <article className="question-card mock-question">
          <header><span className="question-topic">W{question.week} · Question {current + 1}</span><button className={`flag-button ${isFlagged ? "active" : ""}`} onClick={() => setFlagged((items) => isFlagged ? items.filter((id) => id !== question.id) : [...items, question.id])}><Flag size={17} fill={isFlagged ? "currentColor" : "none"} /> {isFlagged ? "Flagged" : "Flag"}</button></header>
          <div className="question-copy">
            {language !== "bn" && <h2>{question.question_en}</h2>}
            {language !== "en" && <p lang="bn">{question.question_bn}</p>}
          </div>
          <div className="answer-list compact-options">
            {question.options.map((option, optionIndex) => {
              const [en, bn] = option.split(" — ");
              return <button key={optionIndex} className={`answer-option ${selected === optionIndex ? "selected" : ""}`} onClick={() => setAnswers((value) => ({ ...value, [question.id]: optionIndex }))}><span className="answer-letter">{String.fromCharCode(65 + optionIndex)}</span><span>{language !== "bn" && <b>{en}</b>}{language !== "en" && <small lang="bn">{bn ?? en}</small>}</span>{selected === optionIndex && <CheckCircle2 className="answer-state" />}</button>;
            })}
          </div>
          <div className="mock-question-footer"><button className="btn btn-ghost" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)}><ArrowLeft size={17} /> Previous</button>{current === 49 ? <button className="btn btn-primary" onClick={submit}>Submit test</button> : <button className="btn btn-primary" onClick={() => setCurrent((value) => value + 1)}>Next <ArrowRight size={17} /></button>}</div>
        </article>
        <aside className="question-map">
          <div><h3>Question map</h3><span>{50 - unanswered}/50 answered</span></div>
          <div className="map-grid">{questions.map((item, itemIndex) => <button key={item.id} className={`${current === itemIndex ? "current" : ""} ${answers[item.id] !== undefined ? "answered" : ""} ${flagged.includes(item.id) ? "flagged" : ""}`} onClick={() => setCurrent(itemIndex)}>{itemIndex + 1}</button>)}</div>
          <div className="map-key"><span><i className="answered" />Answered</span><span><i className="flagged" />Flagged</span><span><i />Empty</span></div>
          <button className="btn btn-primary submit-wide" onClick={submit}>Submit test</button>
          {unanswered > 0 && <p>{unanswered} unanswered question{unanswered === 1 ? "" : "s"}</p>}
        </aside>
      </div>
    </div>
  );
}
