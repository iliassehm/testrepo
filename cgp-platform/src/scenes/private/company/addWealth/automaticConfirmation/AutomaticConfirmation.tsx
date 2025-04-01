import { Text } from "../../../../../components";
import { Widget } from "../../../../../components/Widget";

export function AutomaticConfirmation() {
  return (
    <Widget className="mx-auto max-w-4xl p-12">
      <div className="flex items-center justify-center whitespace-pre-line rounded-xl bg-neutral-100 px-8 py-14 tracking-tight">
        <div className="flex flex-col items-center gap-y-8">
          <Text label="scenes.wealthConnection.add.validation" className="text-xl" />
          <img src="/svg/logo_w.svg" />
        </div>
      </div>
    </Widget>
  );
}
