import * as AccordionPrimitive from "@radix-ui/react-accordion";
import clsx from "clsx";

export function Accordion({
  children,
  type = "single",
  collapsible,
  className,
}) {
  return (
    <AccordionPrimitive.Root
      type={type}
      collapsible={collapsible}
      className={clsx("accordion-root", className)}
    >
      {children}
    </AccordionPrimitive.Root>
  );
}

export function AccordionItem({ children, value, className }) {
  return (
    <AccordionPrimitive.Item
      value={value}
      className={clsx("accordion-item", className)}
    >
      {children}
    </AccordionPrimitive.Item>
  );
}

export function AccordionTrigger({ children, className }) {
  return (
    <AccordionPrimitive.Trigger
      className={clsx(
        "accordion-trigger cursor-pointer flex justify-between items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded",
        className
      )}
    >
      {children}
    </AccordionPrimitive.Trigger>
  );
}

export function AccordionContent({ children, className }) {
  return (
    <AccordionPrimitive.Content
      className={clsx("accordion-content px-4 py-2", className)}
    >
      {children}
    </AccordionPrimitive.Content>
  );
}
