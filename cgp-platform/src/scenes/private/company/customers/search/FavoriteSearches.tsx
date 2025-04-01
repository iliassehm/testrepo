import { Link, useParams } from "@tanstack/react-router";
import { X } from "lucide-react";
import { type FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { z } from "zod";

import { customersSearchSchema } from "../../../../../../shared/schemas/customers.search";
import { gql } from "../../../../../service/client";
import { CompanyCustomersSearchLogic } from "./search.logic";
import { useDeleteSearch } from "./useDeleteSearch";

const Condition = ({
  condition,
}: {
  condition: z.infer<typeof customersSearchSchema>["conditions"][number];
}) => {
  const { t } = useTranslation();

  const fieldLabel = t(`scenes.customersSearch.forms.${condition.field}`);
  if (Array.isArray(condition.value)) {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">{fieldLabel}:</p>
        <ul>
          {condition.value.map((value: string, i: number) => (
            <li key={i} className="text-sm text-blue-800">
              {"- "}
              {t([
                `asset_categories.${value}`,
                `asset_group.${value}`,
                `investmentTypes.${value}`,
                value,
              ])}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <p className="font-medium text-sm">{fieldLabel}:</p>
      <p className="text-sm text-blue-800">{condition.value}</p>
    </div>
  );
};
const FavoriteSearch = ({
  favorite,
  defaultRoute = "company",
}: {
  favorite: { id: string; schema: z.infer<typeof customersSearchSchema> };
  defaultRoute?: string;
}) => {
  const deleteMutation = useDeleteSearch();
  const params = useParams({
    from:
      defaultRoute === "company"
        ? "/company/$companyId/customers/search"
        : "/parent-company/$companyId/customers/search",
  });
  const parsedSchema = useMemo(() => {
    return customersSearchSchema.parse(favorite.schema);
  }, [favorite.schema]);

  return (
    <Link
      to={
        defaultRoute === "company"
          ? "/company/$companyId/customers/search"
          : "/parent-company/$companyId/customers/search"
      }
      params={{
        companyId: params.companyId,
      }}
      search={{
        tab: favorite.schema.type,
        schema: favorite.schema,
      }}
      className="bg-white rounded-xl p-4 relative hover:opacity-75 transition-all"
    >
      <button
        className="absolute top-2 right-2"
        type="button"
        onClick={(e) => {
          e.preventDefault();
          deleteMutation.mutate(favorite.id);
        }}
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex flex-col gap-4">
        {parsedSchema.conditions.map((condition, i) => (
          <Condition key={i} condition={condition} />
        ))}
      </div>
    </Link>
  );
};

export const FavoriteSearches = ({
  defaultRoute = "company",
}: {
  defaultRoute?: string;
}) => {
  const { t } = useTranslation();
  const favoritesQuery = useQuery({
    queryKey: ["favoritesSearches"],
    queryFn: () =>
      gql.client.request(CompanyCustomersSearchLogic.getFavoriteSearches()),
  });

  return (
    <>
      <h2 className="font-bold text-xl text-blue-800 mb-8">
        {t("scenes.customersSearch.save.title")}
      </h2>

      {favoritesQuery.isLoading ? null : (
        <div className="flex flex-col gap-4 grow overflow-auto max-h-[600px] pr-2 py-2">
          {favoritesQuery.data?.favoriteSearchQueries?.length ? (
            favoritesQuery.data?.favoriteSearchQueries?.map((favorite, i) => (
              <FavoriteSearch
                key={i}
                favorite={favorite}
                defaultRoute={defaultRoute}
              />
            ))
          ) : (
            <div>{t("scenes.customersSearch.save.empty")}</div>
          )}
        </div>
      )}
    </>
  );
};

export default FavoriteSearches;
