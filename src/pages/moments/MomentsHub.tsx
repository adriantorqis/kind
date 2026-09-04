import { useNavigate } from "react-router-dom";
import { Sparkles, Puzzle, BookHeart, Waves, ChevronRight, Clock } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { BottomNav } from "../../components/BottomNav";
import { useStore, type MomentKind } from "../../state/store";

const TIERS: { kind: MomentKind; to: string; icon: typeof Puzzle; title: string; desc: string; forStage: string }[] = [
  { kind: "game", to: "/moments/game", icon: Puzzle, title: "Memory Games", desc: "Matching & simple puzzles", forStage: "Early Stage" },
  { kind: "book", to: "/memory-book", icon: BookHeart, title: "Life Memory Book", desc: "Reminiscence & photos", forStage: "Middle Stage" },
  { kind: "sensory", to: "/moments/sensory", icon: Waves, title: "Calm & Sensory", desc: "Music, familiar photos", forStage: "Late Stage" },
];

function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export default function MomentsHub() {
  const navigate = useNavigate();
  const { selectedRecipient, recommendedMoment, engagementLog } = useStore();
  const recommendedTier = TIERS.find((t) => t.kind === recommendedMoment.kind) ?? TIERS[1];

  return (
    <PhoneShell noScroll gradient="from-[#fff7ec] to-[#ffe9d6]">
      <div className="flex shrink-0 flex-col gap-1 px-6 pt-4">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-[#c2410c]">Kindred Moments</p>
        <h1 className="text-[22px] font-semibold text-black">
          Time with {selectedRecipient?.name.split(" ")[0] ?? "them"}
        </h1>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto no-scrollbar px-6 py-4">
        <button
          onClick={() => navigate(recommendedTier.to)}
          className="flex items-center gap-3 rounded-[14px] border-2 border-[#f97316]/40 bg-white p-4 text-left"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#fff0e0] text-[#c2410c]">
            <Sparkles size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#c2410c]">Recommended today</p>
            <p className="text-[15px] font-semibold text-black">{recommendedMoment.title}</p>
            <p className="text-[12px] text-[#818181]">{recommendedMoment.reason}</p>
          </div>
          <ChevronRight size={20} className="text-[#c4c4c4]" />
        </button>

        <div className="flex flex-col gap-3">
          {TIERS.map((t) => (
            <button
              key={t.kind}
              onClick={() => navigate(t.to)}
              className="flex items-center gap-3 rounded-[14px] bg-white p-4 text-left"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#fff0e0] text-[#c2410c]">
                <t.icon size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-black">{t.title}</p>
                <p className="text-[12px] text-[#818181]">
                  {t.desc} · usually {t.forStage.replace(" Stage", "")}
                </p>
              </div>
              <ChevronRight size={20} className="text-[#c4c4c4]" />
            </button>
          ))}
        </div>

        {engagementLog.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold text-black">Recent sessions</p>
            {engagementLog.slice(0, 4).map((e) => (
              <div key={e.id} className="flex items-center gap-3 rounded-[14px] bg-white/70 p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fff0e0] text-[15px]">
                  {e.mood ?? <Clock size={14} className="text-[#c2410c]" />}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-black">{e.title}</p>
                  <p className="text-[11px] text-[#9e9e9e]">{timeAgo(e.at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
      <HomeIndicator />
    </PhoneShell>
  );
}
