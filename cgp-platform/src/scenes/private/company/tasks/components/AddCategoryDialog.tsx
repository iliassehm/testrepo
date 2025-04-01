import { useParams } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";

import { Button, Dialog } from "../../../../../components";
import { getFormErrorMessage } from "../../../../../constants";
import { useToast } from "../../../../../hooks/useToast";
import { gql } from "../../../../../service/client";
import { TaskCategoryInput } from "../../../../../types";
import { FieldText } from "../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../UIComponents/Label/Label";
import { TaskLogic } from "../../customers/home/Task/task.logic";

export type AddCategoryDialogProps = {
  visible: boolean;
  onHide: () => void;
  isLoading: boolean;
};

export const AddCategoryDialog = ({
  visible,
  onHide,
  isLoading,
}: AddCategoryDialogProps) => {
  const { t } = useTranslation();
  const toast = useToast();
  const params = useParams({
    from: "/company/$companyId/tasks",
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resetOptions: {
      keepDirty: false,
      keepDirtyValues: false,
      keepValues: false,
      keepIsSubmitted: false,
    },
  });

  const createTask = useMutation(
    ({ input }: { input: TaskCategoryInput }) =>
      gql.client.request(TaskLogic.createTaskCategory(), {
        input,
        companyID: params.companyId,
      }),
    {
      onSuccess: () => {
        toast.current?.show({
          severity: "success",
          summary: t("forms.taskForm.toast.addCategory"),
        });
        onHide();
        reset();
      },
    }
  );

  return (
    <>
      <Dialog
        header={t(`forms.taskForm.addCategory`)}
        open={visible}
        className="w-1/3"
        onOpenChange={onHide}
      >
        <form
          onSubmit={handleSubmit((data) => createTask.mutate({ input: data }))}
        >
          <div className="mx-auto mt-4 flex w-full flex-col justify-center gap-y-3">
            <div className="flex-1 bg-white">
              <Controller
                name="name"
                control={control}
                rules={{
                  required: t(`forms.taskForm.category.error`) as string,
                }}
                render={({ field }) => (
                  <>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.taskForm.category.label`)}
                    </Label>
                    <FieldText
                      id={field.name}
                      {...field}
                      className="w-full bg-slate-50 h-10"
                      placeholder={
                        t(`forms.taskForm.category.placeholder`) || ""
                      }
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>
            <Button
              label={t(`forms.fields.actions.save`)}
              type="submit"
              // icon="pi pi-plus"
              className="mx-auto mt-10"
              loading={isLoading}
            />
          </div>
        </form>
      </Dialog>
    </>
  );
};
