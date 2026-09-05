import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, Pencil, Users } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useStore } from "../../state/store";

export default function PersonDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { people, memories, family } = useStore();

  const person = people.find((p) => p.id === id);

  if (!person) {
    return (
      <PhoneShell gradient="from-[#f4f5f7] to-[#f4f5f7]">
        <ScreenHeader title="Person" onBack={() => navigate("/memory-book")} />
        <div className="flex flex-1 items-center justify-center px-10 text-center">
          <p className="text-[15px] text-[#8a8f99]">This person is no longer in the book.</p>
        </div>
        <HomeIndicator />
      </PhoneShell>
    );
  }

  const theirs = memories.filter((m) => m.peopleIds?.includes(person.id));
  const inCircle = person.familyMemberId ? family.find((f) => f.id === person.familyMemberId) : undefined;

  return (
    <PhoneShell noScroll gradient="from-[#f4f5f7] to-[#f4f5f7]">
      <ScreenHeader
        title=""
        transparent
        onBack={() => navigate("/memory-book")}
        right={
          <button
            onClick={() => navigate(`/memory-book/people/${person.id}/edit`)}
            aria-label="Edit person"
            className="-mr-1.5 flex size-11 items-center justify-center rounded-full text-[#1d4ed8] active:bg-black/5"
          >
            <Pencil size={18} />
          </button>
        }
      />
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-6">
        <div className="flex items-center gap-4 pb-5">
          {person.photo ? (
            <img src={person.photo} alt="" className="size-[68px] rounded-full object-cover" />
          ) : (
            <span className="flex size-[68px] items-center justify-center rounded-full bg-[#eef2ff] text-[26px] font-semibold text-[#1d4ed8]">
              {person.name[0]}
            </span>
          )}
          <div className="flex-1">
            <h1 className="text-[23px] font-semibold leading-tight tracking-[-0.02em] text-[#14161a]">
              {person.name}
            </h1>
            <p className="text-[14px] text-[#8a8f99]">{person.relationship}</p>
            {inCircle && (
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-[5px] bg-[#eef2ff] px-2 py-[3px] text-[11px] font-semibold text-[#1d4ed8]">
                <Users size={11} /> In the care circle
              </span>
            )}
          </div>
        </div>

        {person.note && (
          <div className="rounded-[12px] bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a8f99]">
              What helps when they come up
            </p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-[#2b2f36]">{person.note}</p>
          </div>
        )}

        <div className="mt-5 flex items-baseline justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a8f99]">
            Appears in {theirs.length} {theirs.length === 1 ? "memory" : "memories"}
          </p>
        </div>

        {theirs.length > 0 ? (
          <>
            <div className="mt-2 flex flex-col gap-2">
              {theirs.map((m) => (
                <button
                  key={m.id}
                  onClick={() => navigate(`/memory-book/${m.id}`)}
                  className="flex items-center gap-3 rounded-[12px] bg-white p-2.5 text-left"
                >
                  {m.photo && <img src={m.photo} alt="" className="size-12 shrink-0 rounded-[8px] object-cover" />}
                  <div className="flex-1">
                    <p className="text-[14.5px] font-semibold leading-snug text-[#14161a]">{m.title}</p>
                    <p className="text-[12.5px] text-[#8a8f99]">{m.year}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate(`/memory-book/story?person=${person.id}`)}
              className="mb-6 mt-5 flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#1d4ed8] py-4 text-[16px] font-semibold text-white"
            >
              <BookOpen size={18} /> Read their memories together
            </button>
          </>
        ) : (
          <p className="mt-2 rounded-[12px] border border-dashed border-[#c3c8d2] px-4 py-5 text-center text-[13.5px] text-[#8a8f99]">
            No memories tagged with {person.name} yet. Tag them when you add or edit a memory.
          </p>
        )}
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
