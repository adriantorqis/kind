import { useNavigate } from "react-router-dom";
import { ChevronRight, ClipboardList, Wifi, BookHeart, Sparkles, Pill } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../components/PhoneShell";
import { BottomNav } from "../components/BottomNav";
import { useStore } from "../state/store";

export default function Home() {
  const navigate = useNavigate();
  const { selectedRecipient, activity, memories } = useStore();

  const nextTask = activity.find((a) => !a.done);
  const doneCount = activity.filter((a) => a.done).length;
  const latestMemory = memories[memories.length - 1];

  if (!selectedRecipient) {
    navigate("/recipients");
    return null;
  }

  const tiles = [
    { to: "/activity", label: "Activity", desc: `${doneCount}/${activity.length} done today`, icon: ClipboardList, bg: "bg-white", fg: "text-[#1d4ed8]" },
    { to: "/connectivity", label: "Connectivity", desc: "Cameras & vitals", icon: Wifi, bg: "bg-white", fg: "text-[#1d4ed8]" },
    { to: "/memory-book", label: "Life Memory Book", desc: `${memories.length} memories`, icon: BookHeart, bg: "bg-white", fg: "text-[#1d4ed8]" },
    { to: "/ai-summary", label: "AI Summary", desc: "Today's recap", icon: Sparkles, bg: "bg-[#1d4ed8]", fg: "text-white" },
  ];

  return (
    <PhoneShell noScroll>
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-6 pb-4 pt-2">
        <button
          onClick={() => navigate("/recipients")}
          className="flex items-center gap-4 rounded-[14px] bg-white p-4 text-left active:opacity-80"
        >
          {selectedRecipient.photo ? (
            <img src={selectedRecipient.photo} alt="" className="size-14 rounded-full object-cover" />
          ) : (
            <div className="flex size-14 items-center justify-center rounded-full bg-[#dbeafe] text-lg font-semibold text-[#1d4ed8]">
              {selectedRecipient.name[0]}
            </div>
          )}
          <div className="flex-1">
            <p className="text-[16px] font-semibold text-black">{selectedRecipient.name}</p>
            <p className="text-[13px] text-[#818181]">
              {selectedRecipient.age}y · {selectedRecipient.relationship}
            </p>
          </div>
          <ChevronRight size={20} className="text-[#c4c4c4]" />
        </button>

        {nextTask && (
          <button
            onClick={() => navigate("/activity")}
            className="mt-4 flex items-center gap-3 rounded-[14px] border-2 border-[#98ccff] bg-white p-4 text-left active:opacity-80"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[#1d4ed8]">
              <Pill size={18} />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#1d4ed8]">Up next · {nextTask.slot}</p>
              <p className="text-[14px] font-semibold text-black">{nextTask.title}</p>
            </div>
            <p className="text-[13px] font-semibold text-[#818181]">{nextTask.time}</p>
          </button>
        )}

        <p className="mb-3 mt-6 text-[16px] font-semibold text-black">Quick Access</p>
        <div className="grid grid-cols-2 gap-3">
          {tiles.map((t) => (
            <button
              key={t.to}
              onClick={() => navigate(t.to)}
              className={`flex flex-col items-start gap-6 rounded-[14px] p-4 text-left ${t.bg} active:opacity-90`}
            >
              <t.icon size={26} className={t.fg} />
              <div>
                <p className={`text-[14px] font-bold ${t.bg === "bg-[#1d4ed8]" ? "text-white" : "text-black"}`}>{t.label}</p>
                <p className={`text-[12px] ${t.bg === "bg-[#1d4ed8]" ? "text-white/70" : "text-[#9e9e9e]"}`}>{t.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {latestMemory && (
          <button
            onClick={() => navigate("/memory-book")}
            className="mt-4 flex items-center gap-3 rounded-[14px] bg-white p-3 text-left active:opacity-80"
          >
            {latestMemory.photo && (
              <img src={latestMemory.photo} alt="" className="size-12 rounded-[10px] object-cover" />
            )}
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-[#9e9e9e]">Latest memory · {latestMemory.year}</p>
              <p className="text-[13px] font-semibold text-black">{latestMemory.title}</p>
            </div>
            <ChevronRight size={18} className="text-[#c4c4c4]" />
          </button>
        )}
      </div>
      <BottomNav />
      <HomeIndicator />
    </PhoneShell>
  );
}
