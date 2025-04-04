import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { metadataLoanSchema } from "../../../../../../../shared/schemas/asset.aggregation.schemas";
import { CustomerAsset } from "../../../../../../types";

interface AssetLoanDetailProps {
  asset?: CustomerAsset;
  customerID: string;
}

export function AssetLoanDetail({ asset, customerID }: AssetLoanDetailProps) {
  const metadata = useMemo<z.infer<typeof metadataLoanSchema> | undefined>(
    () => asset?.metadata,
    [asset]
  );
  const { t } = useTranslation();
  const loanTypeOptions: { [key: string]: string } = {
    amortissable: "Prêt amortissable",
    "in-fine": "Prêt in fine",
    "differe-total": "Prêt avec différé total",
    "differe-partiel": "Prêt avec différé partiel",
  };

  /**
   * Calculates the outstanding capital of the loan.
   * The outstanding capital is the amount of the loan that is remaining to be paid without interest.
   */
  let outstandingCapital = 0;
  if (metadata?.loanedAmount && metadata?.start && metadata?.duration) {
    const currentDate = new Date();
    const startDate = new Date(metadata.start);
    const timeDifferenceInMilliseconds = Math.abs(
      currentDate.getTime() - startDate.getTime()
    );
    const timeDifferenceInMonths = Math.ceil(
      timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24 * 30)
    );

    outstandingCapital =
      (metadata.loanedAmount / metadata.duration) *
      (metadata.duration - timeDifferenceInMonths);
  }

  return (
    <div className="flex flex-col gap-4 w-full mt-2">
      <div className="flex justify-between">
        <h3 className="text-m font-semibold">
          {t("scenes.wealth.loan.loanType.label")}
        </h3>
        <p className="text-m text-blue-800 font-semibold">
          {loanTypeOptions[metadata?.type ?? ""]}
        </p>
      </div>
      <div className="flex justify-between">
        <h3 className="text-m font-semibold">
          {t("scenes.wealth.loan.date.label")}
        </h3>
        <p className="text-m text-blue-800 font-semibold">
          {metadata?.start
            ? new Date(metadata?.start).toLocaleDateString()
            : ""}
        </p>
      </div>
      {metadata?.loanedAmount && (
        <div className="flex justify-between">
          <h3 className="text-m font-semibold">
            {t("scenes.wealth.loan.loanAmount.label")}
          </h3>
          <p className="text-m text-blue-800 font-semibold">
            {(
              metadata?.loanedAmount *
              (asset?.owners?.find((owner) => owner.entity?.id === customerID)
                ?.ownership ?? 0)
            ).toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }) ?? ""}
          </p>
        </div>
      )}
      {metadata?.duration && (
        <div className="flex justify-between">
          <h3 className="text-m font-semibold">
            {t("scenes.wealth.loan.loanPeriod.label")}
          </h3>
          <p className="text-m text-blue-800 font-semibold">
            {metadata?.duration
              ? t("forms.month", { count: metadata?.duration })
              : ""}
          </p>
        </div>
      )}
      {outstandingCapital != null && (
        <div className="flex justify-between">
          <h3 className="text-m font-semibold">
            {t("scenes.wealth.loan.outstandingCapital.label")}
          </h3>
          <p className="text-m text-blue-800 font-semibold">
            {outstandingCapital?.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }) ?? ""}
          </p>
        </div>
      )}
      {metadata?.interests != null && (
        <div className="flex justify-between">
          <h3 className="text-m font-semibold">
            {t("scenes.wealth.loan.interestRate.label")}
          </h3>
          <p className="text-m text-blue-800 font-semibold">
            {`${(metadata.interests / 100).toLocaleString("fr-FR", { maximumFractionDigits: 2, minimumFractionDigits: 2, style: "percent" })}`}
          </p>
        </div>
      )}
      {metadata?.assuranceFee != null && (
        <div className="flex justify-between">
          <h3 className="text-m font-semibold">
            {t("scenes.wealth.loan.insuranceAmount.label")}
          </h3>
          <p className="text-m text-blue-800 font-semibold">
            {metadata?.assuranceFee?.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }) ?? ""}
          </p>
        </div>
      )}
      {metadata?.monthlyPayment != null && (
        <div className="flex justify-between">
          <h3 className="text-m font-semibold">
            {t("scenes.wealth.loan.monthlyAmount.label")}
          </h3>
          <p className="text-m text-blue-800 font-semibold">
            {metadata?.monthlyPayment?.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }) ?? ""}
          </p>
        </div>
      )}
      <div className="flex justify-between">
        <h3 className="text-m font-semibold">
          {t("scenes.wealth.loan.applicationFees.label")}
        </h3>
        <p className="text-m text-blue-800 font-semibold">
          {metadata?.applicationFee?.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }) ?? ""}
        </p>
      </div>
      <div className="flex justify-between">
        <h3 className="text-m font-semibold">
          {t("scenes.wealth.loan.loanOwnership.label")}
        </h3>
        <p className="text-m text-blue-800 font-semibold">
          {metadata?.loanOwnership
            ? `${(asset?.owners?.find((owner) => owner.entity?.id === customerID)?.ownership ?? 0 / 100).toLocaleString("fr-FR", { style: "percent", maximumFractionDigits: 0 })}`
            : ""}
        </p>
      </div>
    </div>
  );
}
