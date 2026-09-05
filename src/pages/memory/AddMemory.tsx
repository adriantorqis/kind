import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Trash2 } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { Chip, FormTextarea, PrimaryButton } from "../../components/ui";
import { usePhotoPicker, PhotoPlaceholder } from "../../components/PhotoPicker";
import { useStore, type MemoryType } from "../../state/store";

const TYPES: MemoryType[] = ["Milestone", "Moment", "Place", "Person"];

export default function AddMemory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { memories, people, addMemory, updateMemory, deleteMemory, selectedRecipient } = useStore();
  const { requestPhoto, sheet } = usePhotoPicker();

  const editing = memories.find((m) => m.id === id);
  const isEdit = Boolean(editing);
  const first = selectedRecipient?.name.split(" ")[0] ?? "them";

  const [title, setTitle] = useState(editing?.title ?? "");
  const [year, setYear] = useState(editing ? String(editing.year) : "");
  const [type, setType] = useState<MemoryType>(editing?.type ?? "Moment");
  const [photo, setPhoto] = useState<string | undefined>(editing?.photo);
  const [story, setStory] = useState(editing?.story ?? "");
  const [prompt, setPrompt] = useState(editing?.prompt ?? "");
  const [peopleIds, setPeopleIds] = useState<string[]>(editing?.peopleIds ?? []);

  // A fresh memory opens to just photo + year + title — everything else is one
  // tap away, not a wall of empty boxes. Editing one that already has detail
  // opens with it visible, so nothing looks like it went missing.
  const [detailsOpen, setDetailsOpen] = useState(
    () => Boolean(editing?.story || editing?.prompt || (editing?.peopleIds?.length ?? 0) > 0),
  );

  const valid = title.trim().length > 0 && /^\d{4}$/.test(year);

  function togglePerson(pid: string) {
    setPeopleIds((prev) => (prev.includes(pid) ? prev.filter((x) => x !== pid) : [...prev, pid]));
  }

  function submit() {
    const payload = {
      title: title.trim(),
      year: Number(year),
      type,
      feeling: editing?.feeling,
      photo,
      story: story.trim() || undefined,
      prompt: prompt.trim() || undefined,
      peopleIds,
    };
    if (isEdit && editing) {
      updateMemory(editing.id, payload);
      navigate(`/memory-book/${editing.id}`);
    } else {
      const newId = addMemory(payload);
      navigate(`/memory-book/${newId}`);
    }
  }

  return (
    <PhoneShell noScroll gradient="from-[#f4f5f7] to-[#f4f5f7]">
      <ScreenHeader title={isEdit ? "Edit Memory" : "Add Memory"} />
      <form
        className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-6 py-5"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        {/* one object, not two fields: the photo and its year, like a print pulled from an envelope */}
        <div className="mx-auto w-full max-w-[260px] rounded-[4px] bg-white p-3 pb-4 shadow-[0_10px_26px_rgba(20,22,26,0.14)]">
          <button
            type="button"
            onClick={async () => {
              const src = await requestPhoto();
              if (src) setPhoto(src);
            }}
            className="relative block aspect-[4/3] w-full overflow-hidden rounded-[2px] bg-[#e8ebf0]"
          >
            {photo ? (
              <>
                <img src={photo} alt="" className="size-full object-cover" />
                <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2.5 py-1 text-[12px] font-medium text-white">
                  Change
                </span>
              </>
            ) : (
              <PhotoPlaceholder />
            )}
          </button>
          <input
            value={year}
            onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="Year"
            aria-label="Year"
            inputMode="numeric"
            required
            className="mt-3 w-full border-0 bg-transparent py-2 text-center text-[24px] font-bold tabular-nums text-[#14161a] outline-none placeholder:text-[#c2c6cd]"
          />
        </div>

        {/* the caption — writing it, not filling a labelled box */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What happened?"
          aria-label="What happened"
          required
          className="mt-5 w-full border-0 bg-transparent py-2.5 text-center text-[20px] font-semibold text-[#14161a] outline-none placeholder:text-[#a6abb4]"
        />

        <button
          type="button"
          onClick={() => setDetailsOpen((v) => !v)}
          className="mx-auto mt-4 flex min-h-11 items-center gap-1 px-3 text-[14px] font-semibold text-[#1d4ed8]"
        >
          {detailsOpen ? "Hide the extra detail" : "Add a story, or tag who's in it"}
          <ChevronDown size={16} className={`transition-transform ${detailsOpen ? "rotate-180" : ""}`} />
        </button>

        {detailsOpen && (
          <div className="mt-2 flex flex-col gap-4">
            <FormTextarea
              label="The story"
              placeholder="What happened, in a few sentences"
              rows={3}
              value={story}
              onChange={(e) => setStory(e.target.value)}
            />
            <FormTextarea
              label={`A question to ask ${first}`}
              placeholder="e.g. What was she wearing that day?"
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            {people.length > 0 && (
              <div>
                <p className="mb-2 text-[14px] font-semibold text-black">Who's in it</p>
                <div className="flex flex-wrap gap-2">
                  {people.map((p) => (
                    <Chip key={p.id} selected={peopleIds.includes(p.id)} onClick={() => togglePerson(p.id)}>
                      {p.name}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 text-[14px] font-semibold text-black">Type</p>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <Chip key={t} selected={type === t} onClick={() => setType(t)}>
                    {t}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        )}

        <PrimaryButton type="submit" disabled={!valid} className="mt-6">
          {isEdit ? "Save changes" : "Add to the book"}
        </PrimaryButton>

        {isEdit && editing && (
          <button
            type="button"
            onClick={() => {
              if (confirm(`Remove "${editing.title}" from the book?`)) {
                deleteMemory(editing.id);
                navigate("/memory-book");
              }
            }}
            className="mb-1 mt-3 flex min-h-11 items-center justify-center gap-2 text-[14px] font-semibold text-[#a3123f]"
          >
            <Trash2 size={15} /> Remove this memory
          </button>
        )}
      </form>
      {sheet}
      <HomeIndicator />
    </PhoneShell>
  );
}
