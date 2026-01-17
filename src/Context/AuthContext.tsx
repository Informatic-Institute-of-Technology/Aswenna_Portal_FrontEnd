import type { ReactNode } from 'react';
import { useState } from 'react';
import type { User } from './createAuthContext';
import { AuthContext } from './createAuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  });
  const [loading] = useState(false);

  const login = async (email: string, password: string) => {
    // TODO: Replace with actual API call to your backend
    // The backend should return a JSON object with user data including the role
    // Example API call:
    // const response = await apiClient.post('/auth/login', { email, password });
    // const { user: userData } = response.data;
    
    // Simulate API call with role detection
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Demo credentials - replace with actual API call
        if (email && password) {
          // Simulate role detection based on email (for demo purposes)
          // In production, the role should come from the backend API
          let role: 'farmer' | 'investor' | 'land_owner' = 'farmer';
          
          if (email.includes('investor')) {
            role = 'investor';
          } else if (email.includes('landowner') || email.includes('land')) {
            role = 'land_owner';
          }
          
          const userData = {
            email,
            name: email.split('@')[0],
            id: Math.random().toString(36).substr(2, 9),
            role, // Role from API response
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };


  //TODO  : User Sign Up Logic
  
  // const signup = async (email: string, password: string, name: string) => {
  //   return new Promise<void>((resolve, reject) => {
  //     setTimeout(() => {
  //       if (email && password && name) {
  //         const userData = {
  //           email,
  //           name,
  //           id: Math.random().toString(36).substr(2, 9),
  //         };
  //         setUser(userData);
  //         localStorage.setItem('user', JSON.stringify(userData));
  //         resolve();
  //       } else {
  //         reject(new Error('Registration failed'));
  //       }
  //     }, 500);
  //   });
  // };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
