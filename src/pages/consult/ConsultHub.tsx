import { useNavigate } from "react-router-dom";
import { Plus, Stethoscope, Brain, HeartHandshake, CalendarClock } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useStore, type SpecialistType } from "../../state/store";

const TYPE_ICON: Record<SpecialistType, typeof Stethoscope> = {
  Geriatrician: Stethoscope,
  Neurologist: Brain,
  Psychologist: HeartHandshake,
};

export default function ConsultHub() {
  const navigate = useNavigate();
  const { consultations, specialists } = useStore();
  const upcoming = consultations.filter((c) => c.status === "Upcoming");

  return (
    <PhoneShell noScroll gradient="from-[#eef4ff] to-[#e4ecff]">
      <ScreenHeader title="Consultations" transparent onBack={() => navigate("/home")} />
      <div className="flex shrink-0 flex-col gap-1 px-6">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-[#1d4ed8]">Direct-to-Professional</p>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto no-scrollbar px-6 py-4">
        <button
          onClick={() => navigate("/consult/new")}
          className="flex items-center justify-center gap-2 rounded-[14px] bg-[#1d4ed8] py-4 text-[15px] font-semibold text-white"
        >
          <Plus size={20} /> Book a Consultation
        </button>

        {upcoming.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-2 rounded-[14px] bg-white/60 py-10 text-center">
            <CalendarClock size={32} className="text-[#9e9e9e]" />
            <p className="text-[14px] font-semibold text-black">No consultations booked yet</p>
            <p className="max-w-[240px] text-[12px] text-[#818181]">
              When something feels beyond day-to-day care, connect directly with a specialist here.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-2 text-[13px] font-semibold text-black">Upcoming</p>
            {upcoming.map((c) => {
              const sp = specialists.find((s) => s.id === c.specialistId);
              const Icon = sp ? TYPE_ICON[sp.type] : Stethoscope;
              return (
                <div key={c.id} className="flex items-center gap-3 rounded-[14px] bg-white p-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[#1d4ed8]">
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-black">{sp?.name}</p>
                    <p className="text-[12px] text-[#818181]">
                      {c.date} · {c.time}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#1d4ed8]">{c.reason}</p>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
