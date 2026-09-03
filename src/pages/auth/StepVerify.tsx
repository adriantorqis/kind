import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthStepLayout } from "./AuthStepLayout";
import { FormField } from "../../components/ui";

export default function StepVerify() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  return (
    <AuthStepLayout
      step={3}
      title="Verify your E-Mail"
      subtitle="We have sent a 5 digit code to your E-mail"
      ctaLabel="Continue"
      ctaDisabled={code.length < 4}
      onSubmit={() => navigate("/signup/password")}
    >
      <FormField
        label="Verification Code*"
        placeholder="Enter Verification Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        inputMode="numeric"
        required
      />
    </AuthStepLayout>
  );
}
