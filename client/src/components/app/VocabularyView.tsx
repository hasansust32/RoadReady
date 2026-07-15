import { useMemo, useState } from "react";
import { BookOpenCheck, Search, Volume2 } from "lucide-react";
import { vocabulary } from "@/data/content";

export default function VocabularyView() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [flipped, setFlipped] = useState<string[]>([]);
  const categories = ["All", ...new Set(vocabulary.map((item) => item[3]))];
  const filtered = useMemo(() => vocabulary.filter((item) => (category === "All" || item[3] === category) && `${item[0]} ${item[1]} ${item[2]}`.toLowerCase().includes(search.toLowerCase())), [category, search]);

  return (
    <div className="page-stack">
      <section className="page-intro vocab-intro"><div><span className="section-kicker">ENGLISH → বাংলা</span><h1>Driving theory vocabulary deck</h1><p>শব্দে click করে বাংলা অর্থ দেখুন। উচ্চারণটি কয়েকবার জোরে বলুন।</p></div><span className="intro-art"><BookOpenCheck /></span></section>
      <section className="filter-bar"><label className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search English or বাংলা…" /></label><div className="filter-scroll">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div></section>
      <div className="vocab-count"><b>{filtered.length}</b> terms · card-এ click করে flip করুন</div>
      <section className="vocab-grid">
        {filtered.map((item) => {
          const isFlipped = flipped.includes(item[0]);
          return <button key={item[0]} className={`vocab-card ${isFlipped ? "flipped" : ""}`} onClick={() => setFlipped((values) => isFlipped ? values.filter((value) => value !== item[0]) : [...values, item[0]])}>
            <span className="vocab-category">{item[3]}</span>
            {!isFlipped ? <><strong>{item[0]}</strong><span className="pronounce"><Volume2 size={15} /> {item[1]}</span><small>বাংলা অর্থ দেখতে click করুন</small></> : <><strong lang="bn">{item[2]}</strong><span className="english-return">{item[0]} · {item[1]}</span><small>English দেখতে আবার click করুন</small></>}
          </button>;
        })}
      </section>
      {!filtered.length && <div className="empty-state"><Search /><h3>No vocabulary found</h3><button className="btn btn-ghost" onClick={() => { setSearch(""); setCategory("All"); }}>Clear filters</button></div>}
    </div>
  );
}
