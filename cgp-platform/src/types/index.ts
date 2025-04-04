import { Control } from "react-hook-form";

import { AssetGroup, WealthFilter } from "./entities";

export * from "./entities";

export type Amount = {
  value?: number;
  grossValue?: number;
  instrument?: string;
};

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export enum Period {
  weekly = 7,
  thirty = 30,
  ninety = 90,
  yearly = 365,
  all = 0,
}

export type DataProps = {
  id: string | number;
  label: string;
  value: number;
  color?: string;
};

export interface PercentPieProps {
  className?: string;
  centeredTextClassName?: string;
  data: DataProps[];
  legendSide?: "right" | "left" | "top" | "bottom";
  colors?: string[];
  enableArcLabels?: boolean;
  centeredText?: string;
}

export interface GlobalSearchParams {
  period?: Period;
  range?: DateRange;
  invitation?: string;
}

export interface WealthFilteredSearch {
  wealthFilter?: WealthFilter;
}

export interface WealthCreationParams {
  assetType?: AssetGroup;
  isUnderManagement?: boolean;
  form?: unknown;
}

export type DiscriminatedResult<
  Result extends { __typename: unknown },
  Typename extends Result["__typename"],
> = Extract<Result, { __typename: Typename }>;


export type SubComponentFormProps = {
  extrasControl?: Control
}