import type { KeyboardEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import * as formData from "../../../../../../../../shared/schemas/investorProfileFormSchema";
import { Button } from "../../../../../../../components";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import type { InvestorProfileForm } from "../investorProfileForm";
import {
  CheckBoxListV1,
  RadioList,
  RadioWithCheckboxList,
  RadioWithGraph,
} from "../utils";

export function InvestorProfileFormFirstVersion({
  onSubmit,
  isLoading = false,
  defaultValue: defaultValues = {} as formData.InvestorProfileFormInputs,
}: InvestorProfileForm) {
  const { register, control, reset, ...form } =
    useForm<formData.InvestorProfileFormInputs>({
      defaultValues,
      resetOptions: {
        keepValues: false,
        keepDefaultValues: false,
        keepDirtyValues: false,
        keepDirty: false,
      },
    });
  const { t } = useTranslation();

  const values = form.watch("q19");
  const q19IsPositive = values === "1";
  const handleSubmit = form.handleSubmit((data) => {
    if (!q19IsPositive) {
      onSubmit({ input: { ...data, q19Answer: undefined } });
    } else {
      onSubmit({ input: data });
    }
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const handleReset = () => {
    const newValues = {} as formData.InvestorProfileFormInputs;

    reset(newValues);
    onSubmit({ input: newValues });
  };

  return (
    <form
      className="relative"
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
    >
      <Button
        type="reset"
        variant="bordered"
        size="small"
        className="py-1 rounded-md absolute -top-12 right-0"
        label="forms.fields.conformity.investorProfile.reset"
        onClick={handleReset}
      />
      {/* Question 1 */}
      <CheckBoxListV1
        data={formData.q1Object}
        i18nKey="q1"
        register={register}
      />

      {/* Question 2 */}
      <CheckBoxListV1
        data={formData.q2Object}
        i18nKey="q2"
        register={register}
      />

      {/* Question 3 (A / B) */}
      <div>
        <RadioWithCheckboxList
          data={formData.q3a}
          i18nKey="q3a.1"
          register={register}
        />
        <RadioWithCheckboxList
          data={formData.q3b}
          i18nKey="q3b.1"
          register={register}
          checkbable={false}
          align="horizontal"
        />
      </div>

      {/* Question 4 */}
      <RadioList
        list={formData.q4List}
        i18nKey="q4"
        name="q4"
        register={register}
      />

      {/* Question 5 */}
      <RadioList
        list={formData.q5List}
        i18nKey="q5"
        name="q5"
        register={register}
      />

      {/* Question 6 */}
      <RadioList
        list={formData.q6List}
        i18nKey="q6"
        name="q6"
        register={register}
      />

      {/* Question 7 */}
      <RadioWithGraph
        list={formData.q7List}
        i18nKey="q7"
        name="q7"
        register={register}
      />

      {/* Question 8 */}
      <RadioWithGraph
        list={formData.q8List}
        i18nKey="q8"
        name="q8"
        register={register}
      />

      {/* Question 9 (A / B) */}
      <div>
        <RadioWithGraph
          list={formData.q9aList}
          i18nKey="q9a"
          name="q9a"
          register={register}
        />

        <RadioWithGraph
          list={formData.q9bList}
          i18nKey="q9b"
          name="q9b"
          register={register}
        />
      </div>

      {/* Question 10 */}
      <RadioList
        list={formData.q10List}
        i18nKey="q10"
        name="q10"
        register={register}
      />

      {/* Question 11 */}
      <RadioList
        list={formData.q11List}
        i18nKey="q11"
        name="q11"
        register={register}
      />

      {/* Question 12 */}
      <RadioList
        list={formData.q12List}
        i18nKey="q12"
        name="q12"
        register={register}
      />

      {/* Question 13 */}
      <RadioList
        name="q13"
        list={formData.q13List}
        i18nKey="q13"
        register={register}
      />

      {/* Question 14 */}
      <CheckBoxListV1
        data={formData.q14Object}
        i18nKey="q14"
        register={register}
      />

      {/* Question 15 */}
      <RadioList
        list={formData.q15List}
        i18nKey="q15"
        name="q15"
        register={register}
      />

      {/* Question 16 */}
      <RadioList
        list={formData.q16List}
        i18nKey="q16"
        name="q16"
        register={register}
      />

      {/* Question 17 */}
      <CheckBoxListV1
        data={formData.q17Object}
        i18nKey="q17"
        register={register}
      />

      {/* Question 18 */}
      <RadioList
        list={formData.q18List}
        i18nKey="q18"
        name="q18"
        register={register}
      />

      <div>
        {/* Question 19 */}
        <RadioList
          list={formData.q19List}
          i18nKey="q19"
          name="q19"
          register={register}
        />
        {q19IsPositive && (
          <>
            <Controller
              name="q19Answer"
              control={control}
              render={({ field }) => (
                <div>
                  <Label htmlFor={field.name}>
                    {t(
                      "scenes.customers.conformity.investorProfile.form.q19.answer"
                    )}
                  </Label>
                  <FieldText id={field.name} {...field} className="w-fit" />
                </div>
              )}
            />
          </>
        )}
      </div>

      <Button
        label="forms.fields.actions.save"
        type="submit"
        className="mt-6"
        isLoading={
          isLoading ||
          form.formState.isSubmitting ||
          form.formState.isValidating
        }
      />
    </form>
  );
}
