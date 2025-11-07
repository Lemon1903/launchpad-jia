import * as React from "react"

import "./input.scss"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={className ? `input ${className}` : "input"}
      {...props}
    />
  )
}

export { Input }
