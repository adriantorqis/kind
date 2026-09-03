import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight, Pencil, Plus } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../components/PhoneShell";
import { ScreenHeader } from "../components/ScreenHeader";
import { useStore } from "../state/store";

export default function RecipientSelect() {
  const navigate = useNavigate();
  const { recipients, selectedRecipientId, selectRecipient } = useStore();

  return (
    <PhoneShell>
      <ScreenHeader title="Select Recipient" onBack={() => navigate(selectedRecipientId ? "/home" : "/welcome")} />
      <div className="flex flex-1 flex-col gap-3 px-6 py-4">
        {recipients.map((r) => {
          const selected = r.id === selectedRecipientId;
          return (
            <div key={r.id} className="relative flex items-center gap-4 rounded-[14px] bg-white p-4">
              <button
                onClick={() => {
                  selectRecipient(r.id);
                  navigate("/home");
                }}
                className="flex flex-1 items-center gap-4 text-left active:opacity-80"
              >
              {r.photo ? (
                <img src={r.photo} alt={r.name} className="size-14 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-lg font-semibold text-[#1d4ed8]">
                  {r.name[0]}
                </div>
              )}
              <div className="flex flex-1 flex-col gap-1">
                <p className="text-[16px] font-semibold text-black">{r.name}</p>
                <p className="text-[13px] text-[#818181]">
                  {r.age}y · {r.relationship}
                </p>
                <span className="w-fit rounded-[4px] bg-[#ffedd4] px-2 py-0.5 text-[11px] font-semibold text-[#ca3500]">
                  {r.stage}
                </span>
              </div>
              {selected ? (
                <CheckCircle2 size={22} className="text-[#1d4ed8]" />
              ) : (
                <ChevronRight size={22} className="text-[#c4c4c4]" />
              )}
              </button>
              <button
                aria-label={`Edit ${r.name}`}
                onClick={() => navigate(`/recipients/${r.id}/edit`)}
                className="absolute right-1 top-1 flex size-11 items-center justify-center rounded-full text-[#c4c4c4] active:bg-black/5 active:text-[#1d4ed8]"
              >
                <Pencil size={16} />
              </button>
            </div>
          );
        })}

        <button
          onClick={() => navigate("/recipients/new")}
          className="mt-1 flex items-center justify-center gap-2 rounded-[8px] bg-[#1d4ed8] py-3 text-[16px] font-semibold text-white active:opacity-90"
        >
          <Plus size={22} />
          Add New Recipient
        </button>
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
