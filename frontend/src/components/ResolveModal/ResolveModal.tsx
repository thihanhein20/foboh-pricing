import { useState } from "react";
import { resolvePrice } from "../../services/api/api";

interface Customer {
  id: string;
  name: string;
}

interface Product {
  id: string;
  title: string;
  basePrice: number;
}

interface Resolution {
  customerId: string;
  productId: string;
  originalPrice: number;
  resolvedPrice: number;
  appliedProfileId: string;
  appliedProfileName: string;
  reason: string;
}

interface ResolveModalProps {
  onClose: () => void;
}

const customers: Customer[] = [
  { id: "c1", name: "Bondi Cellars" },
  { id: "c2", name: "Sydney Wine Co" },
  { id: "c3", name: "Melbourne Drinks" },
];

const products: Product[] = [
  { id: "p1", title: "High Garden Pinot Noir 2021", basePrice: 279.06 },
  { id: "p2", title: "Koyama Methode Brut Nature NV", basePrice: 120.0 },
  { id: "p3", title: "Koyama Riesling 2018", basePrice: 215.04 },
  { id: "p4", title: "Koyama Tussock Riesling 2019", basePrice: 215.04 },
  { id: "p5", title: "Lacourte-Godbillon Brut Cru NV", basePrice: 409.32 },
];

export default function ResolveModal({ onClose }: ResolveModalProps) {
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [resolution, setResolution] = useState<Resolution | null>(null);
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
      setError("Failed to resolve price");
    } finally {
      setLoading(false);
    }
  }

  const saving = resolution
    ? resolution.originalPrice - resolution.resolvedPrice
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-semibold text-gray-800">
              Resolve Price
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Find the effective price for a customer and product
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-light"
          >
            x
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {/* Customer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer
            </label>
            <select
              value={customerId}
              onChange={(e) => {
                setCustomerId(e.target.value);
                setResolution(null);
                setError("");
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="">Select a customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product
            </label>
            <select
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value);
                setResolution(null);
                setError("");
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="">Select a product...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (${p.basePrice.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Result */}
          {resolution && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 space-y-3">
              {/* Prices */}
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

              {/* Saving */}
              {saving > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center">
                  <p className="text-green-600 text-sm font-medium">
                    Saving ${saving.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Profile applied */}
              <div className="border-t border-teal-200 pt-3">
                <p className="text-xs text-gray-500 mb-1">Profile Applied</p>
                <p className="text-sm font-medium text-gray-800">
                  {resolution.appliedProfileName}
                </p>
              </div>

              {/* Reason */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Reason</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {resolution.reason}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleResolve}
            disabled={loading}
            className="px-4 py-2 text-sm bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Resolving..." : "Resolve Price"}
          </button>
        </div>
      </div>
    </div>
  );
}
