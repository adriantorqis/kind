import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Music, Image, Waves as WavesIcon, Mic, Play, Pause, ChevronRight } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { PrimaryButton } from "../../components/ui";
import memWedding from "../../assets/images/mem-wedding.png";

const TRACKS = [
  { id: "gamelan", icon: Music, title: "Gamelan Lullaby", desc: "Soft traditional instrumental" },
  { id: "photos", icon: Image, title: "Family Photo Slideshow", desc: "Familiar faces, gentle pace", photo: memWedding },
  { id: "waves", icon: WavesIcon, title: "Ocean Waves", desc: "Calming nature sounds" },
  { id: "voice", icon: Mic, title: "A Familiar Voice", desc: "Recorded message from family" },
];

export default function SensoryPlayer() {
  const navigate = useNavigate();
  const [nowPlaying, setNowPlaying] = useState<(typeof TRACKS)[number] | null>(null);
  const [playing, setPlaying] = useState(false);

  if (nowPlaying) {
    return (
      <div className="relative flex h-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#3a2a1a] to-[#1a1108] px-8 py-10 text-white">
        <button
          onClick={() => setNowPlaying(null)}
          className="-ml-2 flex min-h-11 items-center self-start px-2 text-[13px] font-medium text-white/70"
        >
          ← Choose another
        </button>

        <div className="flex flex-col items-center gap-6">
          <div
            className={`flex size-40 items-center justify-center rounded-full bg-white/10 ${playing ? "animate-pulse" : ""}`}
          >
            <div className="flex size-28 items-center justify-center rounded-full bg-white/15">
              <nowPlaying.icon size={44} className="text-white/90" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[19px] font-semibold">{nowPlaying.title}</p>
            <p className="text-[13px] text-white/60">{nowPlaying.desc}</p>
          </div>
          <button
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
            className="flex size-16 items-center justify-center rounded-full bg-white text-[#3a2a1a]"
          >
            {playing ? <Pause size={26} /> : <Play size={26} className="ml-1" />}
          </button>
        </div>

        <div className="w-full">
          <PrimaryButton
            onClick={() => navigate("/moments/log", { state: { kind: "sensory", title: nowPlaying.title } })}
            className="bg-white/15"
          >
            Done for now
          </PrimaryButton>
        </div>
        <HomeIndicator light />
      </div>
    );
  }

  return (
    <PhoneShell noScroll gradient="from-[#fff7ec] to-[#ffe9d6]">
      <ScreenHeader title="Calm & Sensory" transparent onBack={() => navigate("/moments")} />
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto no-scrollbar px-6 py-4">
        <p className="text-[13px] text-[#818181]">
          Gentle, low-effort content — no interaction required, just something soothing to experience.
        </p>
        {TRACKS.map((t) => (
          <button
            key={t.id}
            onClick={() => setNowPlaying(t)}
            className="flex items-center gap-3 rounded-[14px] bg-white p-4 text-left"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#fff0e0] text-[#c2410c]">
              <t.icon size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-semibold text-black">{t.title}</p>
              <p className="text-[12px] text-[#818181]">{t.desc}</p>
            </div>
            <ChevronRight size={20} className="text-[#c4c4c4]" />
          </button>
        ))}
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
