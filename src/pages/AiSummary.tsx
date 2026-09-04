import { useNavigate } from "react-router-dom";
import { Sparkles, ClipboardCheck, Smile, AlertTriangle, BookHeart } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../components/PhoneShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { useStore } from "../state/store";

export default function AiSummary() {
  const navigate = useNavigate();
  const { selectedRecipient, activity, engagementLog, symptomLogs, activeAlerts } = useStore();

  const done = activity.filter((a) => a.done).length;
  const lastSession = engagementLog[0];
  const recentSymptoms = symptomLogs.slice(0, 3);
  const name = selectedRecipient?.name.split(" ")[0] ?? "They";

  return (
    <PhoneShell>
      <ScreenHeader title="" transparent onBack={() => navigate(-1)} />
      <div className="flex flex-1 flex-col items-center px-6 pb-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-[#1d4ed8]">
          <Sparkles size={28} className="text-white" />
        </div>
        <h1 className="mt-4 text-[24px] font-semibold text-black">Today's Insight</h1>
        <p className="text-[12px] text-[#818181]">Built from {selectedRecipient?.name ?? "your recipient"}'s activity, sessions & logs</p>

        <div className="mt-4 grid w-full grid-cols-2 gap-3">
          <div className="rounded-[14px] bg-white p-4">
            <div className="mb-1 flex items-center gap-2 text-[12px] font-semibold text-black">
              <ClipboardCheck size={16} /> Tasks Today
            </div>
            <p className="text-[32px] font-bold text-black">
              {done}
              <span className="text-[16px] text-[#818181]">/{activity.length}</span>
            </p>
            <span className="mt-2 inline-block rounded-[4px] bg-[#dcfce7] px-2 py-0.5 text-[11px] font-semibold text-[#008236]">
              {done === activity.length ? "All done" : "In progress"}
            </span>
          </div>
          <div className="rounded-[14px] bg-white p-4">
            <div className="mb-1 flex items-center gap-2 text-[12px] font-semibold text-black">
              <Smile size={16} /> Last Session
            </div>
            <p className="text-[32px] font-bold leading-none text-black">{lastSession?.mood ?? "—"}</p>
            <p className="mt-2 text-[11px] text-[#818181]">
              {lastSession ? lastSession.title : "No sessions logged yet"}
            </p>
          </div>
        </div>

        <div className="mt-4 w-full rounded-[14px] bg-white p-4">
          <p className="text-[14px] font-semibold text-black">Today's Recap</p>
          <p className="mt-3 text-[14px] leading-5 text-black">
            {done > 0
              ? `${done} of ${activity.length} scheduled tasks are complete for ${name} today.`
              : `No tasks have been marked complete yet today for ${name}.`}
          </p>
          <p className="mt-3 text-[14px] leading-5 text-black">
            {lastSession
              ? `The most recent Kindred Moments session — ${lastSession.title} — was logged as ${
                  lastSession.mood === "😊" ? "positive" : lastSession.mood === "😐" ? "neutral" : lastSession.mood === "😟" ? "distressing" : "unrated"
                }${lastSession.note ? `: "${lastSession.note}"` : "."}`
              : `No Kindred Moments session has been logged yet — try one from the Moments tab.`}
          </p>
          <p className="mt-3 text-[14px] leading-5 text-black">
            {recentSymptoms.length > 0
              ? `${recentSymptoms.length} symptom${recentSymptoms.length > 1 ? "s" : ""} logged recently: ${recentSymptoms
                  .map((s) => `${s.symptom} (${s.severity})`)
                  .join(", ")}.`
              : `No symptoms have been logged recently.`}
          </p>
        </div>

        {activeAlerts.length > 0 && (
          <div className="mt-4 w-full rounded-[14px] border border-[#a3123f]/20 bg-[#a3123f]/5 p-4">
            <p className="flex items-center gap-2 text-[13px] font-semibold text-[#a3123f]">
              <AlertTriangle size={14} /> {activeAlerts.length} unacknowledged alert{activeAlerts.length > 1 ? "s" : ""}
            </p>
            <p className="mt-1 text-[13px] leading-[18px] text-black">
              The Circle has {activeAlerts.length === 1 ? "an" : ""} open symptom alert that hasn't been acknowledged yet.
            </p>
            <button onClick={() => navigate("/circle")} className="mt-2 text-[12px] font-semibold text-[#a3123f]">
              Review in Circle →
            </button>
          </div>
        )}

        <div className="mt-4 w-full rounded-[14px] border border-[#1d4ed8]/20 bg-[#1d4ed8]/5 p-4">
          <p className="text-[13px] font-semibold text-[#1d4ed8]">✦ AI Recommendation</p>
          <p className="mt-1 text-[13px] leading-[18px] text-black">
            {lastSession?.mood === "😟"
              ? `The last session felt hard for ${name}. Try something familiar and low-effort — a calming sound or a favorite photo — rather than something new today.`
              : `Consider a Kindred Moments session with ${name} today — reminiscence and familiar content tend to generate positive responses.`}
          </p>
          <button
            onClick={() => navigate("/moments")}
            className="mt-2 flex items-center gap-1 text-[12px] font-semibold text-[#1d4ed8]"
          >
            <BookHeart size={13} /> Open Kindred Moments
          </button>
        </div>
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
