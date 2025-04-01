export default function standardTableCell(value: string) {
  return (
    <div
      className="flex items-center rounded-l-xl pr-3 text-left text-xs text-[#04182B]"
      style={{
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
      }}
    >
      {value}
    </div>
  );
}
