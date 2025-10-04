import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import AddressVerification from "./components/pages/AddressVerification";
import { Toaster } from "sonner";
import { cn } from "./lib/utils";

// Icons
import { Shield, Home, Search, Users, BarChart3 } from "lucide-react";

// Main Navigation Component
const Navigation = () => {
  const location = useLocation();
  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/verify", label: "Verify Address", icon: Search },
  ];

  return (
    <nav className="bg-card border-b px-6 py-3">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold">VeriScore</h1>
        </Link>
        <div className="flex space-x-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                )}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};


// Main App Component
function App() {
  return (
    <div className="min-h-screen bg-secondary/50">
      <BrowserRouter>
        <Navigation />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/verify" element={<AddressVerification />} />
            {/* Add other routes like /customers here when ready */}
          </Routes>
        </main>
        <Toaster richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;