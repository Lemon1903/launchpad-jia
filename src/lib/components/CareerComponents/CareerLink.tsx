"use client";

import CopyLink from "@/lib/components/CareerComponents/new/CopyLink";
import { Card, CardContent, CardHeader } from "@/lib/components/ui/Card/card";
import { useEffect, useState } from "react";

export default function CareerLink(props: { career: any }) {
  const { career } = props;
  const [shareLink, setShareLink] = useState<string>();

  useEffect(() => {
    let careerRedirection = "applicant";
    if (career.orgID === "682d3fc222462d03263b0881") {
      careerRedirection = "whitecloak";
    }
    setShareLink(`https://www.hellojia.ai/${careerRedirection}/job-openings/${career._id}`);
  }, [career]);

  return (
    <Card>
      <CardHeader>
        <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}>Career Link</span>
      </CardHeader>
      {shareLink && (
        <CardContent>
          <CopyLink value={shareLink} />
        </CardContent>
      )}
    </Card>
  );
}
