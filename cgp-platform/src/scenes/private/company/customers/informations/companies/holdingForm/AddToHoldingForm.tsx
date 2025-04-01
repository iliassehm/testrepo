import { MultiSelect } from "primereact/multiselect";
import { Controller, useForm } from "react-hook-form";

import { Button } from "../../../../../../../components";
import { Holding } from "../../../../../../../types";

interface AddToHoldingProps {
  data: Holding[];
  defaultSelected: Holding["id"][];
  onSubmit: (data: Holding["id"][]) => void;
}
export function AddToHolding({
  data,
  defaultSelected,
  onSubmit,
}: AddToHoldingProps) {
  const form = useForm({
    mode: "all",
  });

  return (
    <form
      className="flex flex-col gap-10"
      onSubmit={form.handleSubmit((data) => onSubmit(data.selectedCompanies))}
    >
      <Controller
        control={form.control}
        name="selectedCompanies"
        defaultValue={defaultSelected}
        render={({ field }) => (
          <MultiSelect
            className="w-64 rounded-xl"
            pt={{
              label: {
                className: "!py-1.5",
              },
            }}
            optionLabel="name"
            optionValue="id"
            options={data}
            {...field}
            onChange={(e) => field.onChange(e.value)}
          />
        )}
      />
      <Button
        type="submit"
        label="forms.fields.actions.save"
        className="m-auto"
      />
    </form>
  );
}
