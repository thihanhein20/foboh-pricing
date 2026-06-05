import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getProducts } from "../../services/api/api";
import type { Product, ProfileFormValues, ProductFilters } from "../../types";
import ProductFilter from "../ProductFilter/ProductFilter";
import ProductList from "../ProductList/ProductList";
import AdjustmentControls from "../AdjustmentControls/AdjustmentControls";
import PricePreview from "../PricePreview/PricePreview";
import CustomerScope from "../CustomerScope/CustomerScope";

interface ProfileFormProps {
  initialValues?: ProfileFormValues;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
  saving: boolean;
  breadcrumb: string;
  title: string;
  submitLabel: string;
}

export default function ProfileForm({
  initialValues,
  onSubmit,
  saving,
  breadcrumb,
  title,
  submitLabel,
}: ProfileFormProps) {
  const navigate = useNavigate();

  const [name, setName] = useState(initialValues?.name ?? "");
  const [adjustmentType, setAdjustmentType] = useState<"fixed" | "dynamic">(
    initialValues?.adjustmentType ?? "fixed",
  );
  const [adjustmentDirection, setAdjustmentDirection] = useState<"increase" | "decrease">(
    initialValues?.adjustmentDirection ?? "decrease",
  );
  const [adjustmentValue, setAdjustmentValue] = useState<number>(
    initialValues?.adjustmentValue ?? 0,
  );
  const [productScope, setProductScope] = useState<"specific" | "category" | "all">(
    initialValues?.productScope ?? "specific",
  );
  const [category, setCategory] = useState(initialValues?.category ?? "");
  const [customerScope, setCustomerScope] = useState<"specific" | "group" | "all">(
    initialValues?.customerScope ?? "all",
  );
  const [customerGroup, setCustomerGroup] = useState(initialValues?.customerGroup ?? "");
  const [customerId, setCustomerId] = useState(initialValues?.customerId ?? "");
  const [selectedIds, setSelectedIds] = useState<string[]>(initialValues?.productIds ?? []);

  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({
    title: "",
    sku: "",
    subCategory: "",
    segment: "",
    brand: "",
  });
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  async function fetchProducts() {
    try {
      setLoadingProducts(true);
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== ""),
      );
      const data = await getProducts(activeFilters);
      setProducts(data);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? (err.response?.data?.error ?? "Failed to load products")
          : "Failed to load products",
      );
    } finally {
      setLoadingProducts(false);
    }
  }

  async function handleSubmit() {
    if (!name) {
      setError("name is required and must be a string");
      return;
    }
    if (productScope === "category" && !category) {
      setError("category is required when productScope is category");
      return;
    }
    if (productScope === "specific" && selectedIds.length === 0) {
      setError("productIds is required when productScope is specific");
      return;
    }

    try {
      setError("");
      await onSubmit({
        name,
        adjustmentType,
        adjustmentDirection,
        adjustmentValue,
        productScope,
        productIds: productScope === "specific" ? selectedIds : undefined,
        category: productScope === "category" ? category : undefined,
        customerScope,
        customerId: customerScope === "specific" ? customerId : undefined,
        customerGroup: customerScope === "group" ? customerGroup : undefined,
      });
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? (err.response?.data?.error ?? "Something went wrong")
          : "Something went wrong",
      );
    }
  }

  const selectedProducts =
    productScope === "specific"
      ? products.filter((p) => selectedIds.includes(p.id))
      : productScope === "category"
      ? products.filter((p) => category !== "" && p.subCategory === category)
      : products;

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm text-gray-400 mb-1">
            Pricing Profiles &gt; {breadcrumb}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/pricing")}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 text-sm bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Basic Pricing Profile</h2>
        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. 10% off Wine for VIP customers"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <CustomerScope
        customerScope={customerScope}
        customerGroup={customerGroup}
        customerId={customerId}
        onScopeChange={setCustomerScope}
        onGroupChange={setCustomerGroup}
        onCustomerIdChange={setCustomerId}
      />

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Select Product Pricing</h2>

        <div className="flex gap-4 mb-4">
          {(["specific", "category", "all"] as const).map((scope) => (
            <label key={scope} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={productScope === scope}
                onChange={() => {
                  setProductScope(scope);
                  setSelectedIds([]);
                  setCategory("");
                }}
                className="accent-teal-600"
              />
              <span className="text-sm text-gray-700">
                {scope === "specific"
                  ? "Specific Products"
                  : scope === "category"
                  ? "By Category"
                  : "All Products"}
              </span>
            </label>
          ))}
        </div>

        {productScope === "category" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category this profile applies to
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="">Select a category...</option>
              <option value="Wine Red">Wine Red</option>
              <option value="Wine Sparkling">Wine Sparkling</option>
              <option value="Wine White">Wine White</option>
              <option value="Wine Port/Dessert">Wine Port/Dessert</option>
            </select>
          </div>
        )}

        <div className="mb-4">
          <ProductFilter filters={filters} onChange={setFilters} />
        </div>

        <ProductList
          products={products}
          selectedIds={selectedIds}
          productScope={productScope}
          loading={loadingProducts}
          onToggle={(pid) =>
            setSelectedIds((prev) =>
              prev.includes(pid) ? prev.filter((p) => p !== pid) : [...prev, pid],
            )
          }
          onSelectAll={() => setSelectedIds(products.map((p) => p.id))}
          onDeselectAll={() => setSelectedIds([])}
        />
      </div>

      <AdjustmentControls
        adjustmentType={adjustmentType}
        adjustmentDirection={adjustmentDirection}
        adjustmentValue={adjustmentValue}
        onTypeChange={setAdjustmentType}
        onDirectionChange={setAdjustmentDirection}
        onValueChange={setAdjustmentValue}
      />

      <PricePreview
        products={selectedProducts}
        adjustmentType={adjustmentType}
        adjustmentDirection={adjustmentDirection}
        adjustmentValue={adjustmentValue}
      />
    </div>
  );
}
