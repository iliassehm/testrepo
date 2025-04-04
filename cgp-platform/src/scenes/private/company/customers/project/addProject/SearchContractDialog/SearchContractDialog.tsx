import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Dialog } from "../../../../../../../components";
import { Contract } from "../../../../../../../types";
import { companyCustomersProjectAddRoute } from "../../route";
import { useContractList } from "../../useContractList";
import { SearchContractForm } from "./SearchContractForm";
import { SearchContractTable } from "./SearchContractTable";

const validationSchema = z.object({
  insuranceCompanies: z.array(z.string()).optional(),
  types: z.array(z.string()).optional(),
  name: z.string().optional(),
  selected: z.boolean().optional(),
});
export const typeValuesToContract: { [key: string]: string } = {
  perco: "PERCO",
  pepLifeInsurance: "PEP",
  madelinContract: "Madelin",
  capitalizationContract: "Capitalisation",
  lifeInsuranceContract: "Assurance Vie",
  // : "PERP",
  // : "Plan Epargne Retraite",
  // : "PEA-PME",
  // : "PEA",
  // : "Compte-Titre",

  // article83Contract :
  // per :
  // pee :
};

export type SearchContractFormValues = z.infer<typeof validationSchema>;

export const SearchContractDialog: React.FC<{
  visible: boolean;
  type?: string;
  setVisible: (val: boolean) => void;
  onSelectContract: (contract: Contract) => void;
}> = ({ visible, type, setVisible, onSelectContract }) => {
  const { t } = useTranslation();
  const form = useForm<SearchContractFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      types: type
        ? typeValuesToContract[type]
          ? [typeValuesToContract[type]]
          : []
        : [],
    },
  });

  const params = useParams({ from: companyCustomersProjectAddRoute.id });

  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);

  const { data } = useContractList({
    filters: {
      insuranceCompanies: form.watch("insuranceCompanies") ?? [],
      types: form.watch("types") ?? (type ? [typeValuesToContract[type]] : []),
      name: form.watch("name")?.trim() ?? undefined,
      selected: form.watch("selected") ?? false,
    },
    pagination: {
      page: page + 1,
      size: pageSize,
    },
    companyID: params.companyId as string,
  });

  useEffect(() => {
    // Reset page number when filters change
    setPage(0);
  }, [
    form.watch("insuranceCompanies"),
    form.watch("types"),
    form.watch("name"),
    form.watch("selected"),
  ]);

  return (
    <Dialog
      open={visible}
      header={t("scenes.customers.projects.searchContract.title")}
      className="min-w-[700px]"
      onOpenChange={() => setVisible(false)}
    >
      <div className="flex flex-col items-center gap-4 mt-4">
        <SearchContractForm form={form} />
        <SearchContractTable
          data={data?.contractListing?.contracts ?? []}
          setPage={setPage}
          pagination={{
            currentPage: page,
            totalPage: data?.contractListing?.totalPages ?? 0,
            totalResults: data?.contractListing?.totalCount ?? 0,
          }}
          onSubmit={(contract) => {
            onSelectContract(contract);
            setVisible(false);
          }}
        />
      </div>
    </Dialog>
  );
};
