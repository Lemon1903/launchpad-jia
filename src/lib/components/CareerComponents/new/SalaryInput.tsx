import { Input } from "@/lib/components/ui/Input/input";
import "@/lib/styles/inputs/salary-input.scss";

export default function SalaryInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="salary-input">
      <span className="salary-input__prefix">₱</span>
      <Input
        type="number"
        className={`salary-input__field ${className}`}
        placeholder="0"
        min={0}
        {...props}
      />
      <span className="salary-input__suffix">PHP</span>
    </div>
  );
}
