import { useTranslation } from "react-i18next";

import { Widget } from "../../../../components/Widget";
import { formatCurrency } from "../../../../helpers";
import { Customer, HomeQuery, Scalars } from "../../../../types";
import { customerHomeRoute } from "../customers/route";
import { companyIndexRoute } from "../route";

type CustomerType = NonNullable<
  HomeQuery["company"]
>["customerList"]["edges"][number]["node"];

export function HomeCustomersTable<T extends CustomerType>({
  nodes,
  onRowClick,
}: {
  nodes: T[];
  onRowClick: (data: T) => void;
}) {
  return (
    <div>
      {nodes?.map((element, index) => (
        <div key={index} className="grid grid-cols-5 gap-4 mt-4 text-xs">
          <div
            className="col-span-3 border rounded-lg border-stone-100 bg-stone-100 flex p-3 gap-4 cursor-pointer"
            onClick={() => onRowClick(element)}
          >
            <div className="overflow-hidden text-ellipsis whitespace-nowrap w-1/2 text-sm">
              {element.firstName
                ? element.firstName
                  ?.split(" ")
                  .map((word) => {
                    return word === undefined || word === '' ? undefined : word[0].toUpperCase() + word.substring(1);
                  })
                  .join(" ") + " "
                : ""}
              {element.lastName
                ? element.lastName.toUpperCase()
                : element.name?.toUpperCase()}
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap w-1/2 text-sm">
              {element.email}
            </div>
          </div>
          <div className="border text-blue-800 rounded-lg border-stone-100 bg-stone-100 flex py-3 px-12  justify-center text-sm">
            {formatCurrency(element.wealth)}
          </div>
          <div className="bg-gradient-custom text-white border rounded-lg border-stone-100 bg-stone-100 flex py-3 px-12  justify-center text-sm">
            {formatCurrency(element.underManagement)}
          </div>
        </div>
      ))}
    </div>
  );
}

interface Props {
  company: HomeQuery["company"];
  params: {
    companyId?: string | undefined;
  };
  navigate: any;
}

export function HomeTable({ company, params, navigate }: Props) {
  const { t } = useTranslation();

  const nodes = company?.customerList.edges.map((edge) => edge.node);

  return (
    <Widget
      title="widgets.customers"
      className="h-fit"
      largeTitle
      viewAll={{
        to: "/company/$companyId/customers",
        params: {
          companyId: params.companyId,
        },
      }}
    >
      <div>
        <div className="grid grid-cols-5 text-blue-800 font-semibold">
          <div className="col-span-3 flex p-3">
            <div className="basis-1/2">{t("forms.fields.tables.name")}</div>
            <div className="basis-1/2">{t("forms.fields.tables.email")}</div>
          </div>
          <div className="p-3 flex justify-center">
            <div>{t("forms.fields.tables.wealth")}</div>
          </div>
          <div className="p-3 flex justify-center">
            <div>{t("forms.fields.tables.investment")}</div>
          </div>
        </div>

        <HomeCustomersTable
          nodes={nodes!}
          onRowClick={(element) =>
            navigate({
              to: customerHomeRoute.id,
              params: {
                companyId: params.companyId as string,
                customerId: element.id,
              },
              from: companyIndexRoute.fullPath,
            })
          }
        />
      </div>
    </Widget>
  );
}
