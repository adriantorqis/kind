import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, UserPlus, ClipboardPlus, Sparkles, ChevronRight, Check } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { BottomNav } from "../../components/BottomNav";
import { useStore } from "../../state/store";

const ROLE_ORDER = ["Primary Caregiver", "Secondary Caregiver", "Extended Family"] as const;

export default function CircleHub() {
  const navigate = useNavigate();
  const { family, activity, assignActivity, activeAlerts, acknowledgeSymptom, selectedRecipient } = useStore();
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  function memberOf(id: string | null) {
    return family.find((f) => f.id === id) ?? null;
  }

  return (
    <PhoneShell noScroll gradient="from-[#faf5ff] to-[#f1e8ff]">
      <div className="flex shrink-0 flex-col gap-1 px-6 pt-4">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6b4bbd]">Network</p>
        <h1 className="text-[24px] font-semibold text-black">Circle</h1>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto no-scrollbar px-6 py-4">
        {activeAlerts.length > 0 && (
          <div className="flex flex-col gap-2">
            {activeAlerts.map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-[14px] border-2 border-[#a3123f]/40 bg-[#f7dde5] p-4">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#a3123f]" />
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-[#a3123f]">
                    {a.severity} · {a.symptom}
                  </p>
                  {a.note && <p className="mt-0.5 text-[12px] text-[#7a1a37]">{a.note}</p>}
                </div>
                <button
                  onClick={() => acknowledgeSymptom(a.id)}
                  aria-label="Acknowledge"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#a3123f]"
                >
                  <Check size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate("/ai-summary")}
          className="relative flex items-center gap-3 overflow-hidden rounded-[14px] p-4 text-left"
          style={{ background: "linear-gradient(120deg, #f1edff 0%, #eaf1ff 55%, #f7dde5 100%)" }}
        >
          <Sparkles size={18} className="mt-0.5 shrink-0 self-start text-[#6b4bbd]" />
          <div className="min-w-0 flex-1">
            <p
              className="text-[15px] font-semibold text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #6b4bbd 5%, #5443e7 50%, #a3123f 95%)" }}
            >
              Today's Insight
            </p>
            <p className="text-[12px] text-[#5c5470]">Recap of tasks, mood & sessions</p>
          </div>
          <ChevronRight size={18} className="shrink-0 self-center text-[#6b4bbd]/60" />
        </button>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[14px] font-semibold text-black">Family ({family.length})</p>
            <button onClick={() => navigate("/circle/add")} className="flex items-center gap-1 text-[12px] font-semibold text-[#6b4bbd]">
              <UserPlus size={14} /> Add
            </button>
          </div>
          <div className="flex gap-3.5 overflow-x-auto no-scrollbar px-0.5 pb-1">
            {ROLE_ORDER.flatMap((role) => family.filter((f) => f.role === role)).map((m) => (
              <div key={m.id} className="flex w-[68px] shrink-0 flex-col items-center gap-1.5 text-center">
                <div
                  className="flex size-14 shrink-0 items-center justify-center rounded-full text-[18px] font-semibold text-white ring-2 ring-white shadow-[0_2px_8px_rgba(20,10,40,0.15)]"
                  style={{ backgroundColor: m.color }}
                >
                  {m.name[0]}
                </div>
                <p className="w-full truncate text-[12px] font-semibold text-black">{m.name.split(" ")[0]}</p>
                <p className="w-full truncate text-[10px] text-[#9e9e9e]">{m.role.replace(" Caregiver", "")}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[14px] font-semibold text-black">Who's doing what</p>
            <button onClick={() => navigate("/circle/log-symptom")} className="flex items-center gap-1 text-[12px] font-semibold text-[#6b4bbd]">
              <ClipboardPlus size={14} /> Log symptom
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {activity.map((task) => {
              const assignee = memberOf(task.assigneeId);
              return (
                <div key={task.id} className="rounded-[14px] bg-white p-3">
                  <button
                    onClick={() => setOpenTaskId((id) => (id === task.id ? null : task.id))}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-[10px] text-[12px] font-semibold text-white ${
                        assignee ? "" : "bg-[#dfdfdf] text-[#9e9e9e]"
                      }`}
                      style={assignee ? { backgroundColor: assignee.color } : undefined}
                    >
                      {assignee ? assignee.name[0] : "?"}
                    </div>
                    <div className="flex-1">
                      <p className={`text-[14px] font-semibold ${task.done ? "text-[#9e9e9e] line-through" : "text-black"}`}>
                        {task.title}
                      </p>
                      <p className="text-[11px] text-[#9e9e9e]">
                        {task.slot} · {task.time} · {assignee ? assignee.name : "Unassigned"}
                      </p>
                    </div>
                    <ChevronRight size={16} className={`text-[#c4c4c4] transition ${openTaskId === task.id ? "rotate-90" : ""}`} />
                  </button>
                  {openTaskId === task.id && (
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-[#f0f0f0] pt-3">
                      {family.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            assignActivity(task.id, m.id);
                            setOpenTaskId(null);
                          }}
                          className="flex items-center gap-1.5 rounded-full border border-[#e2e8f0] py-1.5 pl-1.5 pr-3 text-[12px] font-medium text-black"
                        >
                          <span
                            className="flex size-5 items-center justify-center rounded-full text-[11px] text-white"
                            style={{ backgroundColor: m.color }}
                          >
                            {m.name[0]}
                          </span>
                          {m.name}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          assignActivity(task.id, null);
                          setOpenTaskId(null);
                        }}
                        className="rounded-full border border-dashed border-[#dfdfdf] px-3 py-1.5 text-[12px] text-[#9e9e9e]"
                      >
                        Unassign
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {selectedRecipient && (
          <p className="pb-2 text-center text-[11px] text-[#9e9e9e]">
            Coordinating care for {selectedRecipient.name}
          </p>
        )}
      </div>
      <BottomNav />
      <HomeIndicator />
    </PhoneShell>
  );
}
