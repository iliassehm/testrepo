import { Edit2, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";

import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import { InstrumentsLogic } from "../../project/instruments.logic";

interface FundHeaderProps {
  title?: string | null;
  sfdr?: number;
  isFavorite?: boolean;
  companyID: string;
  code: string;
  lastValue?: number;
  onEdit: () => void;
}

export const FundHeader = ({
  title,
  sfdr,
  isFavorite,
  companyID,
  code,
  lastValue,
  onEdit,
}: FundHeaderProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();
  // Mutations
  const setInstrumentFavorite = useMutation(
    "setInstrumentFavorite",
    (input: { companyID: string; code: string; favorite: boolean }) =>
      gql.client.request(InstrumentsLogic.setInstrumentFavorite(), {
        code: input.code,
        isFavorite: input.favorite,
        companyID: input.companyID,
      }),
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries([
          "getInstrumentIsFavorite",
          companyID,
          code,
        ]);
        toast?.current?.show({
          severity: "success",
          summary: t(
            "forms.fields.instrumentDetails.favorite.toast.success.summary"
          ) as string,
          detail: t(
            "forms.fields.instrumentDetails.favorite.toast.success.detail",
            {}
          ),
        });
      },
      onError: (error, variables) => {
        toast?.current?.show({
          severity: "error",
          summary: t(
            "forms.fields.instrumentDetails.favorite.toast.failure.summary"
          ) as string,
          detail: t(
            "forms.fields.instrumentDetails.favorite.toast.failure.detail",
            {}
          ),
        });
      },
    }
  );

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-green-500">☂</span>
          {title ?? "-"}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold text-center text-blue-600">
          {t(`forms.fields.instrumentDetails.price`)} : {lastValue} €
        </h2>
        <button
          onClick={() =>
            setInstrumentFavorite.mutate({
              companyID,
              code,
              favorite: !isFavorite,
            })
          }
          className={`transition-colors ${isFavorite ? "text-blue-600" : "text-gray-500 hover:text-blue-600"}`}
        >
          <Star size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <button onClick={onEdit} className="text-gray-500 hover:text-blue-600">
          <Edit2 size={20} />
        </button>
      </div>
    </div>
  );
};
