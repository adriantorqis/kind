import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserRound, Camera } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../components/PhoneShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { usePhotoPicker } from "../components/PhotoPicker";
import { Chip, FormField, FormTextarea, PrimaryButton } from "../components/ui";
import { useStore, type DementiaStage } from "../state/store";

const RELATIONSHIPS = ["Parent", "Grandparent", "Sibling", "Partner", "Spouse", "Other"];
const STAGES: { stage: DementiaStage; desc: string }[] = [
  { stage: "Early Stage", desc: "Mild memory issues, still independent" },
  { stage: "Middle Stage", desc: "Needs daily assistance" },
  { stage: "Late Stage", desc: "Full time care required" },
];

export default function RecipientForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { recipients, addRecipient, updateRecipient } = useStore();
  const editing = recipients.find((r) => r.id === id);
  const isEdit = Boolean(editing);
  const { requestPhoto, sheet } = usePhotoPicker();

  const [name, setName] = useState(editing?.name ?? "");
  const [age, setAge] = useState(editing ? String(editing.age) : "");
  const [relationship, setRelationship] = useState(editing?.relationship ?? "Parent");
  const [stage, setStage] = useState<DementiaStage>(editing?.stage ?? "Early Stage");
  const [notes, setNotes] = useState(editing?.notes ?? "");
  const [photo, setPhoto] = useState<string | undefined>(editing?.photo);

  const valid = name.trim().length > 0 && Number(age) > 0;

  function submit() {
    const payload = { name: name.trim(), age: Number(age), relationship, stage, notes, photo };
    if (isEdit && editing) {
      updateRecipient(editing.id, payload);
      navigate("/recipients");
    } else {
      addRecipient(payload);
      navigate("/recipients");
    }
  }

  return (
    <PhoneShell noScroll>
      <ScreenHeader title={isEdit ? "Edit Recipient" : "Add New Recipient"} />
      <form
        className="flex flex-1 flex-col gap-5 overflow-y-auto no-scrollbar px-6 py-5"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="flex flex-col items-center gap-2 rounded-[14px] bg-white py-6">
          <button
            type="button"
            onClick={async () => {
              const src = await requestPhoto();
              if (src) setPhoto(src);
            }}
            className="relative flex size-[64px] items-center justify-center rounded-full bg-[#dbeafe] text-[#1d4ed8]"
          >
            {photo ? (
              <img src={photo} alt="" className="size-full rounded-full object-cover" />
            ) : (
              <UserRound size={30} />
            )}
            <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-[#1d4ed8] text-white">
              <Camera size={13} />
            </span>
          </button>
          <p className="text-[12px] font-semibold text-[#1d4ed8]/50">
            {photo ? "Tap to Change Photo" : isEdit ? "Tap to Edit Photo" : "Tap to Add Photo"}
          </p>
        </div>

        <p className="text-[16px] font-semibold text-black">Recipient Information</p>
        <FormField label="Full Name*" placeholder="Enter Recipient's Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <FormField label="Age*" type="number" placeholder="Enter Recipient's Age" value={age} onChange={(e) => setAge(e.target.value)} required />

        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-medium text-black">Relationship of Caregiver and Recipient</p>
          <div className="flex flex-wrap gap-2">
            {RELATIONSHIPS.map((r) => (
              <Chip key={r} selected={relationship === r} onClick={() => setRelationship(r)}>
                {r}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-medium text-black">Dementia Stage</p>
          <div className="flex flex-col gap-2">
            {STAGES.map((s) => (
              <button
                type="button"
                key={s.stage}
                onClick={() => setStage(s.stage)}
                className={`flex items-center gap-3 rounded-[14px] bg-white p-4 text-left ${
                  stage === s.stage ? "ring-2 ring-[#1d4ed8]" : ""
                }`}
              >
                <span
                  className={`size-[18px] shrink-0 rounded-full border-2 ${
                    stage === s.stage ? "border-[#1d4ed8] bg-[#1d4ed8]" : "border-[#dfdfdf]"
                  }`}
                />
                <div>
                  <p className="text-[16px] font-semibold text-black">{s.stage}</p>
                  <p className="text-[14px] text-[#818181]">{s.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <FormTextarea
          label="Diagnosis & Notes"
          placeholder="Write down any important notes about their condition, trigger, preferences..."
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <PrimaryButton type="submit" disabled={!valid} className="mt-2">
          {isEdit ? "Save Changes" : "Save New Recipient"}
        </PrimaryButton>
      </form>
      {sheet}
      <HomeIndicator />
    </PhoneShell>
  );
}
