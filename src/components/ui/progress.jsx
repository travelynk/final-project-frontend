import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-28   overflow-hidden rounded-3xl bg-darkblue02 ",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-darkblue05 transition-all flex justify-end"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    >
      <img src="/src/assets/man.svg" alt="" className="z-10" />
    </ProgressPrimitive.Indicator>
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
