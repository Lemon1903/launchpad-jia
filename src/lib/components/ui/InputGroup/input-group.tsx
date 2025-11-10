"use client";

import * as React from "react";

import "./input-group.scss";

import { Button } from "@/lib/components/ui/Button/button";
import { Input } from "@/lib/components/ui/Input/input";
import { Textarea } from "@/lib/components/ui/Textarea/textarea";

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  // Use a project-scoped class to avoid collisions with any global .input-group styles (e.g. from UI frameworks)
  const cls = className ? `lp-input-group ${className}` : "lp-input-group";
  return <div data-slot="input-group" role="group" className={cls} {...props} />;
}

type AddonAlign = "inline-start" | "inline-end" | "block-start" | "block-end";

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & { align?: AddonAlign }) {
  const cls = className ? `lp-input-group__addon ${className}` : "lp-input-group__addon";
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cls}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      {...props}
    />
  );
}

type ButtonSize = "xs" | "sm" | "icon-xs" | "icon-sm";

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> & { size?: ButtonSize }) {
  const cls = className ? `lp-input-group__button ${className}` : "lp-input-group__button";
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      data-slot="input-group-button"
      className={cls}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  const cls = className ? `lp-input-group__text ${className}` : "lp-input-group__text";
  return <span data-slot="input-group-text" className={cls} {...props} />;
}

function InputGroupInput({ className, ...props }: React.ComponentProps<"input">) {
  return <Input data-slot="input-group-control" className={className} {...props} />;
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <Textarea data-slot="input-group-control" className={className} {...props} />;
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea
};

