import React from "react";

// Presentational card for patient profile details; keeps pages lean and reusable
export default function ProfileCard({ profile, onEdit }) {
  return (
    <section className="bg-white rounded border p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-medium text-lg">Patient Summary</h2>
        <button
          onClick={onEdit}
          className="px-3 py-1 rounded border hover:bg-gray-50 text-sm"
          title="Edit profile"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
        <div>
          <div className="text-gray-500 text-sm">Full Name</div>
          <div>{profile.fullName || "-"}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Age</div>
          <div>{profile.age ?? "-"}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Weight</div>
          <div>{profile.weight ?? "-"}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Email</div>
          <div>{profile.email}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-gray-500 text-sm mb-1">Health History</div>
        <div className="flex gap-2 flex-wrap">
          {(profile.healthHistory || []).length ? (
            profile.healthHistory.map((h, i) => (
              <span key={i} className="px-2 py-1 rounded-full bg-gray-100 text-sm">
                {h}
              </span>
            ))
          ) : (
            <span className="text-gray-500">No history on file.</span>
          )}
        </div>
      </div>
    </section>
  );
}
