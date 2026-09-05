import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Send, Stethoscope, BookOpen } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useStore, type Article, type Symptom } from "../../state/store";

type Msg =
  | { from: "user"; text: string }
  | { from: "bot"; text: string; article?: Article; noMatch?: boolean };

// A small, explainable set of caregiver phrasings mapped to the same symptom
// categories used to tag the library — not a general-purpose language model.
// This keeps the assistant's reasoning inspectable: it only ever answers from
// a phrase it recognizes, never a free-form guess.
const SYMPTOM_PHRASES: Record<Symptom, string[]> = {
  Repetition: ["same question", "over and over", "asks again", "keeps asking", "again and again", "repeat", "repeats", "repeating"],
  Sundowning: ["evening", "sundown", "late afternoon", "worse at night", "dusk", "before bed", "gets worse in the evening"],
  Wandering: ["wander", "leaves the house", "walks off", "gets lost", "leaving", "goes outside", "runs away"],
  Agitation: ["agitated", "upset", "angry", "yelling", "hitting", "aggressive", "distressed", "lashing out", "combative"],
  "Memory Loss": ["forget", "forgetful", "memory", "doesn't remember", "can't remember", "misplac"],
  "Communication Difficulty": ["can't find the words", "trouble talking", "won't talk", "can't speak", "find words", "communicat", "can't understand"],
  "Sleep Disturbance": ["can't sleep", "awake at night", "up all night", "won't sleep", "sleeping", "insomnia", "sleep"],
  "Appetite Changes": ["won't eat", "not eating", "no appetite", "losing weight", "refuses to eat", "eat more", "appetite"],
};

function normalize(s: string) {
  return s.toLowerCase().trim();
}

function findBestMatch(query: string, articles: Article[]): { article: Article | null; score: number } {
  const q = normalize(query);

  // Score each symptom by how many of its recognized phrases appear in the question.
  let bestSymptom: Symptom | null = null;
  let bestSymptomHits = 0;
  for (const [symptom, phrases] of Object.entries(SYMPTOM_PHRASES) as [Symptom, string[]][]) {
    const hits = phrases.filter((p) => q.includes(p)).length;
    if (hits > bestSymptomHits) {
      bestSymptomHits = hits;
      bestSymptom = symptom;
    }
  }

  if (bestSymptom && bestSymptomHits > 0) {
    // Among articles tagged with the winning symptom, prefer the one whose
    // title/summary is most specific to it (fewest total symptom tags).
    const candidates = articles.filter((a) => a.symptoms.includes(bestSymptom!));
    if (candidates.length > 0) {
      candidates.sort((a, b) => a.symptoms.length - b.symptoms.length);
      return { article: candidates[0], score: bestSymptomHits };
    }
  }
  return { article: null, score: 0 };
}

const SUGGESTIONS = [
  "Why does he ask the same question over and over?",
  "She gets confused and upset in the evening",
  "How do I get her to eat more?",
];

export default function Assistant() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillQuery = (location.state as { prefillQuery?: string } | null)?.prefillQuery;
  const { articles } = useStore();
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "Ask me anything about day-to-day care — I'll answer from the caregiver library, and tell you plainly when it's beyond what I know." },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const sentPrefill = useRef(false);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const { article, score } = findBestMatch(text, articles);
      if (article && score >= 1) {
        setMessages((m) => [
          ...m,
          { from: "bot", text: article.summary, article },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          {
            from: "bot",
            text: "I don't have a confident answer to that in the caregiver library. This is worth asking a professional directly, rather than me guessing.",
            noMatch: true,
          },
        ]);
      }
      setThinking(false);
      setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 50);
    }, 600);
  }

  useEffect(() => {
    if (prefillQuery && !sentPrefill.current) {
      sentPrefill.current = true;
      send(prefillQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillQuery]);

  return (
    <PhoneShell noScroll gradient="from-[#f0fdfa] to-[#e0f5f1]">
      <ScreenHeader title="Ask KIND" onBack={() => navigate("/learn")} />
      <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto no-scrollbar px-6 py-4">
        {messages.map((m, i) =>
          m.from === "user" ? (
            <div key={i} className="ml-auto max-w-[80%] rounded-[14px] rounded-tr-sm bg-[#1d4ed8] px-4 py-2.5 text-[14px] text-white">
              {m.text}
            </div>
          ) : (
            <div key={i} className="mr-auto flex max-w-[85%] gap-2">
              <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#0b6b62] text-white">
                <Sparkles size={13} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="rounded-[14px] rounded-tl-sm bg-white px-4 py-2.5 text-[14px] leading-5 text-black">
                  {m.text}
                </div>
                {m.article && (
                  <button
                    onClick={() => navigate(`/learn/${m.article!.id}`)}
                    className="flex items-center gap-2 self-start rounded-[10px] border border-[#0b6b62]/30 bg-white px-3 py-2 text-[12px] font-semibold text-[#0b6b62]"
                  >
                    <BookOpen size={13} /> Read "{m.article.title}"
                  </button>
                )}
                {m.noMatch && (
                  <button
                    onClick={() => navigate("/consult/new")}
                    className="flex items-center gap-2 self-start rounded-[10px] border border-[#1d4ed8]/30 bg-white px-3 py-2 text-[12px] font-semibold text-[#1d4ed8]"
                  >
                    <Stethoscope size={13} /> Book a Consultation
                  </button>
                )}
              </div>
            </div>
          ),
        )}
        {thinking && (
          <div className="mr-auto flex items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#0b6b62] text-white">
              <Sparkles size={13} />
            </div>
            <div className="rounded-[14px] rounded-tl-sm bg-white px-4 py-3 text-[14px] text-[#9e9e9e]">Thinking…</div>
          </div>
        )}
        {messages.length === 1 && (
          <div className="mt-1 flex flex-col gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="self-start rounded-[10px] border border-[#0b6b62]/25 bg-white px-3 py-2 text-[12px] text-[#0b6b62]"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex shrink-0 items-center gap-2 border-t border-[#e4e7ee] bg-white px-4 py-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question..."
          className="flex-1 rounded-full bg-[#f0fdfa] px-4 py-2.5 text-[14px] outline-none placeholder:text-[#acb3bb]"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={!input.trim()}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#0b6b62] text-white disabled:opacity-40"
        >
          <Send size={17} />
        </button>
      </form>
      <HomeIndicator />
    </PhoneShell>
  );
}
