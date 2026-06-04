interface CustomerScopeProps {
  customerScope: "specific" | "group" | "all";
  customerGroup: string;
  customerId: string;
  onScopeChange: (scope: "specific" | "group" | "all") => void;
  onGroupChange: (group: string) => void;
  onCustomerIdChange: (id: string) => void;
}

export default function CustomerScope({
  customerScope,
  customerGroup,
  customerId,
  onScopeChange,
  onGroupChange,
  onCustomerIdChange,
}: CustomerScopeProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-4">
        Assign Customers
      </h2>

      {/* Scope selector */}
      <div className="flex gap-4 mb-4">
        {(["all", "group", "specific"] as const).map((scope) => (
          <label key={scope} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={customerScope === scope}
              onChange={() => onScopeChange(scope)}
              className="accent-teal-600"
            />
            <span className="text-sm text-gray-700">
              {scope === "all"
                ? "All Customers"
                : scope === "group"
                  ? "Customer Group"
                  : "Specific Customer"}
            </span>
          </label>
        ))}
      </div>

      {/* Group input */}
      {customerScope === "group" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Group
          </label>
          <input
            type="text"
            value={customerGroup}
            onChange={(e) => onGroupChange(e.target.value)}
            placeholder="e.g. Independent Retailers"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      )}

      {/* Specific customer input */}
      {customerScope === "specific" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer ID
          </label>
          <input
            type="text"
            value={customerId}
            onChange={(e) => onCustomerIdChange(e.target.value)}
            placeholder="e.g. c1"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      )}
    </div>
  );
}
