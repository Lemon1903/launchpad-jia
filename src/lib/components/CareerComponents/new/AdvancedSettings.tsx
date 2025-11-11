import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { deleteCareer } from "@/lib/api";
import { Button } from "@/lib/components/ui/Button/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/Card/card";

export default function AdvancedSettings({ careerId }: { careerId: string }) {
  const router = useRouter();

  async function handleDeleteCareer() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleting career...",
          text: "Please wait while we delete the career...",
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => Swal.showLoading(),
        });

        try {
          await deleteCareer(careerId, true);
          Swal.fire({
            title: "Deleted!",
            text: "The career has been deleted.",
            icon: "success",
            allowOutsideClick: false,
          }).then(() => {
            router.push("/recruiter-dashboard/careers");
          });
        } catch (error) {
          console.error("Error deleting career:", error);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting the career",
            icon: "error",
          });
        }
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" onClick={handleDeleteCareer}>
          <i
            className="la la-trash"
            style={{ color: "currentcolor", fontSize: 20, marginTop: -3 }}
          ></i>
          <span>Delete this career</span>
        </Button>
        <span style={{ fontSize: "14px", color: "#717680", textAlign: "center" }}>
          Be careful, this action cannot be undone.
        </span>
      </CardContent>
    </Card>
  );
}
