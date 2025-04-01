import i18n from "../../../../../../i18n";
import { Button } from ".././../../../../../components";
import { Dialog } from ".././../../../../../components/Dialog";

interface AddToCustomerReferenceModalProps {
  onConfirmation: (addToCustomerReference: boolean) => void;
  onClose: () => void;
  visible: boolean;
  loading?: boolean;
}

export function AddToCustomerReferenceModal({
  visible,
  loading,
  onConfirmation,
  onClose,
}: AddToCustomerReferenceModalProps) {
  const { t } = i18n;

  const handleClick = (addToCustomerReference: boolean) => {
    onConfirmation?.(addToCustomerReference);
  };

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Dialog
      header={t("scenes.customers.details.companies.addToCustomerReference")}
      open={visible}
      onOpenChange={handleClose}
    >
      <div className="flex justify-center gap-4">
        {t("scenes.customers.details.companies.addToCustomerReferenceMessage")}
      </div>
      <div className="flex justify-center gap-4">
        <Button
          label="boolean.true"
          onClick={() => handleClick(true)}
          loading={loading}
          className="mt-4"
          variant="basic"
        />
        <Button
          label="boolean.false"
          onClick={() => handleClick(false)}
          loading={loading}
          className="mt-4"
          variant="danger"
        />
      </div>
    </Dialog>
  );
}
