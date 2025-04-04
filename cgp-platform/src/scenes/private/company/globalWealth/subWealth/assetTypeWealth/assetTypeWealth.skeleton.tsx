import { Skeleton } from "primereact/skeleton";

export function AssetTypeWealthSkeleton() {
  return (
    <div>
      <div className="flex">
        <Skeleton height="400px" className="mb-2 rounded-3xl"></Skeleton>
        <Skeleton
          width="25%"
          height="10rem"
          className="ml-8 rounded-3xl"
        ></Skeleton>
      </div>
    </div>
  );
}
