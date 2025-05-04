
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/auth/LoginForm';

const Index = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container flex flex-col lg:flex-row items-center justify-center px-4 py-8">
        <div className="w-full lg:w-1/2 lg:pr-12 mb-8 lg:mb-0 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
            <span className="block">LoanNexus</span>
            <span className="text-secondary">Employee Hub</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Simplifying loan management for employees and organizations.
            Apply, approve, and track employee loans with ease.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
              <span>Easy Application</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-secondary mr-2"></div>
              <span>Quick Approval</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-accent mr-2"></div>
              <span>Seamless Tracking</span>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 lg:pl-8 flex justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
