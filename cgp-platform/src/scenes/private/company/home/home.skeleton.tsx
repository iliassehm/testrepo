import { Skeleton } from "primereact/skeleton";

export function HomeSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Skeleton height="400px" className="rounded-3xl" />
      <Skeleton height="400px" className="rounded-3xl" />
      <Skeleton height="325px" className="rounded-3xl" />
      <div className="flex h-full w-full flex-col gap-x-8 gap-y-8 md:flex-row md:gap-y-0">
        <Skeleton height="325px" className="rounded-3xl" />
        <Skeleton height="325px" className="rounded-3xl" />
      </div>
    </div>
  );
}
