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

            <Route path="/connectivity" element={<ConnectivityHub />} />
            <Route path="/connectivity/camera/:room" element={<CameraView />} />
            <Route path="/connectivity/add-camera" element={<AddCamera />} />

            <Route path="/memory-book" element={<MemoryBook />} />
            <Route path="/memory-book/new" element={<AddMemory />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </StoreProvider>
  );
}
