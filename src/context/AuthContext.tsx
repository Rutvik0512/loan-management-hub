
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Role } from '../types';

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Employee',
    email: 'employee@example.com',
    password: 'password',
    role: 'EMPLOYEE' as Role,
    department: 'IT',
    employeeId: 'EMP001',
    salary: 50000,
    bankDetails: {
      accountNumber: '1234567890',
      bankName: 'Example Bank',
      ifscCode: 'EXBK0001234'
    }
  },
  {
    id: '2',
    name: 'Mary Manager',
    email: 'manager@example.com',
    password: 'password',
    role: 'MANAGER' as Role,
    department: 'IT',
    employeeId: 'MGR001',
  },
  {
    id: '3',
    name: 'Frank Finance',
    email: 'finance@example.com',
    password: 'password',
    role: 'FINANCE' as Role,
    department: 'Finance',
    employeeId: 'FIN001',
  },
  {
    id: '4',
    name: 'Adam Admin',
    email: 'admin@example.com',
    password: 'password',
    role: 'ADMIN' as Role,
    department: 'Administration',
    employeeId: 'ADM001',
  }
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with provided credentials
      const foundUser = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        setIsLoading(false);
        return false;
      }
      
      // Remove password from user object before storing in state
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
