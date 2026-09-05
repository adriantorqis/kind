import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, Clock, Pencil, Users } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { PhotoBoxRow } from "../../components/PhotoBox";
import { useStore } from "../../state/store";

export default function PersonDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { people, memories, family, addPersonPhoto, removePersonPhoto, setPrimaryPhoto } = useStore();

  const person = people.find((p) => p.id === id);

  if (!person) {
    return (
      <PhoneShell gradient="from-[#f6efe1] to-[#f6efe1]">
        <ScreenHeader title="Person" onBack={() => navigate("/memory-book")} />
        <div className="flex flex-1 items-center justify-center px-10 text-center">
          <p className="text-[15px] text-[#8a7452]">This person is no longer in the book.</p>
        </div>
        <HomeIndicator />
      </PhoneShell>
    );
  }

  const theirs = memories.filter((m) => m.peopleIds?.includes(person.id));
  const inCircle = person.familyMemberId ? family.find((f) => f.id === person.familyMemberId) : undefined;

  return (
    <PhoneShell noScroll gradient="from-[#f6efe1] to-[#f6efe1]">
      <ScreenHeader
        title=""
        transparent
        onBack={() => navigate("/memory-book")}
        right={
          <button
            onClick={() => navigate(`/memory-book/people/${person.id}/edit`)}
            aria-label="Edit person"
            className="-mr-1.5 flex size-11 items-center justify-center rounded-full text-[#8a7452] active:bg-black/5"
          >
            <Pencil size={18} />
          </button>
        }
      />
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-5">
        <div className="flex items-center gap-4 px-1 pb-4">
          {(person.photos?.length ?? 0) > 0 ? (
            <button
              onClick={() => navigate(`/memory-book/people/${person.id}/ages`)}
              aria-label={`See ${person.name} through the years`}
              className="shrink-0 active:opacity-80"
            >
              <img
                src={person.photo}
                alt=""
                className="size-[64px] rounded-full object-cover shadow-[0_3px_10px_rgba(60,45,25,0.25)]"
              />
            </button>
          ) : person.photo ? (
            <img src={person.photo} alt="" className="size-[64px] shrink-0 rounded-full object-cover shadow-[0_3px_10px_rgba(60,45,25,0.25)]" />
          ) : (
            <span className="flex size-[64px] shrink-0 items-center justify-center rounded-full bg-white text-[24px] font-semibold text-[#8a7452] shadow-[0_3px_10px_rgba(60,45,25,0.18)]">
              {person.name[0]}
            </span>
          )}
          <div className="flex-1">
            <h1 className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-[#3d3222]">
              {person.name}
            </h1>
            <p className="text-[14px] text-[#8a7452]">{person.relationship}</p>
            {inCircle && (
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-[5px] bg-white px-2 py-[3px] text-[11px] font-semibold text-[#1d4ed8]">
                <Users size={11} /> In the care circle
              </span>
            )}
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-[13px] font-semibold text-[#4a3c2a]">Their photo box</p>
          {(person.photos?.length ?? 0) > 1 && (
            <button
              onClick={() => navigate(`/memory-book/people/${person.id}/ages`)}
              className="-mr-1 flex min-h-11 items-center gap-1 px-1 text-[12.5px] font-semibold text-[#1d4ed8]"
            >
              <Clock size={13} /> See through the years
            </button>
          )}
        </div>
        <PhotoBoxRow
          photos={person.photos ?? []}
          coverSrc={person.photo}
          onAdd={(entry) => addPersonPhoto(person.id, entry)}
          onRemove={(pid) => removePersonPhoto(person.id, pid)}
          onSetCover={(pid) => setPrimaryPhoto(person.id, pid)}
        />
        {(person.photos?.length ?? 0) > 1 && (
          <p className="mt-2 px-1 text-[12px] leading-snug text-[#8a7452]">
            An older photo sometimes lands better than a recent one — tap one to make it the main photo.
          </p>
        )}

        {person.note && (
          <div className="mt-5 rounded-[12px] bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a7452]">
              What helps when they come up
            </p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-[#2b2f36]">{person.note}</p>
          </div>
        )}

        <div className="mt-5 flex items-baseline justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a7452]">
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
                    <p className="text-[12.5px] text-[#8a7452]">{m.year}</p>
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
          <p className="mt-2 rounded-[12px] border border-dashed border-[#d8c9a8] px-4 py-5 text-center text-[13.5px] text-[#8a7452]">
            No memories tagged with {person.name} yet. Tag them when you add or edit a memory.
          </p>
        )}
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
