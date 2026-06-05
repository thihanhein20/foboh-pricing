import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getProfileById, updateProfile } from "../../services/api/api";
import ProfileForm from "../../components/ProfileForm/ProfileForm";
import type { PricingProfile, ProfileFormValues } from "../../types";

export default function EditProfile() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<PricingProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfileById(id!)
      .then(setProfile)
      .catch((err) =>
        setLoadError(
          axios.isAxiosError(err)
            ? (err.response?.data?.error ?? "Failed to load profile")
            : "Failed to load profile",
        ),
      )
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(values: ProfileFormValues) {
    setSaving(true);
    try {
      await updateProfile(id!, values);
      navigate("/pricing");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading profile...</div>;
  }

  if (loadError) {
    return (
      <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
        {loadError}
      </div>
    );
  }

  return (
    <ProfileForm
      initialValues={profile!}
      breadcrumb="Edit Profile"
      title="Edit Pricing Profile"
      submitLabel="Save Changes"
      onSubmit={handleSubmit}
      saving={saving}
    />
  );
}
