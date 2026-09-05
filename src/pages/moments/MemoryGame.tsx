import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Sparkles } from "lucide-react";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { ScreenHeader } from "../../components/ScreenHeader";
import { PrimaryButton } from "../../components/ui";

const SYMBOLS = ["🌸", "🐦", "☕", "🎵", "🏡", "🌙"];

type Card = { id: number; symbol: string; matched: boolean };

function shuffledDeck(): Card[] {
  const pairs = [...SYMBOLS, ...SYMBOLS];
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((symbol, id) => ({ id, symbol, matched: false }));
}

export default function MemoryGame() {
  const navigate = useNavigate();
  const [deck, setDeck] = useState<Card[]>(() => shuffledDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);

  const allMatched = useMemo(() => deck.every((c) => c.matched), [deck]);

  function flip(id: number) {
    if (busy || flipped.includes(id) || deck[id].matched || flipped.length === 2) return;
    const next = [...flipped, id];
    setFlipped(next);
    if (next.length === 2) {
      setBusy(true);
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (deck[a].symbol === deck[b].symbol) {
        setTimeout(() => {
          setDeck((prev) => prev.map((c) => (c.id === a || c.id === b ? { ...c, matched: true } : c)));
          setFlipped([]);
          setBusy(false);
        }, 400);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setBusy(false);
        }, 800);
      }
    }
  }

  function reset() {
    setDeck(shuffledDeck());
    setFlipped([]);
    setMoves(0);
    setBusy(false);
  }

  return (
    <PhoneShell noScroll gradient="from-[#fff7ec] to-[#ffe9d6]">
      <ScreenHeader title="Memory Match" transparent onBack={() => navigate("/moments")} />
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-6 py-4">
        {!allMatched ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[14px] text-[#818181]">Find the matching pairs</p>
              <p className="text-[14px] font-semibold text-[#c2410c]">{moves} moves</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {deck.map((card) => {
                const shown = flipped.includes(card.id) || card.matched;
                return (
                  <button
                    key={card.id}
                    onClick={() => flip(card.id)}
                    disabled={card.matched}
                    className={`flex aspect-square items-center justify-center rounded-[14px] text-[24px] transition ${
                      card.matched ? "bg-[#dcfce7]" : shown ? "bg-white" : "bg-[#c2410c]"
                    }`}
                  >
                    {shown ? card.symbol : ""}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <Sparkles size={44} className="text-[#c2410c]" />
            <p className="text-[20px] font-semibold text-black">All matched!</p>
            <p className="text-[14px] text-[#818181]">Finished in {moves} moves.</p>
            <div className="mt-2 flex w-full flex-col gap-2">
              <PrimaryButton onClick={() => navigate("/moments/log", { state: { kind: "game", title: "Memory Match" } })}>
                Continue
              </PrimaryButton>
              <button onClick={reset} className="flex items-center justify-center gap-2 py-2 text-[14px] font-medium text-[#818181]">
                <RotateCcw size={14} /> Play again
              </button>
            </div>
          </div>
        )}
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
