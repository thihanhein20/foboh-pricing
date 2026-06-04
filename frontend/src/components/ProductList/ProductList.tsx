import type { Product } from "../../types";

interface ProductListProps {
  products: Product[];
  selectedIds: string[];
  productScope: "specific" | "category" | "all";
  loading: boolean;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export default function ProductList({
  products,
  selectedIds,
  productScope,
  loading,
  onToggle,
  onSelectAll,
  onDeselectAll,
}: ProductListProps) {
  if (loading) {
    return <div className="text-gray-400 text-sm">Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-gray-400 text-sm text-center py-6">
        No products found
      </div>
    );
  }

  const showCheckboxes = productScope !== "all";

  return (
    <div>
      {/* Select all / Deselect all */}
      {showCheckboxes && (
        <div className="flex gap-4 mb-3">
          <button
            onClick={onSelectAll}
            className="text-sm text-teal-600 hover:text-teal-800"
          >
            Select All
          </button>
          <button
            onClick={onDeselectAll}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Deselect All
          </button>
          {selectedIds.length > 0 && (
            <span className="text-sm text-gray-500">
              {selectedIds.length} product(s) selected
            </span>
          )}
        </div>
      )}

      {/* Product list */}
      <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => showCheckboxes && onToggle(product.id)}
            className={`flex items-center gap-4 px-4 py-3 transition-colors ${
              showCheckboxes ? "cursor-pointer hover:bg-gray-50" : ""
            } ${selectedIds.includes(product.id) ? "bg-teal-50" : ""}`}
          >
            {showCheckboxes && (
              <input
                type="checkbox"
                checked={selectedIds.includes(product.id)}
                onChange={() => onToggle(product.id)}
                onClick={(e) => e.stopPropagation()}
                className="accent-teal-600"
              />
            )}
            <div className="flex-1">
              <div className="font-medium text-sm text-gray-800">
                {product.title}
              </div>
              <div className="text-xs text-gray-400">
                SKU: {product.sku} · {product.subCategory} · {product.brand}
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600">
              ${product.basePrice.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
