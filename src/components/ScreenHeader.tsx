import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ScreenHeader({
  title,
  onBack,
  transparent = false,
  light = false,
  right,
}: {
  title: string;
  onBack?: () => void;
  transparent?: boolean;
  light?: boolean;
  right?: React.ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <div className={`relative flex h-[55px] shrink-0 items-center justify-center px-6 ${transparent ? "" : "bg-white"}`}>
      <button
        aria-label="Back"
        onClick={() => (onBack ? onBack() : navigate(-1))}
        className={`absolute left-1 top-1/2 -translate-y-1/2 flex size-11 items-center justify-center rounded-full active:bg-black/5 ${light ? "text-white" : "text-black"}`}
      >
        <ChevronLeft size={24} />
      </button>
      <p className={`text-[20px] font-semibold ${light ? "text-white" : "text-black"}`}>{title}</p>
      {right && <div className="absolute right-4">{right}</div>}
    </div>
  );
}
