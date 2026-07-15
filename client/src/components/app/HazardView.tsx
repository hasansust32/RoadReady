import { useEffect, useState } from "react";
import { CheckCircle2, Eye, MousePointerClick, Play, RotateCcw, TriangleAlert, XCircle } from "lucide-react";
import { hazardSteps, officialLinks } from "@/data/content";

function scoreClick(position: number) {
  if (position >= 45 && position < 52) return 5;
  if (position < 58 && position >= 45) return 4;
  if (position < 64 && position >= 45) return 3;
  if (position < 70 && position >= 45) return 2;
  if (position <= 76 && position >= 45) return 1;
  return 0;
}

export default function HazardView() {
  const [running, setRunning] = useState(false);
  const [timeline, setTimeline] = useState(0);
  const [clicks, setClicks] = useState<number[]>([]);
  const done = timeline >= 100;
  const score = clicks.reduce((best, click) => Math.max(best, scoreClick(click)), 0);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setTimeline((value) => {
      if (value >= 100) {
        setRunning(false);
        return 100;
      }
      return value + 1;
    }), 100);
    return () => window.clearInterval(timer);
  }, [running]);

  const start = () => { setTimeline(0); setClicks([]); setRunning(true); };
  const click = () => { if (running && clicks.length < 8) setClicks((values) => [...values, timeline]); };

  return (
    <div className="page-stack">
      <section className="page-intro hazard-intro"><div><span className="section-kicker">HAZARD PERCEPTION</span><h1>See it develop. Click at the right moment.</h1><p>Potential hazard এবং developing hazard-এর পার্থক্য বুঝে click timing অনুশীলন করুন।</p></div><div className="hazard-score-card"><strong>44<span>/75</span></strong><small>pass mark</small></div></section>

      <section className="hazard-simulator">
        <div className="sim-header"><div><span className="section-kicker">TIMING DEMO</span><h2>Cyclist approaching a junction</h2></div><span className="demo-label">Practice simulation · official clip নয়</span></div>
        <div className={`road-scene ${running ? "running" : ""}`}>
          <div className="scene-sky"><span className="cloud one" /><span className="cloud two" /></div>
          <div className="scene-houses"><i /><i /><i /></div>
          <div className="scene-road"><span className="lane-line a" /><span className="lane-line b" /><span className="lane-line c" /><span className="junction" /></div>
          <div className="scene-car"><span /><i /><i /></div>
          <div className="scene-cyclist" style={{ left: `${Math.min(78, 8 + timeline * 0.72)}%` }}><span className="bike-wheel w1" /><span className="bike-wheel w2" /><i className="bike-frame" /><b /></div>
          {!running && timeline === 0 && <button className="scene-start" onClick={start}><Play fill="currentColor" /> Start scene</button>}
          {done && <div className="scene-result">{score > 0 ? <CheckCircle2 /> : <XCircle />}<b>{score}/5 points</b><span>{score >= 4 ? "Great timing!" : score > 0 ? "You saw it—but try clicking earlier." : "Click when the cyclist begins to affect your path."}</span></div>}
        </div>
        <div className="timeline"><span className="timeline-fill" style={{ width: `${timeline}%` }} />{clicks.map((item, index) => <i key={`${item}-${index}`} style={{ left: `${item}%` }} title={`Click ${index + 1}`} />)}</div>
        <div className="sim-controls"><div><span className={`status-dot ${timeline >= 45 && timeline <= 76 ? "danger" : ""}`} /><b>{timeline < 25 ? "Scanning…" : timeline < 45 ? "Potential hazard" : timeline <= 76 ? "Developing hazard" : "Hazard passed"}</b><small>{clicks.length} click{clicks.length === 1 ? "" : "s"}</small></div>{running ? <button className="hazard-click" onClick={click}><MousePointerClick /> HAZARD · বিপদ</button> : <button className="btn btn-primary" onClick={start}>{done ? <RotateCcw size={17} /> : <Play size={17} />} {done ? "Try again" : "Start"}</button>}</div>
      </section>

      <section className="hazard-guide">
        <div><span className="section-kicker">CLICKING STRATEGY</span><h2>Potential is not yet developing</h2><p>A parked car is a potential hazard. It becomes developing when its door starts opening or it begins moving into your path.</p><p lang="bn">Park করা গাড়ি সম্ভাব্য বিপদ। দরজা খুলতে শুরু করলে বা আপনার পথে আসতে শুরু করলে সেটি developing hazard।</p></div>
        <div className="hazard-steps">{hazardSteps.map((step, index) => <div key={step.en}><span>{index + 1}</span><p><b>{step.en}</b><small lang="bn">{step.bn}</small></p></div>)}</div>
      </section>

      <section className="hazard-facts"><article><Eye /><strong>14 clips</strong><span>15 developing hazards; one clip contains two</span></article><article><TriangleAlert /><strong>Up to 5</strong><span>points per developing hazard</span></article><article><MousePointerClick /><strong>No patterns</strong><span>Excessive repeated clicking can score zero</span></article></section>

      <div className="official-practice"><CheckCircle2 /><p><b>Use official video clips too.</b><span>এই timing demo concept শেখায়; বাস্তব video practice-এর বিকল্প নয়।</span></p><a href={officialLinks[1].url} target="_blank" rel="noreferrer">Official practice</a></div>
    </div>
  );
}
