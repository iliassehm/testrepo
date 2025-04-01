import { useNavigate, useParams } from "@tanstack/react-router";
import { Tree, TreeProps } from "primereact/tree";
import { TreeNode } from "primereact/treenode";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";

import { Button, Dialog } from "../../../../../../components";
import { getTreatement } from "../../../../../../constants";
import { useCurrentRoute } from "../../../../../../hooks/useCurrentRoute";
import { gql } from "../../../../../../service/client";
import {
  ConformityField,
  Document,
  DocumentCategoryV2,
} from "../../../../../../types";
import { StateTag } from "../../conformity/ged/components/GedDocumentView";
import { RegulationLogic } from "./regulation.logic";

export interface WidgetRegulationItemProps {
  name: ConformityField & ("officialDocuments" | "informationCollections");
  label: string;
  date: string;
  statusIcon: string;
  conformityId?: string;
  documentId?: string;
  geqQuery: DocumentCategoryV2[];
  refetch: () => void;
}

const WidgetRegulationItem: React.FC<WidgetRegulationItemProps> = ({
  refetch,
  label,
  name,
  date,
  documentId,
  conformityId,
  statusIcon,
  geqQuery,
}) => {
  const currentRoute = useCurrentRoute();
  const params = useParams({
    from: currentRoute.routeId,
  }) as { companyId: string; customerId: string };
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const handleClick = () => {
    switch (name) {
      case "DER":
      case "engagementLetter":
      case "investorProfile":
      case "objectivesHeritage":
        setVisible(true);
        break;
      case "officialDocuments":
      case "informationCollections":
        navigate({
          to: "/company/$companyId/customer/$customerId/informations",
          params,
          search: {
            tab: "general",
          },
        });
        break;
      case "LCB":
        navigate({
          to: "/company/$companyId/customer/$customerId/conformity",
          params,
          search: {
            tab: "lcbFtLab",
          },
        });
        break;

      default:
        break;
    }
  };

  const update = useMutation(
    ({ documentId, name }: { documentId: string; name: ConformityField }) =>
      gql.client.request(RegulationLogic.addDocumentToConformity(), {
        companyID: params.companyId,
        customerID: params.customerId,
        conformityID: conformityId,
        input: {
          documentId,
          field: name,
        },
      }),
    {
      onSuccess: () => {
        setVisible(false);
        refetch();
      },
    }
  );

  const { treeValue, defaultKeys, defaultExpandedValue } = useMemo(() => {
    let treeValue: TreeNode[] = [];
    let defaultKeys: TreeProps["selectionKeys"] = undefined;
    let defaultExpandedValue: TreeProps["expandedKeys"] = undefined;

    if (geqQuery?.length > 0) {
      treeValue = geqQuery.map((category) => {
        const categoryName = category.name;

        return {
          label: t(`documentsCategories.${categoryName}`, categoryName),
          key: categoryName,
          selectable: false,
          children: category.documents?.map((document) => {
            if (visible && document.id === documentId) {
              defaultExpandedValue = {
                ...((defaultExpandedValue as object) || {}),
                [categoryName]: true,
              };
              defaultKeys = {
                ...((defaultKeys as object) || {}),
                [categoryName]: {
                  checked: false,
                  partialChecked: true,
                },
                [document.id]: {
                  checked: true,
                  partialChecked: false,
                },
              };
            }

            return {
              ...document,
              selectable: true,

              key: document.id,
              label: document.name,
            };
          }),
        };
      });
    }

    return { treeValue, defaultKeys, defaultExpandedValue };
  }, [geqQuery, t, visible, documentId]);

  return (
    <div className="flex gap-2 w-full mt-4">
      <div
        className="flex items-center justify-between border rounded-lg border-stone-100 bg-stone-100 w-full min-h-[50px] px-4 cursor-pointer"
        onClick={handleClick}
      >
        <div className="w-full">
          <div>
            <label className="text-xs xl-w:text-sm">{label}</label>
          </div>
          <div>
            <label className="text-xs xl-w:text-sm text-blue-800">{date}</label>
          </div>
        </div>
        <div className="flex items-center">
          <img src={statusIcon} className="h-7 w-full" />
        </div>
      </div>
      <DocumentDialog
        visible={visible}
        onClose={() => setVisible(false)}
        treeValue={treeValue}
        defaultExpandedValue={defaultExpandedValue}
        defaultKeys={defaultKeys}
        onSubmit={(documentId) => {
          update.mutate({ documentId, name });
        }}
      />
    </div>
  );
};

interface DocumentDialogProps {
  visible: boolean;
  onClose: () => void;
  defaultExpandedValue?: TreeProps["expandedKeys"];
  defaultKeys?: TreeProps["selectionKeys"];
  treeValue: TreeNode[];
  onSubmit: (documentId: string) => void;
}

function DocumentDialog({
  visible,
  treeValue,
  defaultKeys,
  defaultExpandedValue,
  onClose,
  onSubmit,
}: DocumentDialogProps) {
  const { t } = useTranslation();
  const [selectedGedDocuments, setSelectedGedDocuments] = useState<string[]>(
    []
  );
  const [keys, setKeys] = useState<TreeProps["selectionKeys"]>(defaultKeys);
  const [expandedKeys, setExpandedKeys] =
    useState<TreeProps["expandedKeys"]>(defaultExpandedValue);

  const handleConfirm = () => {
    if (selectedGedDocuments.length === 1) {
      onSubmit(selectedGedDocuments[0]);
    }
  };

  useEffect(() => {
    if (!visible) {
      setSelectedGedDocuments([]);
      setKeys(undefined);
      setExpandedKeys({});
    } else {
      setKeys(defaultKeys);
      setExpandedKeys(defaultExpandedValue);
    }
  }, [visible, defaultKeys]);

  return (
    <Dialog
      header={t("forms.regulation.documentAttachment")}
      open={visible}
      onOpenChange={onClose}
    >
      {treeValue.length > 0 ? (
        <>
          <Tree
            expandedKeys={expandedKeys}
            value={treeValue}
            selectionMode="checkbox"
            selectionKeys={keys}
            nodeTemplate={(node) => (
              <div className="flex flex-col gap-1">
                {node.label}
                {node.selectable && (
                  <StateTag
                    state={getTreatement(node as Document)}
                    className="px-[2px] py-[2px] text-white"
                  />
                )}
              </div>
            )}
            onToggle={(e) => setExpandedKeys(e.value)}
            onSelect={(e) => {
              setSelectedGedDocuments((cur) => [...cur, e.node.id] as string[]);
            }}
            onUnselect={(e) => {
              setSelectedGedDocuments((cur) =>
                cur.filter((id) => id !== e.node.id)
              );
            }}
            onSelectionChange={(e) =>
              setKeys(e.value as TreeProps["selectionKeys"])
            }
            className="w-full h-full bg-[#F8F9FB] max-w-[50vw] max-h-[50vh] overflow-auto text-sm"
          />

          <Button
            label={t("forms.regulation.confirm")}
            onClick={handleConfirm}
            disabled={selectedGedDocuments.length !== 1}
          />
        </>
      ) : (
        <div>{t("forms.regulation.noDocuments")}</div>
      )}
    </Dialog>
  );
}

export default WidgetRegulationItem;
