import { useNavigate } from "react-router-dom";
import { PhoneShell, HomeIndicator } from "../../components/PhoneShell";
import { PrimaryButton, SecondaryButton } from "../../components/ui";

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <PhoneShell gradient="from-white to-[#dbeafe]">
      <div className="flex flex-1 flex-col items-center justify-end gap-3 px-6 pb-8">
        <div
          className="mb-10 flex size-[88px] items-center justify-center rounded-[22px] shadow-lg"
          style={{ backgroundImage: "linear-gradient(180deg, rgb(40,111,227) 0%, rgb(22,61,125) 100%)" }}
        >
          <span className="text-[24px] font-bold text-white">K</span>
        </div>
        <p className="mb-6 text-center text-[16px] text-[#818181]">
          A calmer way to care for someone with dementia.
        </p>
        <PrimaryButton pill onClick={() => navigate("/signup/name")}>
          Sign Up
        </PrimaryButton>
        <SecondaryButton onClick={() => navigate("/recipients")}>Sign In</SecondaryButton>
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
