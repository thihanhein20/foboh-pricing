import { useState } from "react";
import SingleProductTab from "./SingleProductTab";
import PriceSheetTab from "./PriceSheetTab";

type Tab = "single" | "sheet";

const TABS: { id: Tab; label: string }[] = [
  { id: "single", label: "Single Product" },
  { id: "sheet", label: "Full Price Sheet" },
];

interface ResolveModalProps {
  onClose: () => void;
}

export default function ResolveModal({ onClose }: ResolveModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("single");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className={`bg-white rounded-xl shadow-xl w-full mx-4 transition-all duration-200 ${
        activeTab === "sheet" ? "max-w-3xl" : "max-w-lg"
      }`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Resolve Price</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Find the effective price for a customer and product
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-light"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-1 px-6 pt-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-teal-700 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="px-6 py-4">
          {activeTab === "single" ? <SingleProductTab /> : <PriceSheetTab />}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
