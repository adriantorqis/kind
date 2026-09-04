import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, ChevronRight, Clock } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { BottomNav } from "../../components/BottomNav";
import { Chip } from "../../components/ui";
import { useStore, type DementiaStage } from "../../state/store";

const STAGE_FILTERS: (DementiaStage | "All")[] = ["All", "Early Stage", "Middle Stage", "Late Stage"];

const TAG_COLOR: Record<string, string> = {
  "Early Signs": "text-[#a3123f] bg-[#f7dde5]",
  "Daily Care": "text-[#0b6b62] bg-[#d8ebe8]",
  Behavior: "text-[#6b4bbd] bg-[#e5e0f6]",
  Communication: "text-[#1d4ed8] bg-[#dbeafe]",
  Safety: "text-[#c2410c] bg-[#ffedd4]",
};

export default function LearnHub() {
  const navigate = useNavigate();
  const { articles, selectedRecipient } = useStore();
  const [stageFilter, setStageFilter] = useState<DementiaStage | "All">(selectedRecipient?.stage ?? "All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const stageOk = stageFilter === "All" || a.stages.includes(stageFilter);
      const q = query.trim().toLowerCase();
      const queryOk =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.symptoms.some((s) => s.toLowerCase().includes(q));
      return stageOk && queryOk;
    });
  }, [articles, stageFilter, query]);

  return (
    <PhoneShell noScroll gradient="from-[#f0fdfa] to-[#e0f5f1]">
      <div className="flex shrink-0 flex-col gap-3 px-6 pt-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-[#0b6b62]">Informed Caregiving</p>
          <h1 className="text-[22px] font-semibold text-black">Learn</h1>
        </div>
        <div className="flex items-center gap-2 rounded-[14px] bg-white px-4 py-3">
          <Search size={18} className="text-[#9e9e9e]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a symptom or topic..."
            className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#acb3bb]"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto no-scrollbar px-6 py-4">
        <button
          onClick={() => navigate("/learn/assistant")}
          className="flex items-center gap-3 rounded-[14px] border-2 border-[#0b6b62]/30 bg-white p-4 text-left"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#d8ebe8] text-[#0b6b62]">
            <Sparkles size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-black">Ask a quick question</p>
            <p className="text-[12px] text-[#818181]">AI-assisted, answers from this library only</p>
          </div>
          <ChevronRight size={20} className="text-[#c4c4c4]" />
        </button>

        <div className="flex shrink-0 gap-2 overflow-x-auto no-scrollbar">
          {STAGE_FILTERS.map((s) => (
            <Chip key={s} selected={stageFilter === s} onClick={() => setStageFilter(s)}>
              {s === "All" ? "All Stages" : s.replace(" Stage", "")}
            </Chip>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {filtered.length === 0 && (
            <p className="py-8 text-center text-[13px] text-[#9e9e9e]">No articles match that search.</p>
          )}
          {filtered.map((a) => (
            <button
              key={a.id}
              onClick={() => navigate(`/learn/${a.id}`)}
              className="flex flex-col gap-2 rounded-[14px] bg-white p-4 text-left"
            >
              <span className={`w-fit rounded-[4px] px-2 py-0.5 text-[10px] font-semibold ${TAG_COLOR[a.tag]}`}>
                {a.tag}
              </span>
              <p className="text-[15px] font-semibold leading-tight text-black">{a.title}</p>
              <p className="text-[13px] leading-snug text-[#818181]">{a.summary}</p>
              <span className="flex items-center gap-1 text-[11px] text-[#9e9e9e]">
                <Clock size={11} /> {a.readMins} min read
              </span>
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
      <HomeIndicator />
    </PhoneShell>
  );
}
