import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";

export const LegalText = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="border border-gray-400 rounded-lg flex mt-5">
        <div className="bg-gray-400 flex items-center justify-center p-2">
          <InfoCircledIcon className="h-5 w-5 text-white justify-center items-center" />
        </div>

        <div className="p-4 h-64 overflow-y-auto w-100">
          <div className="w-100">
            <p className="font-bold text-black-600 ml-2 text-center">
              {t(`scenes.customers.conformity.lcbFtLab.legalText.article`)}
            </p>
            <p>
              {t("scenes.customers.conformity.lcbFtLab.legalText.content")
                .split("\n")
                .map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
