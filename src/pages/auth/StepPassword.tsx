import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle } from "lucide-react";
import { AuthStepLayout } from "./AuthStepLayout";
import { FormField } from "../../components/ui";

function Rule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {ok ? <CheckCircle2 size={22} className="text-[#1d4ed8]" /> : <Circle size={22} className="text-[#dfdfdf]" />}
      <span className="text-[12px] text-[#818181]">{label}</span>
    </div>
  );
}

export default function StepPassword() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");

  const hasLen = pw.length >= 8;
  const hasNum = /\d/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  const matches = pw.length > 0 && pw === confirm;
  const valid = hasLen && hasNum && hasUpper && hasSymbol && matches;

  return (
    <AuthStepLayout
      step={4}
      title="Create Password"
      subtitle="Create a strong password"
      ctaLabel="Register"
      ctaDisabled={!valid}
      onSubmit={() => navigate("/recipients")}
    >
      <FormField
        label="Create a Password*"
        type="password"
        placeholder="Create Password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        required
      />
      <FormField
        label="Confirm Password*"
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      <div className="flex flex-col gap-2 pt-2">
        <Rule ok={hasLen} label="Minimum 8 Characters" />
        <Rule ok={hasNum} label="Must Contain At Least One Number" />
        <Rule ok={hasUpper} label="Must Contain At Least One Uppercase" />
        <Rule ok={hasSymbol} label="Must Contain At Least One Symbol" />
        <Rule ok={matches} label="Matches the previous password" />
      </div>
    </AuthStepLayout>
  );
}
