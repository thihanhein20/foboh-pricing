import { useNavigate, useLocation } from "react-router-dom";

const pageIcons: Record<string, string> = {
  dashboard: "▦",
  orders: "📋",
  customers: "👥",
  products: "📦",
  settings: "⚙️",
};

const pageDescriptions: Record<string, string> = {
  dashboard: "Your analytics and insights overview",
  orders: "Manage and track all your wholesale orders",
  customers: "View and manage your customer accounts",
  products: "Browse and manage your product catalogue",
  settings: "Configure your account and preferences",
};

export default function ComingSoon() {
  const navigate = useNavigate();
  const location = useLocation();
  const pageName = location.pathname.replace("/", "");
  const icon = pageIcons[pageName] || "🚧";
  const description = pageDescriptions[pageName] || "This page is coming soon";

  return (
    <div className="flex flex-col items-center justify-center min-h-96 py-16">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-md w-full">
        {/* Icon */}
        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
          {icon}
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse inline-block"></span>
          Coming Soon
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 capitalize mb-2">
          {pageName}
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          {description}. We are working hard to bring this to you. Stay tuned!
        </p>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-8" />

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/pricing")}
            className="px-4 py-2 text-sm bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition-colors"
          >
            Go to Pricing
          </button>
        </div>
      </div>

      {/* Other available pages */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400 mb-3">Available now</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => navigate("/pricing")}
            className="px-3 py-1.5 text-xs bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-teal-400 hover:text-teal-600 transition-colors"
          >
            Pricing Profiles
          </button>
        </div>
      </div>
    </div>
  );
}
