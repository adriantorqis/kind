import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import bagusProfile from "../assets/images/bagus-profile.png";
import memBorn from "../assets/images/mem-born.png";
import memGraduated from "../assets/images/mem-graduated.png";
import memWedding from "../assets/images/mem-wedding.png";
import memFirstSteps from "../assets/images/mem-first-steps.png";
import memJakarta from "../assets/images/mem-jakarta.png";
import memFamilyHome from "../assets/images/mem-family-home.png";
import memGrandchild from "../assets/images/mem-grandchild.png";
import memRetirement from "../assets/images/mem-retirement.png";

export type DementiaStage = "Early Stage" | "Middle Stage" | "Late Stage";

export type Recipient = {
  id: string;
  name: string;
  age: number;
  relationship: string;
  stage: DementiaStage;
  notes: string;
  photo?: string;
};

export type MedSlot = "Morning" | "Afternoon" | "Evening" | "Night";

export type ActivityItem = {
  id: string;
  title: string;
  time: string;
  slot: MedSlot;
  done: boolean;
};

export type MemoryType = "Milestone" | "Moment" | "Place" | "Person";
export type Memory = {
  id: string;
  year: number;
  decade: string;
  title: string;
  feeling: string;
  type: MemoryType;
  photo?: string;
  prompt?: string;
};

export type Room = "Bedroom" | "Living Room";

type Store = {
  recipients: Recipient[];
  selectedRecipientId: string | null;
  selectRecipient: (id: string) => void;
  addRecipient: (r: Omit<Recipient, "id">) => string;
  updateRecipient: (id: string, r: Partial<Recipient>) => void;
  selectedRecipient: Recipient | null;

  activity: ActivityItem[];
  toggleActivity: (id: string) => void;

  memories: Memory[];
  addMemory: (m: Omit<Memory, "id" | "decade">) => void;

  cameras: Room[];
  addCamera: (room: string) => void;

  heartRate: number;
  sleep: { h: number; m: number };
};

const StoreCtx = createContext<Store | null>(null);

const seedRecipients: Recipient[] = [
  {
    id: "bagus",
    name: "Bagus Gunawan",
    age: 80,
    relationship: "Parent",
    stage: "Middle Stage",
    notes: "Enjoys stories about Surabaya and family photos from the 1970s–80s.",
    photo: bagusProfile,
  },
];

const seedActivity: ActivityItem[] = [
  { id: "a1", title: "Morning Medication - Panadol", time: "08:00 AM", slot: "Morning", done: true },
  { id: "a2", title: "Blood Pressure Check", time: "09:00 AM", slot: "Morning", done: true },
  { id: "a3", title: "Morning Medication - Panadol", time: "13:00 PM", slot: "Afternoon", done: false },
  { id: "a4", title: "Blood Pressure Check", time: "15:00 PM", slot: "Afternoon", done: false },
  { id: "a5", title: "Morning Medication - Panadol", time: "17:00 AM", slot: "Evening", done: false },
  { id: "a6", title: "Blood Pressure Check", time: "09:00 AM", slot: "Evening", done: false },
  { id: "a7", title: "Aricept (Donepezil)", time: "21:00 PM", slot: "Night", done: false },
];

function decadeOf(year: number) {
  return `${Math.floor(year / 10) * 10}s`;
}

const seedMemories: Memory[] = [
  { id: "m1", year: 1944, decade: "1940s", title: "Born in Surabaya", feeling: "🌅", type: "Milestone", photo: memBorn, prompt: "Dad, tell me about Surabaya when you were a boy. What did your street look like?" },
  { id: "m2", year: 1962, decade: "1960s", title: "Graduated from SMAN 1 Surabaya", feeling: "🌟", type: "Milestone", photo: memGraduated },
  { id: "m3", year: 1968, decade: "1960s", title: "Wedding with Siti Rahayu", feeling: "😊", type: "Moment", photo: memWedding },
  { id: "m4", year: 1970, decade: "1970s", title: "Budi's First Steps", feeling: "😊", type: "Milestone", photo: memFirstSteps },
  { id: "m5", year: 1975, decade: "1970s", title: "A New Life in Jakarta", feeling: "🌅", type: "Milestone", photo: memJakarta },
  { id: "m6", year: 1985, decade: "1980s", title: "The Family Home in Pondok Indah", feeling: "🌟", type: "Place", photo: memFamilyHome },
  { id: "m7", year: 1998, decade: "1990s", title: "Cici — His First Grandchild", feeling: "😊", type: "Moment", photo: memGrandchild },
  { id: "m8", year: 2010, decade: "2010s", title: "Retirement from PT Maju Bersama", feeling: "🍂", type: "Milestone", photo: memRetirement },
];

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [recipients, setRecipients] = useState<Recipient[]>(() => load("kin.recipients", seedRecipients));
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(() =>
    load("kin.selectedRecipientId", "bagus" as string | null),
  );
  const [activity, setActivity] = useState<ActivityItem[]>(() => load("kin.activity", seedActivity));
  const [memories, setMemories] = useState<Memory[]>(() => load("kin.memories", seedMemories));
  const [cameras, setCameras] = useState<Room[]>(() => load("kin.cameras", ["Bedroom", "Living Room"] as Room[]));

  useEffect(() => localStorage.setItem("kin.recipients", JSON.stringify(recipients)), [recipients]);
  useEffect(
    () => localStorage.setItem("kin.selectedRecipientId", JSON.stringify(selectedRecipientId)),
    [selectedRecipientId],
  );
  useEffect(() => localStorage.setItem("kin.activity", JSON.stringify(activity)), [activity]);
  useEffect(() => localStorage.setItem("kin.memories", JSON.stringify(memories)), [memories]);
  useEffect(() => localStorage.setItem("kin.cameras", JSON.stringify(cameras)), [cameras]);

  const value = useMemo<Store>(
    () => ({
      recipients,
      selectedRecipientId,
      selectRecipient: (id) => setSelectedRecipientId(id),
      addRecipient: (r) => {
        const id = crypto.randomUUID();
        setRecipients((prev) => [...prev, { ...r, id }]);
        return id;
      },
      updateRecipient: (id, r) =>
        setRecipients((prev) => prev.map((x) => (x.id === id ? { ...x, ...r } : x))),
      selectedRecipient: recipients.find((r) => r.id === selectedRecipientId) ?? null,

      activity,
      toggleActivity: (id) =>
        setActivity((prev) => prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a))),

      memories: [...memories].sort((a, b) => a.year - b.year),
      addMemory: (m) => setMemories((prev) => [...prev, { ...m, id: crypto.randomUUID(), decade: decadeOf(m.year) }]),

      cameras,
      addCamera: (room) => setCameras((prev) => (prev.includes(room as Room) ? prev : [...prev, room as Room])),

      heartRate: 76,
      sleep: { h: 7, m: 24 },
    }),
    [recipients, selectedRecipientId, activity, memories, cameras],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
