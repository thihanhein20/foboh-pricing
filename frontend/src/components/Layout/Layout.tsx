import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

interface LayoutProps {
  onLogout: () => void;
}

export default function Layout({ onLogout }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} />
      <main className="ml-56 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
