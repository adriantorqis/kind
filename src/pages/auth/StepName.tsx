import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthStepLayout } from "./AuthStepLayout";
import { FormField } from "../../components/ui";

export default function StepName() {
  const navigate = useNavigate();
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");

  return (
    <AuthStepLayout
      step={1}
      title="Create a new account"
      subtitle="Enter your Name"
      ctaLabel="Continue"
      ctaDisabled={!first || !last}
      onSubmit={() => navigate("/signup/email")}
    >
      <FormField label="First name*" placeholder="Enter First Name" value={first} onChange={(e) => setFirst(e.target.value)} required />
      <FormField label="Last Name*" placeholder="Enter Last Name" value={last} onChange={(e) => setLast(e.target.value)} required />
      <FormField label="Middle Name" placeholder="Enter Middle Name" />
    </AuthStepLayout>
  );
}
