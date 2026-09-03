import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { PrimaryButton } from "../../components/ui";

export function AuthStepLayout({
  step,
  title,
  subtitle,
  children,
  ctaLabel,
  onSubmit,
  ctaDisabled,
  footer,
}: {
  step: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  children: ReactNode;
  ctaLabel: string;
  onSubmit: () => void;
  ctaDisabled?: boolean;
  footer?: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <PhoneShell gradient="from-white to-[#dbeafe]">
      <div className="flex flex-col gap-6 px-6 pt-5">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex size-11 shrink-0 -ml-2.5 items-center justify-center self-start text-black active:bg-black/5 rounded-full"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-[2px] flex-1 rounded-full ${s <= step ? "bg-[#1d4ed8]" : "bg-[#dfdfdf]"}`} />
          ))}
        </div>
        <div>
          <h1 className="text-[24px] font-semibold text-black">{title}</h1>
          <p className="mt-1 text-[16px] text-[#818181]">{subtitle}</p>
        </div>
      </div>
      <form
        className="flex flex-1 flex-col justify-between gap-6 px-6 pb-8 pt-8"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="flex flex-col gap-4">{children}</div>
        <div className="flex flex-col gap-3">
          <PrimaryButton type="submit" disabled={ctaDisabled}>
            {ctaLabel}
          </PrimaryButton>
          {footer}
        </div>
      </form>
      <HomeIndicator />
    </PhoneShell>
  );
}
