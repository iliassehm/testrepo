import { DataType } from "../../../../../../../components/Table/tableTypes";
import { clsx } from "../../../../../../../helpers";

export const columnListClassName =
  "bg-blue-800 text-white font-normal border-r-2 border-x-white text-xs";

export const dataTypeBanking: Record<string, DataType> = {
  bankName: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  category: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  date: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  valuation: {
    type: "amount",
    sortable: true,
    field: "activity.value",
    className: clsx("w-32", columnListClassName),
  },
  delete: {
    type: "action",
    sortable: false,
    className: clsx("w-14", columnListClassName),
  },
};

export const dataTypeSecurities: Record<string, DataType> = {
  name: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  category: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  accountNumber: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  date: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  valuation: {
    type: "amount",
    sortable: true,
    field: "activity.value",
    className: clsx("w-32", columnListClassName),
  },
  delete: {
    type: "action",
    sortable: false,
    className: clsx("w-14", columnListClassName),
  },
};

export const dataTypeLongTermAsset: Record<string, DataType> = {
  name: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  category: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  contractNumber: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  establishment: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  subscriptionDate: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  transfersAmount: {
    type: "amount",
    sortable: true,
    className: clsx(columnListClassName),
  },
  scheduledPaymentList: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  scheduledPayment: {
    type: "amount",
    sortable: true,
    className: clsx(columnListClassName),
  },
  accountType: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  delete: {
    type: "action",
    sortable: false,
    className: clsx("w-14", columnListClassName),
  },
};

export const dataTypeCrowdfunding: Record<string, DataType> = {
  name: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  category: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  investDomain: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  investedCapital: {
    type: "amount",
    sortable: true,
    className: clsx(columnListClassName),
  },
  yield: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  startDate: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  endDate: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  delete: {
    type: "action",
    sortable: false,
    className: clsx("w-14", columnListClassName),
  },
};

export const dataTypePrivateEquity: Record<string, DataType> = {
  name: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  category: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  ownership: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  socialCapital: {
    type: "amount",
    sortable: true,
    className: clsx(columnListClassName),
  },
  unitPrice: {
    type: "amount",
    sortable: true,
    className: clsx(columnListClassName),
  },
  quantity: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  investValue: {
    type: "amount",
    sortable: true,
    className: clsx(columnListClassName),
  },
  buyingDate: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  valuation: {
    type: "amount",
    sortable: true,
    className: clsx(columnListClassName),
  },
  delete: {
    type: "action",
    sortable: false,
    className: clsx("w-14", columnListClassName),
  },
};

export const dataTypeBenefits: Record<string, DataType> = {
  name: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  category: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  contractNumber: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  insuranceCompany: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  subscriptionDate: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  contribution: {
    type: "amount",
    sortable: true,
    className: clsx(columnListClassName),
  },
  scheduledPaymentList: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  accountType: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  delete: {
    type: "action",
    sortable: false,
    className: clsx("w-14", columnListClassName),
  },
};

export const dataTypeExotic: Record<string, DataType> = {
  name: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  category: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  buyingValue: {
    type: "amount",
    sortable: true,
    className: clsx(columnListClassName),
  },
  currentValue: {
    type: "amount",
    sortable: true,
    className: clsx(columnListClassName),
  },
  quantity: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  ownership: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  buyingDate: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  delete: {
    type: "action",
    sortable: false,
    className: clsx("w-14", columnListClassName),
  },
};
