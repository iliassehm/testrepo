import React from "react";
import { Controller, useForm } from "react-hook-form";

import { FieldTextarea } from "../../../../../../UIComponents/FieldTextarea/FieldTextarea";

interface AnnotationWidgetProps {
  form: ReturnType<typeof useForm<any>>;
  accessor: string;
  label: string;
  placeholder?: string;
}
export const TextAreaWidget: React.FC<AnnotationWidgetProps> = ({
  form,
  accessor,
  label,
  placeholder,
}) => {
  return (
    <div className="flex flex-1 flex-col">
      <label
        htmlFor={accessor}
        className="font-bold text-sm text-blue-1000 mb-1"
      >
        {label}
      </label>
      <Controller
        name={accessor}
        control={form.control}
        render={({ field }) => (
          <div className="grow">
            <FieldTextarea
              id={field.name}
              name={field.name}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.currentTarget.value)}
              rows={5}
              placeholder={placeholder}
              className="w-full h-24 text-sm"
            />
          </div>
        )}
      />
    </div>
  );
};
