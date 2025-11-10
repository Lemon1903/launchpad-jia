import * as React from "react";
import "./textarea.scss";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={className} {...props} />;
}

export { Textarea };

