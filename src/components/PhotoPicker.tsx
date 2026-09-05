import { useCallback, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { PHOTO_LIBRARY } from "../data/photoLibrary";

/**
 * A mock iOS-style photo picker: a sheet that slides up over the current
 * screen with a grid of the "camera roll," the way a real phone would hand
 * a photo to an app — never the desktop's own file-open dialog, which would
 * break the illusion that this is a phone.
 */
function PhotoLibrarySheet({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (src: string) => void;
}) {
  return (
    <div
      className={`absolute inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute inset-x-0 bottom-0 top-16 flex flex-col rounded-t-[16px] bg-white transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-[#d8d8dc]" />
        <div className="flex shrink-0 items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-11 items-center text-[16px] text-[#1d4ed8]"
          >
            Cancel
          </button>
          <p className="text-[16px] font-semibold text-black">Recents</p>
          <span className="min-w-11" />
        </div>
        <div className="grid grid-cols-3 gap-[2px] overflow-y-auto no-scrollbar px-0 pb-4">
          {PHOTO_LIBRARY.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(src)}
              className="aspect-square overflow-hidden active:opacity-70"
            >
              <img src={src} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * `await requestPhoto()` resolves to a picked image's src, or null if the
 * sheet was dismissed. Render `sheet` once, near the top of the page and
 * outside any scrolling container, so it can cover the whole screen.
 */
export function usePhotoPicker() {
  const [open, setOpen] = useState(false);
  const resolverRef = useRef<((src: string | null) => void) | null>(null);

  const requestPhoto = useCallback(() => {
    setOpen(true);
    return new Promise<string | null>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const resolve = useCallback((src: string | null) => {
    setOpen(false);
    resolverRef.current?.(src);
    resolverRef.current = null;
  }, []);

  const sheet = (
    <PhotoLibrarySheet open={open} onClose={() => resolve(null)} onSelect={(src) => resolve(src)} />
  );

  return { requestPhoto, sheet };
}

/** A plain "tap to add a photo" placeholder, shared by every picker trigger. */
export function PhotoPlaceholder({ label = "Add a photo" }: { label?: string }) {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-1.5 text-[#8a8f99]">
      <Camera size={22} />
      <p className="text-[12px] font-medium">{label}</p>
    </div>
  );
}
