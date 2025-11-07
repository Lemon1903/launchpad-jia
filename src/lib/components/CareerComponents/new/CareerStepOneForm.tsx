import { useEffect, useState } from "react";

import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import RichTextEditor from "@/lib/components/CareerComponents/RichTextEditor";
import MembersDropdown from "@/lib/components/Dropdown/MembersDropdown";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/lib/components/ui/Field/field";
import { Input } from "@/lib/components/ui/Input/input";
import { Separator } from "@/lib/components/ui/Separator/separator";
import "@/lib/styles/forms/career-step-one.scss";

import philippineCitiesAndProvinces from "../../../../../public/philippines-locations.json";

type Province = {
  name: string;
  region: string;
  key: string;
};

type City = {
  name: string;
  province: string;
  city?: boolean;
};

export default function CareerStepOneForm() {
  const [provinces, setProvinces] = useState<Array<Province>>([]);
  const [cities, setCities] = useState<Array<City>>([]);

  // Initialize provinces and cities values for dropdowns
  useEffect(() => {
    const parseProvinces = () => {
      setProvinces(philippineCitiesAndProvinces.provinces);
      const defaultProvince = philippineCitiesAndProvinces.provinces[0];
      // if (!career?.province) {
      //   setProvince(defaultProvince.name);
      // }
      const cities = philippineCitiesAndProvinces.cities.filter(
        (city) => city.province === defaultProvince.key,
      );
      setCities(cities);
      // if (!career?.location) {
      //   setCity(cities[0].name);
      // }
    };
    parseProvinces();
  }, []);

  return (
    <div className="career-step-one">
      {/* Career Information */}
      <div className="layered-card-middle career-step-one__card">
        <span className="career-step-one__section-title">
          1. Career Information
        </span>
        <div className="layered-card-content">
          <FieldGroup>
            {/* Basic Information */}
            <FieldSet>
              <FieldLegend>Basic Information</FieldLegend>
              <Field>
                <FieldLabel htmlFor="job-title">Job Title</FieldLabel>
                <Input
                  id="job-title"
                  value={""}
                  placeholder="Enter job title"
                  onChange={(e) => {
                    // setJobTitle(e.target.value || "");
                  }}
                />
              </Field>
            </FieldSet>

            {/* Work Setting */}
            <FieldSet>
              <FieldLegend>Work Setting</FieldLegend>
              <div className="career-step-one__row">
                <Field>
                  <FieldLabel>Employment Type</FieldLabel>
                  <CustomDropdown
                    onSelectSetting={(employmentType) => {
                      // setEmploymentType(employmentType);
                    }}
                    screeningSetting=""
                    settingList={[{ name: "Full-Time" }, { name: "Part-Time" }]}
                    placeholder="Choose Employment Type"
                  />
                </Field>
                <Field>
                  <FieldLabel>Arrangement</FieldLabel>
                  <CustomDropdown
                    onSelectSetting={(setting) => {
                      // setWorkSetup(setting);
                    }}
                    screeningSetting=""
                    settingList={[{ name: "Fully Remote" }, { name: "Onsite" }, { name: "Hybrid" }]}
                    placeholder="Choose Work Arrangement"
                  />
                </Field>
              </div>
            </FieldSet>

            {/* Location */}
            <FieldSet>
              <FieldLegend>Location</FieldLegend>
              <div className="career-step-one__row">
                <Field>
                  <FieldLabel>Country</FieldLabel>
                  <CustomDropdown
                    onSelectSetting={(setting) => {
                      // setCountry(setting);
                    }}
                    screeningSetting="Philippines"
                    settingList={[]}
                    placeholder="Choose Country"
                  />
                </Field>
                <Field>
                  <FieldLabel>State / Province</FieldLabel>
                  <CustomDropdown
                    onSelectSetting={(province) => {
                      // setProvince(province);
                      // const provinceObj = provinceList.find((p) => p.name === province);
                      // const cities = philippineCitiesAndProvinces.cities.filter((city) => city.province === provinceObj.key);
                      // setCityList(cities);
                      // setCity(cities[0].name);
                    }}
                    screeningSetting=""
                    settingList={provinces}
                    placeholder="Choose State / Province"
                  />
                </Field>
                <Field>
                  <FieldLabel>City</FieldLabel>
                  <CustomDropdown
                    onSelectSetting={(city) => {
                      // setCity(city);
                    }}
                    screeningSetting=""
                    settingList={cities}
                    placeholder="Choose City"
                  />
                </Field>
              </div>
            </FieldSet>
          </FieldGroup>
        </div>
      </div>

      {/* Job Description */}
      <div className="layered-card-middle career-step-one__card">
        <span className="career-step-one__section-title">
          2. Job Description
        </span>
        <div className="layered-card-content">
          <RichTextEditor setText={""} text={""} />
        </div>
      </div>

      {/* Team Access */}
      <div className="layered-card-middle career-step-one__card">
        <span className="career-step-one__section-title">
          3. Team Access
        </span>
        <div className="layered-card-content">
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
        </div>
      </div>
    </div>
  );
}
