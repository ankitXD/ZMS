import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <Toaster
        position="top-right"
        gutter={8}
        containerClassName="!z-[99999]"
        toastOptions={{ duration: 2500 }}
      />
      {/* On desktop, offset content by sidebar width (w-48 => 12rem). Keep 0 on mobile where sidebar is overlaid. */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-48">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet /> {/* 🔥 This is where nested route pages will render */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
