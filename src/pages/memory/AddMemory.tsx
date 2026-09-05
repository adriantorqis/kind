import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera, Trash2 } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { Chip, FormField, FormTextarea, PrimaryButton } from "../../components/ui";
import { useStore, type MemoryType } from "../../state/store";

const TYPES: MemoryType[] = ["Milestone", "Moment", "Place", "Person"];

export default function AddMemory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { memories, people, addMemory, updateMemory, deleteMemory, selectedRecipient } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);

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
        className="flex flex-1 flex-col overflow-y-auto no-scrollbar"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPhoto(URL.createObjectURL(file));
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative flex h-[160px] shrink-0 items-center justify-center overflow-hidden bg-[#e8ebf0]"
        >
          {photo ? (
            <>
              <img src={photo} alt="" className="size-full object-cover" />
              <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/55 px-3 py-1 text-[12px] font-medium text-white">
                Change
              </span>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-[#5c6069]">
              <Camera size={22} />
              <p className="text-[13px] font-medium">Add a photo</p>
            </div>
          )}
        </button>

        <div className="flex flex-col gap-4 px-6 pt-5">
          <FormField
            label="What happened"
            placeholder="e.g. Wedding with Siti Rahayu"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <FormField
            label="Year"
            placeholder="e.g. 1968"
            inputMode="numeric"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
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
              <p className="mb-2 text-[13px] font-semibold text-black">Who's in it</p>
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
            <p className="mb-2 text-[13px] font-semibold text-black">Type</p>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <Chip key={t} selected={type === t} onClick={() => setType(t)}>
                  {t}
                </Chip>
              ))}
            </div>
          </div>

          <PrimaryButton type="submit" disabled={!valid} className="mt-1">
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
              className="mb-3 flex min-h-11 items-center justify-center gap-2 text-[14px] font-semibold text-[#a3123f]"
            >
              <Trash2 size={15} /> Remove this memory
            </button>
          )}
        </div>
      </form>
      <HomeIndicator />
    </PhoneShell>
  );
}
