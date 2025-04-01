import { t } from "i18next";
import { InputNumber } from "primereact/inputnumber";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button, Select } from "../../../../../../components";
import { Widget } from "../../../../../../components/Widget";
import { config } from "../../../../../../config/configuration";
import { getFormErrorMessage } from "../../../../../../constants";
import {
  AssetGroup,
  Customer,
  CustomerAsset,
  RealEstate,
} from "../../../../../../types";
import FieldAmount from "../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldDate } from "../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldNumber } from "../../../../../../UIComponents/FieldNumber/FieldNumber";
import FieldPercentage from "../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { FieldTextarea } from "../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { Label } from "../../../../../../UIComponents/Label/Label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../../../UIComponents/RadioGroup/RadioGroup";

export enum RealEstateFormType {
  SIMPLIFIED = "SIMPLIFIED",
  DETAILED = "DETAILED",
}

enum RealEstateAmenitiesProximity {
  VERY_DISTANT = "VERY_DISTANT",
  DISTANT = "DISTANT",
  STANDARD = "STANDARD",
  CLOSE = "CLOSE",
  VERY_CLOSE = "VERY_CLOSE",
}

enum CondominiumCondition {
  WELL_MAINTAINED = "WELL_MAINTAINED",
  STANDARD = "STANDARD",
  NECLECTED = "NECLECTED",
}

enum RealEstateView {
  VIS_A_VIS = "VIS_A_VIS",
  OPEN_VIEW = "OPEN_VIEW",
  OUTSTANDING = "OUTSTANDING",
}

enum BuildingStanding {
  PREMIUM = "PREMIUM",
  GOOD = "GOOD",
  NORMAL = "NORMAL",
  LOW = "LOW",
}

enum AppartmentType {
  HOUSE = "HOUSE",
  SIMPLEX = "SIMPLEX",
  DUPLEX = "DUPLEX",
  TRIPLEX = "TRIPLEX",
  LAND = "LAND",
}

enum GardenType {
  LANDSCAPE = "LANDSCAPE",
  LANDSCAPED = "LANDSCAPED",
  STANDARD_NONE = "STANDARD_NONE",
  TO_BE_LANDSCAPED = "TO_BE_LANDSCAPED",
}

enum PoolType {
  NONE = "NONE",
  STANDARD = "STANDARD",
  STANDING = "STANDING",
}

enum Direction {
  EAST = "EAST",
  NORTH = "NORTH",
  SOUTH = "SOUTH",
  WEST = "WEST",
}

enum AppartmentCondition {
  REDONE = "REDONE",
  REFRESHED = "REFRESHED",
  STANDARD = "STANDARD",
  TO_REFRESH = "TO_REFRESH",
  IMPORTANT_WORK = "IMPORTANT_WORK",
}

enum MainCategory {
  HERITAGE = "heritage",
  PROFESSIONAL = "professional",
  INVESTMENT = "commercial",
}

export enum SubCategory {
  PRIMARY_RESIDENCE = "primary",
  SECONDARY_RESIDENCE = "secondary",
  LAND = "lot",
  OTHER_HERITAGE = "other_heritage",
  CORPORATE = "realestate_entreprise",
  COMMERCIAL = "commercial_buildings",
  BUSINESS = "business_assets",
  RENTAL = "rental_property",
  LAND_INCOME = "landIncome",
  LMP = "lmp",
  LMNP = "lmnp",
  SCI = "part_sci",
  PINEL = "rental_property_pinel_law",
  DUFLOT = "rental_property_duflot_law",
  MALRAUX = "rental_property_malraux_law",
  SCELLIER = "rental_property_scellier_law",
  ROBIEN = "rental_property_robien_law",
  BORLOO = "rental_property_borloo_law",
  BESSON = "rental_property_besson_law",
  LAND_GROUPING = "land_grouping",
  LAND_GROUPING_WINE = "land_grouping_wine",
  LAND_GROUPING_INVESTMENT = "land_grouping_investment",
  LAND_GROUPING_FORESTRY = "land_grouping_forestry",
}

export const categoryNames = [
  {
    category: MainCategory.HERITAGE,
    label: t(
      `forms.fields.wealth.realEstate.subCategory.primaryResidence`
    ) as string,
    value: SubCategory.PRIMARY_RESIDENCE,
  },
  {
    category: MainCategory.HERITAGE,
    label: t(
      `forms.fields.wealth.realEstate.subCategory.secondaryResidence`
    ) as string,
    value: SubCategory.SECONDARY_RESIDENCE,
  },
  {
    category: MainCategory.HERITAGE,
    label: t(`forms.fields.wealth.realEstate.subCategory.land`) as string,
    value: SubCategory.LAND,
  },
  {
    category: MainCategory.HERITAGE,
    label: t(
      `forms.fields.wealth.realEstate.subCategory.otherHeritage`
    ) as string,
    value: SubCategory.OTHER_HERITAGE,
  },
  {
    category: MainCategory.PROFESSIONAL,
    label: t(`forms.fields.wealth.realEstate.subCategory.corporate`) as string,
    value: SubCategory.CORPORATE,
  },
  {
    category: MainCategory.PROFESSIONAL,
    label: t(`forms.fields.wealth.realEstate.subCategory.commercial`) as string,
    value: SubCategory.COMMERCIAL,
  },
  {
    category: MainCategory.PROFESSIONAL,
    label: t(`forms.fields.wealth.realEstate.subCategory.business`) as string,
    value: SubCategory.BUSINESS,
  },
  {
    category: MainCategory.INVESTMENT,
    label: t(`forms.fields.wealth.realEstate.subCategory.landIncome`) as string,
    value: SubCategory.LAND_INCOME,
  },
  {
    category: MainCategory.INVESTMENT,
    label: t(`forms.fields.wealth.realEstate.subCategory.lmp`) as string,
    value: SubCategory.LMP,
  },
  {
    category: MainCategory.INVESTMENT,
    label: t(`forms.fields.wealth.realEstate.subCategory.lmnp`) as string,
    value: SubCategory.LMNP,
  },
  {
    category: MainCategory.INVESTMENT,
    label: t(`forms.fields.wealth.realEstate.subCategory.sci`) as string,
    value: SubCategory.SCI,
  },
  {
    category: MainCategory.INVESTMENT,
    label: t(`forms.fields.wealth.realEstate.subCategory.pinel`) as string,
    value: SubCategory.PINEL,
  },
  {
    category: MainCategory.INVESTMENT,
    label: t(`forms.fields.wealth.realEstate.subCategory.duflot`) as string,
    value: SubCategory.DUFLOT,
  },
  {
    category: MainCategory.INVESTMENT,
    label: t(`forms.fields.wealth.realEstate.subCategory.malraux`) as string,
    value: SubCategory.MALRAUX,
  },
  {
    category: MainCategory.INVESTMENT,
    label: t(`forms.fields.wealth.realEstate.subCategory.scellier`) as string,
    value: SubCategory.SCELLIER,
  },
  {
    category: MainCategory.INVESTMENT,
    label: t(`forms.fields.wealth.realEstate.subCategory.robien`) as string,
    value: SubCategory.ROBIEN,
  },
  {
    category: MainCategory.INVESTMENT,
    label: t(`forms.fields.wealth.realEstate.subCategory.borloo`) as string,
    value: SubCategory.BORLOO,
  },
  {
    category: MainCategory.INVESTMENT,
    label: t(`forms.fields.wealth.realEstate.subCategory.besson`) as string,
    value: SubCategory.BESSON,
  },
  {
    category: MainCategory.INVESTMENT,
    label: t(
      `forms.fields.wealth.realEstate.subCategory.landGrouping`
    ) as string,
    value: SubCategory.LAND_GROUPING,
  },
  {
    category: MainCategory.INVESTMENT,
    label: t(
      `forms.fields.wealth.realEstate.subCategory.landGroupingWine`
    ) as string,
    value: SubCategory.LAND_GROUPING_WINE,
  },
  {
    category: MainCategory.INVESTMENT,
    label: t(
      `forms.fields.wealth.realEstate.subCategory.landGroupingInvestment`
    ) as string,
    value: SubCategory.LAND_GROUPING_INVESTMENT,
  },
  {
    category: MainCategory.INVESTMENT,
    label: t(
      `forms.fields.wealth.realEstate.subCategory.landGroupingForestry`
    ) as string,
    value: SubCategory.LAND_GROUPING_FORESTRY,
  },
];

interface RealEstateFormData {
  name?: string;
  source?: string | null;
  lat: number;
  lon: number;
  valuation?: number | null;
  price: number | null;
  buyingDate: Date;
  floors?: number | null;
  ownership: number;
  otherOwners?: string | null;
  orientation?: Direction | null;
  pool?: PoolType | null;
  condition?: AppartmentCondition | null;
  bedrooms?: number | null;
  garden?: GardenType | null;
  typeId: AppartmentType;
  bathrooms?: number | null;
  buildingFloors?: number | null;
  floor?: number | null;
  areaLand?: number | null;
  areaBalcony?: number | null;
  buildingStanding?: BuildingStanding | null;
  rooms?: number | null;
  area?: number | null;
  parkingPlots?: number | null;
  vista: RealEstateView;
  amenityProximity: RealEstateAmenitiesProximity;
  condominiumCondition?: CondominiumCondition;
  categoryName: string;
  comment: string;
  annualRevenues: number;
}

const rentCategories = [
  "lmp",
  "lmnp",
  "part_sci",
  "rental_property_pinel_law",
  "rental_property_duflot_law",
  "rental_property_malraux_law",
  "rental_property_scellier_law",
  "rental_property_robien_law",
  "rental_property_borloo_law",
  "rental_property_besson_law",
  "land_grouping",
  "land_grouping_wine",
  "land_grouping_investment",
  "land_grouping_forestry",
];

export const RealEstateForm = ({
  asset,
  onSubmit,
  type,
  isLoading,
  realEstateFormType,
  otherOwners,
  otherOwner,
  customerId,
}: {
  asset?: CustomerAsset;
  onSubmit: (data: RealEstateFormData) => void;
  type: AssetGroup;
  referenceInstrument: string;
  isLoading?: boolean;
  realEstateFormType?: RealEstateFormType;
  otherOwners: { value: string; label: string }[];
  otherOwner?: Customer;
  customerId: string;
}) => {
  const { t } = useTranslation();

  const maxBuyingDate = new Date(new Date().setDate(new Date().getDate() - 1));

  const defaultValues: RealEstateFormData = {
    name: asset?.name ?? "",
    typeId: (asset?.metadata?.typeId ??
      AppartmentType.SIMPLEX) as AppartmentType,
    categoryName: asset?.categoryName ?? categoryNames[0].value,
    comment: asset?.metadata?.comment ?? "",
    annualRevenues: asset?.metadata?.annualRevenues ?? 0,
    source: asset?.metadata?.source ?? "",
    lat: asset?.metadata?.lat ?? 0,
    lon: asset?.metadata?.lon ?? 0,
    ownership: asset?.owners?.find((owner) => owner.entity?.id === customerId)
      ?.ownership
      ? (asset.owners.find((owner) => owner.entity?.id === customerId)
          ?.ownership ?? 0) * 100
      : 100,
    otherOwners: otherOwner?.id ?? "",
    valuation: asset?.activity?.value,
    price: asset?.metadata?.price ?? 0,
    buyingDate: asset?.metadata?.buyingDate ?? maxBuyingDate,
    area: asset?.metadata?.area ?? null,
    rooms: asset?.metadata?.rooms ?? null,
    bathrooms: asset?.metadata?.bathrooms ?? null,
    bedrooms: asset?.metadata?.bedrooms ?? null,
    parkingPlots: asset?.metadata?.parkingPlots ?? null,
    areaBalcony: asset?.metadata?.areaBalcony ?? null,
    floor: asset?.metadata?.floor ?? null,
    buildingFloors: asset?.metadata?.buildingFloors ?? null,
    condition: (asset?.metadata?.condition ??
      AppartmentCondition.STANDARD) as unknown as AppartmentCondition,
    buildingStanding: (asset?.metadata?.buildingStanding ??
      BuildingStanding.NORMAL) as unknown as BuildingStanding,
    orientation: (asset?.metadata?.orientation ?? null) as Direction | null,
    vista: (asset?.metadata?.vista ??
      RealEstateView.OPEN_VIEW) as RealEstateView,
    amenityProximity: (asset?.metadata?.amenityProximity ??
      RealEstateAmenitiesProximity.STANDARD) as RealEstateAmenitiesProximity,
    condominiumCondition: (asset?.metadata?.condominiumCondition ??
      CondominiumCondition.STANDARD) as CondominiumCondition,
    floors: asset?.metadata?.floors ?? null,
    areaLand: asset?.metadata?.areaLand ?? null,
    pool: (asset?.metadata?.pool ?? PoolType.NONE) as PoolType | null,
    garden: (asset?.metadata?.garden ??
      GardenType.LANDSCAPE) as GardenType | null,
  };

  const {
    control,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
    register,
    getValues,
  } = useForm({ defaultValues });

  // const categorieNameWatch = useWatch({
  //   control,
  //   name: "categoryName",
  // });

  // useEffect(() => {
  //   if (!rentCategories.includes(categorieNameWatch)) {
  //     setValue("annualRevenues", 0);
  //   }
  // }, [categorieNameWatch]);

  const housingOptions = [
    {
      label: t(`forms.fields.wealth.realEstate.type.apartment`) as string,
      value: AppartmentType.SIMPLEX,
    },
    {
      label: t(`forms.fields.wealth.realEstate.type.home`) as string,
      value: AppartmentType.HOUSE,
    },
    {
      label: t(`forms.fields.wealth.realEstate.type.land`) as string,
      value: AppartmentType.LAND,
    },
  ];

  const conditionOptions = [
    {
      name: t(`forms.fields.wealth.realEstate.condition.REDONE`) as string,
      value: AppartmentCondition.REDONE,
    },
    {
      name: t(`forms.fields.wealth.realEstate.condition.REFRESHED`) as string,
      value: "REFRESHED",
    },
    {
      name: t(`forms.fields.wealth.realEstate.condition.STANDARD`) as string,
      value: AppartmentCondition.STANDARD,
    },
    {
      name: t(`forms.fields.wealth.realEstate.condition.TO_REFRESH`) as string,
      value: AppartmentCondition.TO_REFRESH,
    },
    {
      name: t(
        `forms.fields.wealth.realEstate.condition.IMPORTANT_WORK`
      ) as string,
      value: AppartmentCondition.IMPORTANT_WORK,
    },
  ];

  const standingOptions = [
    {
      name: t(`forms.fields.wealth.realEstate.buildingStanding.top`) as string,
      value: BuildingStanding.PREMIUM,
    },
    {
      name: t(`forms.fields.wealth.realEstate.buildingStanding.good`) as string,
      value: BuildingStanding.GOOD,
    },
    {
      name: t(
        `forms.fields.wealth.realEstate.buildingStanding.standard`
      ) as string,
      value: BuildingStanding.NORMAL,
    },
    {
      name: t(`forms.fields.wealth.realEstate.buildingStanding.low`) as string,
      value: BuildingStanding.LOW,
    },
  ];

  const orientationOptions = [
    {
      name: t(`forms.fields.wealth.realEstate.orientation.north`) as string,
      value: Direction.NORTH,
    },
    {
      name: t(`forms.fields.wealth.realEstate.orientation.east`) as string,
      value: Direction.EAST,
    },
    {
      name: t(`forms.fields.wealth.realEstate.orientation.south`) as string,
      value: Direction.SOUTH,
    },
    {
      name: t(`forms.fields.wealth.realEstate.orientation.west`) as string,
      value: Direction.WEST,
    },
  ];

  const vistaOptions = [
    {
      name: t(`forms.fields.wealth.realEstate.vista.VIS_A_VIS`) as string,
      value: "VIS_A_VIS",
    },
    {
      name: t(`forms.fields.wealth.realEstate.vista.OPEN_VIEW`) as string,
      value: "OPEN_VIEW",
    },
    {
      name: t(`forms.fields.wealth.realEstate.vista.OUTSTANDING`) as string,
      value: "OUTSTANDING",
    },
  ];

  const commoditesOptions = [
    {
      name: t(
        `forms.fields.wealth.realEstate.amenityProximity.VERY_DISTANT`
      ) as string,
      value: RealEstateAmenitiesProximity.VERY_DISTANT,
    },
    {
      name: t(
        `forms.fields.wealth.realEstate.amenityProximity.DISTANT`
      ) as string,
      value: RealEstateAmenitiesProximity.DISTANT,
    },
    {
      name: t(
        `forms.fields.wealth.realEstate.amenityProximity.STANDARD`
      ) as string,
      value: RealEstateAmenitiesProximity.STANDARD,
    },
    {
      name: t(
        `forms.fields.wealth.realEstate.amenityProximity.CLOSE`
      ) as string,
      value: RealEstateAmenitiesProximity.CLOSE,
    },
    {
      name: t(
        `forms.fields.wealth.realEstate.amenityProximity.VERY_CLOSE`
      ) as string,
      value: RealEstateAmenitiesProximity.VERY_CLOSE,
    },
  ];

  const poolOptions = [
    {
      name: t(`forms.fields.wealth.realEstate.pool.NONE`) as string,
      value: PoolType.NONE,
    },
    {
      name: t(`forms.fields.wealth.realEstate.pool.STANDARD`) as string,
      value: PoolType.STANDARD,
    },
    {
      name: t(`forms.fields.wealth.realEstate.pool.STANDING`) as string,
      value: PoolType.STANDING,
    },
  ];

  const gardenOptions = [
    {
      name: t(`forms.fields.wealth.realEstate.garden.LANDSCAPE`) as string,
      value: GardenType.LANDSCAPE,
    },
    {
      name: t(`forms.fields.wealth.realEstate.garden.LANDSCAPED`) as string,
      value: GardenType.LANDSCAPED,
    },
    {
      name: t(`forms.fields.wealth.realEstate.garden.STANDARD_NONE`) as string,
      value: GardenType.STANDARD_NONE,
    },
    {
      name: t(
        `forms.fields.wealth.realEstate.garden.TO_BE_LANDSCAPED`
      ) as string,
      value: GardenType.TO_BE_LANDSCAPED,
    },
  ];

  const condominiumConditionOptions = [
    {
      name: t(
        `forms.fields.wealth.realEstate.condominiumCondition.WELL_MAINTAINED`
      ) as string,
      value: CondominiumCondition.WELL_MAINTAINED,
    },
    {
      name: t(
        `forms.fields.wealth.realEstate.condominiumCondition.STANDARD`
      ) as string,
      value: CondominiumCondition.STANDARD,
    },
    {
      name: t(
        `forms.fields.wealth.realEstate.condominiumCondition.NEGLECTED`
      ) as string,
      value: CondominiumCondition.NECLECTED,
    },
  ];

  const houseType = watch("typeId");

  if (realEstateFormType === RealEstateFormType.SIMPLIFIED) {
    return (
      <Widget className="pt-4">
        <form
          className="flex flex-col gap-y-5"
          onSubmit={handleSubmit((data) =>
            onSubmit({
              ...data,
              ownership: data.ownership / 100,
            })
          )}
        >
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
            <div className="rounded-xl bg-white">
              <Label
                htmlFor={"name"}
                className="ml-3 font-medium text-xs text-blue-1000"
              >
                {t(`forms.fields.wealth.realEstate.name.label`)}
              </Label>
              <FieldText
                {...register("name")}
                className="w-full border bg-slate-50"
                placeholder={
                  t(`forms.fields.wealth.realEstate.name.placeholder`) || ""
                }
              />
              {getFormErrorMessage("name", errors)}
            </div>
            <div className="rounded-xl bg-white">
              <Controller
                name="categoryName"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.realEstate.type.error`
                  ) as string,
                }}
                render={({ field }) => (
                  <>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-bold text-sm text-blue-1000"
                    >
                      {t(`forms.fields.category`)}
                    </Label>
                    <Select
                      name="categoryName"
                      defaultValue={getValues().categoryName}
                      options={categoryNames
                        .filter((option) => type.includes(option.category))
                        .map((option) => ({
                          value: option.value,
                          label: option.label,
                          optgroup: t(
                            "forms.fields.wealth.realEstate.mainCategory." +
                              option.category
                          ),
                        }))}
                      className="min-w-[150px] py-2"
                      onChange={(option) => field.onChange(option)}
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>

            {/* {rentCategories.includes(categorieNameWatch) && ( */}
            <div className="rounded-xl bg-white">
              <Controller
                key="annualRevenues"
                name="annualRevenues"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.realEstate.annualRevenues.error`
                  ) as string,
                  validate: (value) =>
                    value !== null ||
                    (t(
                      `forms.fields.wealth.realEstate.annualRevenues.label`
                    ) as string),
                }}
                render={({ field }) => (
                  <div>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.realEstate.annualRevenues.label`)}
                    </Label>
                    <InputNumber
                      id={field.name}
                      value={field.value as number}
                      onChange={(e) => field.onChange(e.value as number)}
                      className="w-full border bg-slate-50"
                      inputClassName="flex h-10 w-full bg-slate-50 rounded-md border border-input px-3 py-2 text-sm 
                    ring-offset-background placeholder:text-muted-foreground text-right"
                      mode="currency"
                      currency="EUR"
                      locale="fr-FR"
                      maxFractionDigits={2}
                      placeholder={
                        t(
                          `forms.fields.wealth.realEstate.annualRevenues.placeholder`
                        ) || ""
                      }
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </div>
                )}
              />
            </div>
            <div className="rounded-xl bg-white">
              <Controller
                key="typeId"
                name="typeId"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.realEstate.type.error`
                  ) as string,
                }}
                render={({ field }) => (
                  <>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.realEstate.type.label`)}
                    </Label>
                    <Select
                      name="product"
                      options={housingOptions.map((option) => ({
                        value: option.value,
                        label: option.label,
                      }))}
                      defaultValue={
                        (asset?.metadata?.typeId ??
                          AppartmentType.SIMPLEX) as AppartmentType
                      }
                      className="min-w-[150px] py-2"
                      onChange={(option) => field.onChange(option)}
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>
            <div className="rounded-xl bg-white">
              <Controller
                key="valuation"
                name="valuation"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.realEstate.valuation.error`
                  ) as string,
                  validate: (value) =>
                    value !== null ||
                    (t(
                      `forms.fields.wealth.realEstate.valuation.label`
                    ) as string),
                }}
                render={({ field }) => (
                  <div>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.realEstate.valuation.label`)}
                    </Label>
                    <InputNumber
                      id={field.name}
                      value={field.value as number}
                      onChange={(e) => field.onChange(e.value as number)}
                      className="w-full border bg-slate-50"
                      inputClassName="flex h-10 w-full bg-slate-50 rounded-md border border-input px-3 py-2 text-sm 
                    ring-offset-background placeholder:text-muted-foreground text-right"
                      mode="currency"
                      currency="EUR"
                      locale="fr-FR"
                      maxFractionDigits={2}
                      placeholder={
                        t(
                          `forms.fields.wealth.realEstate.valuation.placeholder`
                        ) || ""
                      }
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </div>
                )}
              />
            </div>
            <div className="rounded-xl bg-white">
              <Controller
                key="buyingDate"
                name="buyingDate"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.realEstate.buyingDate.error`
                  ) as string,
                }}
                render={({ field }) => (
                  <div>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.realEstate.buyingDate.label`)}
                    </Label>
                    <FieldDate
                      id={field.name}
                      {...field}
                      onValueChange={field.onChange}
                      className="border bg-slate-50"
                      placeholder={
                        t(
                          `forms.fields.wealth.realEstate.buyingDate.placeholder`
                        ) as string
                      }
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </div>
                )}
              />
            </div>
            <div className="rounded-xl bg-white">
              <Controller
                name="ownership"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.realEstate.detention.error`
                  ) as string,
                  validate: (value) =>
                    value !== null ||
                    (t(
                      `forms.fields.wealth.realEstate.detention.label`
                    ) as string),
                }}
                render={({ field }) => (
                  <div>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.realEstate.detention.label`)}
                    </Label>
                    <FieldPercentage
                      id={field.name}
                      {...field}
                      className="w-24 border bg-slate-50"
                      placeholder={
                        t(
                          `forms.fields.wealth.realEstate.detention.placeholder`
                        ) || ""
                      }
                    />
                  </div>
                )}
              />
            </div>
            <div className="col-span-2 md:col-span-3 md:col-start-2">
              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.comment`)}
                    </Label>
                    <FieldTextarea
                      className="pl-2 pr-2"
                      id={field.name}
                      {...field}
                      value={field.value as string}
                    />
                  </>
                )}
              />
            </div>
          </div>
          <Button
            label={
              asset?.id
                ? t(`forms.fields.actions.update`)
                : t(`forms.fields.actions.add`)
            }
            type="submit"
            icon="pi pi-plus"
            className="mx-auto mt-10"
            loading={isLoading}
          />
        </form>
      </Widget>
    );
  }

  return (
    <Widget className="pt-4">
      <form
        className="flex flex-col gap-y-4"
        onSubmit={handleSubmit((data) =>
          onSubmit({
            ...data,
            ownership: data.ownership / 100,
          })
        )}
      >
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-xl bg-white">
            <Label
              htmlFor={"name"}
              className="ml-3 font-medium text-xs text-blue-1000"
            >
              {t(`forms.fields.wealth.realEstate.name.label`)}
            </Label>
            <FieldText
              {...register("name")}
              className="w-full border bg-slate-50"
              placeholder={
                t(`forms.fields.wealth.realEstate.name.placeholder`) || ""
              }
            />
            {getFormErrorMessage("name", errors)}
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="source"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.realEstate.location.error`
                ) as string,
              }}
              render={({ field }) => (
                <div className="w-full">
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.realEstate.location.label`)}
                  </Label>

                  <GooglePlacesAutocomplete
                    apiOptions={{ language: "fr", region: "fr" }}
                    selectProps={{
                      placeholder: t(
                        "forms.fields.wealth.realEstate.location.placeholder"
                      ),
                      noOptionsMessage: () =>
                        t("forms.fields.wealth.realEstate.location.noOptions"),
                      defaultValue: field.value
                        ? { label: field.value, value: field.value }
                        : null,
                      onChange: async (place) => {
                        const source = place?.value?.description;

                        if (!source) return;
                        const results = await geocodeByAddress(source);

                        const { lat, lng: lon } = await getLatLng(results[0]);

                        setValue("source", source);
                        setValue("lat", lat);
                        setValue("lon", lon);
                      },
                      styles: {
                        control: (provided) => ({
                          ...provided,
                          borderRadius: "0.375rem",
                          backgroundColor: "var(--bg-slate-50)",
                          borderColor: "var(--input-border-color)",
                        }),
                      },
                    }}
                    apiKey={config.googlePlaceApiKey}
                  />
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="price"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.realEstate.buyingPrice.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(
                    `forms.fields.wealth.realEstate.buyingPrice.label`
                  ) as string),
              }}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.realEstate.buyingPrice.label`)}
                  </Label>
                  <InputNumber
                    id={field.name}
                    value={field.value as number}
                    onChange={(e) => field.onChange(e.value as number)}
                    className="w-full border bg-slate-50"
                    inputClassName="flex h-10 w-full bg-slate-50 rounded-md border border-input px-3 py-2 text-sm 
                    ring-offset-background placeholder:text-muted-foreground text-right"
                    mode="currency"
                    currency="EUR"
                    locale="fr-FR"
                    maxFractionDigits={2}
                    placeholder={
                      t(
                        `forms.fields.wealth.realEstate.buyingPrice.placeholder`
                      ) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="buyingDate"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.realEstate.buyingDate.error`
                ) as string,
              }}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.realEstate.buyingDate.label`)}
                  </Label>
                  <FieldDate
                    id={field.name}
                    {...field}
                    onValueChange={field.onChange}
                    className="border bg-slate-50"
                    max={maxBuyingDate.toISOString().split("T")[0]}
                    placeholder={
                      t(
                        `forms.fields.wealth.realEstate.buyingDate.placeholder`
                      ) as string
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="ownership"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.realEstate.detention.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(
                    `forms.fields.wealth.realEstate.detention.label`
                  ) as string),
              }}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.realEstate.detention.label`)}
                  </Label>
                  <FieldPercentage
                    id={field.name}
                    {...field}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(
                        `forms.fields.wealth.realEstate.detention.placeholder`
                      ) || ""
                    }
                  />
                </div>
              )}
            />
          </div>
          {/* {rentCategories.includes(categorieNameWatch) && ( */}
          <div className="rounded-xl bg-white">
            <Controller
              key="annualRevenues"
              name="annualRevenues"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.realEstate.annualRevenues.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(
                    `forms.fields.wealth.realEstate.annualRevenues.label`
                  ) as string),
              }}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.realEstate.annualRevenues.label`)}
                  </Label>
                  <InputNumber
                    id={field.name}
                    value={field.value as number}
                    onChange={(e) => field.onChange(e.value as number)}
                    className="w-full border bg-slate-50"
                    inputClassName="flex h-10 w-full bg-slate-50 rounded-md border border-input px-3 py-2 text-sm 
                    ring-offset-background placeholder:text-muted-foreground text-right"
                    mode="currency"
                    currency="EUR"
                    locale="fr-FR"
                    maxFractionDigits={2}
                    placeholder={
                      t(
                        `forms.fields.wealth.realEstate.annualRevenues.placeholder`
                      ) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />
          </div>
          {/* )} */}
        </div>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Controller
              name="categoryName"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.realEstate.type.error`
                ) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-bold text-sm text-blue-1000"
                  >
                    {t(`forms.fields.category`)}
                  </Label>
                  <Select
                    name="categoryName"
                    defaultValue={getValues().categoryName}
                    options={categoryNames.map((option) => ({
                      value: option.value,
                      label: option.label,
                      optgroup: t(
                        "forms.fields.wealth.realEstate.mainCategory." +
                          option.category
                      ),
                    }))}
                    className="min-w-[150px] py-2"
                    onChange={(option) => field.onChange(option)}
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div>
            <Controller
              name="typeId"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.realEstate.type.error`
                ) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="font-bold text-sm text-blue-1000"
                  >
                    {t(`forms.fields.wealth.realEstate.type.label`)}
                  </Label>
                  <div className="justify-content-center mt-2 flex">
                    <div className="align-items-center flex">
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value + ""}
                        className="flex w-1/4"
                      >
                        {housingOptions.map((house) => (
                          <div
                            key={house.value}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              id={house.label + field.name}
                              value={house.value}
                            />
                            <Label
                              htmlFor={house.label + field.name}
                              className="cursor-pointer"
                            >
                              {house.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-xl bg-white">
            <Controller
              name="area"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.realEstate.area.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(`forms.fields.wealth.realEstate.area.label`) as string),
              }}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.realEstate.area.label`)}
                  </Label>
                  <div className="p-inputgroup">
                    <FieldNumber
                      id={field.name}
                      {...field}
                      value={field.value as number}
                      className="w-full border bg-slate-50"
                      placeholder={
                        t(`forms.fields.wealth.realEstate.area.placeholder`) ||
                        ""
                      }
                    />
                    <span className="p-inputgroup-addon">m²</span>
                  </div>
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="rooms"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.realEstate.rooms.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(`forms.fields.wealth.realEstate.rooms.label`) as string),
              }}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.realEstate.rooms.label`)}
                  </Label>
                  <FieldNumber
                    id={field.name}
                    {...field}
                    value={field.value as number}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(`forms.fields.wealth.realEstate.rooms.placeholder`) ||
                      ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="bathrooms"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.realEstate.bathrooms.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(
                    `forms.fields.wealth.realEstate.bathrooms.label`
                  ) as string),
              }}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.realEstate.bathrooms.label`)}
                  </Label>
                  <FieldNumber
                    id={field.name}
                    {...field}
                    value={field.value as number}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(
                        `forms.fields.wealth.realEstate.bathrooms.placeholder`
                      ) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="bedrooms"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.realEstate.bedrooms.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(
                    `forms.fields.wealth.realEstate.bedrooms.label`
                  ) as string),
              }}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.realEstate.bedrooms.label`)}
                  </Label>
                  <FieldNumber
                    id={field.name}
                    {...field}
                    value={field.value as number}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(
                        `forms.fields.wealth.realEstate.bedrooms.placeholder`
                      ) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="parkingPlots"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.realEstate.bathrooms.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(
                    `forms.fields.wealth.realEstate.parkingPlots.label`
                  ) as string),
              }}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.realEstate.parkingPlots.label`)}
                  </Label>
                  <FieldNumber
                    id={field.name}
                    {...field}
                    value={field.value as number}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(
                        `forms.fields.wealth.realEstate.parkingPlots.placeholder`
                      ) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="areaBalcony"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.realEstate.areaBalcony.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(
                    `forms.fields.wealth.realEstate.areaBalcony.label`
                  ) as string),
              }}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.realEstate.areaBalcony.label`)}
                  </Label>
                  <div className="p-inputgroup">
                    <FieldNumber
                      id={field.name}
                      {...field}
                      value={field.value as number}
                      className="w-full border bg-slate-50"
                      placeholder={
                        t(
                          `forms.fields.wealth.realEstate.areaBalcony.placeholder`
                        ) || ""
                      }
                    />
                    <span className="p-inputgroup-addon">m²</span>
                  </div>
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />
          </div>
        </div>
        {houseType === AppartmentType.HOUSE ? (
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="rounded-xl bg-white">
              <Controller
                name="floors"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.realEstate.floors.error`
                  ) as string,
                  validate: (value) =>
                    value !== null ||
                    (t(
                      `forms.fields.wealth.realEstate.floors.label`
                    ) as string),
                }}
                render={({ field }) => (
                  <div>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.realEstate.floors.label`)}
                    </Label>
                    <FieldNumber
                      id={field.name}
                      {...field}
                      value={field.value as number}
                      className="w-full border bg-slate-50"
                      placeholder={
                        t(
                          `forms.fields.wealth.realEstate.floors.placeholder`
                        ) || ""
                      }
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </div>
                )}
              />
            </div>
            <div className="rounded-xl bg-white">
              <Controller
                name="areaLand"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.realEstate.areaLand.error`
                  ) as string,
                  validate: (value) =>
                    value !== null ||
                    (t(
                      `forms.fields.wealth.realEstate.areaLand.label`
                    ) as string),
                }}
                render={({ field }) => (
                  <div>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.realEstate.areaLand.label`)}
                    </Label>
                    <div className="p-inputgroup">
                      <FieldNumber
                        id={field.name}
                        {...field}
                        value={field.value as number}
                        className="w-full border bg-slate-50"
                        placeholder={
                          t(
                            `forms.fields.wealth.realEstate.areaLand.placeholder`
                          ) || ""
                        }
                      />
                      <span className="p-inputgroup-addon">m²</span>
                    </div>
                    {getFormErrorMessage(field.name, errors)}
                  </div>
                )}
              />
            </div>
          </div>
        ) : houseType === AppartmentType.SIMPLEX ? (
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="rounded-xl bg-white">
              <Controller
                name="floor"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.realEstate.floor.error`
                  ) as string,
                  validate: (value) =>
                    value !== null ||
                    (t(`forms.fields.wealth.realEstate.floor.label`) as string),
                }}
                render={({ field }) => (
                  <div>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.realEstate.floor.label`)}
                    </Label>
                    <FieldNumber
                      id={field.name}
                      {...field}
                      value={field.value as number}
                      className="w-full border bg-slate-50"
                      placeholder={
                        t(`forms.fields.wealth.realEstate.floor.placeholder`) ||
                        ""
                      }
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </div>
                )}
              />
            </div>
            <div className="rounded-xl bg-white">
              <Controller
                name="buildingFloors"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.realEstate.buildingFloors.error`
                  ) as string,
                  validate: (value) =>
                    value !== null ||
                    (t(
                      `forms.fields.wealth.realEstate.buildingFloors.label`
                    ) as string),
                }}
                render={({ field }) => (
                  <div>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.realEstate.buildingFloors.label`)}
                    </Label>
                    <FieldNumber
                      id={field.name}
                      {...field}
                      value={field.value as number}
                      className="w-full border bg-slate-50"
                      placeholder={
                        t(
                          `forms.fields.wealth.realEstate.buildingFloors.placeholder`
                        ) || ""
                      }
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </div>
                )}
              />
            </div>
          </div>
        ) : (
          ""
        )}
        <div>
          <Controller
            name="condition"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.realEstate.condition.error`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-bold text-sm text-blue-1000"
                >
                  {t(`forms.fields.wealth.realEstate.condition.label`)}
                </Label>
                <div className="justify-content-center mt-2 flex">
                  <div className="align-items-center flex flex-col gap-y-2 lg:flex-row">
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value + ""}
                      className="flex"
                    >
                      {conditionOptions.map((condition) => (
                        <div
                          key={condition.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            id={condition.name + field.name}
                            value={condition.value}
                          />
                          <Label
                            htmlFor={condition.name + field.name}
                            className="cursor-pointer"
                          >
                            {condition.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
                {getFormErrorMessage(field.name, errors)}
              </>
            )}
          />
        </div>
        <div>
          <Controller
            name="buildingStanding"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.realEstate.buildingStanding.error`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-bold text-sm text-blue-1000"
                >
                  {t(`forms.fields.wealth.realEstate.buildingStanding.label`)}
                </Label>
                <div className="justify-content-center mt-2 flex">
                  <div className="align-items-center flex flex-col gap-y-2 lg:flex-row">
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value + ""}
                      className="flex"
                    >
                      {standingOptions.map((standing) => (
                        <div
                          key={standing.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            id={standing.name + field.name}
                            value={standing.value}
                          />
                          <Label
                            htmlFor={standing.name + field.name}
                            className="cursor-pointer"
                          >
                            {standing.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
                {getFormErrorMessage(field.name, errors)}
              </>
            )}
          />
        </div>
        <div>
          <Controller
            name="orientation"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.realEstate.orientation.error`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-bold text-sm text-blue-1000"
                >
                  {t(`forms.fields.wealth.realEstate.orientation.label`)}
                </Label>
                <div className="justify-content-center mt-2 flex">
                  <div className="align-items-center flex flex-col gap-y-2 lg:flex-row">
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value as string}
                      className="flex"
                    >
                      {orientationOptions.map((orientation) => (
                        <div
                          key={orientation.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            id={orientation.name + field.name}
                            value={orientation.value}
                          />
                          <Label
                            htmlFor={orientation.name + field.name}
                            className="cursor-pointer"
                          >
                            {orientation.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
                {getFormErrorMessage(field.name, errors)}
              </>
            )}
          />
        </div>
        <div>
          <Controller
            name="vista"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.realEstate.vista.error`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-bold text-sm text-blue-1000"
                >
                  {t(`forms.fields.wealth.realEstate.vista.label`)}
                </Label>
                <div className="justify-content-center mt-2 flex">
                  <div className="align-items-center flex flex-col gap-y-2 lg:flex-row">
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value + ""}
                      className="flex"
                    >
                      {vistaOptions.map((vista) => (
                        <div
                          key={vista.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            id={vista.name + field.name}
                            value={vista.value}
                          />
                          <Label
                            htmlFor={vista.name + field.name}
                            className="cursor-pointer"
                          >
                            {vista.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
                {getFormErrorMessage(field.name, errors)}
              </>
            )}
          />
        </div>
        <div>
          <Controller
            name="amenityProximity"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.realEstate.amenityProximity.error`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-bold text-sm text-blue-1000"
                >
                  {t(`forms.fields.wealth.realEstate.amenityProximity.label`)}
                </Label>
                <div className="justify-content-center mt-2 flex">
                  <div className="align-items-center flex flex-col gap-y-2 lg:flex-row">
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value + ""}
                      className="flex"
                    >
                      {commoditesOptions.map((commodites) => (
                        <div
                          key={commodites.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            id={commodites.name + field.name}
                            value={commodites.value}
                          />
                          <Label
                            htmlFor={commodites.name + field.name}
                            className="cursor-pointer"
                          >
                            {commodites.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
                {getFormErrorMessage(field.name, errors)}
              </>
            )}
          />
        </div>
        {houseType === AppartmentType.HOUSE ? (
          <>
            <div>
              <Controller
                name="pool"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.realEstate.pool.error`
                  ) as string,
                }}
                render={({ field }) => (
                  <>
                    <Label
                      htmlFor={field.name}
                      className="font-bold text-sm text-blue-1000"
                    >
                      {t(`forms.fields.wealth.realEstate.pool.label`)}
                    </Label>
                    <div className="justify-content-center mt-2 flex">
                      <div className="align-items-center flex flex-col gap-y-2 lg:flex-row">
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value + ""}
                          className="flex"
                        >
                          {poolOptions.map((pool) => (
                            <div
                              key={pool.value}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                id={pool.name + field.name}
                                value={pool.value}
                              />
                              <Label
                                htmlFor={pool.name + field.name}
                                className="cursor-pointer"
                              >
                                {pool.name}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>
            <div>
              <Controller
                name="garden"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.realEstate.garden.error`
                  ) as string,
                }}
                render={({ field }) => (
                  <>
                    <Label
                      htmlFor={field.name}
                      className="font-bold text-sm text-blue-1000"
                    >
                      {t(`forms.fields.wealth.realEstate.garden.label`)}
                    </Label>
                    <div className="justify-content-center mt-2 flex">
                      <div className="align-items-center flex flex-col gap-y-2 lg:flex-row">
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value + ""}
                          className="flex"
                        >
                          {gardenOptions.map((garden) => (
                            <div
                              key={garden.value}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                id={garden.name + field.name}
                                value={garden.value}
                              />
                              <Label
                                htmlFor={garden.name + field.name}
                                className="cursor-pointer"
                              >
                                {garden.name}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>
          </>
        ) : houseType === AppartmentType.SIMPLEX ? (
          <>
            <div>
              <Controller
                name="condominiumCondition"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.realEstate.condominiumCondition.error`
                  ) as string,
                }}
                render={({ field }) => (
                  <>
                    <Label
                      htmlFor={field.name}
                      className="font-bold text-sm text-blue-1000"
                    >
                      {t(
                        `forms.fields.wealth.realEstate.condominiumCondition.label`
                      )}
                    </Label>
                    <div className="justify-content-center mt-2 flex">
                      <div className="align-items-center flex flex-col gap-y-2 lg:flex-row">
                        <RadioGroup
                          name={field.name}
                          onValueChange={field.onChange}
                          defaultValue={field.value + ""}
                          className="flex"
                        >
                          {condominiumConditionOptions.map(
                            (condominiumCondition) => (
                              <div
                                key={condominiumCondition.value}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  id={condominiumCondition.name + field.name}
                                  value={condominiumCondition.value}
                                />
                                <Label
                                  htmlFor={
                                    condominiumCondition.name + field.name
                                  }
                                  className="cursor-pointer"
                                >
                                  {condominiumCondition.name}
                                </Label>
                              </div>
                            )
                          )}
                        </RadioGroup>
                      </div>
                    </div>
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>
          </>
        ) : (
          ""
        )}
        <div className="grid mt-6 w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
          <div className="col-span-2 md:col-span-3 md:col-start-2">
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.comment`)}
                  </Label>
                  <FieldTextarea
                    className="pl-2 pr-2"
                    id={field.name}
                    {...field}
                    value={field.value as string}
                  />
                </>
              )}
            />
          </div>
        </div>
        <Button
          label={
            asset?.id
              ? t(`forms.fields.actions.update`)
              : t(`forms.fields.actions.add`)
          }
          type="submit"
          icon="pi pi-plus"
          className="mx-auto mt-10"
          loading={isLoading}
        />
      </form>
    </Widget>
  );
};
