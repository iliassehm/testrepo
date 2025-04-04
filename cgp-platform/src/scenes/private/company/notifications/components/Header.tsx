import { Text } from "../../../../../components";

interface HeaderProps {
  count: number;
  read: number;
  t: (key: string) => string;
}
export function Header({ count = 0, read = 0, t }: HeaderProps) {
  return (
    <div className="flex justify-start items-center ml-10 mt-5">
      <div className="flex items-center mr-10">
        <Text
          className="text-3xl mr-3"
          label={`${t("notification.notifications")} : `}
        />{" "}
        <div className="text-blue-800 text-xl font-bold">{count}</div>
      </div>
      <div className="flex items-center mr-10">
        <Text
          className="text-xl mr-2"
          label={`${t("notification.unread")} : `}
        />{" "}
        <div className="text-blue-800 text-base text-center font-bold">
          {read}
        </div>
      </div>
    </div>
  );
}
