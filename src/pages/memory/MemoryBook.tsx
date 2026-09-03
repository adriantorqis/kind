import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessageCircle, UserRound } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useStore } from "../../state/store";

type Tab = "Timeline" | "People";

const KEY_PEOPLE = [
  { name: "Siti Rahayu", relation: "Wife", note: "Married in 1968. Loves being asked about their wedding day." },
  { name: "Budi", relation: "Son", note: "Took his first steps in 1970. Visits on weekends." },
  { name: "Cici", relation: "First Grandchild", note: "Born in 1998 — a favorite topic that always brings a smile." },
];

export default function MemoryBook() {
  const navigate = useNavigate();
  const { memories } = useStore();
  const [tab, setTab] = useState<Tab>("Timeline");

  const memoryOfDay = memories[0];
  const grouped = memories.reduce<Record<string, typeof memories>>((acc, m) => {
    (acc[m.decade] ??= []).push(m);
    return acc;
  }, {});

  return (
    <PhoneShell noScroll gradient="from-[#f0f4ff] to-[#e8f0fe]">
      <ScreenHeader
        title="Life Memory Book"
        right={
          <button
            onClick={() => navigate("/memory-book/new")}
            aria-label="Add Memory"
            className="-mr-1.5 flex size-11 items-center justify-center rounded-full text-[#1d4ed8] active:bg-black/5"
          >
            <Plus size={22} />
          </button>
        }
      />
      <div className="flex gap-6 border-b border-[#f0f0f0] bg-white px-6">
        {(["Timeline", "People"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-b-2 py-3 text-[14px] font-semibold ${
              tab === t ? "border-[#1d4ed8] text-[#1d4ed8]" : "border-transparent text-[#9e9e9e]"
            }`}
          >
            {t === "Timeline" ? `Life Timeline (${memories.length})` : "Key People"}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-6 py-4">
        {tab === "Timeline" ? (
          <>
            <p className="mb-3 text-[13px] italic text-[#818181]">Bagus's life, in their own story</p>

            {memoryOfDay && (
              <div className="mb-5 shrink-0 rounded-[14px] bg-white shadow-sm">
                <p className="px-4 pt-3 text-[11px] font-semibold uppercase tracking-wide text-[#1d4ed8]">
                  Memory of the Day
                </p>
                <div className="flex gap-3 p-4 pt-2">
                  {memoryOfDay.photo && (
                    <img src={memoryOfDay.photo} alt="" className="size-16 rounded-[10px] object-cover" />
                  )}
                  <div>
                    <p className="text-[14px] font-semibold text-black">{memoryOfDay.title}</p>
                    <p className="text-[12px] text-[#818181]">
                      {memoryOfDay.year} · {memoryOfDay.feeling} nostalgic
                    </p>
                  </div>
                </div>
                {memoryOfDay.prompt && (
                  <div className="mx-4 mb-4 flex gap-2 rounded-[10px] bg-[#f0f4ff] p-3">
                    <MessageCircle size={16} className="mt-0.5 shrink-0 text-[#1d4ed8]" />
                    <p className="text-[12px] leading-4 text-black">
                      <span className="font-semibold">Try saying to Bagus…</span> "{memoryOfDay.prompt}"
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-6">
              {Object.entries(grouped).map(([decade, items]) => (
                <div key={decade}>
                  <p className="mb-2 text-[13px] font-bold text-[#1d4ed8]">{decade}</p>
                  <div className="flex flex-col gap-2">
                    {items.map((m) => (
                      <div key={m.id} className="flex items-center gap-3 rounded-[14px] bg-white p-3">
                        {m.photo && <img src={m.photo} alt="" className="size-14 rounded-[10px] object-cover" />}
                        <div className="flex-1">
                          <p className="text-[14px] font-semibold text-black">{m.title}</p>
                          <p className="text-[12px] text-[#818181]">
                            {m.year} · {m.feeling} · {m.type}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            {KEY_PEOPLE.map((p) => (
              <div key={p.name} className="flex items-start gap-3 rounded-[14px] bg-white p-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[#1d4ed8]">
                  <UserRound size={22} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-black">
                    {p.name} <span className="font-normal text-[#818181]">· {p.relation}</span>
                  </p>
                  <p className="mt-1 text-[13px] text-[#818181]">{p.note}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
