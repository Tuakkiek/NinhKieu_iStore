// src/components/ui/checkbox.jsx
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // TRẠNG THÁI CHƯA CHỌN: nền trắng + viền xám
      "peer h-4 w-4 shrink-0 rounded-sm border-2 border-gray-300 bg-white",
      
      // TRẠNG THÁI ĐÃ CHỌN: nền đỏ + viền đỏ + chữ trắng
      "data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 data-[state=checked]:text-white",
      
      // FOCUS: viền đỏ nổi bật
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
      
      // DISABLED
      "disabled:cursor-not-allowed disabled:opacity-50",
      
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-3 w-3" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };