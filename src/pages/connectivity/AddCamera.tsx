import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ScanLine, Wifi, Lock, Camera as CameraIcon, Plus } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { FormField, PrimaryButton } from "../../components/ui";
import { useStore } from "../../state/store";

const NETWORKS = ["Home_5G", "Home_2.4G"];

export default function AddCamera() {
  const navigate = useNavigate();
  const { addCamera } = useStore();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [network, setNetwork] = useState<string | null>(null);
  const [name, setName] = useState("");

  if (step === 1) {
    return (
      <PhoneShell noScroll>
        <ScreenHeader title="Add Camera" />
        <div className="flex flex-1 flex-col gap-3 px-6 py-4">
          <button
            onClick={() => setStep(2)}
            className="relative flex h-[176px] shrink-0 flex-col items-center justify-end gap-1 overflow-hidden rounded-[14px] bg-black/70 p-4 text-white"
          >
            <CameraIcon size={28} />
            <p className="text-[12px] font-bold">Home Camera</p>
            <p className="text-[8px] text-white/50">Home CCTV</p>
          </button>
          <button
            onClick={() => setStep(2)}
            className="relative flex h-[176px] shrink-0 flex-col items-center justify-end gap-1 overflow-hidden rounded-[14px] bg-black/50 p-4 text-white"
          >
            <Wifi size={28} />
            <p className="text-[12px] font-bold">Wearable Device</p>
            <p className="text-[8px] text-white/50">Health Tracker</p>
          </button>
          <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-[14px] bg-[#1d4ed8] text-white">
            <Plus size={28} />
            <span className="text-[14px] font-bold">More devices coming soon</span>
          </div>
        </div>
        <HomeIndicator />
      </PhoneShell>
    );
  }

  if (step === 2) {
    return (
      <div className="relative flex h-full flex-col bg-black text-white">
        <div className="flex h-[52px] items-center px-4">
          <p className="text-[17px] font-semibold">13:13</p>
        </div>
        <div className="relative flex items-center justify-center px-6 pb-2 pt-1">
          <button
            onClick={() => setStep(1)}
            aria-label="Back"
            className="absolute left-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full active:bg-white/10"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="text-[20px] font-semibold">Add Camera</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-10">
          <div className="relative flex size-56 items-center justify-center rounded-[24px] border-2 border-white/70">
            <ScanLine size={64} className="text-white/80" />
          </div>
          <p className="text-center text-[14px] font-bold">Scan the QR code on the device or user manual</p>
          <button
            onClick={() => setStep(3)}
            className="rounded-[32px] bg-[#1d4ed8] px-8 py-3 text-[14px] font-semibold"
          >
            Simulate Scan
          </button>
        </div>
        <HomeIndicator light />
      </div>
    );
  }

  if (step === 3) {
    return (
      <PhoneShell noScroll>
        <ScreenHeader title="Add Camera" onBack={() => setStep(2)} />
        <div className="flex flex-1 flex-col gap-3 px-6 py-4">
          <p className="text-[16px] font-semibold text-black">Connect to Wi-Fi</p>
          {NETWORKS.map((n) => (
            <button
              key={n}
              onClick={() => setNetwork(n)}
              className={`flex h-[60px] items-center gap-3 rounded-[14px] border bg-white px-4 ${
                network === n ? "border-[#1d4ed8]" : "border-[#dfdfdf]"
              }`}
            >
              <Wifi size={20} className="text-[#1d4ed8]" />
              <span className="text-[12px] font-medium text-black">{n}</span>
              <Lock size={16} className="ml-auto text-[#9e9e9e]" />
            </button>
          ))}
          <div className="mt-auto">
            <PrimaryButton pill disabled={!network} onClick={() => setStep(4)}>
              Continue
            </PrimaryButton>
          </div>
        </div>
        <HomeIndicator />
      </PhoneShell>
    );
  }

  return (
    <PhoneShell noScroll>
      <ScreenHeader title="Add Camera" onBack={() => setStep(3)} />
      <div className="flex flex-1 flex-col gap-4 px-6 py-4">
        <p className="text-[16px] font-semibold text-black">Name this camera</p>
        <FormField label="Camera Name" placeholder="Enter Camera Name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="mt-auto">
          <PrimaryButton
            pill
            disabled={!name.trim()}
            onClick={() => {
              addCamera(name.trim());
              navigate("/connectivity");
            }}
          >
            Connect
          </PrimaryButton>
        </div>
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
