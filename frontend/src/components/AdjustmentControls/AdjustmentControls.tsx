interface AdjustmentControlsProps {
  adjustmentType: "fixed" | "dynamic";
  adjustmentDirection: "increase" | "decrease";
  adjustmentValue: number;
  onTypeChange: (type: "fixed" | "dynamic") => void;
  onDirectionChange: (direction: "increase" | "decrease") => void;
  onValueChange: (value: number) => void;
}

export default function AdjustmentControls({
  adjustmentType,
  adjustmentDirection,
  adjustmentValue,
  onTypeChange,
  onDirectionChange,
  onValueChange,
}: AdjustmentControlsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-4">
        Set Price Adjustment
      </h2>

      {/* Fixed vs Dynamic */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Adjustment Mode</p>
        <div className="flex gap-4">
          {(["fixed", "dynamic"] as const).map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                checked={adjustmentType === type}
                onChange={() => onTypeChange(type)}
                className="accent-teal-600"
              />
              <span className="text-sm text-gray-700">
                {type === "fixed" ? "Fixed ($)" : "Dynamic (%)"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Increase vs Decrease */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Direction</p>
        <div className="flex gap-4">
          {(["increase", "decrease"] as const).map((dir) => (
            <label key={dir} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={adjustmentDirection === dir}
                onChange={() => onDirectionChange(dir)}
                className="accent-teal-600"
              />
              <span className="text-sm text-gray-700 capitalize">{dir}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Value */}
      <div>
        <p className="text-sm text-gray-500 mb-2">
          Adjustment Value {adjustmentType === "fixed" ? "($)" : "(%)"}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {adjustmentType === "fixed" ? "$" : "%"}
          </span>
          <input
            type="number"
            min={0}
            value={adjustmentValue}
            onChange={(e) => onValueChange(parseFloat(e.target.value) || 0)}
            className="w-40 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>
    </div>
  );
}
