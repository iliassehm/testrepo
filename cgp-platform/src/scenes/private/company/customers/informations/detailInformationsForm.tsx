import React from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button, Text } from "../../../../../components";
import { countriesOptions } from "../../../../../constants";
import { AddressSuggestion } from "../../../../../hooks/useAddressAutocomplete";
import { FieldAddressAutocomplete } from "../../../../../UIComponents/FieldAddressAutocomplete/FieldAddressAutocomplete";
import { FieldText } from "../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../UIComponents/Label/Label";
import Select, { Option } from "../../../../../UIComponents/Select/Select";
import { useCustomerContext } from "../customerContext";
import { CustomerSkeleton } from "../CustomersSkeleton";

export const DetailInformations: React.FC = () => {
  const {
    customerQuery,
    customer,
    detailsInfosForm: form,
    onSubmit,
    updateForms,
  } = useCustomerContext();

  const emailDisabled =
    (customer?.pendingInvitations?.length ?? 0) > 0 ||
    customer?.hasB2CAccount ||
    false;

  if (customerQuery.isLoading) return <CustomerSkeleton />;

  return (
    <FormProvider {...form}>
      <form className="w-full" onSubmit={onSubmit}>
        <Button
          label={`actions.save`}
          type="submit"
          className="absolute top-0 right-0 flex w-fit self-end"
          loading={updateForms.isLoading}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="cols-span-1 flex flex-col gap-4">
            <div>
              <HomeAddressForm />
            </div>
            <div>
              <WorkAddressForm />
            </div>
            <div>
              <OtherAddressForm />
            </div>
            <div>
              <FiscalForm />
            </div>
          </div>
          <div className="cols-span-1 flex flex-col gap-4">
            <div>
              <PhoneForm />
            </div>
            <div>
              <EmailsForm emailDisabled={emailDisabled} />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

function HomeAddressForm() {
  const { t } = useTranslation();

  const { setValue, control } = useFormContext();

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    setValue("street", suggestion.street);
    setValue("zipCode", suggestion.postalCode);
    setValue("city", suggestion.city);
  };

  return (
    <>
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label="scenes.customers.details.homeAddress"
      />
      <div className="flex flex-col gap-4">
        <Controller
          name="street"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.street")}
              </Label>
              <FieldAddressAutocomplete
                id={field.name}
                {...field}
                value={field.value as string}
                handleSuggestionClick={handleSuggestionClick}
              />
            </div>
          )}
        />
        <Controller
          name="addressSupplement"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.addressSupplement")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="zipCode"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.zipCode")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.city")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />

        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.country")}
              </Label>
              <Select
                id={field.name}
                {...field}
                value={countriesOptions?.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => {
                  field.onChange(option?.value);
                }}
                options={countriesOptions as Option[]}
              />
            </div>
          )}
        />
      </div>
    </>
  );
}

function WorkAddressForm() {
  const { t } = useTranslation();

  const { setValue, control } = useFormContext();
  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    setValue("workStreet", suggestion.street);
    setValue("workZipCode", suggestion.postalCode);
    setValue("workCity", suggestion.city);
    setValue("country", "FR");
  };

  return (
    <>
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label="scenes.customers.details.workAddress"
      />
      <div className="flex flex-col gap-4">
        <Controller
          name="workStreet"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.street")}
              </Label>
              <FieldAddressAutocomplete
                id={field.name}
                {...field}
                value={field.value as string}
                handleSuggestionClick={handleSuggestionClick}
              />
            </div>
          )}
        />
        <Controller
          name="workAddressSupplement"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.addressSupplement")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="workZipCode"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.zipCode")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="workCity"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.city")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="workCountry"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.country")}
              </Label>
              <Select
                id={field.name}
                {...field}
                value={countriesOptions?.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => {
                  field.onChange(option?.value);
                }}
                options={countriesOptions as Option[]}
              />
            </div>
          )}
        />
      </div>
    </>
  );
}

function OtherAddressForm() {
  const { t } = useTranslation();

  const { setValue, control } = useFormContext();
  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    setValue("otherStreet", suggestion.street);
    setValue("otherZipCode", suggestion.postalCode);
    setValue("otherCity", suggestion.city);
    setValue("country", "FR");
  };
  return (
    <>
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label="scenes.customers.details.otherAddress"
      />
      <div className="flex flex-col gap-4">
        <Controller
          name="otherStreet"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.street")}
              </Label>
              <FieldAddressAutocomplete
                id={field.name}
                {...field}
                value={field.value as string}
                handleSuggestionClick={handleSuggestionClick}
              />
            </div>
          )}
        />
        <Controller
          name="otherAddressSupplement"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.addressSupplement")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="otherZipCode"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.zipCode")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="otherCity"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.city")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="otherCountry"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.country")}
              </Label>
              <Select
                id={field.name}
                {...field}
                value={countriesOptions?.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => {
                  field.onChange(option?.value);
                }}
                options={countriesOptions as Option[]}
              />
            </div>
          )}
        />
      </div>
    </>
  );
}

function FiscalForm() {
  const { control } = useFormContext();

  return (
    <>
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label="scenes.customers.details.fiscalAddress"
      />

      <Controller
        name="fiscalAddress"
        control={control}
        render={({ field }) => (
          <FieldText id={field.name} {...field} value={field.value as string} />
        )}
      />
    </>
  );
}

function PhoneForm() {
  const { t } = useTranslation();

  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label="scenes.customers.details.phone"
      />
      <div className="flex flex-col gap-4">
        <Controller
          name="firstPhoneNumber"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.firstPhoneNumber")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                value={field.value as string}
              />
              {errors?.firstPhoneNumber && (
                <Text
                  className="text-red-500 text-sm mt-1"
                  label={t(`${errors.firstPhoneNumber}`)}
                />
              )}
            </div>
          )}
        />
        <Controller
          name="secondPhoneNumber"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.secondPhoneNumber")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                value={field.value as string}
              />
              {errors?.secondPhoneNumber && (
                <Text
                  className="text-red-500 text-sm mt-1"
                  label={errors.secondPhoneNumber as never}
                />
              )}
            </div>
          )}
        />
      </div>
    </>
  );
}

function EmailsForm({ emailDisabled }: { emailDisabled?: boolean }) {
  const { t } = useTranslation();

  const { control } = useFormContext();

  return (
    <>
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label="scenes.customers.details.emails"
      />
      <div className="flex flex-col gap-4">
        <Controller
          name="personalEmail"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("scenes.customers.details.personalEmail")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                disabled={emailDisabled == true}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="otherEmail"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("scenes.customers.details.otherEmail")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
      </div>
    </>
  );
}
