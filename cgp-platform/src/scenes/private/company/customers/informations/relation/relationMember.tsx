import { useNavigate, useParams } from "@tanstack/react-router";
import { TFunction } from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Slider, { CustomArrowProps, Settings } from "react-slick";

import { CustomerRelationForm } from "../../../../../../../shared/schemas/relation";
import { Button, Text } from "../../../../../../components";
import { denominations } from "../../../../../../constants";
import {
  clsx,
  DeleteWithConfirmationDialog,
  getAge,
} from "../../../../../../helpers";
import { Customer } from "../../../../../../types";
import { AddToCustomerReferenceModal } from "./AddToCustomerReferenceModal";

interface RelationMemberProps {
  data: CustomerRelationForm[];
  usersInCustomerReferenceData?: Customer[];
  onUpdate: (data: CustomerRelationForm) => void;
  onDelete: (id: CustomerRelationForm["id"]) => void;
  createUserFromRelation: (input: {
    id: CustomerRelationForm["id"];
    addToCustomerReference: boolean;
  }) => void;
  unlinkFromCustomerReference: (input: {
    id: CustomerRelationForm["id"];
  }) => void;
}
export function RelationMember({
  data = [],
  usersInCustomerReferenceData,
  onUpdate,
  onDelete,
  createUserFromRelation,
  unlinkFromCustomerReference,
}: RelationMemberProps) {
  const { t } = useTranslation();

  const params = useParams({
    from: "/company/$companyId/customer/$customerId/informations",
  });

  const options = {
    ...denominations.familyStatusList,
    ...denominations.maritalStatusList,
    ...denominations.otherStatusList,
  };

  const settings: Settings = {
    className: "center rounded-xl gap-4 px-5",
    infinite: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
  };

  return (
    <div className="flex flex-col gap-2 customer-relation">
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label="scenes.company.settings.relation.family"
      />
      <Slider {...settings}>
        {data.map((item) => (
          <div key={item.id} className="flex ">
            <Member
              data={item}
              denomination={options[item.denomination]}
              companyId={params.companyId}
              usersInCustomerReference={usersInCustomerReferenceData ?? []}
              t={t}
              onUpdate={onUpdate}
              onDelete={onDelete}
              createUserFromRelation={createUserFromRelation}
              unlinkFromCustomerReference={unlinkFromCustomerReference}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

interface MemberProps extends Omit<RelationMemberProps, "data"> {
  data: CustomerRelationForm;
  denomination: string;
  companyId: string;
  usersInCustomerReference: Customer[];
  t: TFunction;
}

function Member({
  data,
  denomination,
  companyId,
  usersInCustomerReference,
  t,
  onUpdate,
  onDelete,
  createUserFromRelation,
  unlinkFromCustomerReference,
}: MemberProps) {
  const [userToCreate, setUserToCreate] = useState<string>();

  const navigate = useNavigate({
    from: "/company/$companyId/customer/$customerId/wealth/",
  });
  return (
    <div className="py-8 rounded-lg bg-[#F6F4F3] p-2 ">
      <div className="flex items-center justify-around gap-8">
        <div className="flex">
          <Text
            as="h3"
            className="text-blue-800"
            label={`${data.lastName} ${data.firstName}`}
          />
        </div>
        <p>{denomination}</p>
        <p>
          {t("scenes.company.settings.relation.age", {
            age: getAge(data.birthDate),
          })}
        </p>
        <div className="flex justify-end items-center gap-x-2">
          <i
            className="notification-target-icon pi pi-pencil h-4 w-4 cursor-pointer"
            data-pr-tooltip={t("forms.fields.tables.edit") as string}
            onClick={() => onUpdate(data)}
          />
          <DeleteWithConfirmationDialog
            buttonClassName="p-0 !w-fit"
            onClick={() => onDelete(data.id)}
          />
        </div>
      </div>
      {!usersInCustomerReference.some((user) => user.id === data.id) ? (
        <div className="flex justify-center items-center gap-x-2 px-4">
          <Button
            label={"scenes.customers.details.companies.createCustomerSheet"}
            type="submit"
            className="py-1"
            onClick={() => setUserToCreate(data.id)}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center gap-x-2 px-4">
          <Button
            label={"scenes.customers.details.companies.seeCustomerSheet"}
            type="submit"
            className="py-1"
            onClick={async () => {
              await navigate({
                to: "/company/$companyId/customer/$customerId/wealth",
                params: {
                  companyId: companyId,
                  customerId: data.id,
                },
              });
            }}
          />
          <Button
            label={"scenes.customers.details.companies.unlinkSheet"}
            type="submit"
            className="py-1"
            onClick={async () => {
              await unlinkFromCustomerReference({ id: data.id });
            }}
          />
        </div>
      )}
      <AddToCustomerReferenceModal
        visible={!!userToCreate}
        onConfirmation={(addToCustomerReference) => {
          !!userToCreate &&
            createUserFromRelation({
              id: userToCreate,
              addToCustomerReference,
            });
          setUserToCreate(undefined);
        }}
        onClose={() => setUserToCreate(undefined)}
      />
    </div>
  );
}

function SamplePrevArrow(props: CustomArrowProps) {
  return (
    <div
      className={clsx(
        "flex items-center z-_2 absolute -left-8 top-0 h-full w-8 cursor-pointer rounded-lg",
        props.currentSlide === 0 && "cursor-default",

        props.currentSlide === 0 && "hidden"
      )}
      onClick={props.onClick}
    >
      <img src="/icons/cgp_chevronLeft.svg" className="h-6 w-6" />
    </div>
  );
}

function SampleNextArrow(props: CustomArrowProps) {
  return (
    <div
      className={clsx(
        "flex items-center z-_2 absolute -right-7 top-0 h-full w-8 cursor-pointer rounded-lg md:-right-10",
        props.slideCount !== undefined &&
          props.currentSlide === props.slideCount - 1 &&
          "hidden"
      )}
      onClick={props.onClick}
    >
      <img src="/icons/cgp_chevronRight.svg" className="h-6 w-6" />
    </div>
  );
}
