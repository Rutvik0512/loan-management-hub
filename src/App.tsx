
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import MyLoans from "./pages/MyLoans";
import ApplyLoan from "./pages/ApplyLoan";
import LoanRequests from "./pages/LoanRequests";
import ProcessLoans from "./pages/ProcessLoans";
import ManageLoans from "./pages/ManageLoans";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import { useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      {isAuthenticated && <Sidebar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {isAuthenticated && (
          <>
            {/* Employee routes */}
            <Route path="/my-loans" element={<MyLoans />} />
            <Route path="/apply-loan" element={<ApplyLoan />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Manager routes */}
            {user?.role === 'MANAGER' && (
              <Route path="/loan-requests" element={<LoanRequests />} />
            )}
            
            {/* Finance routes */}
            {user?.role === 'FINANCE' && (
              <Route path="/process-loans" element={<ProcessLoans />} />
            )}
            
            {/* Admin routes */}
            {user?.role === 'ADMIN' && (
              <Route path="/manage-loans" element={<ManageLoans />} />
            )}
          </>
        )}
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
