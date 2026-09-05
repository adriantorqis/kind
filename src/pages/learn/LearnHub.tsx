import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, Play, BookOpen, CheckCircle2 } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { BottomNav } from "../../components/BottomNav";
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
  const { articles, selectedRecipient, symptomLogs, completedLearnIds } = useStore();
  const [stageFilter, setStageFilter] = useState<DementiaStage | "All">(selectedRecipient?.stage ?? "All");
  const [kindFilter, setKindFilter] = useState<"All" | "article" | "video">("All");
  const [query, setQuery] = useState("");

  const forYou = useMemo(() => {
    const lastSymptom = symptomLogs[0];
    const bySymptom = lastSymptom ? articles.find((a) => a.symptoms.includes(lastSymptom.symptom)) : undefined;
    const byStage = selectedRecipient ? articles.find((a) => a.stages.includes(selectedRecipient.stage)) : undefined;
    const pick = bySymptom ?? byStage ?? articles[0];
    const why = bySymptom
      ? `Based on the ${lastSymptom!.symptom.toLowerCase()} you logged`
      : selectedRecipient
        ? `Common in the ${selectedRecipient.stage.replace(" Stage", "").toLowerCase()} stage`
        : "Worth starting here";
    return pick ? { pick, why } : null;
  }, [articles, symptomLogs, selectedRecipient]);

  const doneCount = completedLearnIds.length;
  const pct = articles.length > 0 ? Math.round((doneCount / articles.length) * 100) : 0;

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const stageOk = stageFilter === "All" || a.stages.includes(stageFilter);
      const kindOk = kindFilter === "All" || a.kind === kindFilter;
      const q = query.trim().toLowerCase();
      const queryOk =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.symptoms.some((s) => s.toLowerCase().includes(q));
      return stageOk && kindOk && queryOk;
    });
  }, [articles, stageFilter, kindFilter, query]);

  return (
    <PhoneShell noScroll gradient="from-[#0b6b62] to-[#0a5951]" statusBarLight>
      <div className="flex shrink-0 flex-col gap-3.5 px-6 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/55">Informed Caregiving</p>
            <h1 className="text-[24px] font-semibold tracking-tight text-white">Learn</h1>
          </div>
          <button
            onClick={() => navigate("/learn/assistant")}
            className="mt-1 flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-white"
          >
            <Sparkles size={12} /> Ask AI
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-white transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="shrink-0 text-[11px] font-medium text-white/65">
            {doneCount}/{articles.length} done
          </span>
        </div>

        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/45" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or ask a question..."
            className="w-full rounded-[12px] bg-white/12 py-2.5 pl-10 pr-4 text-[14px] text-white outline-none placeholder:text-white/45"
          />
        </div>
        {query.trim().length > 1 && (
          <button
            onClick={() => navigate("/learn/assistant", { state: { prefillQuery: query } })}
            className="-mt-1.5 flex items-center gap-1.5 self-start text-[12px] font-medium text-white/75"
          >
            <Sparkles size={12} /> Ask Kind AI: &ldquo;{query}&rdquo;
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto no-scrollbar rounded-t-[22px] bg-[#faf7f0] px-6 pb-4 pt-5">
        {forYou && (
          <button
            onClick={() => navigate(`/learn/${forYou.pick.id}`)}
            className="flex flex-col gap-2 rounded-[12px] p-4 text-left text-white"
            style={{ backgroundColor: TAG_COLOR[forYou.pick.tag] ?? "#0b6b62" }}
          >
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.07em] text-white/70">
              {forYou.pick.kind === "video" ? <Play size={11} /> : <BookOpen size={11} />}
              Today's focus · {forYou.why}
            </span>
            <p className="text-[20px] font-semibold leading-tight">{forYou.pick.title}</p>
            <span className="mt-0.5 flex w-fit items-center gap-1.5 rounded-full border border-white/40 px-3 py-1.5 text-[12px] font-semibold">
              Do this: {forYou.pick.actionSteps[0]}
            </span>
          </button>
        )}

        <div className="flex items-center justify-between border-b border-[#e9e4d6] pb-0">
          <div className="flex gap-4 overflow-x-auto no-scrollbar text-[13px]">
            {STAGE_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStageFilter(s)}
                className={`shrink-0 whitespace-nowrap pb-2.5 ${
                  stageFilter === s
                    ? "border-b-2 border-[#0b6b62] font-semibold text-[#0b6b62]"
                    : "font-medium text-[#a39c8a]"
                }`}
              >
                {s === "All" ? "All Stages" : s.replace(" Stage", "")}
              </button>
            ))}
          </div>
          <div className="flex shrink-0 gap-1 pb-2">
            <button
              aria-label="Articles only"
              aria-pressed={kindFilter === "article"}
              onClick={() => setKindFilter((k) => (k === "article" ? "All" : "article"))}
              className={`flex size-7 items-center justify-center rounded-[7px] ${
                kindFilter === "article" ? "bg-[#0b6b62] text-white" : "text-[#b5ac9a]"
              }`}
            >
              <BookOpen size={14} />
            </button>
            <button
              aria-label="Videos only"
              aria-pressed={kindFilter === "video"}
              onClick={() => setKindFilter((k) => (k === "video" ? "All" : "video"))}
              className={`flex size-7 items-center justify-center rounded-[7px] ${
                kindFilter === "video" ? "bg-[#0b6b62] text-white" : "text-[#b5ac9a]"
              }`}
            >
              <Play size={14} />
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-8 text-center text-[14px] text-[#a39c8a]">Nothing matches that search.</p>
        ) : (
          <div className="overflow-hidden rounded-[14px] bg-white">
            {filtered.map((a, i) => {
              const tint = TAG_COLOR[a.tag] ?? "#818181";
              const done = completedLearnIds.includes(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => navigate(`/learn/${a.id}`)}
                  className={`flex w-full items-center gap-3 px-4 py-3.5 text-left ${i !== 0 ? "border-t border-[#f1ede2]" : ""}`}
                >
                  <span className="h-9 w-[3px] shrink-0 rounded-full" style={{ backgroundColor: tint }} />
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: tint }}>
                      {a.tag} · {a.readMins} min
                    </span>
                    <p className="mt-0.5 truncate text-[15px] font-semibold leading-tight text-[#241f14]">{a.title}</p>
                    <p className="mt-0.5 truncate text-[12px] text-[#8b8575]">Do: {a.actionSteps[0]}</p>
                  </div>
                  {done ? (
                    <CheckCircle2 size={16} className="shrink-0 text-[#0b6b62]" />
                  ) : (
                    <span className="shrink-0 text-[#c7c0ac]">{a.kind === "video" ? <Play size={15} /> : <BookOpen size={15} />}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav />
      <HomeIndicator />
    </PhoneShell>
  );
}
