// frontend/src/pages/practitioner/Dashboard.jsx

export default function PractitionerDashboard() {
  // Temporary hard-coded stats. Later we will pull these from the backend.
  const stats = [
    { label: "Total Patients", value: 3, caption: "Active in your panel" },
    { label: "Callback Needed", value: 1, caption: "Awaiting follow-up" },
    { label: "Upcoming Appointments", value: 3, caption: "Next 7 days" },
    { label: "Active Prescriptions", value: 3, caption: "Currently prescribed" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Practitioner Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Manage your patients and appointments.
        </p>
      </header>

      {/* KPI tiles row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold text-[#003E7E]">
                {stat.value}
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-400">{stat.caption}</p>
          </div>
        ))}
      </section>

      {/* Placeholder for later patient table / callback list */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Patient Management</h2>
        <p className="text-sm text-gray-600">
          Patient list, callbacks, and visit history will be added here in a future card.
        </p>
      </section>
    </div>
  );
}
