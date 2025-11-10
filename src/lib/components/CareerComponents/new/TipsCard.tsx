import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/Card/card";
import { Tips } from "@/lib/config/career/steps";
import { Bulb } from "@/lib/icons";
import "@/lib/styles/cards/tips-card.scss";

interface TipsCardProps {
  tips: Tips[];
}

export default function TipsCard({ tips }: TipsCardProps) {
  return (
    <Card className="tips-card">
      <CardHeader>
        <CardTitle>
          <Bulb /> Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tips.map((tip, index) => (
          <div key={index} className="tips-card__tip">
            <span className="tips-card__tip-emphasis">{tip.emphasis}</span>{" "}
            <span className="tips-card__tip-text">{tip.text}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
