import { Outlet } from "react-router-dom";
import { UserSidebar } from "@/components/user/UserSidebar";

export default function UserLayout() {
  return (
    <div className="flex min-h-screen bg-white font-sans">
      <UserSidebar />
      {/* Main content area — adds top padding on mobile for the fixed header bar */}
      <div className="flex-1 overflow-auto bg-white">
        <main className="px-4 py-6 pt-20 sm:px-6 lg:px-8 lg:py-8 lg:pt-8 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
