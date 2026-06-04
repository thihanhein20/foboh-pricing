interface Filters {
  title: string;
  sku: string;
  subCategory: string;
  segment: string;
  brand: string;
}

interface ProductFilterProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function ProductFilter({
  filters,
  onChange,
}: ProductFilterProps) {
  function handleChange(key: keyof Filters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="grid grid-cols-5 gap-2">
      <input
        type="text"
        placeholder="Search..."
        value={filters.title}
        onChange={(e) => handleChange("title", e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <input
        type="text"
        placeholder="SKU"
        value={filters.sku}
        onChange={(e) => handleChange("sku", e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <input
        type="text"
        placeholder="Category"
        value={filters.subCategory}
        onChange={(e) => handleChange("subCategory", e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <input
        type="text"
        placeholder="Segment"
        value={filters.segment}
        onChange={(e) => handleChange("segment", e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <input
        type="text"
        placeholder="Brand"
        value={filters.brand}
        onChange={(e) => handleChange("brand", e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
  );
}
