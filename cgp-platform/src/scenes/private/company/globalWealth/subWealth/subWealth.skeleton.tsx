import { Skeleton } from "primereact/skeleton";

export function SubWealthSkeleton() {
  return (
    <div>
      <div className="h-screen w-full">
        <Skeleton height="70%" className="mb-2 rounded-3xl"></Skeleton>
      </div>
    </div>
  );
}
