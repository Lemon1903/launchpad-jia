import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { updateCareer } from "@/lib/api";
import CopyLink from "@/lib/components/CareerComponents/new/CopyLink";
import { Button } from "@/lib/components/ui/Button/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/Card/card";
import { useAppContext } from "@/lib/context/AppContext";
import { copyTextToClipboard, errorToast, loadingToast, successToast } from "@/lib/Utils";
import { Career } from "@/types";

export default function DirectInterviewLinkV2({ career }: { career: Career }) {
  const { user } = useAppContext();
  const [shareLink, setLink] = useState<string | null>(null);

  async function update(
    dataUpdates: Partial<Career>,
    loadingMessage: string,
    sucessMessage: string,
  ) {
    loadingToast(loadingMessage);

    // Handle slug if it's an array or string
    try {
      await updateCareer(career.id, {
        lastEditedBy: user,
        ...dataUpdates,
      });
      successToast(sucessMessage, 1200);
    } catch (error) {
      errorToast("An error occurred. Please try again.", 1200);
    } finally {
      toast.dismiss("loading-toast");
    }
  }

  async function generateLink() {
    const directLink = `/direct-interview/${career.id}`;

    await update(
      { directInterviewLink: directLink },
      "Generating Link...",
      "Sucessfully Created Direct Link",
    );

    const dynamicLink = `${window.location.origin}${directLink}`;
    setLink(dynamicLink);
    copyTextToClipboard(dynamicLink);
  }

  async function disableLink() {
    await update(
      { directInterviewLink: null },
      "Removing Direct Link",
      "Sucessfully Removed Direct Link",
    );

    setLink(null);
  }

  useEffect(() => {
    if (career.directInterviewLink) {
      let dynamicLink = `${
        window.location.origin.includes("hirejia.ai")
          ? "https://www.hellojia.ai"
          : window.location.origin
      }${career.directInterviewLink}`;

      setLink(dynamicLink);
    }
  }, [career.directInterviewLink]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Direct Interview Link</CardTitle>
      </CardHeader>
      <CardContent>
        {shareLink ? (
          <>
            <CopyLink value={shareLink} />
            <span
              style={{
                textAlign: "center",
                fontSize: 14,
                color: "#717680",
                fontWeight: 500,
              }}
            >
              Share this link to an applicant for a direct interview.
            </span>

            <div className="btn-set careers-btn-set" style={{ flexDirection: "row", gap: 10 }}>
              <Button variant="outline" asChild style={{ flex: 1 }}>
                <a href={shareLink} target="_blank">
                  <i className="la la-link" style={{ fontSize: 20 }}></i> Open link
                </a>
              </Button>
              <Button variant="destructive" onClick={disableLink} style={{ flex: 1 }}>
                <i className="la la-square text-danger" style={{ fontSize: 20 }}></i> Disable Link
              </Button>
            </div>
          </>
        ) : (
          <Button variant="outline" onClick={generateLink}>
            <i className="la la-link text-success" /> Generate Direct Interview Link
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
