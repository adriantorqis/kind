import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, MessageCircle, Pencil } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useStore } from "../../state/store";

export default function MemoryDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { memories, people, selectedRecipient } = useStore();

  const memory = memories.find((m) => m.id === id);
  const first = selectedRecipient?.name.split(" ")[0] ?? "them";

  if (!memory) {
    return (
      <PhoneShell gradient="from-[#f4f5f7] to-[#f4f5f7]">
        <ScreenHeader title="Memory" onBack={() => navigate("/memory-book")} />
        <div className="flex flex-1 items-center justify-center px-10 text-center">
          <p className="text-[16px] text-[#8a8f99]">This memory is no longer in the book.</p>
        </div>
        <HomeIndicator />
      </PhoneShell>
    );
  }

  const cast = (memory.peopleIds ?? [])
    .map((pid) => people.find((p) => p.id === pid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <PhoneShell noScroll gradient="from-[#f4f5f7] to-[#f4f5f7]">
      <ScreenHeader
        title=""
        transparent
        onBack={() => navigate("/memory-book")}
        right={
          <button
            onClick={() => navigate(`/memory-book/${memory.id}/edit`)}
            aria-label="Edit memory"
            className="-mr-1.5 flex size-11 items-center justify-center rounded-full text-[#1d4ed8] active:bg-black/5"
          >
            <Pencil size={18} />
          </button>
        }
      />
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar">
        {memory.photo && (
          <div className="relative shrink-0">
            <img src={memory.photo} alt="" className="h-[240px] w-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />
            <p className="absolute bottom-3 left-6 text-[24px] font-bold leading-none tracking-[-0.02em] text-white tabular-nums">
              {memory.year}
            </p>
          </div>
        )}

        <div className="px-6 pb-5 pt-4">
          <h1 className="text-[24px] font-semibold leading-tight tracking-[-0.02em] text-[#14161a]">
            {memory.title}
          </h1>
          <p className="mt-1 text-[14px] text-[#8a8f99]">
            {memory.decade} · {memory.type}
          </p>

          {memory.story ? (
            <p className="mt-4 text-[16px] leading-relaxed text-[#2b2f36]">{memory.story}</p>
          ) : (
            <button
              onClick={() => navigate(`/memory-book/${memory.id}/edit`)}
              className="mt-4 w-full rounded-[12px] border border-dashed border-[#c3c8d2] py-4 text-[14px] text-[#8a8f99]"
            >
              No story written yet. Add one so it can be read aloud.
            </button>
          )}

          {cast.length > 0 && (
            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a8f99]">Who's in it</p>
              <div className="mt-2 flex flex-col gap-2">
                {cast.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/memory-book/people/${p.id}`)}
                    className="flex items-center gap-3 rounded-[12px] bg-white px-3 py-2.5 text-left"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[14px] font-semibold text-[#1d4ed8]">
                      {p.name[0]}
                    </span>
                    <span className="flex-1">
                      <span className="block text-[14px] font-semibold text-[#14161a]">{p.name}</span>
                      <span className="block text-[12px] text-[#8a8f99]">{p.relationship}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {memory.prompt && (
          <div className="border-y border-[#e6e8ec] bg-[#f7f9ff] px-6 py-4">
            <div className="flex gap-2.5">
              <MessageCircle size={16} className="mt-0.5 shrink-0 text-[#1d4ed8]" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1d4ed8]">
                  Try saying to {first}
                </p>
                <p className="mt-1 text-[16px] italic leading-snug text-[#2b2f36]">"{memory.prompt}"</p>
              </div>
            </div>
          </div>
        )}

        <div className="px-6 py-5">
          <button
            onClick={() => navigate(`/memory-book/story?start=${memory.id}`)}
            className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#1d4ed8] py-4 text-[16px] font-semibold text-white"
          >
            <BookOpen size={18} /> Read from here
          </button>
        </div>
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
