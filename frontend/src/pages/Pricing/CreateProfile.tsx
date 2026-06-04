import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, createProfile } from "../../services/api/api";
import type { Product } from "../../types";
import ProductFilter from "../../components/ProductFilter/ProductFilter";
import ProductList from "../../components/ProductList/ProductList";
import AdjustmentControls from "../../components/AdjustmentControls/AdjustmentControls";
import PricePreview from "../../components/PricePreview/PricePreview";
import CustomerScope from "../../components/CustomerScope/CustomerScope";

interface Filters {
  title: string;
  sku: string;
  subCategory: string;
  segment: string;
  brand: string;
}

export default function CreateProfile() {
  const navigate = useNavigate();

  // Profile state
  const [name, setName] = useState("");
  const [adjustmentType, setAdjustmentType] = useState<"fixed" | "dynamic">(
    "fixed",
  );
  const [adjustmentDirection, setAdjustmentDirection] = useState<
    "increase" | "decrease"
  >("decrease");
  const [adjustmentValue, setAdjustmentValue] = useState<number>(0);
  const [productScope, setProductScope] = useState<
    "specific" | "category" | "all"
  >("specific");
  const [customerScope, setCustomerScope] = useState<
    "specific" | "group" | "all"
  >("all");
  const [customerGroup, setCustomerGroup] = useState("");
  const [customerId, setCustomerId] = useState("");

  // Product state
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({
    title: "",
    sku: "",
    subCategory: "",
    segment: "",
    brand: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  async function fetchProducts() {
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== ""),
      );
      const data = await getProducts(activeFilters);
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  function toggleProduct(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  function selectAll() {
    setSelectedIds(products.map((p) => p.id));
  }

  function deselectAll() {
    setSelectedIds([]);
  }

  async function handleSave() {
    if (!name) {
      setError("Profile name is required");
      return;
    }
    if (productScope === "specific" && selectedIds.length === 0) {
      setError("Please select at least one product");
      return;
    }

    try {
      setSaving(true);
      await createProfile({
        name,
        adjustmentType,
        adjustmentDirection,
        adjustmentValue,
        productScope,
        productIds: productScope === "specific" ? selectedIds : undefined,
        customerScope,
        customerId: customerScope === "specific" ? customerId : undefined,
        customerGroup: customerScope === "group" ? customerGroup : undefined,
      });
      navigate("/pricing");
    } catch (err) {
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  const selectedProducts = products.filter((p) => selectedIds.includes(p.id));

  return (
    <div className="max-w-4xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm text-gray-400 mb-1">
            Pricing Profiles &gt; Create Profile
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Create Pricing Profile
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/pricing")}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save & Publish Profile"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Profile Name */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          Basic Pricing Profile
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. 10% off Wine for VIP customers"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Customer Scope */}
      <CustomerScope
        customerScope={customerScope}
        customerGroup={customerGroup}
        customerId={customerId}
        onScopeChange={setCustomerScope}
        onGroupChange={setCustomerGroup}
        onCustomerIdChange={setCustomerId}
      />

      {/* Product Selection */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          Select Product Pricing
        </h2>

        {/* Product Scope */}
        <div className="flex gap-4 mb-4">
          {(["specific", "category", "all"] as const).map((scope) => (
            <label
              key={scope}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                checked={productScope === scope}
                onChange={() => setProductScope(scope)}
                className="accent-teal-600"
              />
              <span className="text-sm text-gray-700 capitalize">
                {scope === "specific"
                  ? "Specific Products"
                  : scope === "category"
                    ? "By Category"
                    : "All Products"}
              </span>
            </label>
          ))}
        </div>

        {/* Filter */}
        <div className="mb-4">
          <ProductFilter filters={filters} onChange={setFilters} />
        </div>

        {/* Product List */}
        <ProductList
          products={products}
          selectedIds={selectedIds}
          productScope={productScope}
          loading={loading}
          onToggle={toggleProduct}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
        />
      </div>

      {/* Adjustment Controls */}
      <AdjustmentControls
        adjustmentType={adjustmentType}
        adjustmentDirection={adjustmentDirection}
        adjustmentValue={adjustmentValue}
        onTypeChange={setAdjustmentType}
        onDirectionChange={setAdjustmentDirection}
        onValueChange={setAdjustmentValue}
      />

      {/* Price Preview */}
      <PricePreview
        products={selectedProducts}
        adjustmentType={adjustmentType}
        adjustmentDirection={adjustmentDirection}
        adjustmentValue={adjustmentValue}
      />
    </div>
  );
}
