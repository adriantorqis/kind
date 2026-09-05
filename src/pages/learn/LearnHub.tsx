import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, ChevronRight, Play, BookOpen, CheckCircle2 } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { BottomNav } from "../../components/BottomNav";
import { Chip } from "../../components/ui";
import { useStore, type DementiaStage } from "../../state/store";

const STAGE_FILTERS: (DementiaStage | "All")[] = ["All", "Early Stage", "Middle Stage", "Late Stage"];
const TYPE_FILTERS = ["All", "Articles", "Videos"] as const;

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
  const [typeFilter, setTypeFilter] = useState<(typeof TYPE_FILTERS)[number]>("All");
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

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const stageOk = stageFilter === "All" || a.stages.includes(stageFilter);
      const typeOk = typeFilter === "All" || (typeFilter === "Videos" ? a.kind === "video" : a.kind === "article");
      const q = query.trim().toLowerCase();
      const queryOk =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.symptoms.some((s) => s.toLowerCase().includes(q));
      return stageOk && typeOk && queryOk;
    });
  }, [articles, stageFilter, typeFilter, query]);

  return (
    <PhoneShell noScroll gradient="from-[#f0fdfa] to-[#e0f5f1]">
      <div className="flex shrink-0 flex-col gap-3 px-6 pt-4">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#0b6b62]">Informed Caregiving</p>
            <h1 className="text-[24px] font-semibold text-black">Learn</h1>
          </div>
          {doneCount > 0 && (
            <p className="text-[12px] font-medium text-[#0b6b62]">
              {doneCount} of {articles.length} done
            </p>
          )}
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

        {forYou && (
          <button
            onClick={() => navigate(`/learn/${forYou.pick.id}`)}
            className="flex flex-col gap-2.5 rounded-[16px] p-4 text-left text-white"
            style={{ background: "linear-gradient(135deg, #0b6b62 0%, #0e8073 100%)" }}
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/70">
              For you today · {forYou.why}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white/15">
                {forYou.pick.kind === "video" ? <Play size={17} /> : <BookOpen size={17} />}
              </span>
              <p className="flex-1 text-[16px] font-semibold leading-tight">{forYou.pick.title}</p>
            </div>
            <span className="flex w-fit items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[12px] font-semibold text-[#0b6b62]">
              Do this: {forYou.pick.actionSteps[0]}
            </span>
          </button>
        )}

        <div className="flex shrink-0 flex-col gap-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {STAGE_FILTERS.map((s) => (
              <Chip key={s} selected={stageFilter === s} onClick={() => setStageFilter(s)}>
                {s === "All" ? "All Stages" : s.replace(" Stage", "")}
              </Chip>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {TYPE_FILTERS.map((t) => (
              <Chip key={t} selected={typeFilter === t} onClick={() => setTypeFilter(t)}>
                {t}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {filtered.length === 0 && (
            <p className="py-8 text-center text-[14px] text-[#9e9e9e]">Nothing matches that search.</p>
          )}
          {filtered.map((a) => {
            const tint = TAG_COLOR[a.tag] ?? "#818181";
            const done = completedLearnIds.includes(a.id);
            return (
              <button
                key={a.id}
                onClick={() => navigate(`/learn/${a.id}`)}
                className="flex items-start gap-3 rounded-r-[10px] bg-white py-3.5 pl-4 pr-4 text-left"
                style={{ borderLeft: `4px solid ${tint}` }}
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[8px]" style={{ backgroundColor: `${tint}1a`, color: tint }}>
                  {a.kind === "video" ? <Play size={14} /> : <BookOpen size={14} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: tint }}>
                      {a.tag}
                    </span>
                    <span className="text-[11px] text-[#c4c4c4]">· {a.readMins} min</span>
                    {done && <CheckCircle2 size={12} className="ml-auto shrink-0 text-[#0b6b62]" />}
                  </div>
                  <p className="mt-0.5 text-[16px] font-semibold leading-tight text-black">{a.title}</p>
                  <p className="mt-1 text-[13px] leading-snug text-[#5c6069]">Do: {a.actionSteps[0]}</p>
                </div>
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
