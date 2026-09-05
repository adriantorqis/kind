import { useNavigate } from "react-router-dom";
import { Sparkles, Puzzle, BookHeart, Waves, Clock } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { BottomNav } from "../../components/BottomNav";
import { useStore, type MomentKind } from "../../state/store";

const TIERS: { kind: MomentKind; to: string; icon: typeof Puzzle; title: string; forStage: string }[] = [
  { kind: "game", to: "/moments/game", icon: Puzzle, title: "Memory Games", forStage: "Early" },
  { kind: "book", to: "/memory-book", icon: BookHeart, title: "Life Memory Book", forStage: "Middle" },
  { kind: "sensory", to: "/moments/sensory", icon: Waves, title: "Calm & Sensory", forStage: "Late" },
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

  const recommended = TIERS.find((t) => t.kind === recommendedMoment.kind) ?? TIERS[1];
  const others = TIERS.filter((t) => t.kind !== recommended.kind);

  return (
    <PhoneShell noScroll gradient="from-[#fff7ec] to-[#ffe9d6]">
      <div className="flex shrink-0 flex-col gap-1 px-6 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#c2410c]">Kindred Moments</p>
        <h1 className="text-[24px] font-semibold text-black">
          Time with {selectedRecipient?.name.split(" ")[0] ?? "them"}
        </h1>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto no-scrollbar px-6 py-4">
        {/* the bento: one hero cell for what fits today, two square cells for the rest */}
        <button
          onClick={() => navigate(recommended.to)}
          className="relative flex aspect-[2/1] w-full flex-col justify-between overflow-hidden rounded-[18px] bg-[#c2410c] p-4 text-left"
        >
          <Sparkles size={22} className="text-white/90" />
          <div>
            <p className="text-[16px] font-semibold leading-tight text-white">{recommended.title}</p>
            <p className="text-[12px] text-white/70">{recommendedMoment.reason}</p>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-3">
          {others.map((t) => (
            <button
              key={t.kind}
              onClick={() => navigate(t.to)}
              className="flex aspect-square flex-col justify-between rounded-[18px] bg-white p-4 text-left"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-[#fff0e0] text-[#c2410c]">
                <t.icon size={18} />
              </div>
              <p className="text-[16px] font-semibold leading-tight text-black">{t.title}</p>
            </button>
          ))}
        </div>

        {engagementLog.length > 0 && (
          <div className="mt-1 flex flex-col gap-2">
            <p className="text-[14px] font-semibold text-black">Recent sessions</p>
            {engagementLog.slice(0, 4).map((e) => (
              <div key={e.id} className="flex items-center gap-3 rounded-[14px] bg-white/70 p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fff0e0] text-[16px]">
                  {e.mood ?? <Clock size={14} className="text-[#c2410c]" />}
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-black">{e.title}</p>
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
