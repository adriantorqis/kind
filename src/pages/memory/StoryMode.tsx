import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, MessageCircle, Eye, EyeOff, Smile, RotateCcw } from "lucide-react";
import { HomeIndicator } from "../../components/PhoneShell";
import { useStore } from "../../state/store";

/**
 * The book as the person with dementia actually experiences it: one memory at a
 * time, photo first, large type, almost no chrome. The caregiver sets it up and
 * then hands the phone over, which is what the reminiscence-therapy evidence
 * describes — the caregiver curates, the person engages.
 */
export default function StoryMode() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { memories, people, selectedRecipient } = useStore();

  const personFilter = params.get("person");
  const startAt = params.get("start");

  const pages = useMemo(
    () => (personFilter ? memories.filter((m) => m.peopleIds?.includes(personFilter)) : memories),
    [memories, personFilter],
  );

  const [i, setI] = useState(() => {
    if (!startAt) return 0;
    const idx = pages.findIndex((m) => m.id === startAt);
    return idx === -1 ? 0 : idx;
  });
  const [handedOver, setHandedOver] = useState(false);

  const first = selectedRecipient?.name.split(" ")[0] ?? "them";
  const atEnd = i >= pages.length;
  const memory = pages[i];

  // Keyboard arrows help on desktop and cost nothing on touch.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setI((v) => Math.min(v + 1, pages.length));
      if (e.key === "ArrowLeft") setI((v) => Math.max(v - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pages.length]);

  if (pages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-white px-10 text-center">
        <p className="text-[17px] text-[#5c6069]">There are no memories to read yet.</p>
        <button
          onClick={() => navigate("/memory-book")}
          className="rounded-[12px] bg-[#1d4ed8] px-6 py-3 text-[15px] font-semibold text-white"
        >
          Back to the book
        </button>
      </div>
    );
  }

  // ---- closing page ----
  if (atEnd) {
    return (
      <div className="flex h-full flex-col bg-white">
        <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
          <p className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#14161a]">
            That's the end of the book
          </p>
          <p className="mt-3 text-[17px] leading-relaxed text-[#5c6069]">
            You read {pages.length} {pages.length === 1 ? "memory" : "memories"} with {first}.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3">
            <button
              onClick={() => navigate("/moments/log", { state: { kind: "book", title: "Life Memory Book" } })}
              className="flex items-center justify-center gap-2 rounded-[12px] bg-[#1d4ed8] py-4 text-[16px] font-semibold text-white"
            >
              <Smile size={18} /> Log how it went
            </button>
            <button
              onClick={() => setI(0)}
              className="flex items-center justify-center gap-2 rounded-[12px] border border-[#dde1e8] py-4 text-[15px] font-semibold text-[#14161a]"
            >
              <RotateCcw size={16} /> Read it again
            </button>
            <button
              onClick={() => navigate("/memory-book")}
              className="flex min-h-11 items-center justify-center text-[14px] text-[#8a8f99]"
            >
              Close the book
            </button>
          </div>
        </div>
        <HomeIndicator />
      </div>
    );
  }

  const cast = (memory.peopleIds ?? [])
    .map((id) => people.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="relative flex h-full flex-col bg-white">
      {/* progress: one segment per memory, so the length of the book is visible */}
      <div className="flex shrink-0 gap-1 px-4 pt-3">
        {pages.map((_, idx) => (
          <span
            key={idx}
            className={`h-[3px] flex-1 rounded-full ${idx <= i ? "bg-[#1d4ed8]" : "bg-[#e3e6ec]"}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between px-2 py-1.5">
        <button
          onClick={() => navigate("/memory-book")}
          aria-label="Close"
          className="flex size-11 items-center justify-center rounded-full text-[#8a8f99] active:bg-black/5"
        >
          <X size={20} />
        </button>
        <button
          onClick={() => setHandedOver((v) => !v)}
          className="flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-[#1d4ed8] active:bg-black/5"
        >
          {handedOver ? <Eye size={15} /> : <EyeOff size={15} />}
          {handedOver ? "Caregiver view" : `Hand to ${first}`}
        </button>
      </div>

      {/* the memory itself */}
      <div className="relative flex flex-1 flex-col overflow-y-auto no-scrollbar">
        {memory.photo && (
          <div className="relative shrink-0">
            <img src={memory.photo} alt="" className="h-[270px] w-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
            <p className="absolute bottom-3 left-6 text-[38px] font-bold leading-none tracking-[-0.02em] text-white tabular-nums">
              {memory.year}
            </p>
          </div>
        )}

        <div className="px-6 pb-6 pt-5">
          <h1
            className={`font-semibold leading-tight tracking-[-0.02em] text-[#14161a] ${
              handedOver ? "text-[30px]" : "text-[25px]"
            }`}
          >
            {memory.title}
          </h1>

          {memory.story && (
            <p
              className={`mt-3 leading-relaxed text-[#2b2f36] ${handedOver ? "text-[20px]" : "text-[17px]"}`}
            >
              {memory.story}
            </p>
          )}

          {cast.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {cast.map((p) => (
                <span
                  key={p.id}
                  className="flex items-center gap-2 rounded-full bg-[#eef2ff] py-1.5 pl-1.5 pr-3.5"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#1d4ed8] text-[12px] font-semibold text-white">
                    {p.name[0]}
                  </span>
                  <span className={`font-medium text-[#1d4ed8] ${handedOver ? "text-[15px]" : "text-[13.5px]"}`}>
                    {p.name} <span className="font-normal opacity-70">· {p.relationship.toLowerCase()}</span>
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* caregiver-only strip: the thing to actually say out loud */}
      {!handedOver && memory.prompt && (
        <div className="shrink-0 border-t border-[#e6e8ec] bg-[#f7f9ff] px-6 py-3.5">
          <div className="flex gap-2.5">
            <MessageCircle size={16} className="mt-0.5 shrink-0 text-[#1d4ed8]" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1d4ed8]">
                Try saying to {first}
              </p>
              <p className="mt-1 text-[14.5px] italic leading-snug text-[#2b2f36]">"{memory.prompt}"</p>
            </div>
          </div>
        </div>
      )}

      {/* paging: large targets, and the whole photo area is tappable too */}
      <div className="flex shrink-0 items-center justify-between border-t border-[#e6e8ec] bg-white px-3 py-2">
        <button
          onClick={() => setI((v) => Math.max(v - 1, 0))}
          disabled={i === 0}
          className="flex min-h-[52px] items-center gap-1 rounded-[12px] px-4 text-[15px] font-semibold text-[#1d4ed8] disabled:opacity-25"
        >
          <ChevronLeft size={22} /> Back
        </button>
        <span className="text-[13px] tabular-nums text-[#8a8f99]">
          {i + 1} of {pages.length}
        </span>
        <button
          onClick={() => setI((v) => v + 1)}
          className="flex min-h-[52px] items-center gap-1 rounded-[12px] bg-[#1d4ed8] px-5 text-[15px] font-semibold text-white"
        >
          Next <ChevronRight size={22} />
        </button>
      </div>
      <HomeIndicator />
    </div>
  );
}
