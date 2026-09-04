import { useNavigate } from "react-router-dom";
import { ChevronRight, ClipboardList, Wifi, BookHeart, GraduationCap, Users, Stethoscope, Pill, AlertTriangle } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../components/PhoneShell";
import { BottomNav } from "../components/BottomNav";
import { useStore } from "../state/store";

const PILLARS = [
  { letter: "K", to: "/moments", label: "Moments", icon: BookHeart },
  { letter: "I", to: "/learn", label: "Learn", icon: GraduationCap },
  { letter: "N", to: "/circle", label: "Circle", icon: Users },
  { letter: "D", to: "/consult", label: "Consult", icon: Stethoscope },
];

export default function Home() {
  const navigate = useNavigate();
  const { selectedRecipient, activity, activeAlerts } = useStore();

  const nextTask = activity.find((a) => !a.done);
  const doneCount = activity.filter((a) => a.done).length;

  if (!selectedRecipient) {
    navigate("/recipients");
    return null;
  }

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
              {selectedRecipient.age}y · {selectedRecipient.relationship} · {selectedRecipient.stage}
            </p>
          </div>
          <ChevronRight size={20} className="text-[#c4c4c4]" />
        </button>

        {activeAlerts.length > 0 && (
          <button
            onClick={() => navigate("/circle")}
            className="mt-3 flex items-center gap-3 rounded-[14px] border-2 border-[#a3123f]/40 bg-[#f7dde5] p-3.5 text-left"
          >
            <AlertTriangle size={18} className="shrink-0 text-[#a3123f]" />
            <p className="flex-1 text-[13px] font-semibold text-[#a3123f]">
              {activeAlerts.length} symptom alert{activeAlerts.length > 1 ? "s" : ""}{" "}
              {activeAlerts.length > 1 ? "need" : "needs"} acknowledgement
            </p>
            <ChevronRight size={16} className="text-[#a3123f]" />
          </button>
        )}

        {nextTask && (
          <button
            onClick={() => navigate("/activity")}
            className="mt-3 flex items-center gap-3 rounded-[14px] border-2 border-[#98ccff] bg-white p-4 text-left active:opacity-80"
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

        <p className="mb-3 mt-6 text-[16px] font-semibold text-black">The K.I.N.D. Framework</p>
        <div className="grid grid-cols-2 gap-3">
          {PILLARS.map((p) => (
            <button
              key={p.to}
              onClick={() => navigate(p.to)}
              className="relative flex flex-col items-start gap-6 rounded-[14px] bg-white p-4 text-left active:opacity-90"
            >
              <span className="absolute right-3 top-3 font-serif text-[22px] font-semibold text-[#1d4ed8]/15">
                {p.letter}
              </span>
              <p.icon size={26} className="text-[#1d4ed8]" />
              <p className="text-[14px] font-bold text-black">{p.label}</p>
            </button>
          ))}
        </div>

        <p className="mb-2 mt-6 text-[13px] font-semibold text-[#9e9e9e]">Also</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/activity")}
            className="flex items-center gap-3 rounded-[14px] bg-white p-3.5 text-left"
          >
            <ClipboardList size={18} className="text-[#818181]" />
            <p className="flex-1 text-[13px] font-semibold text-black">Full Schedule</p>
            <span className="text-[12px] text-[#9e9e9e]">{doneCount}/{activity.length} today</span>
          </button>
          <button
            onClick={() => navigate("/connectivity")}
            className="flex items-center gap-3 rounded-[14px] bg-white p-3.5 text-left"
          >
            <Wifi size={18} className="text-[#818181]" />
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-black">Connected Devices</p>
              <p className="text-[11px] text-[#9e9e9e]">Optional — camera & wearable, not required</p>
            </div>
          </button>
        </div>
      </div>
      <BottomNav />
      <HomeIndicator />
    </PhoneShell>
  );
}
