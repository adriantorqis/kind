import { useNavigate, useParams } from "react-router-dom";
import { Pill, Pencil, Clock, Trash2 } from "lucide-react";
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

export default function MedicationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { medications, deleteMedication } = useStore();
  const med = medications.find((m) => m.id === id);

  if (!med) {
    return (
      <PhoneShell>
        <ScreenHeader title="Medicine Detail" onBack={() => navigate("/medication")} />
        <div className="flex flex-1 items-center justify-center px-6 text-center text-[14px] text-[#818181]">
          That medication couldn't be found.
        </div>
        <HomeIndicator />
      </PhoneShell>
    );
  }

  const tint = FORM_TINT[med.form] ?? FORM_TINT.Tablet;

  return (
    <PhoneShell noScroll>
      <ScreenHeader
        title="Medicine Detail"
        onBack={() => navigate("/medication")}
        right={
          <button
            onClick={() => navigate(`/medication/${med.id}/edit`)}
            aria-label="Edit medication"
            className="flex size-10 items-center justify-center rounded-full text-[#1d4ed8] active:bg-black/5"
          >
            <Pencil size={18} />
          </button>
        }
      />
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar">
        <div className="flex h-[180px] w-full items-center justify-center" style={{ backgroundColor: tint.bg }}>
          <Pill size={64} style={{ color: tint.ink }} />
        </div>

        <div className="flex flex-1 flex-col px-6 py-4">
          <h1 className="text-[24px] font-semibold leading-tight text-black">{med.name}</h1>
          <p className="mt-1 text-[16px] text-black">
            {med.amountPerDose} {med.form.toLowerCase()} ({med.dosageAmount}
            {med.dosageUnit})
          </p>

          {med.notes && <p className="mt-3 text-[16px] text-black">{med.notes}</p>}
          <p className="mt-1 text-[16px] text-black">
            {med.mealInstruction === "Anytime" ? (
              <>
                Can be taken <span className="text-[#1d4ed8]">anytime</span> (with or without food)
              </>
            ) : (
              <>
                Take <span className="text-[#1d4ed8]">{med.mealInstruction.toLowerCase()}</span>
              </>
            )}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {med.times.map((t) => (
              <span key={t} className="flex items-center gap-1 rounded-[8px] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-black">
                <Clock size={11} className="text-[#1d4ed8]" /> {t}
              </span>
            ))}
          </div>

          {(med.whatFor || med.avoid || med.sideEffects) ? (
            <div className="mt-5 flex flex-col gap-4 rounded-[14px] bg-white p-4">
              <p className="text-[14px] font-semibold text-black">Notes</p>
              {med.whatFor && (
                <div>
                  <p className="text-[14px] font-bold text-black">What is it for?</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-[#5c6069]">{med.whatFor}</p>
                </div>
              )}
              {med.avoid && (
                <div>
                  <p className="text-[14px] font-bold text-black">Important things to avoid</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-[#5c6069]">{med.avoid}</p>
                </div>
              )}
              {med.sideEffects && (
                <div>
                  <p className="text-[14px] font-bold text-black">Side effects</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-[#5c6069]">{med.sideEffects}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-5 rounded-[14px] border border-dashed border-[#e2e8f0] px-4 py-5 text-center text-[13px] text-[#9e9e9e]">
              No reference notes added for this medication yet.
            </p>
          )}

          <button
            onClick={() => {
              deleteMedication(med.id);
              navigate("/medication");
            }}
            className="mt-4 flex items-center justify-center gap-2 rounded-[12px] py-3 text-[14px] font-semibold text-[#a3123f]"
          >
            <Trash2 size={15} /> Remove this medication
          </button>
        </div>
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
