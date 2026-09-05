import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { Chip, FormField, FormTextarea, PrimaryButton } from "../../components/ui";
import { useStore, type MedForm, type MealInstruction } from "../../state/store";

const UNITS = ["mg", "ml", "mcg", "g", "IU"];
const FORMS: MedForm[] = ["Tablet", "Capsule", "Liquid", "Injection", "Cream"];
const MEAL_INSTRUCTIONS: MealInstruction[] = ["Anytime", "Before food", "After food", "With food"];

function Stepper({ label, value, onChange, min = 1 }: { label: string; value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[14px] font-semibold text-black">{label}</span>
      <div className="flex h-[43px] items-center rounded-[10px] border border-[#e2e8f0] bg-white px-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex size-9 shrink-0 items-center justify-center rounded-[8px] text-black active:bg-black/5"
        >
          <Minus size={15} />
        </button>
        <span className="flex-1 text-center text-[14px] font-semibold text-black">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex size-9 shrink-0 items-center justify-center rounded-[8px] text-black active:bg-black/5"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}

export default function MedicationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { medications, addMedication, updateMedication } = useStore();
  const editing = medications.find((m) => m.id === id);
  const isEdit = Boolean(editing);

  const [name, setName] = useState(editing?.name ?? "");
  const [dosageAmount, setDosageAmount] = useState(editing?.dosageAmount ?? "");
  const [dosageUnit, setDosageUnit] = useState(editing?.dosageUnit ?? "mg");
  const [form, setForm] = useState<MedForm>(editing?.form ?? "Tablet");
  const [amountPerDose, setAmountPerDose] = useState(editing?.amountPerDose ?? 1);
  const [timesPerDay, setTimesPerDay] = useState(editing?.timesPerDay ?? 1);
  const [times, setTimes] = useState<string[]>(editing?.times ?? ["08:00"]);
  const [mealInstruction, setMealInstruction] = useState<MealInstruction>(editing?.mealInstruction ?? "Anytime");
  const [notes, setNotes] = useState(editing?.notes ?? "");

  const valid = name.trim().length > 0 && dosageAmount.trim().length > 0;

  function setTimesPerDayAndSync(n: number) {
    setTimesPerDay(n);
    setTimes((prev) => {
      const next = [...prev];
      while (next.length < n) next.push("08:00");
      return next.slice(0, n);
    });
  }

  function submit() {
    const payload = {
      name: name.trim(),
      dosageAmount: dosageAmount.trim(),
      dosageUnit,
      form,
      amountPerDose,
      timesPerDay,
      times,
      mealInstruction,
      notes: notes.trim(),
      whatFor: editing?.whatFor ?? "",
      avoid: editing?.avoid ?? "",
      sideEffects: editing?.sideEffects ?? "",
    };
    if (isEdit && editing) {
      updateMedication(editing.id, payload);
      navigate(`/medication/${editing.id}`);
    } else {
      const newId = addMedication(payload);
      navigate(`/medication/${newId}`);
    }
  }

  return (
    <PhoneShell noScroll>
      <ScreenHeader title={isEdit ? "Edit Medication" : "Add Medication"} />
      <form
        className="flex flex-1 flex-col gap-5 overflow-y-auto no-scrollbar px-6 py-5"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <FormField label="Name" placeholder="e.g. Panadol" value={name} onChange={(e) => setName(e.target.value)} required />

        <div className="flex flex-col gap-1.5">
          <span className="text-[14px] font-semibold text-black">Dosage</span>
          <input
            value={dosageAmount}
            onChange={(e) => setDosageAmount(e.target.value)}
            placeholder="Enter amount"
            inputMode="decimal"
            className="w-full rounded-[10px] border border-[#e2e8f0] bg-white px-4 py-3 text-[16px] text-black placeholder:text-[#acb3bb] outline-none focus:border-[#1d4ed8]"
          />
          <div className="flex flex-wrap gap-1.5">
            {UNITS.map((u) => (
              <Chip key={u} selected={dosageUnit === u} onClick={() => setDosageUnit(u)}>
                {u}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[14px] font-semibold text-black">Form</span>
          <div className="flex flex-wrap gap-2">
            {FORMS.map((f) => (
              <Chip key={f} selected={form === f} onClick={() => setForm(f)}>
                {f}
              </Chip>
            ))}
          </div>
        </div>

        <Stepper label="Amount per dose" value={amountPerDose} onChange={setAmountPerDose} />
        <Stepper label="Times per day" value={timesPerDay} onChange={setTimesPerDayAndSync} />

        <div className="flex flex-col gap-2">
          <span className="text-[14px] font-semibold text-black">Reminder times</span>
          <div className="flex flex-wrap gap-2">
            {times.map((t, i) => (
              <input
                key={i}
                type="time"
                value={t}
                onChange={(e) =>
                  setTimes((prev) => prev.map((p, idx) => (idx === i ? e.target.value : p)))
                }
                className="rounded-[10px] border border-[#e2e8f0] bg-white px-3 py-2.5 text-[14px] text-black outline-none focus:border-[#1d4ed8]"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[14px] font-semibold text-black">Meal Instruction</span>
          <div className="flex flex-wrap gap-2">
            {MEAL_INSTRUCTIONS.map((mi) => (
              <Chip key={mi} selected={mealInstruction === mi} onClick={() => setMealInstruction(mi)}>
                {mi}
              </Chip>
            ))}
          </div>
        </div>

        <FormTextarea
          label="Notes"
          placeholder="e.g. eat 1x a day in the evening"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <PrimaryButton type="submit" disabled={!valid} pill className="mt-2">
          {isEdit ? "Save Changes" : "Add Medication"}
        </PrimaryButton>
      </form>
      <HomeIndicator />
    </PhoneShell>
  );
}
