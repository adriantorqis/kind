import { Routes, Route, Navigate } from "react-router-dom";
import { StoreProvider } from "./state/store";
import Splash from "./pages/Splash";
import Welcome from "./pages/auth/Welcome";
import StepName from "./pages/auth/StepName";
import StepEmail from "./pages/auth/StepEmail";
import StepVerify from "./pages/auth/StepVerify";
import StepPassword from "./pages/auth/StepPassword";
import RecipientSelect from "./pages/RecipientSelect";
import RecipientForm from "./pages/RecipientForm";
import Home from "./pages/Home";
import Activity from "./pages/Activity";
import ConnectivityHub from "./pages/connectivity/ConnectivityHub";
import CameraView from "./pages/connectivity/CameraView";
import AddCamera from "./pages/connectivity/AddCamera";
import AiSummary from "./pages/AiSummary";
import MemoryBook from "./pages/memory/MemoryBook";
import AddMemory from "./pages/memory/AddMemory";
import MemoryDetail from "./pages/memory/MemoryDetail";
import StoryMode from "./pages/memory/StoryMode";
import PersonDetail from "./pages/memory/PersonDetail";
import PersonForm from "./pages/memory/PersonForm";
import PersonAges from "./pages/memory/PersonAges";
import MomentsHub from "./pages/moments/MomentsHub";
import MemoryGame from "./pages/moments/MemoryGame";
import SensoryPlayer from "./pages/moments/SensoryPlayer";
import MoodLog from "./pages/moments/MoodLog";
import LearnHub from "./pages/learn/LearnHub";
import ArticleDetail from "./pages/learn/ArticleDetail";
import Assistant from "./pages/learn/Assistant";
import CircleHub from "./pages/circle/CircleHub";
import AddFamilyMember from "./pages/circle/AddFamilyMember";
import LogSymptom from "./pages/circle/LogSymptom";
import ConsultHub from "./pages/consult/ConsultHub";
import BookConsultation from "./pages/consult/BookConsultation";

export default function App() {
  return (
    <StoreProvider>
      <div className="app-shell">
        <div className="phone-frame">
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/signup/name" element={<StepName />} />
            <Route path="/signup/email" element={<StepEmail />} />
            <Route path="/signup/verify" element={<StepVerify />} />
            <Route path="/signup/password" element={<StepPassword />} />

            <Route path="/recipients" element={<RecipientSelect />} />
            <Route path="/recipients/new" element={<RecipientForm />} />
            <Route path="/recipients/:id/edit" element={<RecipientForm />} />

            <Route path="/home" element={<Home />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/ai-summary" element={<AiSummary />} />

            {/* K — Kindred Moments */}
            <Route path="/moments" element={<MomentsHub />} />
            <Route path="/moments/game" element={<MemoryGame />} />
            <Route path="/moments/sensory" element={<SensoryPlayer />} />
            <Route path="/moments/log" element={<MoodLog />} />
            <Route path="/memory-book" element={<MemoryBook />} />
            <Route path="/memory-book/story" element={<StoryMode />} />
            <Route path="/memory-book/new" element={<AddMemory />} />
            <Route path="/memory-book/people/new" element={<PersonForm />} />
            <Route path="/memory-book/people/:id" element={<PersonDetail />} />
            <Route path="/memory-book/people/:id/edit" element={<PersonForm />} />
            <Route path="/memory-book/people/:id/ages" element={<PersonAges />} />
            <Route path="/memory-book/:id" element={<MemoryDetail />} />
            <Route path="/memory-book/:id/edit" element={<AddMemory />} />

            {/* I — Informed Caregiving */}
            <Route path="/learn" element={<LearnHub />} />
            <Route path="/learn/assistant" element={<Assistant />} />
            <Route path="/learn/:id" element={<ArticleDetail />} />

            {/* N — Network */}
            <Route path="/circle" element={<CircleHub />} />
            <Route path="/circle/add" element={<AddFamilyMember />} />
            <Route path="/circle/log-symptom" element={<LogSymptom />} />

            {/* D — Direct-to-Professional */}
            <Route path="/consult" element={<ConsultHub />} />
            <Route path="/consult/new" element={<BookConsultation />} />

            {/* Connectivity — optional integration, not a primary pillar */}
            <Route path="/connectivity" element={<ConnectivityHub />} />
            <Route path="/connectivity/camera/:room" element={<CameraView />} />
            <Route path="/connectivity/add-camera" element={<AddCamera />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </StoreProvider>
  );
}
