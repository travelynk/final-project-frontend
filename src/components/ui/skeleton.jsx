import { cn } from "@/lib/utils";

function Skeleton({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md    border border-darkblue04  w-full ",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Skeleton };
