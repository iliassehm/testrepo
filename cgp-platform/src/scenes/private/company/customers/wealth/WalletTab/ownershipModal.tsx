import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { Checkbox } from "primereact/checkbox";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";

import { Button, Dialog } from "../../../../../../components";
import { useCurrentRoute } from "../../../../../../hooks/useCurrentRoute";
import i18n from "../../../../../../i18n";
import { CustomerAsset } from "../../../../../../types";
import FieldPercentage from "../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import Select from "../../../../../../UIComponents/Select/Select";
import { OwnershipEditionLogic } from "./ownershipEdition.logic";

const clientValidation = z.object({
  id: z.string().trim(),
  name: z.string().trim().nullish(),
  ownership: z.number().default(0),
  mode: z.string().trim().nullish(),
});

const validationSchema = z.object({
  clients: z.array(clientValidation),
});
type ValidationSchema = z.infer<typeof validationSchema>;

interface OwnershipModalProps {
  assetId: CustomerAsset["id"];
  onClose: () => void;
  refetchCustomerWealth?: () => void;
  visible: boolean;
  loading?: boolean;
}

export function OwnershipModal({
  assetId,
  visible,
  loading,
  onClose,
  refetchCustomerWealth,
}: OwnershipModalProps) {
  const route = useCurrentRoute();
  const currentRouteId = route.routeId;
  const { companyId, customerId } = useParams({
    from: currentRouteId as never,
  });
  const { t } = i18n;
  const queryClient = useQueryClient();

  const getUsersInCustomerReferenceQuery = useQuery(
    ["users_in_customer_reference", companyId, customerId, assetId],
    () => OwnershipEditionLogic.relatedEntities(companyId, assetId, customerId),
    {
      enabled: visible,
    }
  );

  const form = useForm({
    resolver: zodResolver(validationSchema),
    values: {
      clients: getUsersInCustomerReferenceQuery.data ?? [],
    },
    disabled:
      getUsersInCustomerReferenceQuery.isLoading ||
      getUsersInCustomerReferenceQuery.isError,
    resetOptions: {
      keepDirtyValues: false, // user-interacted input will be retained
      keepErrors: false, // input errors will be retained with value update
    },
  });
  const { handleSubmit, control, setValue } = form;

  const onCloseEvent = (open: boolean) => {
    if (!open) {
      form.reset();
      onClose?.();
    }
  };

  const mutation = useMutation({
    mutationFn: (data: ValidationSchema) =>
      OwnershipEditionLogic.updateAssetOwnership(
        companyId,
        assetId,
        data.clients.map((client) => ({ ...client, name: undefined }))
      ),
    onSuccess: () => {
      refetchCustomerWealth?.();
      queryClient.invalidateQueries(["customer_wealth", customerId, companyId]);
      onCloseEvent(false);
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "clients",
  });

  const mode = [
    {
      label: t("scenes.customers.wealth.ownershipModal.mode.fullProperty"),
      value: "fullProperty",
    },
    {
      label: t("scenes.customers.wealth.ownershipModal.mode.property"),
      value: "property",
    },
    {
      label: t("scenes.customers.wealth.ownershipModal.mode.usufruct"),
      value: "usufruct",
    },
  ];

  const clients = form.getValues("clients");
  if (getUsersInCustomerReferenceQuery.isLoading || clients == undefined) {
    return <Loader />;
  }

  return (
    <Dialog
      header={t("scenes.customers.wealth.ownershipModal.title")}
      open={visible}
      onOpenChange={onCloseEvent}
    >
      <form
        onSubmit={handleSubmit((data) => {
          console.debug("subitted", data);

          data ? mutation.mutate(data) : null;
        })}
      >
        <div className="flex flex-col">
          <div className="grid gap-4 grid-cols-12 text-blue-800 mt-5 mb-4">
            <div className="flex col-span-1">
              <Checkbox
                name={`clients.checkAll`}
                checked={clients.every((client) => client.ownership > 0)}
                onChange={(e) => {
                  clients.forEach((_, index) => {
                    setValue(`clients.${index}.ownership`, e.checked ? 1 : 0);
                  });
                }}
              />
            </div>
            <div className="flex col-span-5">
              {t(`scenes.customers.wealth.ownershipModal.owner`)}
            </div>
            <div className="flex justify-center items-center col-span-3">
              {t(`scenes.customers.wealth.ownershipModal.ownership`)}
            </div>
            <div className="flex justify-center items-center col-span-3">
              {t(`scenes.customers.wealth.ownershipModal.mode.label`)}
            </div>
          </div>
          <div className="">
            {fields.map((client, index) => (
              <div className="grid gap-4 grid-cols-12 mb-2" key={index}>
                <div className="col-span-1">
                  <Controller
                    name={`clients.${index}.ownership`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        inputId={field.name}
                        checked={field.value > 0}
                        inputRef={field.ref}
                        onChange={(event) =>
                          field.onChange(event.checked ? 1 : 0)
                        }
                        required={false}
                      />
                    )}
                  />
                </div>
                <div className="col-span-5">{client.name}</div>
                <div className="col-span-3">
                  <Controller
                    name={`clients.${index}.ownership`}
                    control={control}
                    render={({ field }) => (
                      <div className="w-32">
                        <FieldPercentage
                          id={field.name}
                          name={field.name}
                          value={field.value ? field.value * 100 : undefined}
                          className="w-full bg-slate-50 h-10"
                          onChange={(value) => {
                            field.onChange(value / 100);
                          }}
                        />
                      </div>
                    )}
                  />
                </div>
                <div className="col-span-3">
                  <Controller
                    name={`clients.${index}.mode`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        id={field.name}
                        value={{
                          value: field.value ?? "",
                          label: field.value
                            ? (t(
                                "scenes.customers.wealth.ownershipModal.mode." +
                                  field.value
                              ) as string)
                            : "",
                        }}
                        onChange={(option) => field.onChange(option?.value)}
                        options={mode}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "var(--bg-slate-50)",
                            borderColor: "var(--input-border-color)",
                          }),
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          label="forms.fields.actions.save"
          loading={
            mutation.isLoading ||
            loading ||
            getUsersInCustomerReferenceQuery.isLoading
          }
          className="mt-4 mx-auto"
        />
      </form>
    </Dialog>
  );
}
