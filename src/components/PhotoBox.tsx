import { useRef, useState } from "react";
import { Camera, Check, ChevronLeft, Star, Trash2, X } from "lucide-react";

export type BoxPhoto = { id: string; year: number; photo: string };

// Deterministic little tilts so the stack looks dropped-in-a-box, not designed.
const TILTS = [-6, 5, -4, 6, -3, 4, -5, 3];

function Polaroid({
  photo,
  year,
  tilt,
  isCover,
  onClick,
}: {
  photo: string;
  year: number;
  tilt: number;
  isCover: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{ transform: `rotate(${tilt}deg)` }}
      className="relative shrink-0 rounded-[3px] bg-white p-[7px] pb-3 shadow-[0_5px_14px_rgba(60,45,25,0.22)] transition active:scale-95"
    >
      {isCover && (
        <span
          style={{ transform: `rotate(${-tilt}deg)` }}
          className="absolute -right-1.5 -top-1.5 z-10 flex size-6 items-center justify-center rounded-full bg-[#1d4ed8] text-white shadow-sm"
        >
          <Star size={11} fill="white" />
        </span>
      )}
      <img src={photo} alt="" className="size-[78px] rounded-[1px] object-cover" />
      <p className="mt-1.5 text-center text-[11px] font-medium tabular-nums text-[#6b5a42]">{year}</p>
    </button>
  );
}

export function PhotoBoxRow({
  photos,
  coverSrc,
  onAdd,
  onRemove,
  onSetCover,
}: {
  photos: BoxPhoto[];
  coverSrc?: string;
  onAdd: (entry: { year: number; photo: string }) => void;
  onRemove?: (id: string) => void;
  onSetCover?: (id: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draftPhoto, setDraftPhoto] = useState<string | undefined>();
  const [draftYear, setDraftYear] = useState("");

  const sorted = [...photos].sort((a, b) => a.year - b.year);
  const selected = sorted.find((p) => p.id === selectedId);

  function beginAdd() {
    setAdding(true);
    setDraftPhoto(undefined);
    setDraftYear("");
    fileRef.current?.click();
  }

  function cancelAdd() {
    setAdding(false);
    setDraftPhoto(undefined);
    setDraftYear("");
  }

  function confirmAdd() {
    if (!draftPhoto || !/^\d{4}$/.test(draftYear)) return;
    onAdd({ year: Number(draftYear), photo: draftPhoto });
    cancelAdd();
  }

  // ---- a photo pulled out of the box for a closer look ----
  if (selected) {
    const isCover = selected.photo === coverSrc;
    return (
      <div className="rounded-[10px] bg-[#efe4cf] p-4">
        <button
          onClick={() => setSelectedId(null)}
          className="mb-3 flex min-h-9 items-center gap-1 text-[13px] font-semibold text-[#8a7452]"
        >
          <ChevronLeft size={16} /> Back to the box
        </button>
        <div className="mx-auto w-fit rounded-[4px] bg-white p-2.5 pb-4 shadow-[0_10px_28px_rgba(60,45,25,0.28)]">
          <img src={selected.photo} alt="" className="max-h-[240px] w-full max-w-[280px] rounded-[2px] object-cover" />
          <p className="mt-2 text-center text-[15px] font-semibold tabular-nums text-[#4a3c2a]">{selected.year}</p>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {!isCover && onSetCover && (
            <button
              onClick={() => {
                onSetCover(selected.id);
                setSelectedId(null);
              }}
              className="flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-[#1d4ed8] text-[14px] font-semibold text-white"
            >
              <Star size={14} fill="white" /> Make this the one everyone sees
            </button>
          )}
          {isCover && (
            <p className="flex min-h-11 items-center justify-center gap-1.5 text-[13px] font-medium text-[#8a7452]">
              <Star size={13} fill="#8a7452" className="text-[#8a7452]" /> This is the main photo
            </p>
          )}
          {onRemove && (
            <button
              onClick={() => {
                onRemove(selected.id);
                setSelectedId(null);
              }}
              className="flex min-h-11 items-center justify-center gap-2 text-[14px] font-semibold text-[#a3123f]"
            >
              <Trash2 size={14} /> Take this one out
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---- the box itself ----
  return (
    <div className="rounded-[10px] bg-[#efe4cf] p-4">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setDraftPhoto(URL.createObjectURL(file));
        }}
      />
      <div className="flex items-start gap-3 overflow-x-auto no-scrollbar pb-1 pt-2">
        {sorted.map((p, i) => (
          <Polaroid
            key={p.id}
            photo={p.photo}
            year={p.year}
            tilt={TILTS[i % TILTS.length]}
            isCover={p.photo === coverSrc}
            onClick={() => setSelectedId(p.id)}
          />
        ))}

        {adding ? (
          <div className="flex shrink-0 flex-col items-center rounded-[3px] bg-white p-[7px] pb-2.5 shadow-[0_5px_14px_rgba(60,45,25,0.22)]">
            {draftPhoto ? (
              <>
                <img src={draftPhoto} alt="" className="size-[78px] rounded-[1px] object-cover" />
                <div className="mt-1.5 flex items-center gap-1">
                  <input
                    value={draftYear}
                    onChange={(e) => setDraftYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="Year"
                    inputMode="numeric"
                    className="w-[46px] rounded-[4px] border border-[#d8c9a8] bg-[#fbf6ec] py-0.5 text-center text-[11px] tabular-nums text-[#4a3c2a] outline-none focus:border-[#1d4ed8]"
                  />
                  <button
                    onClick={confirmAdd}
                    disabled={!/^\d{4}$/.test(draftYear)}
                    aria-label="Add this photo"
                    className="flex size-6 items-center justify-center rounded-full bg-[#1d4ed8] text-white disabled:opacity-30"
                  >
                    <Check size={13} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex size-[78px] items-center justify-center">
                <div className="size-4 animate-spin rounded-full border-2 border-[#c9b691] border-t-transparent" />
              </div>
            )}
            <button
              onClick={cancelAdd}
              aria-label="Cancel"
              className="mt-1 flex min-h-6 items-center gap-0.5 text-[10px] font-medium text-[#a3123f]"
            >
              <X size={10} /> cancel
            </button>
          </div>
        ) : (
          <button
            onClick={beginAdd}
            className="flex size-[92px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-[3px] border-2 border-dashed border-[#c9b691] text-[#8a7452] active:bg-black/[0.03]"
          >
            <Camera size={20} />
            <span className="text-[10.5px] font-medium leading-none">Add a photo</span>
          </button>
        )}
      </div>
    </div>
  );
}
