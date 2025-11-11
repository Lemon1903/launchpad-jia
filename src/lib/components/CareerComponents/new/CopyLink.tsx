import { Button } from "@/lib/components/ui/Button/button";
import { Input } from "@/lib/components/ui/Input/input";
import { candidateActionToast } from "@/lib/Utils";

export default function CopyLink({ value }: { value: string }) {
  function handleCopy() {
    navigator.clipboard.writeText(value);
    candidateActionToast(
      "Career Link Copied to Clipboard",
      1300,
      <i className="la la-link mr-1 text-info"></i>,
    );
  }

  return (
    <div className="d-flex align-items-center" style={{ gap: 10 }}>
      <Input value={value} readOnly={true} />
      <Button variant="ghost" size="icon-sm" onClick={handleCopy}>
        <i className="la la-copy" style={{ fontSize: 20, color: "#535862" }}></i>
      </Button>
    </div>
  );
}
