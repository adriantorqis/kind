import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, Pill, CalendarDays, ChevronRight } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../components/PhoneShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { useStore, type MedSlot } from "../state/store";
import { APP_TODAY, addDays, fromISODate, formatMonthYear, formatWeekdayLetter, isSameDay, startOfWeekMonday, toISODate } from "../lib/calendar";

const SLOTS: MedSlot[] = ["Morning", "Afternoon", "Evening", "Night"];

export default function Activity() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialDate = (location.state as { date?: string } | null)?.date;
  const { activity, toggleActivity } = useStore();
  const [selected, setSelected] = useState<Date>(initialDate ? fromISODate(initialDate) : APP_TODAY);

  const week = useMemo(() => {
    const start = startOfWeekMonday(selected);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selected]);

  const selectedISO = toISODate(selected);
  const dayItems = activity.filter((a) => a.date === selectedISO);
  const total = dayItems.length;
  const done = dayItems.filter((a) => a.done).length;

  return (
    <PhoneShell noScroll>
      <ScreenHeader title="Activity" transparent />
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-6 pb-4">
        <div className="rounded-[14px] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[20px] font-bold text-black">{formatMonthYear(selected)}</p>
            <button
              onClick={() => navigate("/calendar", { state: { date: selectedISO } })}
              className="flex items-center gap-1 text-[12px] font-semibold text-[#1d4ed8]"
            >
              <CalendarDays size={13} /> View Calendar
            </button>
          </div>
          <div className="flex justify-between gap-1.5">
            {week.map((d) => {
              const iso = toISODate(d);
              const isSelected = isSameDay(d, selected);
              const isToday = isSameDay(d, APP_TODAY);
              return (
                <button
                  key={iso}
                  onClick={() => setSelected(d)}
                  className={`flex h-[60px] w-[36px] flex-col items-center justify-center rounded-[6px] border text-[16px] ${
                    isSelected
                      ? "border-[#1d4ed8] bg-[#1d4ed8] text-white font-semibold"
                      : isToday
                        ? "border-[#1d4ed8] text-[#1d4ed8]"
                        : "border-[#dfdfdf] text-black"
                  }`}
                >
                  <span className="text-[16px]">{formatWeekdayLetter(d)}</span>
                  <span className="text-[16px] font-normal">{String(d.getDate()).padStart(2, "0")}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => navigate("/medication")}
          className="mt-3 flex items-center gap-3 rounded-[14px] bg-white p-3.5 text-left"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[#1d4ed8]">
            <Pill size={16} />
          </div>
          <p className="flex-1 text-[14px] font-semibold text-black">Manage medications</p>
          <ChevronRight size={16} className="shrink-0 text-[#c4c4c4]" />
        </button>

        <div className="mb-2 mt-6 flex items-baseline justify-between">
          <p className="text-[16px] font-semibold text-black">
            {isSameDay(selected, APP_TODAY) ? "Today's Progress" : "That day's Progress"}
          </p>
          {total > 0 && (
            <p className="text-[12px] font-semibold text-[#1d4ed8]">
              {done}/{total} done
            </p>
          )}
        </div>
        {total === 0 ? (
          <p className="rounded-[14px] bg-white px-4 py-8 text-center text-[13px] text-[#9e9e9e]">
            Nothing scheduled for this day.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {SLOTS.map((slot) => {
              const items = dayItems.filter((a) => a.slot === slot);
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
        )}
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
