import React from "react";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export default function About() {
  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-xl font-semibold">About UWF CareConnect</h1>
      <p className="text-gray-700 dark:text-gray-300">
        Your trusted healthcare management platform
      </p>

      {/* About */}
      <div className="card space-y-3">
        <div className="flex items-center gap-2">
          <InformationCircleIcon className="h-5 w-5 text-blue-700" />
          <h2 className="text-section-title">About Our Wellness Clinic</h2>
        </div>

        <p className="text-section-body">
          The University of West Florida Wellness Clinic…
        </p>

        <p className="text-section-body">
          Our mission is to deliver accessible healthcare…
        </p>
      </div>

      {/* Contact */}
      <div className="card space-y-3">
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5 text-green-700" />
          <h2 className="text-section-title">Contact Information</h2>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2">
          <MapPinIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 mt-1" />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-section-body">
              Building 960, Suite 106<br />
              11000 University Parkway<br />
              Pensacola, FL 32514
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-2">
          <PhoneIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 mt-1" />
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-section-body">(850) 474-2172</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-2">
          <EnvelopeIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 mt-1" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-section-body">healthservices@uwf.edu</p>
          </div>
        </div>

        {/* Hours */}
        <div className="flex items-start gap-2">
          <ClockIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 mt-1" />
          <div>
            <p className="font-medium">Hours</p>
            <p className="text-section-body">
              Monday–Friday: 8AM – 5PM<br />
              Closed weekends
            </p>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="card space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5 text-blue-700" />
          <h2 className="text-section-title">Privacy & Security</h2>
        </div>

        <p className="text-section-body">
          Your health information is protected under HIPAA…
        </p>

        <p className="text-sm text-muted">
          For more information about our privacy practices…
        </p>
      </div>

      {/* Footer */}
      <div className="bg-blue-900 text-white rounded-lg p-4 text-center space-y-1">
        <p className="font-semibold">University of West Florida</p>
        <p className="text-sm opacity-90">
          Building a healthier campus community.
        </p>
        <p className="text-xs opacity-80">
          © {new Date().getFullYear()} UWF CareConnect. All rights reserved.
        </p>
      </div>
    </div>
  );
}
