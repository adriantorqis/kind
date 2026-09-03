import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronDown, Volume2, Mic, Circle, Camera as CameraIcon, MoreVertical } from "lucide-react";
import { HomeIndicator } from "../../components/PhoneShell";
import { useStore, type Room } from "../../state/store";
import cctvHero from "../../assets/images/cctv-bedroom-hero.png";

function ControlButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Mic;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2">
      <div
        className={`flex size-16 items-center justify-center rounded-full transition ${
          active ? "bg-[#1d4ed8] text-white" : "bg-white/90 text-black"
        }`}
      >
        <Icon size={24} />
      </div>
      <span className="text-[11px] font-medium text-white">{label}</span>
    </button>
  );
}

export default function CameraView() {
  const navigate = useNavigate();
  const { room } = useParams();
  const { cameras } = useStore();
  const currentRoom = (room as Room) ?? cameras[0];

  const [pickerOpen, setPickerOpen] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [recording, setRecording] = useState(false);
  const [flash, setFlash] = useState(false);

  function capture() {
    setFlash(true);
    setTimeout(() => setFlash(false), 180);
  }

  return (
    <div className="relative flex h-full flex-col bg-black text-white">
      <img src={cctvHero} alt={currentRoom} className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-black/30" />
      {flash && <div className="absolute inset-0 bg-white/80" />}

      <div className="relative z-10 flex h-[52px] items-center justify-between px-4">
        <p className="text-[17px] font-semibold">13:13</p>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-1 px-6 pb-2 pt-1">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="absolute left-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full active:bg-white/10"
        >
          <ChevronLeft size={24} />
        </button>
        <button onClick={() => setPickerOpen((v) => !v)} className="flex min-h-11 items-center gap-1 px-2">
          <span className="text-[20px] font-semibold">Home Camera</span>
          <ChevronDown size={16} className={`transition ${pickerOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {pickerOpen && (
        <div className="relative z-20 mx-4 -mt-1 mb-1 shrink-0 overflow-hidden rounded-bl-[24px] rounded-br-[24px] bg-white text-black shadow-lg">
          <p className="px-4 pb-3 pt-4 text-[16px] font-semibold">Home</p>
          {cameras.map((r) => (
            <button
              key={r}
              onClick={() => {
                setPickerOpen(false);
                navigate(`/connectivity/camera/${encodeURIComponent(r)}`);
              }}
              className={`mx-4 mb-2 flex h-[60px] items-center gap-3 rounded-[14px] border px-3 ${
                r === currentRoom ? "border-[#1d4ed8] text-[#1d4ed8]" : "border-[#dfdfdf] text-black"
              }`}
            >
              <CameraIcon size={20} />
              <span className="text-[16px] font-medium">{r}</span>
              {r === currentRoom && <MoreVertical size={18} className="ml-auto" />}
            </button>
          ))}
        </div>
      )}

      <div className="relative z-10 flex items-center gap-2 px-6 pt-2">
        <span className="size-1.5 rounded-full bg-red-500" />
        <span className="text-[10px] font-bold">LIVE</span>
        <span className="text-[10px] text-white/60">· 10:24:30 AM</span>
      </div>
      <p className="relative z-10 px-6 pt-1 text-[16px] font-bold">{currentRoom}</p>

      <div className="relative z-10 mt-auto flex items-center justify-around px-4 pb-10 pt-6">
        <ControlButton icon={Volume2} label="Speaker" active={speakerOn} onClick={() => setSpeakerOn((v) => !v)} />
        <ControlButton icon={Mic} label="Mic" active={micOn} onClick={() => setMicOn((v) => !v)} />
        <ControlButton icon={CameraIcon} label="Capture" onClick={capture} />
        <ControlButton icon={Circle} label="Record" active={recording} onClick={() => setRecording((v) => !v)} />
      </div>
      <HomeIndicator light />
    </div>
  );
}
