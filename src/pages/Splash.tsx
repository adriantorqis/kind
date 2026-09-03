import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneShell, HomeIndicator } from "../components/PhoneShell";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate("/welcome", { replace: true }), 1400);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <PhoneShell gradient="from-white to-[#dbeafe]">
      <div className="flex flex-1 items-center justify-center">
        <div
          className="flex size-[100px] items-center justify-center rounded-[24px] shadow-lg"
          style={{ backgroundImage: "linear-gradient(180deg, rgb(40,111,227) 0%, rgb(22,61,125) 100%)" }}
        >
          <span className="text-[48px] font-bold text-white">K</span>
        </div>
      </div>
      <HomeIndicator />
    </PhoneShell>
  );
}
