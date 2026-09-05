import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera, Trash2 } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { FormField, FormTextarea, PrimaryButton } from "../../components/ui";
import { useStore } from "../../state/store";

const SUGGESTED = ["Wife", "Husband", "Son", "Daughter", "Grandchild", "Sibling", "Friend"];

export default function PersonForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { people, addPerson, updatePerson, deletePerson, selectedRecipient } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const editing = people.find((p) => p.id === id);
  const isEdit = Boolean(editing);
  const first = selectedRecipient?.name.split(" ")[0] ?? "them";

  const [name, setName] = useState(editing?.name ?? "");
  const [relationship, setRelationship] = useState(editing?.relationship ?? "");
  const [note, setNote] = useState(editing?.note ?? "");
  const [photo, setPhoto] = useState<string | undefined>(editing?.photo);

  const valid = name.trim().length > 0 && relationship.trim().length > 0;

  return (
    <PhoneShell noScroll gradient="from-[#f4f5f7] to-[#f4f5f7]">
      <ScreenHeader title={isEdit ? "Edit Person" : "Add a Person"} />
      <form
        className="flex flex-1 flex-col gap-4 overflow-y-auto no-scrollbar px-6 py-5"
        onSubmit={(e) => {
          e.preventDefault();
          const payload = {
            name: name.trim(),
            relationship: relationship.trim(),
            note: note.trim() || undefined,
            photo,
            familyMemberId: editing?.familyMemberId,
          };
          if (isEdit && editing) {
            updatePerson(editing.id, payload);
            navigate(`/memory-book/people/${editing.id}`);
          } else {
            const newId = addPerson(payload);
            navigate(`/memory-book/people/${newId}`);
          }
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
          className="mx-auto flex flex-col items-center gap-2"
        >
          {photo ? (
            <img src={photo} alt="" className="size-[86px] rounded-full object-cover" />
          ) : (
            <span className="flex size-[86px] items-center justify-center rounded-full bg-white">
              <Camera size={26} className="text-[#1d4ed8]" />
            </span>
          )}
          <span className="text-[13px] font-semibold text-[#1d4ed8]">
            {photo ? "Change photo" : "Add a photo"}
          </span>
        </button>

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
                className={`rounded-full border px-3 py-2 text-[13px] font-medium ${
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
          placeholder="Anything the next person reading the book should know. e.g. She passed in 2019 — he sometimes speaks about her in the present tense, and correcting him upsets him."
          rows={4}
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
      </form>
      <HomeIndicator />
    </PhoneShell>
  );
}
