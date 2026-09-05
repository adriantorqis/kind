import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ThumbsUp, Stethoscope, Clock, Play, CheckCircle2, ChevronDown } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useStore } from "../../state/store";

const TAG_COLOR: Record<string, string> = {
  "Early Signs": "#a3123f",
  "Daily Care": "#0b6b62",
  Behavior: "#6b4bbd",
  Communication: "#1d4ed8",
  Safety: "#c2410c",
};

export default function ArticleDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { articles, completedLearnIds, toggleLearnDone } = useStore();
  const article = articles.find((a) => a.id === id);
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [expanded, setExpanded] = useState(false);

  if (!article) {
    return (
      <PhoneShell gradient="from-[#faf7f0] to-[#faf7f0]">
        <ScreenHeader title="Not found" onBack={() => navigate("/learn")} />
        <div className="flex flex-1 items-center justify-center px-6 text-center text-[14px] text-[#8b8575]">
          That article couldn't be found.
        </div>
        <HomeIndicator />
      </PhoneShell>
    );
  }

  const done = completedLearnIds.includes(article.id);
  const tint = TAG_COLOR[article.tag] ?? "#0b6b62";

  return (
    <PhoneShell noScroll gradient="from-[#faf7f0] to-[#faf7f0]">
      <ScreenHeader title="Learn" onBack={() => navigate("/learn")} />
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-6 py-4">
        {article.kind === "video" ? (
          <button
            className="relative flex aspect-video w-full items-center justify-center rounded-[14px]"
            style={{ backgroundColor: tint }}
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-white/90" style={{ color: tint }}>
              <Play size={22} className="ml-0.5" />
            </span>
            <span className="absolute bottom-3 right-3 rounded-[5px] bg-black/40 px-2 py-0.5 text-[11px] font-medium text-white">
              {article.readMins} min
            </span>
          </button>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: tint }}>
            <Clock size={11} /> {article.readMins} min read · {article.tag}
          </span>
        )}

        <h1 className="mt-3 text-[24px] font-semibold leading-tight text-[#241f14]">{article.title}</h1>
        <p className="mt-1.5 text-[14px] text-[#8b8575]">{article.summary}</p>

        <div className="mt-4 rounded-[14px] bg-white p-4">
          <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.06em]" style={{ color: tint }}>
            What to do
          </p>
          <div className="flex flex-col gap-3">
            {article.actionSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ backgroundColor: tint }}
                >
                  {i + 1}
                </span>
                <p className="text-[15px] leading-snug text-[#241f14]">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => toggleLearnDone(article.id)}
          className={`mt-3 flex items-center justify-center gap-2 rounded-[12px] py-3 text-[14px] font-semibold ${
            done ? "bg-[#d8ebe8] text-[#0b6b62]" : "bg-white text-[#a39c8a]"
          }`}
        >
          <CheckCircle2 size={16} /> {done ? "Marked as done" : "Mark as done"}
        </button>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-5 flex items-center gap-1.5 text-[13px] font-semibold"
          style={{ color: tint }}
        >
          {expanded ? "Hide the full article" : article.kind === "video" ? "Read the transcript" : "Read the full article"}
          <ChevronDown size={14} className={`transition ${expanded ? "rotate-180" : ""}`} />
        </button>

        {expanded && (
          <div className="mt-3 flex flex-col gap-4">
            {article.body.map((p, i) => (
              <p key={i} className="text-[15px] leading-6 text-[#241f14]">
                {p}
              </p>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-1.5">
          {article.symptoms.map((s) => (
            <span key={s} className="rounded-[4px] bg-white px-2 py-1 text-[11px] font-medium" style={{ color: tint }}>
              {s}
            </span>
          ))}
        </div>

        <div className="mt-5 rounded-[14px] bg-white p-4">
          <p className="mb-3 text-[14px] font-semibold text-[#241f14]">Was this helpful?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setHelpful(true)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-[10px] border py-2.5 text-[14px] font-medium ${
                helpful === true ? "border-[#0b6b62] bg-[#d8ebe8] text-[#0b6b62]" : "border-[#eee8d9] text-[#a39c8a]"
              }`}
            >
              <ThumbsUp size={14} /> Yes
            </button>
            <button
              onClick={() => setHelpful(false)}
              className={`flex-1 rounded-[10px] border py-2.5 text-[14px] font-medium ${
                helpful === false ? "border-[#a3123f] bg-[#f7dde5] text-[#a3123f]" : "border-[#eee8d9] text-[#a39c8a]"
              }`}
            >
              Not quite
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate("/consult/new", { state: { reason: article.title } })}
          className="mt-4 flex items-center gap-3 rounded-[14px] border-2 border-[#1d4ed8]/30 bg-white p-4 text-left"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[#1d4ed8]">
            <Stethoscope size={18} />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#241f14]">Want to discuss this with a professional?</p>
            <p className="text-[12px] text-[#8b8575]">Book a consultation, pre-filled with this topic</p>
          </div>
        </button>
        <div className="h-6" />
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
