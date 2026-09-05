import { useNavigate } from "react-router-dom";
import { Pill, Plus, ChevronRight } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useStore } from "../../state/store";

const FORM_TINT: Record<string, { bg: string; ink: string }> = {
  Tablet: { bg: "#dbeafe", ink: "#1d4ed8" },
  Capsule: { bg: "#ede4ff", ink: "#6b4bbd" },
  Liquid: { bg: "#d8ebe8", ink: "#0b6b62" },
  Injection: { bg: "#f7dde5", ink: "#a3123f" },
  Cream: { bg: "#ffedd4", ink: "#c2410c" },
};

export default function MedicationList() {
  const navigate = useNavigate();
  const { medications } = useStore();

  return (
    <PhoneShell noScroll>
      <ScreenHeader title="Medication" onBack={() => navigate(-1)} />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
          <p className="mb-2 text-[16px] font-semibold text-black">Added Medicines</p>
          {medications.length === 0 ? (
            <p className="rounded-[14px] bg-white px-4 py-8 text-center text-[13px] text-[#9e9e9e]">
              No medications added yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {medications.map((m) => {
                const tint = FORM_TINT[m.form] ?? FORM_TINT.Tablet;
                return (
                  <button
                    key={m.id}
                    onClick={() => navigate(`/medication/${m.id}`)}
                    className="flex items-center gap-3.5 rounded-[14px] bg-white p-3.5 text-left"
                  >
                    <div
                      className="flex size-[46px] shrink-0 items-center justify-center rounded-[13px]"
                      style={{ backgroundColor: tint.bg, color: tint.ink }}
                    >
                      <Pill size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-black">
                        {m.name} {m.dosageAmount}
                        {m.dosageUnit}
                      </p>
                      <p className="text-[12px] text-[#818181]">
                        {m.timesPerDay}× daily · {m.form}
                      </p>
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-[#c4c4c4]" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <button
          onClick={() => navigate("/medication/new")}
          aria-label="Add medication"
          className="absolute bottom-5 right-5 flex size-14 items-center justify-center rounded-full bg-[#1d4ed8] text-white shadow-[0_4px_14px_rgba(29,78,216,0.35)]"
        >
          <Plus size={24} />
        </button>
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
