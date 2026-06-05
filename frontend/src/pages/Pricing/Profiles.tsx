import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getProfiles, deleteProfile } from "../../services/api/api";
import type { PricingProfile } from "../../types";
import ResolveModal from "../../components/ResolveModal/ResolveModal";

export default function Profiles() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<PricingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showResolveModal, setShowResolveModal] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      const data = await getProfiles();
      setProfiles(data);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? (err.response?.data?.error ?? "Failed to load profiles")
          : "Failed to load profiles",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProfile(id);
      setProfiles(profiles.filter((p) => p.id !== id));
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? (err.response?.data?.error ?? "Failed to delete profile")
          : "Failed to delete profile",
      );
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pricing Profiles</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your customer specific pricing profiles
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowResolveModal(true)}
            className="px-4 py-2 text-sm border border-teal-700 text-teal-700 hover:bg-teal-50 rounded-lg font-medium transition-colors"
          >
            Resolve Price
          </button>
          <button
            onClick={() => navigate("/pricing/create")}
            className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Create Profile
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-gray-400 text-sm">Loading profiles...</div>
      )}

      {/* Empty state */}
      {!loading && profiles.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-400 text-sm">No pricing profiles yet.</p>
          <button
            onClick={() => navigate("/pricing/create")}
            className="mt-4 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Create your first profile
          </button>
        </div>
      )}

      {/* Profiles table */}
      {!loading && profiles.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">
                  Name
                </th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">
                  Type
                </th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">
                  Adjustment
                </th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">
                  Product Scope
                </th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">
                  Customer Scope
                </th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">
                  Created
                </th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {profiles.map((profile) => (
                <tr
                  key={profile.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {profile.name}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        profile.adjustmentType === "fixed"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-purple-50 text-purple-600"
                      }`}
                    >
                      {profile.adjustmentType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {profile.adjustmentDirection === "increase" ? "+" : "-"}
                    {profile.adjustmentType === "fixed" ? "$" : ""}
                    {profile.adjustmentValue}
                    {profile.adjustmentType === "dynamic" ? "%" : ""}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {profile.productScope}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {profile.customerScope}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(profile.id)}
                      className="text-red-400 hover:text-red-600 text-xs transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Resolve Modal */}
      {showResolveModal && (
        <ResolveModal onClose={() => setShowResolveModal(false)} />
      )}
    </div>
  );
}
