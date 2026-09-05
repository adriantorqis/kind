import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, BookOpen, X } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useStore } from "../../state/store";

export default function MemoryBook() {
  const navigate = useNavigate();
  const { memories, people, selectedRecipient } = useStore();
  const [q, setQ] = useState("");

  const first = selectedRecipient?.name.split(" ")[0] ?? "them";
  const query = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!query) return memories;
    return memories.filter((m) => {
      const cast = (m.peopleIds ?? [])
        .map((id) => people.find((p) => p.id === id)?.name ?? "")
        .join(" ");
      return [m.title, m.story ?? "", String(m.year), m.decade, m.type, cast]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [memories, people, query]);

  const grouped = results.reduce<Record<string, typeof memories>>((acc, m) => {
    (acc[m.decade] ??= []).push(m);
    return acc;
  }, {});

  const cover = memories.filter((m) => m.photo).slice(0, 3);
  const span =
    memories.length > 0
      ? `${memories[0].year} – ${memories[memories.length - 1].year}`
      : "";

  return (
    <PhoneShell noScroll gradient="from-[#f4f5f7] to-[#f4f5f7]">
      <ScreenHeader
        title="Life Memory Book"
        onBack={() => navigate("/moments")}
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

      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar">
        {/* the book itself, as an object you open */}
        <div className="px-6 pb-5 pt-1">
          <button
            onClick={() => navigate("/memory-book/story")}
            disabled={memories.length === 0}
            className="flex w-full items-center gap-4 rounded-[14px] bg-white p-3.5 text-left disabled:opacity-50"
          >
            <div className="flex shrink-0 -space-x-4">
              {cover.map((m, idx) => (
                <img
                  key={m.id}
                  src={m.photo}
                  alt=""
                  className="size-[54px] rounded-[10px] border-2 border-white object-cover"
                  style={{ zIndex: cover.length - idx }}
                />
              ))}
            </div>
            <div className="flex-1">
              <p className="text-[16px] font-semibold leading-tight text-[#14161a]">
                Read {first}'s book together
              </p>
              <p className="mt-0.5 text-[12.5px] text-[#8a8f99]">
                {memories.length} {memories.length === 1 ? "memory" : "memories"}
                {span && ` · ${span}`}
              </p>
            </div>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1d4ed8] text-white">
              <BookOpen size={18} />
            </span>
          </button>
        </div>

        {/* people: the book's cast, and a way into a themed reading */}
        <div className="border-y border-[#e6e8ec] bg-white py-4">
          <div className="flex items-baseline justify-between px-6 pb-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[#8a8f99]">
              The people in it
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-6">
            {people.map((p) => {
              const count = memories.filter((m) => m.peopleIds?.includes(p.id)).length;
              return (
                <button
                  key={p.id}
                  onClick={() => navigate(`/memory-book/people/${p.id}`)}
                  className="flex w-[68px] shrink-0 flex-col items-center gap-1.5"
                >
                  {p.photo ? (
                    <img src={p.photo} alt="" className="size-14 rounded-full object-cover" />
                  ) : (
                    <span className="flex size-14 items-center justify-center rounded-full bg-[#eef2ff] text-[19px] font-semibold text-[#1d4ed8]">
                      {p.name[0]}
                    </span>
                  )}
                  <span className="w-full truncate text-center text-[12px] font-medium text-[#14161a]">
                    {p.name.split(" ")[0]}
                  </span>
                  <span className="text-[11px] text-[#8a8f99]">{count}</span>
                </button>
              );
            })}
            <button
              onClick={() => navigate("/memory-book/people/new")}
              className="flex w-[68px] shrink-0 flex-col items-center gap-1.5"
            >
              <span className="flex size-14 items-center justify-center rounded-full border border-dashed border-[#b9c0cc] text-[#8a8f99]">
                <Plus size={20} />
              </span>
              <span className="text-center text-[12px] font-medium text-[#8a8f99]">Add</span>
            </button>
          </div>
        </div>

        {/* search */}
        <div className="px-6 pb-1 pt-4">
          {/* a label so the whole padded row is the tap target, not just the text box */}
          <label className="flex items-center gap-2 rounded-[11px] bg-white px-3.5">
            <Search size={16} className="shrink-0 text-[#8a8f99]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search a year, a place, a name…"
              className="min-w-0 flex-1 bg-transparent py-3 text-[14.5px] text-[#14161a] outline-none placeholder:text-[#a6abb4]"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Clear search"
                className="-mr-2 flex size-11 shrink-0 items-center justify-center text-[#8a8f99]"
              >
                <X size={16} />
              </button>
            )}
          </label>
        </div>

        {/* the timeline, on a real spine */}
        <div className="px-6 pb-6 pt-4">
          {results.length === 0 ? (
            <p className="rounded-[12px] border border-dashed border-[#c3c8d2] px-4 py-8 text-center text-[14px] text-[#8a8f99]">
              Nothing in the book matches "{q}".
            </p>
          ) : (
            Object.entries(grouped).map(([decade, items]) => (
              <div key={decade}>
                <p className="pb-2 pt-1 text-[13px] font-bold tabular-nums text-[#1d4ed8]">{decade}</p>
                <div className="relative border-l border-[#dbe0e8] pl-5">
                  {items.map((m) => (
                    <div key={m.id} className="relative pb-3">
                      <span className="absolute -left-[23px] top-[26px] size-[7px] rounded-full bg-[#1d4ed8] ring-4 ring-[#f4f5f7]" />
                      <button
                        onClick={() => navigate(`/memory-book/${m.id}`)}
                        className="flex w-full gap-3 rounded-[12px] bg-white p-3 text-left"
                      >
                        {m.photo && (
                          <img src={m.photo} alt="" className="size-[58px] shrink-0 rounded-[9px] object-cover" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-[14.5px] font-semibold leading-snug text-[#14161a]">{m.title}</p>
                          <p className="text-[12px] tabular-nums text-[#8a8f99]">
                            {m.year} · {m.feeling} {m.type}
                          </p>
                          {m.story && (
                            <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-[#5c6069]">{m.story}</p>
                          )}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
