import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { FormField, PrimaryButton } from "../../components/ui";
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
  const { addMemory } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState<MemoryType>("Moment");
  const [feeling, setFeeling] = useState(FEELINGS[0]);
  const [photo, setPhoto] = useState<string | undefined>();

  const valid = title.trim().length > 0 && /^\d{4}$/.test(year);

  return (
    <PhoneShell noScroll gradient="from-[#eee] to-[#dbeafe]">
      <ScreenHeader title="Add Memory" />
      <form
        className="flex flex-1 flex-col overflow-y-auto no-scrollbar"
        onSubmit={(e) => {
          e.preventDefault();
          addMemory({ title: title.trim(), year: Number(year), type, feeling: feeling.split(" ")[0], photo });
          navigate("/memory-book");
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
          className="flex h-[224px] shrink-0 items-center justify-center overflow-hidden"
          style={
            photo
              ? undefined
              : { backgroundImage: "linear-gradient(150deg, #ff8800 0%, #d9509a 50%, #c13898 100%)" }
          }
        >
          {photo ? (
            <img src={photo} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-16 items-center justify-center rounded-full bg-white/20">
                <Camera size={28} className="text-white" />
              </div>
              <p className="text-[14px] font-semibold text-white">Tap to add a photo</p>
              <p className="text-[12px] text-white/70">From your camera roll</p>
            </div>
          )}
        </button>

        <div className="flex flex-col gap-4 px-6 pt-5">
          <FormField
            label="Memory Title *"
            placeholder="e.g. Wedding Day in Surabaya"
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

          <div>
            <p className="mb-2 text-[13px] font-semibold text-black">Type of Memory</p>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map((t) => (
                <button
                  type="button"
                  key={t.type}
                  onClick={() => setType(t.type)}
                  className={`rounded-[12px] border py-3 text-center text-[13px] font-semibold ${
                    type === t.type
                      ? "border-transparent text-white"
                      : "border-[#dfdfdf] bg-white text-[#818181]"
                  }`}
                  style={
                    type === t.type
                      ? { backgroundImage: "linear-gradient(165deg, #ff8800 0%, #d9509a 50%, #c13898 100%)" }
                      : undefined
                  }
                >
                  {t.emoji} {t.type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-semibold text-black">Feeling</p>
            <div className="flex flex-wrap gap-2">
              {FEELINGS.map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFeeling(f)}
                  className={`rounded-full border px-3 py-2 text-[13px] font-medium ${
                    feeling === f ? "border-[#1d4ed8] bg-[#1d4ed8] text-white" : "border-[#dfdfdf] bg-white text-[#818181]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <PrimaryButton type="submit" disabled={!valid} className="my-2">
            Continue →
          </PrimaryButton>
        </div>
      </form>
      <HomeIndicator />
    </PhoneShell>
  );
}
