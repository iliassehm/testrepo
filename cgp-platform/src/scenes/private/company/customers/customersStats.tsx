import { memo, useCallback } from "react";
import { UseMutateFunction } from "react-query";

import { Text } from "../../../../components";
import { Card } from "../../../../components/Card";
import { defaultAmount } from "../../../../constants";
import { clsx } from "../../../../helpers";
// import { InputNumber } from "primereact/inputnumber";
// import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";
import {
  Amount,
  CustomerDetails,
  CustomerDetailsUpdateInput,
  CustomerDetailsUpdateMutation,
} from "../../../../types";

export const CustomersStats = memo(
  ({
    data: { count, averageWealth, managedWealth } = {
      count: 0,
      averageWealth: defaultAmount,
      managedWealth: defaultAmount,
    },
    customerDetailsUpdate,
  }: {
    data: CustomerDetails;
    customerDetailsUpdate: UseMutateFunction<
      CustomerDetailsUpdateMutation,
      unknown,
      Partial<CustomerDetailsUpdateInput>,
      unknown
    >;
  }) => {
    const onSubmit = useCallback(
      (key: keyof CustomerDetailsUpdateInput) => (value: number) => {
        customerDetailsUpdate({
          count,
          managedWealth: managedWealth.value,
          averageWealth: averageWealth.value,
          [key]: value,
        });
      },
      [count, managedWealth, averageWealth]
    );

    return (
      <>
        <EditableCard
          label="scenes.company.assetTypeWealth.stats.nb_clients"
          value={count}
          onSubmit={onSubmit("count")}
        />
        <EditableCard
          label="scenes.company.assetTypeWealth.stats.average_wealth"
          value={averageWealth}
          onSubmit={onSubmit("averageWealth")}
          withCurrency
        />
        <EditableCard
          label="scenes.company.assetTypeWealth.stats.managedWealth"
          value={managedWealth}
          onSubmit={onSubmit("managedWealth")}
          withCurrency
        />
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps?.data?.count === nextProps?.data?.count &&
      prevProps?.data?.averageWealth.value ===
        nextProps?.data?.averageWealth.value &&
      prevProps?.data?.managedWealth.value ===
        nextProps?.data?.managedWealth.value
    );
  }
);

function EditableCard({
  label,
  value,
  withCurrency = false,
  className,
}: {
  label: string;
  value: Amount | number;
  withCurrency?: boolean;
  onSubmit: (value: number) => void;
  className?: string;
}) {
  // States
  const amount = typeof value === "number" ? value : value.value ?? 0;

  // Variables
  const formattedAmount = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  const displayAmount = withCurrency ? `${formattedAmount} €` : formattedAmount;

  return (
    <Card
      className={clsx(
        "flex flex-col items-center w-fit bg-white px-4 pt-5",
        className
      )}
    >
      <Text
        as="h3"
        label={label}
        className="text-center font-bold text-blue-1100 whitespace-nowrap"
      />
      {/* <Inplace
        active={isOpen}
        closable
        onClose={() => {
          onSubmit(state);
          setIsopen(false);
        }}
        className="customer-inplace"
      > */}
      <div className="customer-inplace my-6">
        {/* <InplaceDisplay> */}
        <div className="relative">
          <p className="font-bold text-2xl text-blue-800 whitespace-nowrap">
            {displayAmount}
          </p>
        </div>
      </div>
      {/* </InplaceDisplay> */}
      {/* <InplaceContent>
          <div className="flex-1">
            <InputNumber
              inputClassName="h-2"
              defaultValue={"test"}
              onChange={(e) => e.value !== null && setState(e.value)}
              autoFocus
            />
          </div>
        </InplaceContent> */}
      {/* </Inplace> */}
    </Card>
  );
}
