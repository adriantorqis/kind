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
  assigneeId: string | null;
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

// ---- Kindred Moments (K) ----
export type MomentKind = "game" | "book" | "sensory";
export type EngagementLog = {
  id: string;
  recipientId: string;
  kind: MomentKind;
  title: string;
  at: string; // ISO timestamp
  mood: "😊" | "😐" | "😟" | null;
  note?: string;
};

// ---- Informed Caregiving (I) ----
export type Symptom =
  | "Sundowning"
  | "Wandering"
  | "Agitation"
  | "Memory Loss"
  | "Communication Difficulty"
  | "Sleep Disturbance"
  | "Repetition"
  | "Appetite Changes";

export type Article = {
  id: string;
  title: string;
  summary: string;
  body: string[];
  stages: DementiaStage[];
  symptoms: Symptom[];
  readMins: number;
  tag: "Early Signs" | "Daily Care" | "Behavior" | "Communication" | "Safety";
};

// ---- Network (N) ----
export type FamilyRole = "Primary Caregiver" | "Secondary Caregiver" | "Extended Family";
export type FamilyMember = {
  id: string;
  name: string;
  role: FamilyRole;
  relationship: string;
  color: string;
};

export type SymptomSeverity = "Mild" | "Moderate" | "Severe";
export type SymptomLog = {
  id: string;
  recipientId: string;
  symptom: Symptom;
  severity: SymptomSeverity;
  note: string;
  at: string; // ISO timestamp
  acknowledged: boolean;
};

// ---- Direct-to-Professional (D) ----
export type SpecialistType = "Geriatrician" | "Neurologist" | "Psychologist";
export type Specialist = {
  id: string;
  name: string;
  type: SpecialistType;
  title: string;
  clinic: string;
};

export type Consultation = {
  id: string;
  specialistId: string;
  date: string; // e.g. "Fri, 12 Sep"
  time: string; // e.g. "10:30 AM"
  attachContext: boolean;
  reason: string;
  status: "Upcoming" | "Completed" | "Cancelled";
};

type Store = {
  recipients: Recipient[];
  selectedRecipientId: string | null;
  selectRecipient: (id: string) => void;
  addRecipient: (r: Omit<Recipient, "id">) => string;
  updateRecipient: (id: string, r: Partial<Recipient>) => void;
  selectedRecipient: Recipient | null;

  activity: ActivityItem[];
  toggleActivity: (id: string) => void;
  assignActivity: (id: string, assigneeId: string | null) => void;
  addActivity: (a: Omit<ActivityItem, "id" | "done">) => void;

  memories: Memory[];
  addMemory: (m: Omit<Memory, "id" | "decade">) => void;

  cameras: Room[];
  addCamera: (room: string) => void;

  heartRate: number;
  sleep: { h: number; m: number };

  // Kindred Moments
  engagementLog: EngagementLog[];
  logEngagement: (e: Omit<EngagementLog, "id" | "at" | "recipientId">) => void;
  recommendedMoment: { kind: MomentKind; title: string; reason: string };

  // Informed Caregiving
  articles: Article[];

  // Network
  family: FamilyMember[];
  addFamilyMember: (m: Omit<FamilyMember, "id">) => void;
  symptomLogs: SymptomLog[];
  logSymptom: (s: Omit<SymptomLog, "id" | "at" | "acknowledged" | "recipientId">) => void;
  acknowledgeSymptom: (id: string) => void;
  activeAlerts: SymptomLog[];

  // Direct-to-Professional
  specialists: Specialist[];
  consultations: Consultation[];
  bookConsultation: (c: Omit<Consultation, "id" | "status">) => string;
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
  { id: "a1", title: "Morning Medication - Panadol", time: "08:00 AM", slot: "Morning", done: true, assigneeId: "fam-you" },
  { id: "a2", title: "Blood Pressure Check", time: "09:00 AM", slot: "Morning", done: true, assigneeId: "fam-you" },
  { id: "a3", title: "Morning Medication - Panadol", time: "13:00 PM", slot: "Afternoon", done: false, assigneeId: "fam-budi" },
  { id: "a4", title: "Blood Pressure Check", time: "15:00 PM", slot: "Afternoon", done: false, assigneeId: null },
  { id: "a5", title: "Evening walk", time: "17:00 PM", slot: "Evening", done: false, assigneeId: "fam-you" },
  { id: "a6", title: "Blood Pressure Check", time: "09:00 AM", slot: "Evening", done: false, assigneeId: null },
  { id: "a7", title: "Aricept (Donepezil)", time: "21:00 PM", slot: "Night", done: false, assigneeId: "fam-you" },
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

const seedArticles: Article[] = [
  {
    id: "art-early-signs",
    title: "Normal Aging or Early Dementia? What to Watch For",
    summary: "Occasional forgetfulness is normal. Here's the difference between typical aging and signs worth discussing with a doctor.",
    body: [
      "Everyone misplaces their keys sometimes. The difference between normal aging and possible early dementia is less about a single forgotten word, and more about a pattern: does the same kind of forgetting keep happening, and is it starting to affect daily life?",
      "Watch for: forgetting recently learned information and asking the same question repeatedly; trouble following a familiar recipe or paying bills they've always managed; getting lost on a route they've driven for years; withdrawing from hobbies or social activities without a clear reason.",
      "This is not a diagnosis, and it isn't meant to be one. If two or more of these feel familiar, it's worth writing down specific examples — dates, what happened — and bringing them to a doctor. Early conversations lead to earlier support, for everyone in the family.",
    ],
    stages: ["Early Stage"],
    symptoms: ["Memory Loss"],
    readMins: 3,
    tag: "Early Signs",
  },
  {
    id: "art-diagnosis-conversation",
    title: "Bringing It Up With a Doctor, Without the Dread",
    summary: "A short script for the first conversation, so you're not starting from a blank page in the waiting room.",
    body: [
      "Most families rehearse this conversation in their head for weeks and then run out of time in a 12-minute appointment. Bring a written list instead of relying on memory in the moment.",
      "Include: 2-3 specific recent examples (what happened, when), any changes in mood or personality, whether a family member has a history of dementia, and current medications.",
      "You can also ask directly: \"Could this be an early sign of dementia, and if so, what's the next step?\" Naming it plainly tends to get a clearer answer than describing around it.",
    ],
    stages: ["Early Stage"],
    symptoms: ["Memory Loss", "Communication Difficulty"],
    readMins: 2,
    tag: "Early Signs",
  },
  {
    id: "art-sundowning",
    title: "Sundowning: Why Evenings Are Harder",
    summary: "Late-afternoon confusion and agitation are common and predictable — here's how to soften them.",
    body: [
      "Sundowning is a real, well-documented pattern: increased confusion, restlessness, or agitation in the late afternoon and evening. It isn't something you're causing, and it isn't a sign the condition has suddenly worsened.",
      "What tends to help: keeping the home well-lit before dusk actually falls, so the transition to darkness is gradual; a calm, low-stimulation routine in the late afternoon rather than errands or visitors; limiting caffeine after noon; a consistent bedtime routine.",
      "If sundowning includes leaving the house or intense distress, that's worth flagging in a consultation — not because it's an emergency, but because a professional can suggest routine changes specific to your situation.",
    ],
    stages: ["Middle Stage", "Late Stage"],
    symptoms: ["Sundowning", "Agitation"],
    readMins: 4,
    tag: "Behavior",
  },
  {
    id: "art-wandering",
    title: "Wandering: Reducing Risk Without Locking the Door",
    summary: "Practical, non-restrictive ways to keep someone safe when they feel the urge to walk.",
    body: [
      "The urge to walk often has a reason behind it, even if it isn't expressed clearly — boredom, searching for something familiar, or simply restlessness. Before restricting movement, try addressing the underlying need: a supervised walk at the same time each day can reduce the urge to leave unexpectedly.",
      "Practical safeguards: a door chime or sensor so you know when a door opens; ID inside clothing or a bracelet with a contact number; letting a couple of neighbors know, so an extra set of eyes exists outside the home too.",
      "If wandering happens at night or has led to a close call, this is a good, specific topic to raise directly with a specialist.",
    ],
    stages: ["Middle Stage", "Late Stage"],
    symptoms: ["Wandering"],
    readMins: 3,
    tag: "Safety",
  },
  {
    id: "art-communication",
    title: "When Words Get Harder to Find",
    summary: "How to keep a conversation going when the right word won't come.",
    body: [
      "As dementia progresses, finding words becomes harder before understanding does. Resist the instinct to finish sentences for them or to correct small factual errors in a story — the emotional content is usually more important than the factual accuracy.",
      "Try short, simple sentences and one question at a time. \"Would you like tea or juice?\" works better than an open-ended \"What do you want to drink?\" Give extra time before repeating or rephrasing a question — a long pause is often just processing time, not confusion.",
      "Facial expression, tone, and touch carry a lot of the message. A calm voice communicates safety even when the specific words aren't landing.",
    ],
    stages: ["Middle Stage", "Late Stage"],
    symptoms: ["Communication Difficulty"],
    readMins: 3,
    tag: "Communication",
  },
  {
    id: "art-agitation",
    title: "Responding to Agitation Without Escalating It",
    summary: "What's usually behind sudden distress, and how to de-escalate in the moment.",
    body: [
      "Agitation is almost always communication about an unmet need — pain, hunger, needing the bathroom, overstimulation, or fear from not recognizing the surroundings. Ruling out a physical cause first is worth the two minutes it takes.",
      "In the moment: lower your voice rather than raising it, remove or reduce nearby noise, and avoid arguing about what's real. \"You're safe, I'm right here\" tends to land better than correcting a misperception.",
      "If agitation includes striking out or happens daily, this is worth bringing to a professional — there may be a medication interaction or an underlying discomfort worth investigating.",
    ],
    stages: ["Middle Stage", "Late Stage"],
    symptoms: ["Agitation"],
    readMins: 3,
    tag: "Behavior",
  },
  {
    id: "art-daily-routine-early",
    title: "Building a Routine That Still Fits Their Independence",
    summary: "For early-stage care: structure that supports without taking over.",
    body: [
      "In the early stage, the goal isn't to manage every task — it's to quietly reduce the cognitive load of daily decisions while preserving as much independence as possible. A visible daily schedule on the fridge or a whiteboard reduces the number of \"what happens next\" questions.",
      "Simplify without infantilizing: labeled drawers, a designated spot for keys and glasses, medication organizers by day and time. Small environmental changes prevent a disproportionate number of frustrating moments.",
      "Involve them in the plan rather than deciding for them where possible — a caregiving relationship that starts collaborative tends to stay easier to sustain as needs increase.",
    ],
    stages: ["Early Stage"],
    symptoms: ["Memory Loss"],
    readMins: 3,
    tag: "Daily Care",
  },
  {
    id: "art-daily-care-late",
    title: "Late-Stage Daily Care: Comfort Over Correction",
    summary: "What matters most when independence has largely given way to full support.",
    body: [
      "In the late stage, the priorities shift from cognitive support to physical comfort, dignity, and connection. Recognition may fade, but the capacity to feel calm, safe, or distressed generally remains — this is why sensory content (familiar music, a gentle voice, touch) still matters even when conversation doesn't work anymore.",
      "Keep routines simple and predictable: same caregivers where possible, same order of activities, unhurried pacing during personal care. Rushing tends to produce more resistance, not less.",
      "This stage is also when caregiver burnout risk is highest. Asking family or professional respite care for even a few hours a week is not a failure — it's what keeps the care sustainable.",
    ],
    stages: ["Late Stage"],
    symptoms: ["Memory Loss", "Communication Difficulty"],
    readMins: 4,
    tag: "Daily Care",
  },
  {
    id: "art-sleep",
    title: "Sleep Disturbance: Untangling Night and Day",
    summary: "Why the day/night cycle unravels, and small changes that help reset it.",
    body: [
      "Dementia can disrupt the brain's internal clock, leading to daytime napping and nighttime wakefulness. This is exhausting for caregivers, and it's rarely fixed by one change alone.",
      "Morning sunlight exposure (even 20 minutes) helps reset circadian rhythm more reliably than most sleep aids. Limit naps to a short window in early afternoon, keep the evening low-stimulation, and keep a consistent wake time even after a rough night.",
      "If disrupted sleep is nightly and affecting the whole household's health, it's a reasonable, specific reason to book a consultation — there are safe options worth discussing with a professional.",
    ],
    stages: ["Middle Stage", "Late Stage"],
    symptoms: ["Sleep Disturbance"],
    readMins: 3,
    tag: "Daily Care",
  },
  {
    id: "art-repetition",
    title: "The Same Question, Fifteen Times: Why, and How to Respond",
    summary: "Repetition is one of the most common and most draining symptoms — here's what's actually happening.",
    body: [
      "Repeated questions usually aren't about the answer — they're often about an underlying feeling of uncertainty that the answer doesn't resolve, because the answer itself isn't retained. Answering with visible patience, every time, is genuinely the most effective response, even though it's the hardest to sustain.",
      "A written answer nearby (a note by the door: \"We're going to the doctor at 2pm\") can sometimes reduce the need to ask, since it offers reassurance on demand without requiring you.",
      "It helps to remember: the repetition is a symptom, not a choice. Naming that to yourself in the moment can reduce your own frustration, which the person you're caring for will pick up on regardless of the words used.",
    ],
    stages: ["Early Stage", "Middle Stage"],
    symptoms: ["Repetition", "Memory Loss"],
    readMins: 2,
    tag: "Behavior",
  },
  {
    id: "art-appetite",
    title: "When Eating Habits Change",
    summary: "Appetite and taste changes are common — practical adjustments that help.",
    body: [
      "Dementia can affect appetite, taste perception, and even the physical coordination needed to eat. Weight loss is common and worth monitoring, not ignoring as a minor issue.",
      "Try smaller, more frequent meals instead of three large ones; finger foods reduce the coordination demands of utensils; strong flavors (a little more herbs or citrus) can help when taste perception dulls; eating together, rather than serving and leaving, often increases how much gets eaten.",
      "A sudden, significant appetite change or difficulty swallowing is worth raising with a professional promptly — it can have several different underlying causes worth ruling out.",
    ],
    stages: ["Middle Stage", "Late Stage"],
    symptoms: ["Appetite Changes"],
    readMins: 2,
    tag: "Daily Care",
  },
];

const seedFamily: FamilyMember[] = [
  { id: "fam-you", name: "You", role: "Primary Caregiver", relationship: "Daughter", color: "#1d4ed8" },
  { id: "fam-budi", name: "Budi Gunawan", role: "Secondary Caregiver", relationship: "Son", color: "#0b6b62" },
  { id: "fam-cici", name: "Cici", role: "Extended Family", relationship: "Granddaughter", color: "#6b4bbd" },
];

const seedSpecialists: Specialist[] = [
  { id: "sp-geri", name: "Dr. Ratna Wijaya", type: "Geriatrician", title: "Geriatric Medicine", clinic: "Siloam Senior Health" },
  { id: "sp-neuro", name: "Dr. Hendra Kusuma", type: "Neurologist", title: "Neurology & Cognitive Disorders", clinic: "RS Pondok Indah" },
  { id: "sp-psych", name: "Dr. Amelia Santoso", type: "Psychologist", title: "Clinical Psychology, Geriatric Care", clinic: "MindWell Clinic" },
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
  const [activity, setActivity] = useState<ActivityItem[]>(() => load("kin.activity.v2", seedActivity));
  const [memories, setMemories] = useState<Memory[]>(() => load("kin.memories", seedMemories));
  const [cameras, setCameras] = useState<Room[]>(() => load("kin.cameras", ["Bedroom", "Living Room"] as Room[]));
  const [engagementLog, setEngagementLog] = useState<EngagementLog[]>(() => load("kin.engagementLog", [] as EngagementLog[]));
  const [family, setFamily] = useState<FamilyMember[]>(() => load("kin.family", seedFamily));
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>(() => load("kin.symptomLogs", [] as SymptomLog[]));
  const [consultations, setConsultations] = useState<Consultation[]>(() => load("kin.consultations", [] as Consultation[]));

  useEffect(() => localStorage.setItem("kin.recipients", JSON.stringify(recipients)), [recipients]);
  useEffect(
    () => localStorage.setItem("kin.selectedRecipientId", JSON.stringify(selectedRecipientId)),
    [selectedRecipientId],
  );
  useEffect(() => localStorage.setItem("kin.activity.v2", JSON.stringify(activity)), [activity]);
  useEffect(() => localStorage.setItem("kin.memories", JSON.stringify(memories)), [memories]);
  useEffect(() => localStorage.setItem("kin.cameras", JSON.stringify(cameras)), [cameras]);
  useEffect(() => localStorage.setItem("kin.engagementLog", JSON.stringify(engagementLog)), [engagementLog]);
  useEffect(() => localStorage.setItem("kin.family", JSON.stringify(family)), [family]);
  useEffect(() => localStorage.setItem("kin.symptomLogs", JSON.stringify(symptomLogs)), [symptomLogs]);
  useEffect(() => localStorage.setItem("kin.consultations", JSON.stringify(consultations)), [consultations]);

  const value = useMemo<Store>(
    () => {
      const selectedRecipient = recipients.find((r) => r.id === selectedRecipientId) ?? null;
      const recipientEngagement = engagementLog
        .filter((e) => e.recipientId === selectedRecipientId)
        .sort((a, b) => b.at.localeCompare(a.at));
      const lastEngagement = recipientEngagement[0];

      const stageDefault: Record<DementiaStage, { kind: MomentKind; title: string }> = {
        "Early Stage": { kind: "game", title: "Memory Match" },
        "Middle Stage": { kind: "book", title: "Life Memory Book" },
        "Late Stage": { kind: "sensory", title: "Calm Sounds & Familiar Faces" },
      };
      const fallback = selectedRecipient
        ? stageDefault[selectedRecipient.stage]
        : { kind: "book" as MomentKind, title: "Life Memory Book" };
      const recommendedMoment = lastEngagement?.mood === "😟"
        ? { kind: fallback.kind, title: fallback.title, reason: `Last session felt hard — sticking with what's familiar for ${selectedRecipient?.name.split(" ")[0] ?? "them"}.` }
        : { kind: fallback.kind, title: fallback.title, reason: `Matched to ${selectedRecipient?.stage ?? "their"} care needs.` };

      const activeAlerts = symptomLogs
        .filter((s) => !s.acknowledged && (s.severity === "Moderate" || s.severity === "Severe"))
        .sort((a, b) => b.at.localeCompare(a.at));

      return {
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
        selectedRecipient,

        activity,
        toggleActivity: (id) =>
          setActivity((prev) => prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a))),
        assignActivity: (id, assigneeId) =>
          setActivity((prev) => prev.map((a) => (a.id === id ? { ...a, assigneeId } : a))),
        addActivity: (a) => setActivity((prev) => [...prev, { ...a, id: crypto.randomUUID(), done: false }]),

        memories: [...memories].sort((a, b) => a.year - b.year),
        addMemory: (m) => setMemories((prev) => [...prev, { ...m, id: crypto.randomUUID(), decade: decadeOf(m.year) }]),

        cameras,
        addCamera: (room) => setCameras((prev) => (prev.includes(room as Room) ? prev : [...prev, room as Room])),

        heartRate: 76,
        sleep: { h: 7, m: 24 },

        engagementLog: recipientEngagement,
        logEngagement: (e) =>
          setEngagementLog((prev) => [
            ...prev,
            { ...e, id: crypto.randomUUID(), at: new Date().toISOString(), recipientId: selectedRecipientId ?? "" },
          ]),
        recommendedMoment,

        articles: seedArticles,

        family,
        addFamilyMember: (m) => setFamily((prev) => [...prev, { ...m, id: crypto.randomUUID() }]),
        symptomLogs: symptomLogs
          .filter((s) => s.recipientId === selectedRecipientId)
          .sort((a, b) => b.at.localeCompare(a.at)),
        logSymptom: (s) =>
          setSymptomLogs((prev) => [
            ...prev,
            {
              ...s,
              id: crypto.randomUUID(),
              at: new Date().toISOString(),
              acknowledged: false,
              recipientId: selectedRecipientId ?? "",
            },
          ]),
        acknowledgeSymptom: (id) =>
          setSymptomLogs((prev) => prev.map((s) => (s.id === id ? { ...s, acknowledged: true } : s))),
        activeAlerts,

        specialists: seedSpecialists,
        consultations: [...consultations].sort((a, b) => b.id.localeCompare(a.id)),
        bookConsultation: (c) => {
          const id = crypto.randomUUID();
          setConsultations((prev) => [...prev, { ...c, id, status: "Upcoming" }]);
          return id;
        },
      };
    },
    [recipients, selectedRecipientId, activity, memories, cameras, engagementLog, family, symptomLogs, consultations],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
