export default function About() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">About</h1>

      <div className="bg-white border rounded p-4">
        <p className="text-gray-700">
          UWF CareConnect is a student wellness portal for scheduling appointments,
          viewing personal health information, and communicating with the campus clinic.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div className="border rounded p-3">
            <div className="font-medium mb-1">Version</div>
            <div className="text-gray-600">1.0.0 (frontend for current MVP)</div>
          </div>
          <div className="border rounded p-3">
            <div className="font-medium mb-1">Theme</div>
            <div className="text-gray-600">UWF Blue (#003E7E)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
