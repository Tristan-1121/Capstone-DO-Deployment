import React from "react";

export default function ContactSection({ profile = {} }) {
  const {
    phone,
    address,
    city,
    state,
    zip,
    emergencyContactName,
    emergencyContactPhone,
  } = profile || {};

  return (
    <section className="bg-white rounded border p-4 shadow-sm">
      <h3 className="font-medium text-lg mb-3">Contact Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
        <div>
          <div className="text-gray-500 text-sm">Phone</div>
          <div>{phone || "—"}</div>
        </div>

        <div>
          <div className="text-gray-500 text-sm">Address</div>
          <div>
            {address
              ? `${address}${city ? `, ${city}` : ""}${state ? `, ${state}` : ""}`
              : "—"}
          </div>
        </div>

        <div>
          <div className="text-gray-500 text-sm">ZIP Code</div>
          <div>{zip || "—"}</div>
        </div>

        <div>
          <div className="text-gray-500 text-sm">Emergency Contact</div>
          <div>
            {emergencyContactName
              ? `${emergencyContactName}${emergencyContactPhone ? ` — ${emergencyContactPhone}` : ""}`
              : "—"}
          </div>
        </div>
      </div>
    </section>
  );
}
