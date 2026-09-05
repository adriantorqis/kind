import { useNavigate } from "react-router-dom";
import { Check, ChevronRight, TriangleAlert } from "lucide-react";
import { PhoneShell, HomeIndicator, useClock } from "../components/PhoneShell";
import { BottomNav } from "../components/BottomNav";
import { useStore, type ActivityItem } from "../state/store";

function minutesOf(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

function greeting(hour: number) {
  if (hour < 11) return "Good morning";
  if (hour < 15) return "Good afternoon";
  if (hour < 19) return "Good evening";
  return "Tonight";
}

const STAGE_TONE: Record<string, string> = {
  "Early Stage": "bg-[#e7f0e8] text-[#2f6b39]",
  "Middle Stage": "bg-[#ffedd4] text-[#a4451a]",
  "Late Stage": "bg-[#f3e6ef] text-[#7d3560]",
};

export default function Home() {
  const navigate = useNavigate();
  const { selectedRecipient, activity, activeAlerts, family, memories, articles, symptomLogs, consultations } =
    useStore();
  const now = useClock();

  if (!selectedRecipient) {
    navigate("/recipients");
    return null;
  }

  const first = selectedRecipient.name.split(" ")[0];
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const done = activity.filter((a) => a.done).length;

  // The three rows worth showing: what just happened, what's next, what follows.
  const sorted = [...activity].sort((a, b) => minutesOf(a.time) - minutesOf(b.time));
  const nextIdx = sorted.findIndex((a) => !a.done && minutesOf(a.time) >= nowMins);
  const anchor = nextIdx === -1 ? Math.max(0, sorted.length - 3) : Math.max(0, nextIdx - 1);
  const window = sorted.slice(anchor, anchor + 3);
  const nextTask = nextIdx === -1 ? sorted.find((a) => !a.done) : sorted[nextIdx];

  // A memory rotates by day, preferring one with a conversation prompt.
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const withPrompt = memories.filter((m) => m.prompt);
  const pool = withPrompt.length > 0 ? withPrompt : memories;
  const moment = pool[dayIndex % pool.length];

  // Reading suggestion follows the most recent symptom, otherwise the stage.
  const lastSymptom = symptomLogs[0];
  const bySymptom = lastSymptom ? articles.find((a) => a.symptoms.includes(lastSymptom.symptom)) : undefined;
  const suggested = bySymptom ?? articles.find((a) => a.stages.includes(selectedRecipient.stage)) ?? articles[0];
  const suggestedWhy = bySymptom
    ? `You logged ${lastSymptom!.symptom.toLowerCase()} recently`
    : `Common in the ${selectedRecipient.stage.replace(" Stage", "").toLowerCase()} stage`;

  const upcoming = consultations.find((c) => c.status === "Upcoming");
  const memberOf = (id: string | null) => family.find((f) => f.id === id) ?? null;
  const onDuty = family.filter((f) => activity.some((a) => !a.done && a.assigneeId === f.id));

  return (
    <PhoneShell noScroll gradient="from-[#f4f5f7] to-[#f4f5f7]">
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar">
        {/* ---- who, and how they are ---- */}
        <div className="flex items-start gap-4 px-6 pb-5 pt-1">
          <div className="flex-1">
            <p className="text-[14px] text-[#8a8f99]">{greeting(now.getHours())}</p>
            <h1 className="mt-0.5 text-[24px] font-semibold leading-tight tracking-[-0.02em] text-[#14161a]">
              {activeAlerts.length > 0
                ? "Something needs a look"
                : done === activity.length
                  ? `${first} is all set for today`
                  : nextTask
                    ? `${first}'s day is underway`
                    : selectedRecipient.name}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <span className={`rounded-[5px] px-2 py-[3px] text-[11px] font-semibold ${STAGE_TONE[selectedRecipient.stage]}`}>
                {selectedRecipient.stage}
              </span>
              <span className="text-[12px] text-[#8a8f99]">
                {selectedRecipient.age} · {selectedRecipient.relationship}
              </span>
            </div>
          </div>
          <button onClick={() => navigate("/recipients")} aria-label="Switch recipient" className="shrink-0">
            {selectedRecipient.photo ? (
              <img src={selectedRecipient.photo} alt="" className="size-[52px] rounded-full object-cover" />
            ) : (
              <div className="flex size-[52px] items-center justify-center rounded-full bg-[#dbeafe] text-[16px] font-semibold text-[#1d4ed8]">
                {first[0]}
              </div>
            )}
          </button>
        </div>

        {/* ---- anything unresolved comes before anything else ---- */}
        {activeAlerts.length > 0 && (
          <button
            onClick={() => navigate("/circle")}
            className="mb-4 flex items-start gap-3 border-y border-[#e8ccd5] bg-[#fdf2f5] px-6 py-3.5 text-left"
          >
            <TriangleAlert size={17} className="mt-0.5 shrink-0 text-[#a3123f]" />
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-[#7d1233]">
                {activeAlerts[0].severity} · {activeAlerts[0].symptom}
              </p>
              <p className="text-[12px] leading-snug text-[#9c5670]">
                {activeAlerts[0].note || "Logged by the circle, not yet acknowledged."}
                {activeAlerts.length > 1 && ` · ${activeAlerts.length - 1} more`}
              </p>
            </div>
            <ChevronRight size={16} className="mt-0.5 shrink-0 text-[#c08ba0]" />
          </button>
        )}

        {/* ---- today ---- */}
        <section className="border-y border-[#e6e8ec] bg-white">
          <div className="flex items-baseline justify-between px-6 pb-2 pt-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[#8a8f99]">Today</h2>
            <span className="text-[12px] tabular-nums text-[#8a8f99]">{done} of {activity.length} done</span>
          </div>
          <ul>
            {window.map((t: ActivityItem) => {
              const who = memberOf(t.assigneeId);
              const isNext = nextTask?.id === t.id;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => navigate("/activity")}
                    className="flex w-full items-center gap-3 px-6 py-2.5 text-left"
                  >
                    <span className="w-[42px] shrink-0 text-[14px] tabular-nums text-[#8a8f99]">{t.time}</span>
                    <span
                      className={`flex size-[18px] shrink-0 items-center justify-center rounded-full border ${
                        t.done ? "border-[#2f6b39] bg-[#2f6b39] text-white" : isNext ? "border-[#1d4ed8]" : "border-[#d3d6dc]"
                      }`}
                    >
                      {t.done && <Check size={11} strokeWidth={3} />}
                    </span>
                    <span
                      className={`flex-1 text-[14px] ${
                        t.done ? "text-[#a6abb4] line-through" : isNext ? "font-semibold text-[#14161a]" : "text-[#14161a]"
                      }`}
                    >
                      {t.title}
                    </span>
                    <span className="shrink-0 text-[12px] text-[#8a8f99]">{who ? who.name : "Unassigned"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            onClick={() => navigate("/activity")}
            className="flex w-full items-center justify-between px-6 pb-3.5 pt-2 text-[14px] font-medium text-[#1d4ed8]"
          >
            See the full day
            <ChevronRight size={15} />
          </button>
        </section>

        {/* ---- the moment: the emotional centre of the app, so it gets the photo ---- */}
        {moment && (
          <section className="mt-5">
            <h2 className="px-6 pb-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#8a8f99]">
              A moment to share
            </h2>
            <button
              onClick={() => navigate(`/memory-book/${moment.id}`)}
              className="block w-full text-left"
            >
              <div className="relative h-[168px] w-full overflow-hidden">
                {moment.photo && <img src={moment.photo} alt="" className="size-full object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-3">
                  <p className="text-[16px] font-semibold leading-tight text-white">{moment.title}</p>
                  <p className="text-[12px] text-white/70">
                    {moment.year} · {moment.type}
                  </p>
                </div>
              </div>
            </button>
            {moment.prompt && (
              <div className="border-b border-[#e6e8ec] bg-white px-6 py-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[#8a8f99]">
                  Try saying to {first}
                </p>
                <p className="mt-1.5 text-[16px] italic leading-snug text-[#2b2f36]">"{moment.prompt}"</p>
                <button
                  onClick={() => navigate(`/memory-book/story?start=${moment.id}`)}
                  className="-ml-1 mt-1.5 flex min-h-11 items-center gap-1.5 px-1 text-[14px] font-semibold text-[#1d4ed8]"
                >
                  Read this one together
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </section>
        )}

        {/* ---- one thing worth reading, chosen for a stated reason ---- */}
        {suggested && (
          <section className="mt-5">
            <h2 className="px-6 pb-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#8a8f99]">
              Worth reading
            </h2>
            <button
              onClick={() => navigate(`/learn/${suggested.id}`)}
              className="flex w-full items-start gap-3 border-y border-[#e6e8ec] bg-white px-6 py-3.5 text-left"
            >
              <div className="flex-1">
                <p className="text-[16px] font-semibold leading-snug text-[#14161a]">{suggested.title}</p>
                <p className="mt-1 text-[12px] text-[#8a8f99]">
                  {suggestedWhy} · {suggested.readMins} min
                </p>
              </div>
              <ChevronRight size={16} className="mt-1 shrink-0 text-[#c2c6cd]" />
            </button>
          </section>
        )}

        {/* ---- who is carrying today, and anything booked ---- */}
        <section className="mt-5 px-6">
          <h2 className="pb-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#8a8f99]">The circle</h2>
          <button onClick={() => navigate("/circle")} className="flex w-full items-center gap-3 text-left">
            <div className="flex -space-x-2">
              {family.slice(0, 4).map((m) => (
                <span
                  key={m.id}
                  className="flex size-8 items-center justify-center rounded-full border-2 border-[#f4f5f7] text-[12px] font-semibold text-white"
                  style={{ backgroundColor: m.color }}
                >
                  {m.name[0]}
                </span>
              ))}
            </div>
            <p className="flex-1 text-[14px] text-[#5c6069]">
              {onDuty.length > 0
                ? `${onDuty.map((m) => m.name).join(" and ")} still ${onDuty.length > 1 ? "have" : "has"} tasks today`
                : "Everything assigned today is done"}
            </p>
            <ChevronRight size={16} className="shrink-0 text-[#c2c6cd]" />
          </button>

          {upcoming && (
            <button
              onClick={() => navigate("/consult")}
              className="mt-3 flex w-full items-center gap-3 rounded-[10px] border border-[#dde1e8] bg-white px-4 py-3 text-left"
            >
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-[#14161a]">{upcoming.reason}</p>
                <p className="text-[12px] text-[#8a8f99]">
                  {upcoming.date} · {upcoming.time}
                </p>
              </div>
              <ChevronRight size={15} className="shrink-0 text-[#c2c6cd]" />
            </button>
          )}
        </section>

        <div className="h-6" />
      </div>
      <BottomNav />
      <HomeIndicator />
    </PhoneShell>
  );
}
