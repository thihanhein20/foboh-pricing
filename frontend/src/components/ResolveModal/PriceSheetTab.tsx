import { useState } from "react";
import { resolveAllForCustomer } from "../../services/api/api";
import { getApiError } from "../../utils/error";
import type { PriceResolution } from "../../types";
import { CUSTOMERS, PRODUCTS } from "./constants";

export default function PriceSheetTab() {
  const [customerId, setCustomerId] = useState("");
  const [resolutions, setResolutions] = useState<PriceResolution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!customerId) {
      setError("Please select a customer");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data = await resolveAllForCustomer(customerId);
      setResolutions(data);
    } catch (err) {
      setError(getApiError(err, "Failed to load price sheet"));
    } finally {
      setLoading(false);
    }
  }

  const selectedCustomer = CUSTOMERS.find((c) => c.id === customerId);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
        <select
          value={customerId}
          onChange={(e) => { setCustomerId(e.target.value); setResolutions([]); setError(""); }}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
        >
          <option value="">Select a customer...</option>
          {CUSTOMERS.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {resolutions.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">
            Price sheet for{" "}
            <span className="font-medium text-gray-700">{selectedCustomer?.name}</span>
          </p>
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Product</th>
                  <th className="text-right px-4 py-2.5 text-gray-500 font-medium">Base</th>
                  <th className="text-right px-4 py-2.5 text-gray-500 font-medium">Price</th>
                  <th className="text-right px-4 py-2.5 text-gray-500 font-medium">Saving</th>
                  <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Profile Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(() => {
                  return resolutions.map((r) => {
                    const saving = r.originalPrice - r.resolvedPrice;
                    const hasProfile = r.appliedProfileId !== null;
                    const isBestDeal = r.customerScope === "specific";
                    const productTitle =
                      PRODUCTS.find((p) => p.id === r.productId)?.title ?? r.productId;

                    return (
                      <tr
                        key={r.productId}
                        className={`transition-colors ${
                          isBestDeal ? "bg-teal-50 hover:bg-teal-100" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-4 py-3 text-gray-800 font-medium">{productTitle}</td>
                        <td className="px-4 py-3 text-right text-gray-400">
                          ${r.originalPrice.toFixed(2)}
                        </td>
                        <td className={`px-4 py-3 text-right font-semibold ${
                          isBestDeal ? "text-teal-700" : saving < 0 ? "text-red-500" : "text-gray-700"
                        }`}>
                          ${r.resolvedPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {isBestDeal ? (
                            <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">
                              ★ {saving > 0 ? `−$${saving.toFixed(2)}` : saving < 0 ? `+$${Math.abs(saving).toFixed(2)}` : "—"}
                            </span>
                          ) : saving > 0 ? (
                            <span className="text-gray-400 text-xs">−${saving.toFixed(2)}</span>
                          ) : saving < 0 ? (
                            <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-medium">
                              +${Math.abs(saving).toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {hasProfile ? (
                            <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                              {r.appliedProfileName}
                            </span>
                          ) : (
                            <span className="text-gray-400">Base price</span>
                          )}
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2 text-sm bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Loading..." : "Generate Price Sheet"}
        </button>
      </div>
    </div>
  );
}
