// src/pages/About.jsx
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
    <div className="space-y-6">
      {/* Page Header */}
      <h1 className="text-xl font-semibold">About UWF CareConnect</h1>
      <p className="text-gray-700">
        Your trusted healthcare management platform
      </p>

      {/* About Section */}
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <InformationCircleIcon className="h-5 w-5 text-blue-700" />
          <h2 className="font-semibold text-gray-800">About Our Wellness Clinic</h2>
        </div>

        <p className="text-gray-700 leading-relaxed">
          The University of West Florida Wellness Clinic is dedicated to providing
          comprehensive healthcare services to our campus community. CareConnect is
          UWF’s modern digital portal designed to streamline your healthcare
          experience, making it easier to manage appointments, track medications,
          and stay connected with your healthcare providers.
        </p>

        <p className="text-gray-700 leading-relaxed">
          Our mission is to deliver accessible, quality healthcare while empowering
          students and staff to take an active role in their health and wellness
          journey.
        </p>
      </div>

      {/* Contact Info */}
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5 text-green-700" />
          <h2 className="font-semibold text-gray-800">Contact Information</h2>
        </div>

        {/* Location */}
        <div>
          <div className="flex items-start gap-2">
            <MapPinIcon className="h-5 w-5 text-gray-600 mt-1" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-gray-700">
                Building 960, Suite 106<br />
                11000 University Parkway<br />
                Pensacola, FL 32514
              </p>
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-2">
          <PhoneIcon className="h-5 w-5 text-gray-600 mt-1" />
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-gray-700">(850) 474-2172</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-2">
          <EnvelopeIcon className="h-5 w-5 text-gray-600 mt-1" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-gray-700">healthservices@uwf.edu</p>
          </div>
        </div>

        {/* Hours */}
        <div className="flex items-start gap-2">
          <ClockIcon className="h-5 w-5 text-gray-600 mt-1" />
          <div>
            <p className="font-medium">Hours</p>
            <p className="text-gray-700">
              Monday–Friday: 8:00 AM – 5:00 PM<br />
              Saturday–Sunday: Closed<br />
              (Closed on all university-recognized holidays)
            </p>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5 text-blue-700" />
          <h2 className="font-semibold text-gray-800">Privacy & Security</h2>
        </div>

        <p className="text-gray-700 leading-relaxed">
          Your health information is protected under HIPAA regulations. We take your
          privacy seriously and use industry-standard security measures to keep your
          data safe and confidential.
        </p>

        <p className="text-gray-700 text-sm">
          For more information about our privacy practices, please contact the UWF
          Health Services office.
        </p>
      </div>

      {/* Footer Bar */}
      <div className="bg-blue-900 text-white rounded-lg p-4 text-center space-y-1">
        <p className="font-semibold">University of West Florida</p>
        <p className="text-sm opacity-90">Building a healthier campus community, one student at a time.</p>
        <p className="text-xs opacity-80">© {new Date().getFullYear()} UWF CareConnect. All rights reserved.</p>
      </div>
    </div>
  );
}
