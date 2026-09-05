import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { Chip, FormTextarea, PrimaryButton } from "../../components/ui";
import { useStore, type Symptom, type SymptomSeverity } from "../../state/store";

const SYMPTOMS: Symptom[] = [
  "Sundowning", "Wandering", "Agitation", "Memory Loss",
  "Communication Difficulty", "Sleep Disturbance", "Repetition", "Appetite Changes",
];
const SEVERITIES: { level: SymptomSeverity; desc: string }[] = [
  { level: "Mild", desc: "Noticeable, didn't disrupt the day" },
  { level: "Moderate", desc: "Needed extra attention or reassurance" },
  { level: "Severe", desc: "Distressing, or a safety concern" },
];

export default function LogSymptom() {
  const navigate = useNavigate();
  const { logSymptom, selectedRecipient } = useStore();
  const [symptom, setSymptom] = useState<Symptom | null>(null);
  const [severity, setSeverity] = useState<SymptomSeverity | null>(null);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  const valid = symptom && severity;

  if (done) {
    return (
      <PhoneShell>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          {severity !== "Mild" ? (
            <>
              <AlertTriangle size={44} className="text-[#a3123f]" />
              <p className="text-[20px] font-semibold text-black">Logged & flagged to the Circle</p>
              <p className="text-[14px] text-[#818181]">
                Family members will see this as an alert. Consider a consultation if it continues.
              </p>
            </>
          ) : (
            <p className="text-[16px] font-semibold text-black">Logged</p>
          )}
        </div>
        <HomeIndicator />
      </PhoneShell>
    );
  }

  return (
    <PhoneShell noScroll>
      <ScreenHeader title="Log a Symptom" />
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto no-scrollbar px-6 py-5">
        <p className="text-[14px] text-[#818181]">
          For {selectedRecipient?.name ?? "your recipient"} — this feeds the family's shared timeline and, for anything
          moderate or above, raises an alert the whole Circle can see.
        </p>

        <div>
          <p className="mb-2 text-[12px] font-medium text-black">What did you notice?</p>
          <div className="flex flex-wrap gap-2">
            {SYMPTOMS.map((s) => (
              <Chip key={s} selected={symptom === s} onClick={() => setSymptom(s)}>
                {s}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[12px] font-medium text-black">How severe?</p>
          <div className="flex flex-col gap-2">
            {SEVERITIES.map((s) => (
              <button
                key={s.level}
                onClick={() => setSeverity(s.level)}
                className={`flex items-center gap-3 rounded-[14px] bg-white p-3.5 text-left ${
                  severity === s.level ? "ring-2 ring-[#a3123f]" : ""
                }`}
              >
                <span
                  className={`size-[18px] shrink-0 rounded-full border-2 ${
                    severity === s.level ? "border-[#a3123f] bg-[#a3123f]" : "border-[#dfdfdf]"
                  }`}
                />
                <div>
                  <p className="text-[14px] font-semibold text-black">{s.level}</p>
                  <p className="text-[12px] text-[#818181]">{s.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <FormTextarea
          label="What happened? (optional)"
          placeholder="e.g. Got upset around 4pm, kept asking to go home even though we were home"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <PrimaryButton
          disabled={!valid}
          onClick={() => {
            if (!symptom || !severity) return;
            logSymptom({ symptom, severity, note: note.trim() });
            setDone(true);
            setTimeout(() => navigate("/circle", { replace: true }), 1100);
          }}
        >
          Save Log
        </PrimaryButton>
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
