import { useState } from "react";
import { CheckCircle2, Circle, Pill } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../components/PhoneShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { useStore, type MedSlot } from "../state/store";

const DAYS = [
  { d: "M", n: 3 },
  { d: "T", n: 4 },
  { d: "W", n: 5 },
  { d: "T", n: 6 },
  { d: "F", n: 7 },
  { d: "S", n: 8 },
  { d: "S", n: 9 },
];

const SLOTS: MedSlot[] = ["Morning", "Afternoon", "Evening", "Night"];

export default function Activity() {
  const { activity, toggleActivity } = useStore();
  const [activeDay, setActiveDay] = useState(4);

  const total = activity.length;
  const done = activity.filter((a) => a.done).length;

  return (
    <PhoneShell noScroll>
      <ScreenHeader title="Activity" transparent />
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-6 pb-4">
        <div className="rounded-[14px] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[20px] font-bold text-black">August 2026</p>
            <p className="text-[13px] font-semibold text-[#1d4ed8]">
              {done}/{total} done
            </p>
          </div>
          <div className="flex justify-between gap-1.5">
            {DAYS.map(({ d, n }) => (
              <button
                key={n}
                onClick={() => setActiveDay(n)}
                className={`flex h-[60px] w-[36px] flex-col items-center justify-center rounded-[6px] border text-[16px] ${
                  n === activeDay ? "border-[#1d4ed8] bg-[#1d4ed8] text-white font-semibold" : "border-[#dfdfdf] text-black"
                }`}
              >
                <span className="text-[16px]">{d}</span>
                <span className="text-[16px] font-normal">{String(n).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="mb-2 mt-6 text-[16px] font-semibold text-black">Today's Progress</p>
        <div className="flex flex-col gap-5">
          {SLOTS.map((slot) => {
            const items = activity.filter((a) => a.slot === slot);
            if (items.length === 0) return null;
            return (
              <div key={slot} className="flex gap-3">
                <div className="flex w-6 flex-col items-center pt-1">
                  <div className="size-6 rounded-full bg-[#dbeafe]" />
                  <div className="mt-1 w-px flex-1 bg-[#dfdfdf]" />
                </div>
                <div className="flex flex-1 flex-col gap-2 pb-1">
                  <p className="text-[16px] font-semibold text-black">{slot}</p>
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleActivity(item.id)}
                      className="flex items-center gap-3 rounded-[14px] border border-[#dfdfdf] bg-white p-3 text-left"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[#1d4ed8]">
                        <Pill size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-semibold text-black">{item.title}</p>
                        <p className="text-[11px] text-[#818181]">{item.time}</p>
                      </div>
                      {item.done ? (
                        <CheckCircle2 size={22} className="text-[#22c55e]" />
                      ) : (
                        <Circle size={22} className="text-[#dfdfdf]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
