import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthStepLayout } from "./AuthStepLayout";
import { FormField } from "../../components/ui";

export default function StepEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  return (
    <AuthStepLayout
      step={2}
      title="Register your E-mail"
      subtitle="Enter your E-mail"
      ctaLabel="Continue"
      ctaDisabled={!email.includes("@")}
      onSubmit={() => navigate("/signup/verify")}
    >
      <FormField
        label="E-Mail*"
        type="email"
        placeholder="Enter E-mail Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </AuthStepLayout>
  );
}
