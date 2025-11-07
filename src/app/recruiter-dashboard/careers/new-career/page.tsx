"use client";

// import CareerFormOld from "@/lib/components/CareerComponents/CareerForm";
import CareerForm from "@/lib/components/CareerComponents/new/CareerForm";
import HeaderBar from "@/lib/PageComponent/HeaderBar";

export default function NewCareerPage() {
    return (
        <>
        <HeaderBar activeLink="Careers" currentPage="Add new career" icon="la la-suitcase" />
        <div className="container-fluid mt--7" style={{ paddingTop: "6rem" }}>
          <div className="row">
            <CareerForm />
            {/* <CareerFormOld formType="add" /> */}
          </div>
        </div>
      </>
    )
}
