import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { PrimaryButton, FormTextarea } from "../../components/ui";
import { useStore, type MomentKind } from "../../state/store";

type LocationState = { kind: MomentKind; title: string } | null;

const MOODS: { face: "😊" | "😐" | "😟"; label: string }[] = [
  { face: "😊", label: "Enjoyed it" },
  { face: "😐", label: "Neutral" },
  { face: "😟", label: "Distressed" },
];

export default function MoodLog() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logEngagement, selectedRecipient } = useStore();
  const state = location.state as LocationState;
  const kind = state?.kind ?? "book";
  const title = state?.title ?? "Session";

  const [mood, setMood] = useState<"😊" | "😐" | "😟" | null>(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  function submit() {
    logEngagement({ kind, title, mood, note: note.trim() || undefined });
    setSaved(true);
    setTimeout(() => navigate("/moments", { replace: true }), 900);
  }

  if (saved) {
    return (
      <PhoneShell gradient="from-[#fff7ec] to-[#ffe9d6]">
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <CheckCircle2 size={48} className="text-[#0b6b62]" />
          <p className="text-[16px] font-semibold text-black">Logged</p>
          <p className="text-[13px] text-[#818181]">This helps shape what's recommended next time.</p>
        </div>
        <HomeIndicator />
      </PhoneShell>
    );
  }

  return (
    <PhoneShell gradient="from-[#fff7ec] to-[#ffe9d6]">
      <div className="flex flex-1 flex-col gap-6 px-6 py-8">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-[#c2410c]">{title}</p>
          <h1 className="mt-1 text-[22px] font-semibold text-black">
            How did that go for {selectedRecipient?.name.split(" ")[0] ?? "them"}?
          </h1>
        </div>

        <div className="flex gap-3">
          {MOODS.map((m) => (
            <button
              key={m.face}
              onClick={() => setMood(m.face)}
              className={`flex flex-1 flex-col items-center gap-2 rounded-[14px] border-2 bg-white py-5 ${
                mood === m.face ? "border-[#c2410c]" : "border-transparent"
              }`}
            >
              <span className="text-[32px]">{m.face}</span>
              <span className="text-[12px] font-medium text-[#818181]">{m.label}</span>
            </button>
          ))}
        </div>

        <FormTextarea
          label="Anything worth remembering? (optional)"
          placeholder="e.g. Smiled a lot during the wedding photo, got restless near the end..."
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="mt-auto flex flex-col gap-2">
          <PrimaryButton onClick={submit} disabled={!mood}>
            Save & Finish
          </PrimaryButton>
          <button onClick={() => navigate("/moments")} className="min-h-11 py-2 text-center text-[13px] font-medium text-[#818181]">
            Skip for now
          </button>
        </div>
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
