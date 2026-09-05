import { useNavigate } from "react-router-dom";
import { Stethoscope, Brain, HeartHandshake, ArrowUpRight } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useStore, type SpecialistType } from "../../state/store";

const TYPE_META: Record<SpecialistType, { icon: typeof Stethoscope; desc: string; tint: string; ink: string }> = {
  Geriatrician: { icon: Stethoscope, desc: "General care for aging-related conditions", tint: "#dbeafe", ink: "#1d4ed8" },
  Neurologist: { icon: Brain, desc: "Diagnosis & cognitive decline management", tint: "#ede4ff", ink: "#6b4bbd" },
  Psychologist: { icon: HeartHandshake, desc: "Behavioral & emotional support", tint: "#d8ebe8", ink: "#0b6b62" },
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

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto no-scrollbar px-6 py-4">
        {upcoming.length > 0 && (
          <div>
            <p className="mb-2 text-[14px] font-semibold text-black">Upcoming</p>
            <div className="flex flex-col gap-2">
              {upcoming.map((c) => {
                const sp = specialists.find((s) => s.id === c.specialistId);
                return (
                  <div key={c.id} className="flex gap-3 rounded-[4px] border-l-[5px] border-[#1d4ed8] bg-white py-3 pl-3.5 pr-4">
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
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 text-[14px] font-semibold text-black">Reach a specialist directly</p>
          <div className="flex flex-col gap-2.5">
            {specialists.map((sp) => {
              const meta = TYPE_META[sp.type];
              const Icon = meta.icon;
              const initials = sp.name
                .replace("Dr. ", "")
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2);
              return (
                <button
                  key={sp.id}
                  onClick={() => navigate("/consult/new", { state: { type: sp.type } })}
                  className="flex items-center gap-3.5 rounded-[16px] bg-white p-3.5 text-left"
                >
                  <div
                    className="flex size-[46px] shrink-0 items-center justify-center rounded-[13px] text-[15px] font-bold"
                    style={{ backgroundColor: meta.tint, color: meta.ink }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-black">{sp.name}</p>
                    <p className="truncate text-[12px] text-[#818181]">{sp.title}</p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] font-medium" style={{ color: meta.ink }}>
                      <Icon size={11} /> {sp.type} · {sp.clinic}
                    </p>
                  </div>
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: meta.tint, color: meta.ink }}
                  >
                    <ArrowUpRight size={15} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="px-1 text-[12px] leading-relaxed text-[#5c6069]">
          Booking here shares a scheduling request only — for anything urgent, contact the clinic or emergency
          services directly.
        </p>
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
