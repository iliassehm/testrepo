import { TypedDocumentNode } from "msw/lib/core/graphql";
import { useQuery } from "react-query";

import {
  benefitsAssetGroups,
  financialAssetGroups,
  nonFinancialAssetGroups,
  othersAssetGroups,
  passiveAssetGroups,
} from "../constants/assets";
import { CustomerWealthAssetSearch } from "../scenes/private/company/customers/wealth/route";
import { WealthLogic } from "../scenes/private/company/customers/wealth/wealth.logic";
import { PublicForm } from "../scenes/public/form/form.logic";
import { gql } from "../service/client";
import {
  AssetGroup,
  CustomerWealthQuery,
  PublicCustomerWealthQuery,
  WealthFilter,
} from "../types";

function fetchCustomerWealth<T>({
  queryFn,
  customerId,
  search,
  computing,
  ...params
}: {
  queryFn: () => TypedDocumentNode<T, any>;
  customerId?: string;
  company?: string;
  search: CustomerWealthAssetSearch;
  computing?: WealthFilter;
  token?: string;
}) {
  return gql.client.request(queryFn(), {
    ...params,
    ...(search.range ?? {}),
    ...(customerId ? { id: customerId } : {}),
    financialTypes: financialAssetGroups,
    nonFinancialTypes: nonFinancialAssetGroups,
    passiveTypes: passiveAssetGroups,
    benefitsTypes: benefitsAssetGroups,
    othersTypes: othersAssetGroups,
    repartitionTypes: Object.values(AssetGroup),
    computing,
  });
}

function useBaseCustomerWealth<T>({
  queryFn,
  customerId,
  company,
  token,
  search,
  computing,
  onSuccess,
}: {
  queryFn: () => TypedDocumentNode<T, any>;
  customerId?: string;
  company?: string;
  search: CustomerWealthAssetSearch;
  computing?: WealthFilter;
  token?: string;
  onSuccess?: (data: T) => void;
}) {
  return useQuery(
    ["customer_wealth", customerId, company, search.period, computing],
    () =>
      fetchCustomerWealth<T>({
        queryFn,
        customerId,
        company,
        search,
        computing,
        token,
      }),
    { onSuccess }
  );
}

export function useCustomerWealth(params: {
  customerId: string;
  company?: string;
  search: CustomerWealthAssetSearch;
  computing?: WealthFilter;
  onSuccess?: (data: CustomerWealthQuery) => void;
}) {
  return useBaseCustomerWealth<CustomerWealthQuery>({
    ...params,
    queryFn: WealthLogic.queries,
  });
}

export function usePublicCustomerWealth(params: {
  token: string;
  search: CustomerWealthAssetSearch;
  computing?: WealthFilter;
  onSuccess?: (data: PublicCustomerWealthQuery) => void;
}) {
  return useBaseCustomerWealth<PublicCustomerWealthQuery>({
    ...params,
    queryFn: PublicForm.publicCustomerWidgetWealth,
  });
}
