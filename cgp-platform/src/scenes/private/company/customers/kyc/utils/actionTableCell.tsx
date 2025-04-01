import { CustomerAsset } from "../../../../../../types";

export const actionTableCell = (
  asset: CustomerAsset,
  setEditingAsset: (asset: CustomerAsset) => void,
  setDeletion: (id: string) => void,
  t: (key: string) => string
) => {
  const editBodyTemplate = (asset: CustomerAsset) => {
    return (
      <button className="mr-1" onClick={() => setEditingAsset(asset)}>
        <i
          className="notification-target-icon pi pi-pencil h-4 w-4 cursor-pointer"
          data-pr-tooltip={t("forms.fields.tables.edit") as string}
        />
      </button>
    );
  };

  const deleteBodyTemplate = (asset: CustomerAsset) => {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDeletion(asset.id);
        }}
      >
        <i className="notification-target-icon pi pi-trash text-red-500 h-4 w-4 cursor-pointer" />
      </button>
    );
  };

  return (
    <div className="w-full flex justify-center">
      {editBodyTemplate(asset)}
      {deleteBodyTemplate(asset)}
    </div>
  );
};
