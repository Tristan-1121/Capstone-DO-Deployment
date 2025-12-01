import React from "react";
import SummarySection from "./SummarySection";
import HealthHistorySection from "./HealthHistorySection";
import AllergiesSection from "./AllergiesSection";
import PrescriptionsSection from "./PrescriptionsSection";
import ContactSection from "./ContactSection";

export default function ProfileCard({ profile = {}, onEdit }) {
  return (
    <div className="space-y-6">
      <SummarySection profile={profile} onEdit={onEdit} />
      <ContactSection profile={profile} />
      <HealthHistorySection profile={profile} />
      <AllergiesSection profile={profile} />
      <PrescriptionsSection profile={profile} />
    </div>
  );
}
