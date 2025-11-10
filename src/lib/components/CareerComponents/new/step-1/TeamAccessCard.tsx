import MembersDropdown from "@/lib/components/Dropdown/MembersDropdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/Card/card";
import { Separator } from "@/lib/components/ui/Separator/separator";

export default function TeamAccessCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>3. Team Access</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="career-step-one__team-access-header">
          <div>
            <div className="career-step-one__team-access-title">Add more members</div>
            <span className="career-step-one__team-access-subtitle">
              You can add other members to collaborate on this career.
            </span>
          </div>
          <MembersDropdown />
        </div>
        <Separator className="career-step-one__separator" />
        <span className="career-step-one__footnote">
          *Admins can view all careers regardless of specific access settings.
        </span>
      </CardContent>
    </Card>
  );
}
