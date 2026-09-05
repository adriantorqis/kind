import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera, Trash2 } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { FormField, FormTextarea, PrimaryButton } from "../../components/ui";
import { useStore, type MemoryType } from "../../state/store";

const TYPES: { type: MemoryType; emoji: string }[] = [
  { type: "Milestone", emoji: "★" },
  { type: "Moment", emoji: "❤️" },
  { type: "Place", emoji: "📍" },
  { type: "Person", emoji: "👤" },
];

const FEELINGS = ["😊 Happy", "🌅 Nostalgic", "🌟 Proud", "😄 Funny", "🍂 Bittersweet"];

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
  const [feeling, setFeeling] = useState(
    FEELINGS.find((f) => f.startsWith(editing?.feeling ?? "")) ?? FEELINGS[0],
  );
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
      feeling: feeling.split(" ")[0],
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
          className="flex h-[200px] shrink-0 items-center justify-center overflow-hidden bg-[#e8ebf0]"
        >
          {photo ? (
            <img src={photo} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-14 items-center justify-center rounded-full bg-white">
                <Camera size={24} className="text-[#1d4ed8]" />
              </div>
              <p className="text-[14px] font-semibold text-[#14161a]">Add a photo</p>
              <p className="text-[12px] text-[#8a8f99]">The picture does most of the work</p>
            </div>
          )}
        </button>
        {photo && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="border-b border-[#e6e8ec] bg-white py-2.5 text-[13px] font-semibold text-[#1d4ed8]"
          >
            Change photo
          </button>
        )}

        <div className="flex flex-col gap-4 px-6 pt-5">
          <FormField
            label="What happened *"
            placeholder="e.g. Wedding with Siti Rahayu"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <FormField
            label="Year *"
            placeholder="e.g. 1968"
            inputMode="numeric"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />

          <FormTextarea
            label="The story"
            placeholder="Two or three sentences, the way you'd tell it out loud. Small details help most: the weather, a smell, who was there."
            rows={4}
            value={story}
            onChange={(e) => setStory(e.target.value)}
          />

          <FormTextarea
            label={`What to ask ${first}`}
            placeholder="An open question, not a memory test. e.g. What was she wearing that day?"
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {people.length > 0 && (
            <div>
              <p className="mb-2 text-[13px] font-semibold text-[#14161a]">Who's in it</p>
              <div className="flex flex-wrap gap-2">
                {people.map((p) => {
                  const on = peopleIds.includes(p.id);
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => togglePerson(p.id)}
                      className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-[13px] font-medium ${
                        on ? "border-[#1d4ed8] bg-[#1d4ed8] text-white" : "border-[#dde1e8] bg-white text-[#5c6069]"
                      }`}
                    >
                      <span
                        className={`flex size-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                          on ? "bg-white/25 text-white" : "bg-[#eef2ff] text-[#1d4ed8]"
                        }`}
                      >
                        {p.name[0]}
                      </span>
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <p className="mb-2 text-[13px] font-semibold text-[#14161a]">Type</p>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map((t) => (
                <button
                  type="button"
                  key={t.type}
                  onClick={() => setType(t.type)}
                  className={`rounded-[12px] border py-3 text-center text-[13px] font-semibold ${
                    type === t.type
                      ? "border-[#1d4ed8] bg-[#1d4ed8] text-white"
                      : "border-[#dde1e8] bg-white text-[#5c6069]"
                  }`}
                >
                  {t.emoji} {t.type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-semibold text-[#14161a]">How it feels</p>
            <div className="flex flex-wrap gap-2">
              {FEELINGS.map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFeeling(f)}
                  className={`rounded-full border px-3 py-2 text-[13px] font-medium ${
                    feeling === f
                      ? "border-[#1d4ed8] bg-[#1d4ed8] text-white"
                      : "border-[#dde1e8] bg-white text-[#5c6069]"
                  }`}
                >
                  {f}
                </button>
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
