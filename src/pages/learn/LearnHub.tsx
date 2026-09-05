import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, ChevronRight, Clock } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { BottomNav } from "../../components/BottomNav";
import { Chip } from "../../components/ui";
import { useStore, type DementiaStage } from "../../state/store";

const STAGE_FILTERS: (DementiaStage | "All")[] = ["All", "Early Stage", "Middle Stage", "Late Stage"];

const TAG_COLOR: Record<string, string> = {
  "Early Signs": "#a3123f",
  "Daily Care": "#0b6b62",
  Behavior: "#6b4bbd",
  Communication: "#1d4ed8",
  Safety: "#c2410c",
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
          <h1 className="text-[24px] font-semibold text-black">Learn</h1>
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
          className="relative flex items-center gap-3 overflow-hidden rounded-[14px] p-4 text-left"
          style={{ background: "linear-gradient(120deg, #eaf1ff 0%, #f1edff 55%, #eaf7f4 100%)" }}
        >
          <Sparkles size={18} className="mt-0.5 shrink-0 self-start text-[#5443e7]" />
          <div className="min-w-0 flex-1">
            <p
              className="text-[15px] font-semibold text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #1d4ed8 5%, #5443e7 50%, #0b6b62 95%)" }}
            >
              Ask a quick question
            </p>
            <p className="text-[12px] text-[#5c6069]">Answers from this library only</p>
          </div>
          <ChevronRight size={18} className="shrink-0 self-center text-[#5443e7]/60" />
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
            <p className="py-8 text-center text-[14px] text-[#9e9e9e]">No articles match that search.</p>
          )}
          {filtered.map((a) => {
            const tint = TAG_COLOR[a.tag] ?? "#818181";
            return (
              <button
                key={a.id}
                onClick={() => navigate(`/learn/${a.id}`)}
                className="flex flex-col gap-1.5 rounded-r-[10px] bg-white py-3.5 pl-4 pr-4 text-left"
                style={{ borderLeft: `4px solid ${tint}` }}
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: tint }}>
                  {a.tag}
                </span>
                <p className="text-[16px] font-semibold leading-tight text-black">{a.title}</p>
                <p className="text-[14px] leading-snug text-[#818181]">{a.summary}</p>
                <span className="mt-0.5 flex items-center gap-1 text-[11px] text-[#9e9e9e]">
                  <Clock size={11} /> {a.readMins} min read
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <BottomNav />
      <HomeIndicator />
    </PhoneShell>
  );
}
