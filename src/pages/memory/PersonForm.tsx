import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { PhotoBoxRow, type BoxPhoto } from "../../components/PhotoBox";
import { FormField, FormTextarea, PrimaryButton } from "../../components/ui";
import { useStore } from "../../state/store";

const SUGGESTED = ["Wife", "Husband", "Son", "Daughter", "Grandchild", "Sibling", "Friend"];

export default function PersonForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { people, addPerson, updatePerson, deletePerson, selectedRecipient } = useStore();

  const editing = people.find((p) => p.id === id);
  const isEdit = Boolean(editing);
  const first = selectedRecipient?.name.split(" ")[0] ?? "them";

  const [name, setName] = useState(editing?.name ?? "");
  const [relationship, setRelationship] = useState(editing?.relationship ?? "");
  const [note, setNote] = useState(editing?.note ?? "");
  const [photos, setPhotos] = useState<BoxPhoto[]>(editing?.photos ?? []);
  const [coverSrc, setCoverSrc] = useState<string | undefined>(editing?.photo);

  const valid = name.trim().length > 0 && relationship.trim().length > 0;

  function submit() {
    const payload = {
      name: name.trim(),
      relationship: relationship.trim(),
      note: note.trim() || undefined,
      photo: coverSrc,
      photos,
      familyMemberId: editing?.familyMemberId,
    };
    if (isEdit && editing) {
      updatePerson(editing.id, payload);
      navigate(`/memory-book/people/${editing.id}`);
    } else {
      const newId = addPerson(payload);
      navigate(`/memory-book/people/${newId}`);
    }
  }

  return (
    <PhoneShell noScroll gradient="from-[#f6efe1] to-[#f6efe1]">
      <ScreenHeader title={isEdit ? "Edit Person" : "Add a Person"} />
      <form
        className="flex flex-1 flex-col gap-4 overflow-y-auto no-scrollbar px-5 py-5"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div>
          <p className="mb-2 px-1 text-[14px] font-semibold text-[#4a3c2a]">
            Their photo box{photos.length === 0 && " — start with one"}
          </p>
          <PhotoBoxRow
            photos={photos}
            coverSrc={coverSrc}
            onAdd={(entry) => {
              const next = { ...entry, id: crypto.randomUUID() };
              setPhotos((prev) => [...prev, next]);
              setCoverSrc((prev) => prev ?? next.photo);
            }}
            onRemove={(pid) => {
              setPhotos((prev) => {
                const removed = prev.find((p) => p.id === pid);
                const next = prev.filter((p) => p.id !== pid);
                if (removed && removed.photo === coverSrc) setCoverSrc(next[0]?.photo);
                return next;
              });
            }}
            onSetCover={(pid) => setCoverSrc(photos.find((p) => p.id === pid)?.photo)}
          />
        </div>

        <div className="flex flex-col gap-4 px-1">
          <FormField
            label="Name *"
            placeholder="e.g. Siti Rahayu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <FormField
              label={`Who they are to ${first} *`}
              placeholder="e.g. Wife"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              required
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRelationship(s)}
                  className={`rounded-full border px-3 py-2 text-[14px] font-medium ${
                    relationship === s
                      ? "border-[#1d4ed8] bg-[#1d4ed8] text-white"
                      : "border-[#dde1e8] bg-white text-[#5c6069]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <FormTextarea
            label="What helps when they come up"
            placeholder="e.g. She passed in 2019 — correcting him when he speaks of her in the present tense upsets him."
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <PrimaryButton type="submit" disabled={!valid} className="mt-1">
            {isEdit ? "Save changes" : "Add to the book"}
          </PrimaryButton>

          {isEdit && editing && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Remove ${editing.name}? They'll be untagged from any memories.`)) {
                  deletePerson(editing.id);
                  navigate("/memory-book");
                }
              }}
              className="mb-3 flex min-h-11 items-center justify-center gap-2 text-[14px] font-semibold text-[#a3123f]"
            >
              <Trash2 size={15} /> Remove this person
            </button>
          )}
        </div>
      </form>
      <HomeIndicator />
    </PhoneShell>
  );
}
