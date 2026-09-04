import { useEffect, useState, type ReactNode } from "react";
import { Signal, Wifi, BatteryFull } from "lucide-react";

export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 20_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function StatusBar({ light = false }: { light?: boolean }) {
  const color = light ? "text-white" : "text-black";
  const now = useClock();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return (
    <div className={`flex h-[52px] items-center justify-between px-4 shrink-0 ${color}`}>
      <p className="text-[17px] font-semibold tabular-nums">{time}</p>
      <div className="flex items-center gap-1.5">
        <Signal size={15} strokeWidth={2.5} />
        <Wifi size={15} strokeWidth={2.5} />
        <BatteryFull size={20} strokeWidth={1.5} />
      </div>
    </div>
  );
}

export function HomeIndicator({ light = false }: { light?: boolean }) {
  return (
    <div className="flex h-[26px] items-end justify-center pb-2 shrink-0">
      <div className={`h-[5px] w-[140px] rounded-full ${light ? "bg-white" : "bg-black"}`} />
    </div>
  );
}

export function PhoneShell({
  children,
  gradient = "from-[#eee] to-[#dbeafe]",
  statusBarLight = false,
  noScroll = false,
  className = "",
}: {
  children: ReactNode;
  gradient?: string;
  statusBarLight?: boolean;
  noScroll?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex h-full min-h-full flex-col bg-gradient-to-b ${gradient} ${className}`}>
      <StatusBar light={statusBarLight} />
      <div className={`flex flex-1 flex-col ${noScroll ? "overflow-hidden" : "overflow-y-auto no-scrollbar"}`}>
        {children}
      </div>
    </div>
  );
}
