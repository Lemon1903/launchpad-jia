import { getCareer } from "@/lib/api";
import CareerForm from "@/lib/components/CareerComponents/new/CareerForm";
import HeaderBar from "@/lib/PageComponent/HeaderBar";

export default async function EditCareerPage({
  params,
  searchParams,
}: {
  params: Promise<{ careerId: string }>;
  searchParams: Promise<{ step: string }>;
}) {
  const { careerId } = await params;
  const { step } = await searchParams;
  const currentStep = step && !isNaN(parseInt(step)) ? parseInt(step) : null;

  const response = await getCareer(careerId);
  const career = response.career;

  return (
    <>
      <HeaderBar activeLink="Careers" currentPage="Edit career" icon="la la-suitcase" />
      <div className="container-fluid mt--7" style={{ paddingTop: "6rem" }}>
        <div className="row">
          <CareerForm step={currentStep} existingCareer={career} />
        </div>
      </div>
    </>
  );
}
