import { useParams } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import { Button } from "../../../../../../components";
import {
  getFormErrorMessage,
  mouvementTypesOptions,
  movementStatusBOOptions,
  movementStatusOptions,
} from "../../../../../../constants";
import { numberFormat } from "../../../../../../helpers";
import type { TransactionCreationInput } from "../../../../../../types";
import FieldAmount from "../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldDate } from "../../../../../../UIComponents/FieldDate/FieldDate";
import FieldPercentage from "../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { FieldTextarea } from "../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { Label } from "../../../../../../UIComponents/Label/Label";
import Select from "../../../../../../UIComponents/Select/Select";
import { CompanyGeneralLogic } from "../../../settings/office/generalOffice/general.logic";

type FormData = TransactionCreationInput & {
  netAmount?: number;
  feesAmount?: number;
};

export function MouvementForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: TransactionCreationInput;
  onSubmit: (data: TransactionCreationInput) => void;
}) {
  const { handleSubmit, control, formState, watch } = useForm<FormData>({
    defaultValues,
  });
  const { t } = useTranslation();

  const { errors } = formState;

  const params = useParams({
    from: "/company/$companyId/customer/$customerId/",
  });

  const listManagers = useQuery(
    ["company", "managers", params.companyId],
    async () => CompanyGeneralLogic.managerListQuery(params.companyId)
  );

  const managers =
    listManagers?.data?.companyManagersStats?.map((manager) => ({
      label: manager.name || "",
      value: manager.id || "",
    })) ?? [];

  let [value, fee] = watch(["value", "fee"]);
  value = value || 0;
  fee = fee || 0;
  let netAmount = 0;
  let feesAmount = 0;

  feesAmount = value * (fee / 100);
  netAmount = value - feesAmount;

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <div className="flex flex-col gap-4">
        <Controller
          name="name"
          control={control}
          rules={{ required: t("forms.errors.required") }}
          render={({ field }) => (
            <div className="w-2/3">
              <Label
                htmlFor={field.name}
                className="text-[#4761C8] font-medium"
              >
                {t("forms.fields.name")}
              </Label>
              <FieldText id={field.name} {...field} value={field.value || ""} />
              {getFormErrorMessage(field.name, errors)}
            </div>
          )}
        />
        <Controller
          name="typeOperation"
          control={control}
          rules={{ required: t("forms.errors.required") }}
          render={({ field }) => (
            <div className="w-1/2">
              <Label
                htmlFor={field.name}
                className="text-[#4761C8] font-medium"
              >
                {t("forms.fields.typeOperation")}
              </Label>
              <Select
                id={field.name}
                name={field.name}
                value={mouvementTypesOptions
                  .flatMap((group) => group.options)
                  .find((option) => option.value === field.value)}
                onChange={(option) => field.onChange(option?.value)}
                options={mouvementTypesOptions}
              />
              {getFormErrorMessage(field.name, errors)}
            </div>
          )}
        />

        <div className="flex gap-4 justify-between">
          <div className="flex gap-4 items-end">
            <Controller
              name="value"
              control={control}
              render={({ field }) => (
                <div className="w-fit">
                  <Label
                    htmlFor={field.name}
                    className="text-[#4761C8] font-medium"
                  >
                    {t("forms.fields.amount")}
                  </Label>
                  <FieldAmount
                    id={field.name}
                    {...field}
                    value={field.value || ""}
                  />
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />
            <Controller
              name="fee"
              control={control}
              render={({ field }) => (
                <div className="max-w-[90px]">
                  <Label
                    htmlFor={field.name}
                    className="text-[#4761C8] font-medium"
                  >
                    {t("forms.fields.fees")}
                  </Label>
                  <FieldPercentage
                    id={field.name}
                    {...field}
                    value={field.value as number}
                    placeholder="0 %"
                  />
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />
          </div>
        </div>
        <div className="flex gap-4 items-center justify-end">
          <div className="max-w-[90px]">
            <Label className="text-[#4761C8] font-medium">
              {t("forms.fields.netAmount")}
            </Label>
            <p className="text-right">{numberFormat(netAmount)}</p>
          </div>

          <div className="max-w-[90px]">
            <Label className="text-[#4761C8] font-medium">
              {t("forms.fields.feesAmount")}
            </Label>
            <p className="text-right">{numberFormat(feesAmount)}</p>
          </div>
        </div>

        <div className="flex justify-between gap-8 items-end">
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <div className="w-fit">
                <Label
                  htmlFor={field.name}
                  className="text-[#4761C8] font-medium"
                >
                  {t("forms.fields.effectiveDate")}
                </Label>
                <FieldDate
                  id={field.name}
                  {...field}
                  onValueChange={field.onChange}
                  placeholder="dd/mm/yyyy"
                />
                {getFormErrorMessage(field.name, errors)}
              </div>
            )}
          />
          <Controller
            name="statusValidation"
            control={control}
            render={({ field }) => (
              <div className="w-[200px]">
                <Label
                  htmlFor={field.name}
                  className="text-[#4761C8] font-medium"
                >
                  {t("scenes.wealth.transactions.statusValidation")}
                </Label>
                <Select
                  id={field.name}
                  name={field.name}
                  value={movementStatusOptions.find(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                  options={movementStatusOptions}
                />
                {getFormErrorMessage(field.name, errors)}
              </div>
            )}
          />
        </div>

        <div className="flex justify-between gap-8 items-end">
          <Controller
            name="dateBO"
            control={control}
            render={({ field }) => (
              <div className="w-fit">
                <Label
                  htmlFor={field.name}
                  className="text-[#4761C8] font-medium"
                >
                  {t("forms.fields.dateBO")}
                </Label>
                <FieldDate
                  id={field.name}
                  {...field}
                  onValueChange={field.onChange}
                  placeholder="dd/mm/yyyy"
                />
                {getFormErrorMessage(field.name, errors)}
              </div>
            )}
          />
          <Controller
            name="statusBO"
            control={control}
            render={({ field }) => (
              <div className="w-[200px]">
                <Label
                  htmlFor={field.name}
                  className="text-[#4761C8] font-medium"
                >
                  {t("scenes.wealth.transactions.statusBo")}
                </Label>
                <Select
                  id={field.name}
                  name={field.name}
                  value={movementStatusBOOptions.find(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                  options={movementStatusBOOptions}
                />
                {getFormErrorMessage(field.name, errors)}
              </div>
            )}
          />
          <Controller
          name="managerBO"
          control={control}
          render={({ field }) => (
            <div className="w-1/2">
              <Label
                htmlFor={field.name}
                className="text-[#4761C8] font-medium"
              >
                {t("scenes.wealth.transactions.managerBO")}
              </Label>
              <Select
                id={field.name}
                name={field.name}
                value={managers.find((type) => type.value === field.value)}
                onChange={(option) => field.onChange(option?.value)}
                options={managers}
              />
              {getFormErrorMessage(field.name, errors)}
            </div>
          )}
        />
        </div>

        <Controller
          name="manager"
          control={control}
          render={({ field }) => (
            <div className="w-1/2">
              <Label
                htmlFor={field.name}
                className="text-[#4761C8] font-medium"
              >
                {t("forms.fields.tables.advisor")}
              </Label>
              <Select
                id={field.name}
                name={field.name}
                value={managers.find((type) => type.value === field.value)}
                onChange={(option) => field.onChange(option?.value)}
                options={managers}
              />
              {getFormErrorMessage(field.name, errors)}
            </div>
          )}
        />

        <Controller
          name="comment"
          control={control}
          render={({ field }) => (
            <div className="w-full">
              <Label
                htmlFor={field.name}
                className="text-[#4761C8] font-medium"
              >
                {t("forms.fields.comment")}
              </Label>
              <FieldTextarea
                id={field.name}
                {...field}
                value={field.value || ""}
                placeholder="Note"
              />
              {getFormErrorMessage(field.name, errors)}
            </div>
          )}
        />

        <Button
          type="submit"
          id="submit"
          label="forms.fields.actions.save"
          className="m-auto"
        />
      </div>
    </form>
  );
}
