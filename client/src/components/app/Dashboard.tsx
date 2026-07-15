import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  CheckCircle2,
  Flame,
  Gauge,
  HeartPulse,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Timer,
  TriangleAlert,
} from "lucide-react";
import { essentialNumbers, officialLinks, weekMeta } from "@/data/content";
import type { SavedProgress, ViewName, WeekData } from "@/types";

interface Props {
  weeks: WeekData[];
  progress: SavedProgress;
  onNavigate: (view: ViewName) => void;
  onReset: () => void;
}

export default function Dashboard({ weeks, progress, onNavigate, onReset }: Props) {
  const accuracy = progress.attempts ? Math.round((progress.correct / progress.attempts) * 100) : 0;
  const learned = progress.learnedRules.length;
  const totalRules = weeks.reduce((sum, week) => sum + Object.keys(week.rules).length, 0);

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> আপনার bilingual study coach</div>
          <h1>Drive theory.<br /><span>Understand it.</span></h1>
          <p>
            640টি workbook MCQ, 160টি মূল নিয়ম, ২০২৬ CPR update এবং English–বাংলা
            explanation—এক জায়গায়। বাংলা দিয়ে বুঝুন, English দিয়ে test-ready হন।
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-large" onClick={() => onNavigate("practice")}>
              <Play size={18} fill="currentColor" /> Practice শুরু করুন
            </button>
            <button className="btn btn-ghost btn-large" onClick={() => onNavigate("learn")}>
              নিয়ম পড়ুন <ArrowRight size={18} />
            </button>
          </div>
          <div className="exam-note">
            <span className="live-dot" /> Real test: English, Welsh বা British Sign Language—বাংলা নয়
          </div>
        </div>
        <div className="hero-visual" aria-label="Theory test pass target">
          <div className="road-sign">
            <span>43</span>
            <small>PASS / 50</small>
          </div>
          <div className="road-lines"><i /><i /><i /></div>
          <div className="mini-stat stat-a"><Timer size={18} /><span><b>57</b> min</span></div>
          <div className="mini-stat stat-b"><TriangleAlert size={18} /><span><b>44</b> / 75</span></div>
        </div>
      </section>

      <section className="metric-grid" aria-label="Study progress">
        <div className="metric-card">
          <span className="metric-icon coral"><Target size={20} /></span>
          <div><small>Accuracy / সঠিক</small><strong>{accuracy}%</strong></div>
          <span className="metric-sub">{progress.correct}/{progress.attempts || 0} answered</span>
        </div>
        <div className="metric-card">
          <span className="metric-icon green"><BookOpenCheck size={20} /></span>
          <div><small>Rules learned</small><strong>{learned}/{totalRules}</strong></div>
          <span className="metric-sub">{Math.round((learned / totalRules) * 100)}% complete</span>
        </div>
        <div className="metric-card">
          <span className="metric-icon blue"><Gauge size={20} /></span>
          <div><small>Best mock</small><strong>{progress.bestMock}/50</strong></div>
          <span className="metric-sub">Pass target 43</span>
        </div>
        <div className="metric-card">
          <span className="metric-icon amber"><Flame size={20} /></span>
          <div><small>Study streak</small><strong>{progress.streak} day</strong></div>
          <span className="metric-sub">Keep the habit</span>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div><span className="section-kicker">YOUR STUDY ROUTE</span><h2>Choose how you want to learn</h2></div>
        </div>
        <div className="action-grid">
          <button className="action-card primary-action" onClick={() => onNavigate("practice")}>
            <span className="action-icon"><Brain size={25} /></span>
            <span><b>Smart practice</b><small>বিষয়, ভাষা ও প্রশ্নসংখ্যা বেছে নিন</small></span>
            <ArrowRight size={19} />
          </button>
          <button className="action-card" onClick={() => onNavigate("mock")}>
            <span className="action-icon purple"><Timer size={25} /></span>
            <span><b>57-minute mock</b><small>৫০ প্রশ্ন · পাস ৪৩ · flag & review</small></span>
            <ArrowRight size={19} />
          </button>
          <button className="action-card" onClick={() => onNavigate("hazard")}>
            <span className="action-icon amber"><TriangleAlert size={25} /></span>
            <span><b>Hazard trainer</b><small>Developing hazard click timing অনুশীলন</small></span>
            <ArrowRight size={19} />
          </button>
          <button className="action-card" onClick={() => onNavigate("vocabulary")}>
            <span className="action-icon green"><BookOpenCheck size={25} /></span>
            <span><b>English vocabulary</b><small>উচ্চারণ, বাংলা অর্থ ও keyword</small></span>
            <ArrowRight size={19} />
          </button>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div><span className="section-kicker">WEEKS 3–10</span><h2>Complete topic coverage</h2></div>
          <button className="text-button" onClick={() => onNavigate("learn")}>সব নিয়ম দেখুন <ArrowRight size={16} /></button>
        </div>
        <div className="week-grid">
          {weeks.filter((w) => w.week !== "2026").map((week) => {
            const meta = weekMeta[week.week];
            const weekLearned = Object.keys(week.rules).filter((id) => progress.learnedRules.includes(`${week.week}:${id}`)).length;
            return (
              <button key={week.week} className="week-card" onClick={() => onNavigate("learn")} style={{ "--week-accent": meta.accent } as React.CSSProperties}>
                <span className="week-number">W{week.week}</span>
                <span className="week-title"><b>{meta.short}</b><small>{meta.bn}</small></span>
                <span className="week-progress"><i style={{ width: `${(weekLearned / 20) * 100}%` }} /></span>
                <span className="week-count">{weekLearned}/20</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="split-panel">
        <div className="numbers-preview">
          <div className="section-heading compact">
            <div><span className="section-kicker">MEMORY ANCHORS</span><h2>Numbers you must know</h2></div>
            <button className="text-button" onClick={() => onNavigate("numbers")}>সব দেখুন</button>
          </div>
          <div className="number-row">
            {essentialNumbers.slice(0, 4).map((item) => (
              <div className="number-chip" key={item.value}><strong>{item.value}</strong><span>{item.bn}</span></div>
            ))}
          </div>
        </div>
        <div className="update-panel">
          <span className="update-icon"><HeartPulse /></span>
          <div><span className="section-kicker">NEW FOR 2026</span><h3>CPR + AED questions included</h3><p>প্রাপ্তবয়স্ক CPR depth ৫–৬ সেমি। Public AED যে কেউ ব্যবহার করতে পারেন।</p></div>
          <button className="circle-button" onClick={() => onNavigate("learn")} aria-label="Open 2026 update"><ArrowRight /></button>
        </div>
      </section>

      <footer className="dashboard-footer">
        <div>
          <CheckCircle2 size={17} /> Content checked against the workbook and current official guidance
          {officialLinks.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}</a>)}
        </div>
        {progress.attempts > 0 && <button className="reset-link" onClick={onReset}><RotateCcw size={14} /> Reset my progress</button>}
      </footer>
    </div>
  );
}
