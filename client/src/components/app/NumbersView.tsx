import { useState } from "react";
import { ArrowRight, Brain, Check, Gauge, RotateCcw, Ruler, Timer } from "lucide-react";
import { essentialNumbers } from "@/data/content";

const stops = [
  { speed: 20, thinking: 6, braking: 6, total: 12 },
  { speed: 30, thinking: 9, braking: 14, total: 23 },
  { speed: 40, thinking: 12, braking: 24, total: 36 },
  { speed: 50, thinking: 15, braking: 38, total: 53 },
  { speed: 60, thinking: 18, braking: 55, total: 73 },
  { speed: 70, thinking: 21, braking: 75, total: 96 },
];

export default function NumbersView() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="page-stack">
      <section className="page-intro numbers-intro"><div><span className="section-kicker">ESSENTIAL NUMBERS</span><h1>Memorise the numbers that win marks</h1><p>এই সংখ্যাগুলো প্রতিদিন ৩ মিনিট জোরে বলুন। Sequence মনে রাখুন, শুধু আলাদা answer নয়।</p></div><span className="intro-art"><Gauge /></span></section>

      <section className="stopping-card">
        <div className="section-heading compact"><div><span className="section-kicker">STOPPING DISTANCES</span><h2>12 · 23 · 36 · 53 · 73 · 96</h2></div><span className="legend"><i className="thinking" />Thinking <i className="braking" />Braking</span></div>
        <div className="stop-chart">
          {stops.map((item) => <div className="stop-row" key={item.speed}><b>{item.speed}<small>mph</small></b><div className="stop-bar"><span className="thinking" style={{ width: `${item.thinking}%` }}>{item.thinking}m</span><span className="braking" style={{ width: `${item.braking}%` }}>{item.braking}m</span></div><strong>{item.total}m</strong></div>)}
        </div>
        <p className="chart-note"><Ruler size={16} /> এগুলো typical dry-road distance; খারাপ weather, tyre বা driver condition-এ distance আরও বাড়ে।</p>
      </section>

      <section className="number-cards-grid">
        {essentialNumbers.map((item, index) => <article className="reference-card" key={item.value}><span className="ref-index">{String(index + 1).padStart(2, "0")}</span><strong>{item.value}</strong><b>{item.en}</b><p lang="bn">{item.bn}</p><small>{item.memory}</small></article>)}
      </section>

      <section className="memory-test">
        <span className="memory-icon"><Brain /></span>
        <div><span className="section-kicker">30-SECOND RECALL</span><h3>What are the dry, wet and icy following gaps?</h3><p>শুকনা, ভেজা ও বরফে কত following gap রাখবেন?</p>{revealed && <div className="memory-answer"><Check /> Dry 2 seconds · Wet 4 seconds · Ice up to 10× longer</div>}</div>
        <button className="btn btn-primary" onClick={() => setRevealed((value) => !value)}>{revealed ? <><RotateCcw size={16} /> Hide answer</> : <>Reveal answer <ArrowRight size={16} /></>}</button>
      </section>
    </div>
  );
}
