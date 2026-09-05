import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Circle, CheckCircle2 } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../components/PhoneShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { PrimaryButton } from "../components/ui";
import { useStore } from "../state/store";
import { APP_TODAY, addMonths, fromISODate, formatMonthYear, isSameDay, monthGrid, toISODate } from "../lib/calendar";

const WEEKDAY_HEADER = ["M", "T", "W", "T", "F", "S", "S"];

export default function CalendarPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialDate = (location.state as { date?: string } | null)?.date;
  const { activity } = useStore();

  const [selected, setSelected] = useState<Date>(initialDate ? fromISODate(initialDate) : APP_TODAY);
  const [viewMonth, setViewMonth] = useState<Date>(new Date(selected.getFullYear(), selected.getMonth(), 1));

  const grid = useMemo(() => monthGrid(viewMonth), [viewMonth]);
  const tasksByDate = useMemo(() => {
    const map = new Map<string, typeof activity>();
    for (const a of activity) {
      const list = map.get(a.date) ?? [];
      list.push(a);
      map.set(a.date, list);
    }
    return map;
  }, [activity]);

  const selectedISO = toISODate(selected);
  const selectedTasks = (tasksByDate.get(selectedISO) ?? []).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <PhoneShell noScroll>
      <ScreenHeader title="Calendar" onBack={() => navigate(-1)} />
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-6 py-4">
        <div className="flex items-center justify-between">
          <p className="text-[20px] font-semibold text-black">{formatMonthYear(viewMonth)}</p>
          <div className="flex gap-1">
            <button
              onClick={() => setViewMonth((m) => addMonths(m, -1))}
              aria-label="Previous month"
              className="flex size-8 items-center justify-center rounded-full text-[#1d4ed8] active:bg-black/5"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              aria-label="Next month"
              className="flex size-8 items-center justify-center rounded-full text-[#1d4ed8] active:bg-black/5"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-y-1 rounded-[14px] bg-white p-3">
          {WEEKDAY_HEADER.map((w, i) => (
            <p key={i} className="pb-2 text-center text-[12px] font-semibold text-[#9e9e9e]">
              {w}
            </p>
          ))}
          {grid.map((d) => {
            const iso = toISODate(d);
            const inMonth = d.getMonth() === viewMonth.getMonth();
            const isToday = isSameDay(d, APP_TODAY);
            const isSelected = isSameDay(d, selected);
            const hasTasks = (tasksByDate.get(iso)?.length ?? 0) > 0;
            return (
              <button
                key={iso}
                onClick={() => setSelected(d)}
                className="flex flex-col items-center gap-1 py-1.5"
              >
                <span
                  className={`flex size-8 items-center justify-center rounded-full text-[14px] font-medium ${
                    isSelected
                      ? "bg-[#1d4ed8] font-semibold text-white"
                      : isToday
                        ? "border border-[#1d4ed8] text-[#1d4ed8]"
                        : inMonth
                          ? "text-black"
                          : "text-[#d4d4d4]"
                  }`}
                >
                  {d.getDate()}
                </span>
                <span className={`size-1 rounded-full ${hasTasks && !isSelected ? "bg-[#1d4ed8]" : "bg-transparent"}`} />
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex-1">
          <p className="mb-2 text-[14px] font-semibold text-black">
            {isSameDay(selected, APP_TODAY)
              ? "Today"
              : selected.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </p>
          {selectedTasks.length === 0 ? (
            <p className="rounded-[14px] bg-white px-4 py-6 text-center text-[13px] text-[#9e9e9e]">
              No tasks scheduled for this day.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedTasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 rounded-[12px] bg-white px-4 py-3">
                  <span className="w-[44px] shrink-0 text-[12px] tabular-nums text-[#9e9e9e]">{t.time}</span>
                  <span className={`flex-1 text-[14px] ${t.done ? "text-[#c4c4c4] line-through" : "text-black"}`}>
                    {t.title}
                  </span>
                  {t.done ? (
                    <CheckCircle2 size={16} className="shrink-0 text-[#0c7a13]" />
                  ) : (
                    <Circle size={16} className="shrink-0 text-[#dfdfdf]" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <PrimaryButton onClick={() => navigate("/activity", { state: { date: selectedISO } })} className="mt-4">
          Go to this day
        </PrimaryButton>
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
