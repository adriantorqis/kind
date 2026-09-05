import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ThumbsUp, Stethoscope, Clock } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useStore } from "../../state/store";

export default function ArticleDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { articles } = useStore();
  const article = articles.find((a) => a.id === id);
  const [helpful, setHelpful] = useState<boolean | null>(null);

  if (!article) {
    return (
      <PhoneShell>
        <ScreenHeader title="Not found" onBack={() => navigate("/learn")} />
        <div className="flex flex-1 items-center justify-center px-6 text-center text-[14px] text-[#818181]">
          That article couldn't be found.
        </div>
        <HomeIndicator />
      </PhoneShell>
    );
  }

  return (
    <PhoneShell noScroll gradient="from-[#f0fdfa] to-[#e0f5f1]">
      <ScreenHeader title="Learn" onBack={() => navigate("/learn")} />
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-6 py-4">
        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#0b6b62]">
          <Clock size={11} /> {article.readMins} min read · {article.tag}
        </span>
        <h1 className="mt-2 text-[24px] font-semibold leading-tight text-black">{article.title}</h1>
        <p className="mt-2 text-[14px] text-[#818181]">{article.summary}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {article.symptoms.map((s) => (
            <span key={s} className="rounded-[4px] bg-white px-2 py-1 text-[11px] font-medium text-[#0b6b62]">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-4">
          {article.body.map((p, i) => (
            <p key={i} className="text-[16px] leading-6 text-black">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-8 rounded-[14px] bg-white p-4">
          <p className="mb-3 text-[14px] font-semibold text-black">Was this helpful?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setHelpful(true)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-[10px] border py-2.5 text-[14px] font-medium ${
                helpful === true ? "border-[#0b6b62] bg-[#d8ebe8] text-[#0b6b62]" : "border-[#e2e8f0] text-[#818181]"
              }`}
            >
              <ThumbsUp size={14} /> Yes
            </button>
            <button
              onClick={() => setHelpful(false)}
              className={`flex-1 rounded-[10px] border py-2.5 text-[14px] font-medium ${
                helpful === false ? "border-[#a3123f] bg-[#f7dde5] text-[#a3123f]" : "border-[#e2e8f0] text-[#818181]"
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
            <p className="text-[14px] font-semibold text-black">Want to discuss this with a professional?</p>
            <p className="text-[12px] text-[#818181]">Book a consultation, pre-filled with this topic</p>
          </div>
        </button>
        <div className="h-6" />
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
