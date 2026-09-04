import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Stethoscope, Brain, HeartHandshake, CalendarCheck } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { FormTextarea, PrimaryButton } from "../../components/ui";
import { useStore, type SpecialistType } from "../../state/store";

const TYPE_META: Record<SpecialistType, { icon: typeof Stethoscope; desc: string }> = {
  Geriatrician: { icon: Stethoscope, desc: "General care for aging-related conditions" },
  Neurologist: { icon: Brain, desc: "Diagnosis & cognitive decline management" },
  Psychologist: { icon: HeartHandshake, desc: "Behavioral & emotional support" },
};

const SLOTS = ["Fri, 12 Sep · 10:30 AM", "Fri, 12 Sep · 2:00 PM", "Mon, 15 Sep · 9:00 AM"];

export default function BookConsultation() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillReason = (location.state as { reason?: string } | null)?.reason;
  const { specialists, bookConsultation, symptomLogs, engagementLog, selectedRecipient } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [type, setType] = useState<SpecialistType | null>(null);
  const [specialistId, setSpecialistId] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [reason, setReason] = useState(prefillReason ?? "");
  const [attachContext, setAttachContext] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const typeOptions: SpecialistType[] = ["Geriatrician", "Neurologist", "Psychologist"];
  const shortlisted = specialists.filter((s) => s.type === type);
  const specialist = specialists.find((s) => s.id === specialistId);

  function confirm() {
    if (!specialistId || !slot) return;
    const id = bookConsultation({ specialistId, date: slot.split(" · ")[0], time: slot.split(" · ")[1], attachContext, reason: reason.trim() || "General check-in" });
    setBookingId(id);
    setStep(4);
  }

  if (step === 4 && bookingId) {
    return (
      <PhoneShell>
        <ScreenHeader title="Consult" onBack={() => navigate("/consult")} />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <CalendarCheck size={48} className="text-[#0b6b62]" />
          <p className="text-[20px] font-semibold text-black">Booked</p>
          <p className="text-[14px] text-[#818181]">
            {specialist?.name} · {slot}
            {attachContext ? " · recent logs will be shared" : ""}
          </p>
          <p className="rounded-[10px] bg-[#f0fdfa] px-3 py-2 text-[12px] text-[#0b6b62]">
            🔔 You'll get a reminder the day before this appointment
          </p>
          <PrimaryButton onClick={() => navigate("/consult")} className="mt-4">
            Back to Consultations
          </PrimaryButton>
        </div>
        <HomeIndicator />
      </PhoneShell>
    );
  }

  return (
    <PhoneShell noScroll>
      <ScreenHeader
        title="Book a Consultation"
        onBack={() => (step === 1 ? navigate("/consult") : setStep((s) => (s - 1) as typeof step))}
      />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto no-scrollbar px-6 py-4">
        {step === 1 && (
          <>
            <p className="text-[13px] text-[#818181]">Who would help most right now?</p>
            {typeOptions.map((t) => {
              const Meta = TYPE_META[t];
              return (
                <button
                  key={t}
                  onClick={() => {
                    setType(t);
                    setStep(2);
                  }}
                  className="flex items-center gap-3 rounded-[14px] bg-white p-4 text-left"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[#1d4ed8]">
                    <Meta.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-black">{t}</p>
                    <p className="text-[12px] text-[#818181]">{Meta.desc}</p>
                  </div>
                </button>
              );
            })}
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-[13px] text-[#818181]">Available {type}s</p>
            {shortlisted.map((s) => (
              <div key={s.id} className="rounded-[14px] bg-white p-4">
                <p className="text-[15px] font-semibold text-black">{s.name}</p>
                <p className="text-[12px] text-[#818181]">
                  {s.title} · {s.clinic}
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {SLOTS.map((sl) => (
                    <button
                      key={sl}
                      onClick={() => {
                        setSpecialistId(s.id);
                        setSlot(sl);
                        setStep(3);
                      }}
                      className="rounded-[10px] border border-[#e2e8f0] py-2.5 text-[13px] font-medium text-[#1d4ed8]"
                    >
                      {sl}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {step === 3 && (
          <>
            <div className="rounded-[14px] bg-white p-4">
              <p className="text-[13px] font-semibold text-black">{specialist?.name}</p>
              <p className="text-[12px] text-[#818181]">{slot}</p>
            </div>
            <FormTextarea
              label="What's this about? (optional)"
              placeholder="e.g. Sundowning has gotten worse this week"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <button
              onClick={() => setAttachContext((v) => !v)}
              className="flex items-start gap-3 rounded-[14px] bg-white p-4 text-left"
            >
              <span
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[5px] border-2 ${
                  attachContext ? "border-[#1d4ed8] bg-[#1d4ed8] text-white" : "border-[#dfdfdf]"
                }`}
              >
                {attachContext && <CheckCircle2 size={13} />}
              </span>
              <span>
                <span className="block text-[14px] font-semibold text-black">Attach recent context</span>
                <span className="block text-[12px] text-[#818181]">
                  Share {selectedRecipient?.name.split(" ")[0]}'s last {symptomLogs.length} symptom notes and{" "}
                  {engagementLog.length} recent Kindred Moments sessions so the specialist has background before you speak.
                </span>
              </span>
            </button>
            <PrimaryButton onClick={confirm} className="mt-2">
              Confirm Booking
            </PrimaryButton>
          </>
        )}
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
