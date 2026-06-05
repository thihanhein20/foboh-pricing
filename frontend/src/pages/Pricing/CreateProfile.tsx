import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProfile } from "../../services/api/api";
import ProfileForm from "../../components/ProfileForm/ProfileForm";
import type { ProfileFormValues } from "../../types";

export default function CreateProfile() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(values: ProfileFormValues) {
    setSaving(true);
    try {
      await createProfile(values);
      navigate("/pricing");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProfileForm
      breadcrumb="Create Profile"
      title="Create Pricing Profile"
      submitLabel="Save & Publish Profile"
      onSubmit={handleSubmit}
      saving={saving}
    />
  );
}
