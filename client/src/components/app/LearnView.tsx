import { useMemo, useState } from "react";
import { Check, CheckCircle2, ChevronDown, Search, Sparkles } from "lucide-react";
import { weekMeta } from "@/data/content";
import type { Language, WeekData } from "@/types";

interface Props {
  weeks: WeekData[];
  language: Language;
  learnedRules: string[];
  onToggleRule: (key: string) => void;
}

export default function LearnView({ weeks, language, learnedRules, onToggleRule }: Props) {
  const [selectedWeek, setSelectedWeek] = useState("3");
  const [search, setSearch] = useState("");
  const [openRule, setOpenRule] = useState<string | null>(null);
  const week = weeks.find((item) => item.week === selectedWeek) ?? weeks[0];
  const meta = weekMeta[week.week];

  const rules = useMemo(() => Object.entries(week.rules).filter(([, rule]) => {
    const haystack = `${rule.title} ${rule.explanation_en} ${rule.explanation_bn}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  }), [week, search]);

  const learnedThisWeek = Object.keys(week.rules).filter((id) => learnedRules.includes(`${week.week}:${id}`)).length;

  return (
    <div className="page-stack">
      <section className="page-intro learn-intro">
        <div><span className="section-kicker">160 CORE RULES + 2026 UPDATE</span><h1>Learn the rule, then remember the English</h1><p>বাংলায় concept বুঝুন। এরপর English keyword দেখে নিজে নিয়মটি বলার চেষ্টা করুন।</p></div>
        <div className="intro-progress"><strong>{learnedRules.length}</strong><span>rules learned<br />নিয়ম শেখা</span></div>
      </section>

      <div className="study-layout">
        <aside className="topic-sidebar">
          <label className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search rule / নিয়ম খুঁজুন" /></label>
          <div className="topic-list">
            {weeks.map((item) => {
              const itemMeta = weekMeta[item.week];
              const count = Object.keys(item.rules).filter((id) => learnedRules.includes(`${item.week}:${id}`)).length;
              return (
                <button key={item.week} className={selectedWeek === item.week ? "active" : ""} onClick={() => { setSelectedWeek(item.week); setOpenRule(null); }}>
                  <span className="topic-badge" style={{ background: itemMeta.accent }}>{item.week === "2026" ? <Sparkles size={14} /> : item.week}</span>
                  <span><b>{itemMeta.short}</b><small>{itemMeta.shortBn}</small></span>
                  <em>{count}/{Object.keys(item.rules).length}</em>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="rules-panel">
          <div className="rules-header">
            <div className="rules-title"><span className="large-week" style={{ color: meta.accent }}>{week.week === "2026" ? "NEW" : `W${week.week}`}</span><div><h2>{week.title}</h2><p>{meta.bn}</p></div></div>
            <div className="rule-progress"><span><i style={{ width: `${(learnedThisWeek / Object.keys(week.rules).length) * 100}%`, background: meta.accent }} /></span><b>{learnedThisWeek}/{Object.keys(week.rules).length}</b></div>
          </div>

          {rules.length === 0 ? (
            <div className="empty-state"><Search /><h3>কোনো matching rule পাওয়া যায়নি</h3><button className="btn btn-ghost" onClick={() => setSearch("")}>Clear search</button></div>
          ) : (
            <div className="rule-list">
              {rules.map(([id, rule], index) => {
                const key = `${week.week}:${id}`;
                const done = learnedRules.includes(key);
                const isOpen = openRule === key;
                return (
                  <article className={`rule-card ${done ? "done" : ""} ${isOpen ? "open" : ""}`} key={key}>
                    <button className="rule-main" onClick={() => setOpenRule(isOpen ? null : key)} aria-expanded={isOpen}>
                      <span className="rule-index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="rule-copy">
                        <b>{rule.title}</b>
                        {(language === "both" || language === "bn") && <span lang="bn">{rule.explanation_bn}</span>}
                        {language === "en" && <span>{rule.explanation_en}</span>}
                      </span>
                      <ChevronDown className="rule-chevron" size={19} />
                    </button>
                    {isOpen && (
                      <div className="rule-detail">
                        {language !== "bn" && <div><small>ENGLISH RULE</small><p>{rule.explanation_en}</p></div>}
                        {language !== "en" && <div lang="bn"><small>বাংলা ব্যাখ্যা</small><p>{rule.explanation_bn}</p></div>}
                        <button className={`learn-button ${done ? "learned" : ""}`} onClick={() => onToggleRule(key)}>
                          {done ? <><CheckCircle2 size={17} /> শেখা হয়েছে · Learned</> : <><Check size={17} /> Mark as learned</>}
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
