import { Skeleton } from "primereact/skeleton";

export function CustomersSkeleton() {
  return (
    <div>
      <div className="flex">
        <Skeleton height="600px" className="mb-2 rounded-3xl" />
        <div className="ml-8 w-1/4">
          <Skeleton height="10rem" className="rounded-3xl" />
          <Skeleton height="10rem" className="my-4 rounded-3xl" />
          <Skeleton height="10rem" className="rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
