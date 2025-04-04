import { Skeleton } from "primereact/skeleton";

export function ComplianceSkeleton() {
  return (
    <div>
      <div className="mt-4 flex h-[400px]">
        <Skeleton height="20%" width="100%" className="mb-2 rounded-xl" />
      </div>
      <div
        className="mt-8 grid sm:grid-cols-3 grid-cols-1 gap-4"
        style={{
          height: "60vh",
        }}
      >
        <Skeleton height="100%" width="33%" className="mb-2 rounded-xl" />
        <Skeleton height="100%" width="33%" className="mb-2 rounded-xl" />
        <Skeleton height="100%" width="33%" className="mb-2 rounded-xl" />
      </div>
    </div>
  );
}
