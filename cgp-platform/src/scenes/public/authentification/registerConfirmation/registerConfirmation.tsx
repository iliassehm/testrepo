import { Trans } from "react-i18next";

import { Text } from "../../../../components";
import { AuthLayout } from "../components/authLayout";
import { loginScene } from "../route";

export function RegisterConfirmation() {
  return (
    <AuthLayout>
      <div>
        <Trans
          className="text-lg font-medium leading-normal text-blue-1100"
          i18nKey="scenes.authentification.emailConfirmation"
          components={[<span className="font-bold text-blue-800" />]}
        />
        <Text
          to={loginScene.fullPath}
          label="scenes.authentification.backToLogin"
          className="m-auto mt-4 block w-fit cursor-pointer text-xs text-grey-500 hover:text-gray-700"
        />
      </div>
    </AuthLayout>
  );
}
