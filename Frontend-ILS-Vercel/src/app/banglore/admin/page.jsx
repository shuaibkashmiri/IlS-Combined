"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminCourses from "./courses";
import AdminDashboard from "./dashboard";
import AdminVideos from "./videos";
import AdminStudents from "./students";
import AdminInstructors from "./instructors";
import AdminSettings from "./settings";
import { MdBarChart, MdSettings, MdMenu, MdClose } from "react-icons/md";
import { FiBook } from "react-icons/fi";
import { FaVideo, FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";

const Sidebar = ({
  activeTab,
  setActiveTab,
  showCreateCourse,
  setShowCreateCourse,
  showAddVideo,
  setShowAddVideo,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const pathname = usePathname();
  const menuItems = [
    {
      icon: MdBarChart,
      label: "Dashboard",
      value: "dashboard",
      path: "/banglore/admin",
      component: <AdminDashboard />,
    },
    {
      icon: FiBook,
      label: "Courses",
      value: "courses",
      path: "/banglore/admin/courses",
      component: (
        <AdminCourses
          showCreateCourse={showCreateCourse}
          setShowCreateCourse={setShowCreateCourse}
        />
      ),
    },
    {
      icon: FaVideo,
      label: "Videos",
      value: "videos",
      path: "/banglore/admin/videos",
      component: (
        <AdminVideos
          showAddVideo={showAddVideo}
          setShowAddVideo={setShowAddVideo}
        />
      ),
    },
    {
      icon: FaUserGraduate,
      label: "Students",
      value: "students",
      path: "/banglore/admin/students",
      component: <AdminStudents />,
    },
    {
      icon: FaChalkboardTeacher,
      label: "Instructors",
      value: "instructors",
      path: "/banglore/admin/instructors",
      component: <AdminInstructors />,
    },
    {
      icon: MdSettings,
      label: "Settings",
      value: "settings",
      path: "/banglore/admin/settings",
      component: <AdminSettings />,
    },
  ];

  // Update active tab based on current path
  useEffect(() => {
    const currentPath = pathname;
    const matchingMenuItem = menuItems.find(
      (item) => item.path === currentPath
    );
    if (matchingMenuItem) {
      setActiveTab(matchingMenuItem.value);
    }
  }, [pathname]);

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#164758]">Admin Panel</h2>
              <button
                className="lg:hidden text-gray-500 hover:text-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MdClose size={24} />
              </button>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((menuItem) => (
              <button
                key={menuItem.value}
                className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                  activeTab === menuItem.value
                    ? "bg-[#00965f] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => {
                  setActiveTab(menuItem.value);
                  setIsMobileMenuOpen(false);
                }}
                aria-label={menuItem.label}
              >
                <menuItem.icon className="mr-3 h-5 w-5" />
                <span className="font-medium">{menuItem.label}</span>
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#00965f] flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const MainContent = ({
  activeTab,
  menuItems,
  showCreateCourse,
  setShowCreateCourse,
  showAddVideo,
  setShowAddVideo,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  return (
    <main className="flex-1 min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-gray-500 hover:text-gray-700"
        >
          <MdMenu size={24} />
        </button>
        <h1 className="text-xl font-bold text-[#164758]">
          {menuItems.find((item) => item.value === activeTab)?.label}
        </h1>
        <div className="w-8" /> {/* Spacer for alignment */}
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Dynamic Content Rendering */}
          {menuItems.map((menuItem) => {
            if (menuItem.value === activeTab && menuItem.component !== null) {
              return <div key={menuItem.value}>{menuItem.component}</div>;
            }
            return null;
          })}
        </div>
      </div>
    </main>
  );
};

function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      icon: MdBarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <AdminDashboard />,
    },
    {
      icon: FiBook,
      label: "Courses",
      value: "courses",
      component: (
        <AdminCourses
          showCreateCourse={showCreateCourse}
          setShowCreateCourse={setShowCreateCourse}
        />
      ),
    },
    {
      icon: FaVideo,
      label: "Videos",
      value: "videos",
      component: (
        <AdminVideos
          showAddVideo={showAddVideo}
          setShowAddVideo={setShowAddVideo}
        />
      ),
    },
    {
      icon: FaUserGraduate,
      label: "Students",
      value: "students",
      component: <AdminStudents />,
    },
    {
      icon: FaChalkboardTeacher,
      label: "Instructors",
      value: "instructors",
      component: <AdminInstructors />,
    },
    {
      icon: MdSettings,
      label: "Settings",
      value: "settings",
      component: <AdminSettings />,
    },
  ];

  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showCreateCourse={showCreateCourse}
        setShowCreateCourse={setShowCreateCourse}
        showAddVideo={showAddVideo}
        setShowAddVideo={setShowAddVideo}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <MainContent
        activeTab={activeTab}
        menuItems={menuItems}
        showCreateCourse={showCreateCourse}
        setShowCreateCourse={setShowCreateCourse}
        showAddVideo={showAddVideo}
        setShowAddVideo={setShowAddVideo}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
    </div>
  );
}

export default Admin;