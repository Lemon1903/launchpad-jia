"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";

import "./label.scss";

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return <LabelPrimitive.Root className={"lp-label " + className} {...props} />;
}

export { Label };
