"use client"

import * as SeparatorPrimitive from "@radix-ui/react-separator"
import * as React from "react"

import styles from "./separator.module.scss"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={`${styles.separator} ${styles[`separator--${orientation}`]} ${className || ""}`}
      {...props}
    />
  )
}

export { Separator }
