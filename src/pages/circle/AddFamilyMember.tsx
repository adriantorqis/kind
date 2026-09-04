import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { Chip, FormField, PrimaryButton } from "../../components/ui";
import { useStore, type FamilyRole } from "../../state/store";

const ROLES: FamilyRole[] = ["Primary Caregiver", "Secondary Caregiver", "Extended Family"];
const PALETTE = ["#1d4ed8", "#0b6b62", "#6b4bbd", "#c2410c", "#a3123f"];

export default function AddFamilyMember() {
  const navigate = useNavigate();
  const { family, addFamilyMember } = useStore();
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [role, setRole] = useState<FamilyRole>("Secondary Caregiver");

  const valid = name.trim().length > 0 && relationship.trim().length > 0;

  return (
    <PhoneShell noScroll>
      <ScreenHeader title="Add Family Member" />
      <form
        className="flex flex-1 flex-col gap-5 overflow-y-auto no-scrollbar px-6 py-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          addFamilyMember({ name: name.trim(), relationship: relationship.trim(), role, color: PALETTE[family.length % PALETTE.length] });
          navigate("/circle");
        }}
      >
        <p className="text-[13px] text-[#818181]">
          Invited members share visibility into tasks, mood trends, and can be assigned to a routine.
        </p>
        <FormField label="Name*" placeholder="Enter their name" value={name} onChange={(e) => setName(e.target.value)} required />
        <FormField
          label="Relationship*"
          placeholder="e.g. Son, Daughter, Neighbor"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          required
        />
        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-medium text-black">Role</p>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <Chip key={r} selected={role === r} onClick={() => setRole(r)}>
                {r}
              </Chip>
            ))}
          </div>
          <p className="text-[11px] text-[#9e9e9e]">
            {role === "Primary Caregiver" && "Full visibility, can assign tasks to anyone."}
            {role === "Secondary Caregiver" && "Can see and take tasks, log symptoms."}
            {role === "Extended Family" && "Read-only visibility into mood trends and stage."}
          </p>
        </div>
        <PrimaryButton type="submit" disabled={!valid} className="mt-auto">
          Add to Circle
        </PrimaryButton>
      </form>
      <HomeIndicator />
    </PhoneShell>
  );
}
