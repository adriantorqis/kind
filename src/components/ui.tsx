import type { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function PrimaryButton({
  className = "",
  pill = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { pill?: boolean }) {
  return (
    <button
      {...props}
      className={`w-full py-4 text-center text-[16px] font-semibold text-white transition active:opacity-80 disabled:opacity-40 ${
        pill ? "rounded-[32px]" : "rounded-[14px]"
      } bg-[#1d4ed8] ${className}`}
    />
  );
}

export function SecondaryButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`w-full rounded-[32px] border-2 border-[#1d4ed8] py-3 text-center text-[16px] font-semibold text-[#1d4ed8] transition active:opacity-70 ${className}`}
    />
  );
}

export function FormField({
  label,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="text-[14px] font-semibold text-black">{label}</span>
      <input
        {...props}
        className={`w-full rounded-[14px] border border-[#e2e8f0] bg-white px-4 py-3 text-[16px] text-black placeholder:text-[#acb3bb] outline-none focus:border-[#1d4ed8] ${className}`}
      />
    </label>
  );
}

export function FormTextarea({
  label,
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="text-[14px] font-semibold text-black">{label}</span>
      <textarea
        {...props}
        className={`w-full rounded-[14px] border border-[#e2e8f0] bg-white px-4 py-3 text-[14px] text-black placeholder:text-[#acb3bb] outline-none focus:border-[#1d4ed8] ${className}`}
      />
    </label>
  );
}

export function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[14px] border px-4 py-1.5 text-[12px] font-medium transition ${
        selected ? "border-[#1d4ed8] bg-[#1d4ed8] text-white" : "border-[#1d4ed8] bg-white text-[#1d4ed8]"
      }`}
    >
      {children}
    </button>
  );
}

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-[14px] bg-white ${className}`}>{children}</div>;
}
