import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Plus, ChevronRight, HeartPulse, Moon, Camera as CameraIcon, Watch } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useStore } from "../../state/store";
import cctvHero from "../../assets/images/cctv-bedroom-hero.png";
import deviceCamera from "../../assets/images/device-home-camera.png";
import deviceWearable from "../../assets/images/device-wearable.png";

type Tab = "Home" | "Camera" | "Monitor";

export default function ConnectivityHub() {
  const navigate = useNavigate();
  const { cameras, heartRate, sleep } = useStore();
  const [tab, setTab] = useState<Tab>("Home");

  return (
    <PhoneShell noScroll>
      <ScreenHeader title="Connectivity" transparent onBack={() => navigate("/home")} />
      <div className="flex shrink-0 justify-center gap-8 border-b border-[#f0f0f0] bg-white px-6">
        {(["Home", "Camera", "Monitor"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`min-h-11 px-1 py-3 text-[14px] font-semibold ${tab === t ? "text-[#1d4ed8] underline underline-offset-4" : "text-[#9e9e9e]"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-6 py-4">
        {tab === "Home" && (
          <>
            <button
              onClick={() => navigate("/ai-summary")}
              className="mb-4 flex items-center gap-2 rounded-[14px] border-2 border-[#98ccff] bg-white p-3"
            >
              <Sparkles size={20} className="text-[#1d4ed8]" />
              <span
                className="text-[12px] font-semibold text-transparent bg-clip-text flex-1 text-left"
                style={{ backgroundImage: "linear-gradient(90deg, #1d4ed8 5%, #5443e7 50%, #6f3eee 90%)" }}
              >
                Here is the summary of Dad's Health
              </span>
              <span className="shrink-0 text-[12px] font-semibold text-[#1d4ed8]">Read the recap</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[14px] bg-white p-4">
                <p className="mb-1 text-[12px] font-bold text-black">Heart Rate</p>
                <div className="flex items-end gap-1">
                  <span className="text-[32px] font-bold leading-none text-black">{heartRate}</span>
                  <span className="pb-1 text-[16px] text-black/50">bpm</span>
                </div>
                <span className="mt-2 inline-flex items-center gap-1 rounded-[6px] bg-[#dcfce7] px-2 py-1 text-[12px] font-semibold text-[#008236]">
                  <HeartPulse size={12} /> Normal
                </span>
              </div>
              <div className="rounded-[14px] bg-white p-4">
                <p className="mb-1 text-[12px] font-bold text-black">Sleep</p>
                <div className="flex items-end gap-1">
                  <span className="text-[32px] font-bold leading-none text-black">{sleep.h}</span>
                  <span className="text-[14px] text-black/50">h</span>
                  <span className="text-[32px] font-bold leading-none text-black">{sleep.m}</span>
                  <span className="text-[14px] text-black/50">m</span>
                </div>
                <span className="mt-2 inline-flex items-center gap-1 rounded-[6px] bg-[#dcfce7] px-2 py-1 text-[12px] font-semibold text-[#008236]">
                  <Moon size={12} /> Normal
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                onClick={() => setTab("Camera")}
                className="flex flex-col items-center gap-2 rounded-[14px] bg-white p-4"
              >
                <img src={deviceCamera} alt="" className="size-16 rounded-full object-cover" />
                <p className="text-[14px] font-bold text-black">Home Camera</p>
                <p className="text-[14px] text-[#9e9e9e]">See all devices</p>
              </button>
              <div className="flex flex-col items-center gap-2 rounded-[14px] bg-white p-4">
                <img src={deviceWearable} alt="" className="size-16 rounded-full object-cover" />
                <p className="text-[14px] font-bold text-black">Wearable Devices</p>
                <p className="text-[14px] text-[#9e9e9e]">See all devices</p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/connectivity/camera/${encodeURIComponent(cameras[0] ?? "Bedroom")}`)}
              className="relative mt-3 h-[176px] shrink-0 overflow-hidden rounded-[14px]"
            >
              <img src={cctvHero} alt="" className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 bg-black/25" />
              <div className="absolute left-4 top-4 flex items-center gap-2">
                <img src={deviceCamera} alt="" className="size-8 rounded-full object-cover" />
                <div className="text-left">
                  <p className="text-[12px] font-bold text-white">{cameras[0] ?? "Bedroom"}</p>
                  <p className="text-[8px] text-white/50">Home CCTV</p>
                </div>
              </div>
              <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#1d4ed8]/80 px-3 py-1 text-[12px] font-bold text-white">
                Open <ChevronRight size={12} />
              </span>
            </button>

            <button
              onClick={() => navigate("/connectivity/add-camera")}
              className="mt-3 flex flex-col items-center justify-center gap-2 rounded-[14px] bg-[#1d4ed8] py-8 text-white"
            >
              <Plus size={28} />
              <span className="text-[14px] font-bold">Connect Device</span>
            </button>
          </>
        )}

        {tab === "Camera" && (
          <div className="flex flex-col gap-3">
            {cameras.map((room) => (
              <button
                key={room}
                onClick={() => navigate(`/connectivity/camera/${encodeURIComponent(room)}`)}
                className="flex h-[60px] items-center gap-3 rounded-[14px] border border-[#dfdfdf] bg-white px-3"
              >
                <CameraIcon size={22} className="text-[#1d4ed8]" />
                <span className="text-[16px] font-medium text-black">{room}</span>
                <ChevronRight size={18} className="ml-auto text-[#c4c4c4]" />
              </button>
            ))}
            <button
              onClick={() => navigate("/connectivity/add-camera")}
              className="flex items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-[#98ccff] py-4 text-[14px] font-semibold text-[#1d4ed8]"
            >
              <Plus size={18} /> Add Camera
            </button>
          </div>
        )}

        {tab === "Monitor" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-[14px] bg-white p-4">
              <Watch size={22} className="text-[#1d4ed8]" />
              <div>
                <p className="text-[14px] font-semibold text-black">No wearable connected</p>
                <p className="text-[12px] text-[#818181]">Connect a device to see live vitals here.</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/connectivity/add-camera")}
              className="flex items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-[#98ccff] py-4 text-[14px] font-semibold text-[#1d4ed8]"
            >
              <Plus size={18} /> Connect Device
            </button>
          </div>
        )}
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
