import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import "./badge.scss";

type BadgeVariant = "default" | "secondary" | "destructive" | "accent" | "outline";

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & { variant?: BadgeVariant; asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return <Comp data-slot="badge" data-variant={variant} className={className} {...props} />;
}

export { Badge };

