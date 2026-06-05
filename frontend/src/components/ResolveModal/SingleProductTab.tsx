import { useState } from "react";
import { resolvePrice } from "../../services/api/api";
import { getApiError } from "../../utils/error";
import type { PriceResolution } from "../../types";
import { CUSTOMERS, PRODUCTS } from "./constants";

export default function SingleProductTab() {
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [resolution, setResolution] = useState<PriceResolution | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleResolve() {
    if (!customerId || !productId) {
      setError("Please select both a customer and a product");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data = await resolvePrice(customerId, productId);
      setResolution(data);
    } catch (err) {
      setError(getApiError(err, "Failed to resolve price"));
    } finally {
      setLoading(false);
    }
  }

  const saving = resolution
    ? resolution.originalPrice - resolution.resolvedPrice
    : 0;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
        <select
          value={customerId}
          onChange={(e) => { setCustomerId(e.target.value); setResolution(null); setError(""); }}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
        >
          <option value="">Select a customer...</option>
          {CUSTOMERS.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
        <select
          value={productId}
          onChange={(e) => { setProductId(e.target.value); setResolution(null); setError(""); }}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
        >
          <option value="">Select a product...</option>
          {PRODUCTS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} (${p.basePrice.toFixed(2)})
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {resolution && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Original Price</p>
              <p className="text-base font-medium text-gray-600 line-through">
                ${resolution.originalPrice.toFixed(2)}
              </p>
            </div>
            <div className="text-2xl text-gray-300">→</div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Resolved Price</p>
              <p className="text-2xl font-bold text-teal-700">
                ${resolution.resolvedPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {saving > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center">
              <p className="text-green-600 text-sm font-medium">
                Saving ${saving.toFixed(2)}
              </p>
            </div>
          )}

          <div className="border-t border-teal-200 pt-3">
            <p className="text-xs text-gray-500 mb-1">Profile Applied</p>
            <p className="text-sm font-medium text-gray-800">{resolution.appliedProfileName}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Reason</p>
            <p className="text-xs text-gray-600 leading-relaxed">{resolution.reason}</p>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={handleResolve}
          disabled={loading}
          className="px-4 py-2 text-sm bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Resolving..." : "Resolve Price"}
        </button>
      </div>
    </div>
  );
}
