import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, Eye, EyeOff, Star, RotateCcw } from "lucide-react";
import { HomeIndicator } from "../../components/PhoneShell";
import { TILTS } from "../../components/PhotoBox";
import { useStore } from "../../state/store";

/**
 * One person, watched across their own years. Built for the same reason the
 * photo box exists: a face from decades ago sometimes registers when a recent
 * one doesn't, so this is a place to actually sit with that — not manage it.
 */
export default function PersonAges() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { people, selectedRecipient, setPrimaryPhoto } = useStore();

  const person = people.find((p) => p.id === id);
  const sorted = useMemo(
    () => [...(person?.photos ?? [])].sort((a, b) => a.year - b.year),
    [person],
  );

  const [i, setI] = useState(() => {
    const idx = sorted.findIndex((p) => p.photo === person?.photo);
    return idx === -1 ? 0 : idx;
  });
  const [handedOver, setHandedOver] = useState(false);

  const first = selectedRecipient?.name.split(" ")[0] ?? "them";
  const backTo = () => navigate(`/memory-book/people/${id}`);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setI((v) => Math.min(v + 1, sorted.length));
      if (e.key === "ArrowLeft") setI((v) => Math.max(v - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sorted.length]);

  if (!person || sorted.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#f6efe1] px-10 text-center">
        <p className="text-[16px] text-[#6b5a42]">There's no photo box to look through yet.</p>
        <button
          onClick={backTo}
          className="rounded-[10px] bg-[#1d4ed8] px-6 py-3 text-[15px] font-semibold text-white"
        >
          Back to their page
        </button>
      </div>
    );
  }

  const atEnd = i >= sorted.length;

  // ---- closing card ----
  if (atEnd) {
    return (
      <div className="flex h-full flex-col bg-[#f6efe1]">
        <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
          <p className="text-[24px] font-semibold leading-tight tracking-[-0.02em] text-[#3d3222]">
            That's every photo of {person.name.split(" ")[0]} we have
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-[#6b5a42]">
            {sorted.length} {sorted.length === 1 ? "year" : "years"}, {sorted[0].year}–{sorted[sorted.length - 1].year}
          </p>
          <div className="mt-8 flex w-full flex-col gap-3">
            <button
              onClick={() => setI(0)}
              className="flex items-center justify-center gap-2 rounded-[10px] bg-[#1d4ed8] py-4 text-[16px] font-semibold text-white"
            >
              <RotateCcw size={16} /> Look again
            </button>
            <button onClick={backTo} className="flex min-h-11 items-center justify-center text-[14px] text-[#8a7452]">
              Back to their page
            </button>
          </div>
        </div>
        <HomeIndicator />
      </div>
    );
  }

  const current = sorted[i];
  const isCover = current.photo === person.photo;

  return (
    <div className="relative flex h-full flex-col bg-[#f6efe1]">
      {/* progress: one segment per year in the box */}
      <div className="flex shrink-0 gap-1 px-4 pt-3">
        {sorted.map((_, idx) => (
          <span
            key={idx}
            className={`h-[3px] flex-1 rounded-full ${idx <= i ? "bg-[#1d4ed8]" : "bg-[#e4d7ba]"}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between px-2 py-1.5">
        <button
          onClick={backTo}
          aria-label="Close"
          className="flex size-11 items-center justify-center rounded-full text-[#8a7452] active:bg-black/5"
        >
          <X size={20} />
        </button>
        <p className={`font-semibold text-[#3d3222] ${handedOver ? "text-[16px]" : "text-[13px]"}`}>
          {handedOver ? person.name.split(" ")[0] : `${person.name} through the years`}
        </p>
        <button
          onClick={() => setHandedOver((v) => !v)}
          aria-label={handedOver ? "Switch to caregiver view" : `Hand to ${first}`}
          className="flex size-11 items-center justify-center rounded-full text-[#1d4ed8] active:bg-black/5"
        >
          {handedOver ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>

      {/* the photo itself, as one big instant-photo */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto no-scrollbar px-8 py-2">
        <div className="w-full max-w-[300px] rounded-[4px] bg-white p-3 pb-5 shadow-[0_14px_34px_rgba(60,45,25,0.3)]">
          <img
            src={current.photo}
            alt=""
            className={`w-full rounded-[2px] object-cover transition-all ${handedOver ? "aspect-[4/5]" : "aspect-square"}`}
          />
          <p
            className={`mt-3 text-center font-bold tabular-nums text-[#4a3c2a] ${
              handedOver ? "text-[34px]" : "text-[26px]"
            }`}
          >
            {current.year}
          </p>
        </div>

        {!handedOver && !isCover && (
          <button
            onClick={() => setPrimaryPhoto(person.id, current.id)}
            className="mt-4 flex min-h-11 items-center gap-1.5 rounded-full px-4 text-[13.5px] font-semibold text-[#1d4ed8] active:bg-black/5"
          >
            <Star size={14} /> Make this the one everyone sees
          </button>
        )}
        {!handedOver && isCover && (
          <p className="mt-4 flex min-h-11 items-center gap-1.5 text-[13px] font-medium text-[#8a7452]">
            <Star size={13} fill="#8a7452" /> This is the main photo
          </p>
        )}
      </div>

      {/* jump straight to a year — hidden once handed over, this is a caregiver's shortcut */}
      {!handedOver && sorted.length > 1 && (
        <div className="flex shrink-0 gap-2.5 overflow-x-auto no-scrollbar px-5 pb-3">
          {sorted.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setI(idx)}
              style={{ transform: `rotate(${TILTS[idx % TILTS.length]}deg)` }}
              className={`shrink-0 rounded-[2px] bg-white p-1 pb-2 shadow-[0_3px_8px_rgba(60,45,25,0.2)] transition ${
                idx === i ? "opacity-100 ring-2 ring-[#1d4ed8]" : "opacity-60"
              }`}
            >
              <img src={p.photo} alt="" className="size-11 rounded-[1px] object-cover" />
              <p className="mt-0.5 text-center text-[9px] tabular-nums text-[#6b5a42]">{p.year}</p>
            </button>
          ))}
        </div>
      )}

      {/* paging */}
      <div className="flex shrink-0 items-center justify-between border-t border-[#e4d7ba] bg-white px-3 py-2">
        <button
          onClick={() => setI((v) => Math.max(v - 1, 0))}
          disabled={i === 0}
          className="flex min-h-[52px] items-center gap-1 rounded-[12px] px-4 text-[15px] font-semibold text-[#1d4ed8] disabled:opacity-25"
        >
          <ChevronLeft size={22} /> Back
        </button>
        <span className="text-[13px] tabular-nums text-[#8a7452]">
          {i + 1} of {sorted.length}
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
