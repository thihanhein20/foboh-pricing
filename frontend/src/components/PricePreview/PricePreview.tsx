import type { Product } from "../../types";

interface PricePreviewProps {
  products: Product[];
  adjustmentType: "fixed" | "dynamic";
  adjustmentDirection: "increase" | "decrease";
  adjustmentValue: number;
}

function calculateNewPrice(
  basePrice: number,
  adjustmentType: "fixed" | "dynamic",
  adjustmentDirection: "increase" | "decrease",
  adjustmentValue: number,
): number {
  let adjustment = 0;
  if (adjustmentType === "fixed") {
    adjustment = adjustmentValue;
  } else {
    adjustment = (adjustmentValue / 100) * basePrice;
  }
  const newPrice =
    adjustmentDirection === "increase"
      ? basePrice + adjustment
      : basePrice - adjustment;
  return Math.max(0, Math.round(newPrice * 100) / 100);
}

export default function PricePreview({
  products,
  adjustmentType,
  adjustmentDirection,
  adjustmentValue,
}: PricePreviewProps) {
  if (products.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-4">
        Price Preview
      </h2>
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-4 py-2 text-gray-500 font-medium">
              Product
            </th>
            <th className="text-left px-4 py-2 text-gray-500 font-medium">
              SKU
            </th>
            <th className="text-left px-4 py-2 text-gray-500 font-medium">
              Base Price
            </th>
            <th className="text-left px-4 py-2 text-gray-500 font-medium">
              Adjustment
            </th>
            <th className="text-left px-4 py-2 text-gray-500 font-medium">
              New Price
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => {
            const newPrice = calculateNewPrice(
              product.basePrice,
              adjustmentType,
              adjustmentDirection,
              adjustmentValue,
            );
            const diff = newPrice - product.basePrice;

            return (
              <tr key={product.id}>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {product.title}
                </td>
                <td className="px-4 py-3 text-gray-400">{product.sku}</td>
                <td className="px-4 py-3 text-gray-600">
                  ${product.basePrice.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium ${
                      adjustmentDirection === "decrease"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {adjustmentDirection === "decrease" ? "-" : "+"}
                    {adjustmentType === "fixed"
                      ? `$${adjustmentValue.toFixed(2)}`
                      : `${adjustmentValue}%`}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-teal-700">
                    ${newPrice.toFixed(2)}
                  </span>
                  {diff !== 0 && (
                    <span className="text-xs text-gray-400 ml-2">
                      {diff > 0 ? "+" : ""}${diff.toFixed(2)}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
