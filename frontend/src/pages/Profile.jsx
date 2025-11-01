import React, { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../api/profile";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileForm from "../components/profile/ProfileForm";

// Loads current profile, shows a summary card, and supports editing via a modal form
export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // initial fetch
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getMyProfile();
        if (mounted) setProfile(data);
      } catch (e) {
        setError("Failed to load profile");
      }
    })();
    return () => { mounted = false; };
  }, []);

  const save = async (payload) => {
    try {
      setSaving(true);
      const updated = await updateMyProfile(payload);
      setProfile(updated);
      setEditing(false);
    } catch (e) {
      alert(e.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (error) return <div className="text-red-600">{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">My Profile</h1>

      <ProfileCard profile={profile} onEdit={() => setEditing(true)} />

      {/* Placeholder sections for parity with Figma; fill later */}
      <section className="bg-white rounded border p-4">
        <h2 className="font-medium mb-2">Prescriptions</h2>
        <div className="text-gray-500">No prescriptions on file.</div>
      </section>

      <section className="bg-white rounded border p-4">
        <h2 className="font-medium mb-2">Allergies</h2>
        <div className="text-gray-500">None recorded.</div>
      </section>

      {editing && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center">
          <div className="bg-white rounded shadow">
            <ProfileForm
              initial={profile}
              onCancel={() => setEditing(false)}
              onSave={save}
            />
            {saving && <div className="p-3 text-sm text-gray-500">Saving…</div>}
          </div>
        </div>
      )}
    </div>
  );
}
