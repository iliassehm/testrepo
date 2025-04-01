import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Step {
  id: number;
  label: string;
  href: string;
}

export default function Navbar() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/kyc",
  });

  const steps: Step[] = [
    {
      id: 1,
      label: t("scenes.customers.kyc.steps.customer"),
      href: "/",
    },
    {
      id: 2,
      label: t("scenes.customers.kyc.steps.income"),
      href: "/income",
    },
    {
      id: 3,
      label: t("scenes.customers.kyc.steps.expenses"),
      href: "/expense",
    },
    {
      id: 4,
      label: t("scenes.customers.kyc.steps.wealth"),
      href: "/wealth",
    },
    {
      id: 5,
      label: t("scenes.customers.kyc.steps.finances"),
      href: "/finance",
    },
  ];

  useEffect(() => {
    switch (window.location.pathname.split("/")[6]) {
      case "income":
        setCurrentStep(2);
        break;
      case "expense":
        setCurrentStep(3);
        break;
      case "wealth":
        setCurrentStep(4);
        break;
      case "finance":
        setCurrentStep(5);
        break;
      default:
        setCurrentStep(1);
    }
  }, [window.location.pathname]);

  const getProgressLineWidth = () => {
    switch (currentStep) {
      case 1:
        return 9;
      case 2:
        return 28;
      case 3:
        return 50;
      case 4:
        return 72;
      case 5:
        return 91;

      default:
        return 9;
    }
  };

  return (
    <div className="w-[90%] mx-auto flex justify-between gap-4 mb-6 shadow-md shadow-[#00000040] rounded-lg bg-white">
      <div className="flex justify-between items-center w-full relative px-[5%] h-[120px]">
        {/* Progress Line */}
        <div className="absolute top-11 left-0 w-full h-[2px] bg-gray-200" />
        <div
          className={`absolute top-11 left-0 h-[2px] bg-blue-800 transition-all duration-300`}
          style={{ width: `${getProgressLineWidth()}%` }}
        />
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center min-w-[6%]">
            <Link
              to={`/company/$companyId/customer/$customerId/kyc${step.href}`}
              params={params}
              onClick={() => setCurrentStep(step.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium  relative z-10 transition-all duration-300 ${
                step.id === currentStep
                  ? "bg-blue-800 text-white text-xl w-12 h-12"
                  : step.id < currentStep
                    ? "bg-blue-800 text-white text-sm"
                    : "bg-white border-2 border-gray-200 text-gray-400 text-sm"
              }`}
            >
              {step.id}
            </Link>
            <span
              className={`mt-2 font-medium ${
                step.id === currentStep
                  ? "text-blue-600 text-xl"
                  : step.id < currentStep
                    ? "text-blue-600 text-sm"
                    : "text-gray-400 text-sm"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
