import { zodResolver } from "@hookform/resolvers/zod";
import { personForms } from "@shared-schemas/customerInfo";
import { investorProfileFormSchema } from "@shared-schemas/investorProfileFormSchema";
import { lcbValidationSchema } from "@shared-schemas/lcb";
import { useParams, useSearch } from "@tanstack/react-router";
import debounce from "lodash/debounce";
import React, { useEffect, useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import { z } from "zod";

import { useCurrentRoute } from "../../../../hooks/useCurrentRoute";
import { useToast } from "../../../../hooks/useToast";
import { gql } from "../../../../service/client";
import {
  CustomerInformationsFullFieldsQuery,
  CustomerInformationsQuery,
} from "../../../../types";
import { LCBLogic } from "./conformity/LCB/LCB.logic";
import { CompanyCustomersInformationsLogic } from "./informations/informations.logic";

type GeneralInfosFormType = NonNullable<
  z.infer<typeof personForms.shape.generalForm>
>;
type DetailsInfosFormType = NonNullable<
  z.infer<typeof personForms.shape.detailsForm>
>;

type ProfileInvestFormType = z.infer<typeof investorProfileFormSchema>;
type LCBFormType = z.infer<typeof lcbValidationSchema>;

type CustomerContextType = {
  customerId: string;
  companyId: string;
  customer?: CustomerInformationsFullFieldsQuery["customer"];
  investorProfile?: CustomerInformationsFullFieldsQuery["investorProfileForm"];
  customerQuery: UseQueryResult<CustomerInformationsQuery, unknown>;

  generalInfosForm: UseFormReturn<GeneralInfosFormType>;
  detailsInfosForm: UseFormReturn<DetailsInfosFormType>;
  profileInvestForm: UseFormReturn<ProfileInvestFormType>;
  lcbForm: UseFormReturn<LCBFormType>;

  updateForms: UseMutationResult<any>;

  onSubmit: (
    e?: React.FormEvent,
    callback?: ReturnType<typeof debounce>
  ) => void;
};

const customerContext = React.createContext<CustomerContextType>({} as any);
export const useCustomerContext = () => React.useContext(customerContext);

const useSafeSearch = () => {
  try {
    return useSearch({
      from: "/company/$companyId/customer/$customerId/informations",
    });
  } catch (e) {
    return null;
  }
};

const CustomerContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const currentRoute = useCurrentRoute();

  const { companyId, customerId } = useParams({
    from: currentRoute.routeId,
  }) as { companyId: string; customerId: string };

  const search = useSafeSearch();

  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useTranslation();

  const customerQuery = useQuery(
    ["companyCustomersInformationsGeneralFullFields", customerId],
    () =>
      gql.client.request(CompanyCustomersInformationsLogic.fullFields(), {
        companyID: companyId,
        customerID: customerId,
      })
  );

  const isCustomerCreation = search?.source === "customer_creation";

  const customer = useMemo(
    () => customerQuery?.data?.customer as CustomerContextType["customer"],
    [customerQuery?.data]
  );

  const investorProfile = useMemo(
    () =>
      customerQuery?.data
        ?.investorProfileForm as CustomerContextType["investorProfile"],
    [customerQuery?.data]
  );

  const generalInfosForm = useForm<GeneralInfosFormType>({
    resolver: zodResolver(personForms.shape.generalForm),
    values: {
      ...customer?.informations?.general,
      tag: customer?.tag,
    },
    defaultValues: {
      nationality: "FR",
      taxResidence: "FR",
      ...(isCustomerCreation && {
        entryDateIntoRelationship: new Date(),
        dateLastMeeting: new Date(),
      }),
    },
  });

  const detailsInfosForm = useForm<DetailsInfosFormType>({
    resolver: zodResolver(personForms.shape.detailsForm),
    values: customer?.informations?.details,
    defaultValues: {
      country: "FR",
      fiscalAddress: "France",
    },
  });

  const lcbForm = useForm<LCBFormType>({
    resolver: zodResolver(lcbValidationSchema),
    values: customer?.informations?.lcbLab ?? {},
  });

  const profileInvestForm = useForm<ProfileInvestFormType>({
    resolver: zodResolver(investorProfileFormSchema),
    values: investorProfile,
  });

  const updateForms = useMutation({
    mutationFn: async () => {
      const mutations = [];
      if (generalInfosForm.formState.isDirty) {
        mutations.push(
          gql.client.request(
            CompanyCustomersInformationsLogic.updateCustomerInformationsGeneral(),
            {
              companyID: companyId,
              customerID: customerId,
              input: generalInfosForm.getValues(),
            }
          )
        );
      }

      if (detailsInfosForm.formState.isDirty) {
        mutations.push(
          gql.client.request(
            CompanyCustomersInformationsLogic.updateCustomerInformationsDetail(),
            {
              companyID: companyId,
              customerID: customerId,
              input: detailsInfosForm.getValues(),
            }
          )
        );
      }

      if (lcbForm.formState.isDirty) {
        mutations.push(
          gql.client.request(LCBLogic.updateLCB(), {
            companyID: companyId as string,
            customerId: customerId as string,
            input: lcbForm.getValues(),
          })
        );
      }

      return Promise.all(mutations);
    },
    onSuccess: () => refreshData(),
    onError: (e) => {
      if (e instanceof Error) {
        let message = "";

        if (e.message.includes("EMAIL_ALREADY_EXISTS"))
          message = "forms.fields.notifications.error.EMAIL_ALREADY_EXISTS";
        else if (e.message.includes("CANT_UPDATE_EMAIL"))
          message = "forms.fields.notifications.error.CANT_UPDATE_EMAIL";
        else message = "forms.fields.notifications.error.success";

        toast?.current?.show({
          severity: "error",
          summary: "Error",
          detail: t(message),
        });
      }
    },
  });

  const refreshData = () => {
    queryClient.invalidateQueries(["companyCustomersInformations", customerId]);
    queryClient.invalidateQueries(["layout_customer", companyId, customerId]);
    queryClient.invalidateQueries(["lcbForm", companyId, customerId]);
    queryClient.invalidateQueries([
      "users_in_customer_reference",
      companyId,
      customerId,
    ]);

    toast?.current?.show({
      severity: "success",
      summary: "Success",
      detail: t("forms.fields.notifications.success.save"),
    });
  };

  const submitDebounce = debounce(() => updateForms.mutate(), 1);
  const autoSubmitDebounce = debounce(() => updateForms.mutate(), 2000);

  const onSubmit = (
    e?: React.FormEvent,
    callback?: ReturnType<typeof debounce>
  ) => {
    e?.preventDefault();

    generalInfosForm.handleSubmit(callback ?? submitDebounce)(e);
    detailsInfosForm.handleSubmit(callback ?? submitDebounce)(e);
    lcbForm.handleSubmit(callback ?? submitDebounce)(e);
    profileInvestForm.handleSubmit(callback ?? submitDebounce)(e);
  };

  useEffect(() => {
    const watchSubscriptions = [
      generalInfosForm.watch(() => {
        onSubmit(undefined, autoSubmitDebounce);
      }),
      detailsInfosForm.watch(() => {
        onSubmit(undefined, autoSubmitDebounce);
      }),
      lcbForm.watch(() => {
        onSubmit(undefined, autoSubmitDebounce);
      }),
      profileInvestForm.watch(() => {
        onSubmit(undefined, autoSubmitDebounce);
      }),
    ];

    return () => {
      watchSubscriptions.forEach((w) => w.unsubscribe());
    };
  }, []);

  return (
    <customerContext.Provider
      value={
        {
          companyId,
          customerId,
          customer,
          investorProfile,
          customerQuery,

          generalInfosForm,
          detailsInfosForm,
          lcbForm,
          profileInvestForm,

          updateForms,

          onSubmit,
        } as never
      }
    >
      {children}
    </customerContext.Provider>
  );
};

export default CustomerContextProvider;
