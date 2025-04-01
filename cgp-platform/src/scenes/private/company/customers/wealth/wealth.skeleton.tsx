import { Skeleton } from "primereact/skeleton";

export function WealthSkeleton() {
  return (
    <div>
      <div className="mb-8 flex flex-col gap-x-8 gap-y-8 xl:flex-row">
        <Skeleton height="400px" className="mb-2 rounded-3xl"></Skeleton>
        <Skeleton height="400px" className="mb-2 rounded-3xl"></Skeleton>
        <Skeleton height="400px" className="mb-2 rounded-3xl"></Skeleton>
      </div>
    </div>
  );
}
