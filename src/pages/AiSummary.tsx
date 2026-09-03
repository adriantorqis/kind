import { Sparkles, HeartPulse, Moon } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../components/PhoneShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { useStore } from "../state/store";

export default function AiSummary() {
  const { selectedRecipient, heartRate, sleep } = useStore();

  return (
    <PhoneShell>
      <ScreenHeader title="" transparent />
      <div className="flex flex-1 flex-col items-center px-6 pb-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-[#1d4ed8]">
          <Sparkles size={28} className="text-white" />
        </div>
        <h1 className="mt-4 text-[24px] font-semibold text-black">AI Summary</h1>
        <p className="text-[12px] text-[#818181]">Summary from {selectedRecipient?.name ?? "your recipient"}</p>

        <div className="mt-4 grid w-full grid-cols-2 gap-3">
          <div className="rounded-[14px] bg-white p-4">
            <div className="mb-1 flex items-center gap-2 text-[12px] font-semibold text-black">
              <HeartPulse size={16} /> Heart Rate
            </div>
            <p className="text-[32px] font-bold text-black">{heartRate}</p>
            <p className="text-[12px] text-[#818181]">bpm</p>
            <span className="mt-2 inline-block rounded-[4px] bg-[#dcfce7] px-2 py-0.5 text-[11px] font-semibold text-[#008236]">
              Normal
            </span>
          </div>
          <div className="rounded-[14px] bg-white p-4">
            <div className="mb-1 flex items-center gap-2 text-[12px] font-semibold text-black">
              <Moon size={16} /> Sleep
            </div>
            <p className="text-[32px] font-bold text-black">
              {sleep.h}
              <span className="text-[14px] text-[#818181]">h </span>
              {sleep.m}
              <span className="text-[14px] text-[#818181]">m</span>
            </p>
            <span className="mt-2 inline-block rounded-[4px] bg-[#dcfce7] px-2 py-0.5 text-[11px] font-semibold text-[#008236]">
              Normal
            </span>
          </div>
        </div>

        <div className="mt-4 w-full rounded-[14px] bg-white p-4">
          <p className="text-[14px] font-semibold text-black">Today's Recap</p>
          <p className="mt-3 text-[14px] leading-5 text-black">
            Good afternoon! {selectedRecipient?.name ?? "They"} had a relatively stable day. Morning medications were
            administered on schedule at 08:00 and 09:00. Heart rate has been consistent at {heartRate} bpm throughout
            the day — within the normal range.
          </p>
          <p className="mt-3 text-[14px] leading-5 text-black">
            Sleep quality was good at {sleep.h}h {sleep.m}m. Mild confusion was noted around 14:00 — consider a
            shorter afternoon nap to help regulate rhythm.
          </p>
          <p className="mt-3 text-[14px] leading-5 text-black">
            Reminder: evening medication is scheduled for tonight. Blood pressure check is still pending for the
            afternoon slot.
          </p>
        </div>

        <div className="mt-4 w-full rounded-[14px] border border-[#1d4ed8]/20 bg-[#1d4ed8]/5 p-4">
          <p className="text-[13px] font-semibold text-[#1d4ed8]">✦ AI Recommendation</p>
          <p className="mt-1 text-[13px] leading-[18px] text-black">
            Consider showing {selectedRecipient?.name ?? "them"} photos from the Life Memory Book today — family
            albums tend to generate positive responses and reduce late-afternoon restlessness.
          </p>
        </div>
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
