import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize default credentials on first load
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Check if default admin accounts exist
    const hasRecruiterAdmin = users.some(u => u.email === 'admin@mail.com' && u.role === 'recruiter');
    const hasCandidateAdmin = users.some(u => u.email === 'admin@mail.com' && u.role === 'candidate');
    
    // Create default accounts if they don't exist
    if (!hasRecruiterAdmin) {
      users.push({
        email: 'admin@mail.com',
        password: 'admin123',
        role: 'recruiter',
        name: 'Admin Recruiter',
        id: 'recruiter_admin_001'
      });
    }
    
    if (!hasCandidateAdmin) {
      users.push({
        email: 'admin@mail.com',
        password: 'admin123',
        role: 'candidate',
        name: 'Admin Candidate',
        id: 'candidate_admin_001'
      });
    }
    
    // Save updated users list
    if (!hasRecruiterAdmin || !hasCandidateAdmin) {
      localStorage.setItem('registeredUsers', JSON.stringify(users));
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password, role) => {
    // Get all registered users
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Find user by email and password
    const existingUser = users.find(u => u.email === email && u.password === password);
    
    if (!existingUser) {
      return Promise.reject(new Error('Invalid email or password'));
    }
    
    // Check if the role matches
    if (existingUser.role !== role) {
      return Promise.reject(new Error(`This account is registered as a ${existingUser.role}. Please use the ${existingUser.role} login page.`));
    }
    
    // Create user session (without password)
    const userData = {
      email: existingUser.email,
      role: existingUser.role,
      name: existingUser.name,
      id: existingUser.id
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return Promise.resolve(userData);
  };

  const signup = (name, email, password, role) => {
    // Get all registered users
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return Promise.reject(new Error('Email already registered'));
    }
    
    // Create new user account
    const newUser = {
      email,
      password, // In production, this should be hashed!
      role,
      name,
      id: Date.now()
    };
    
    // Add to registered users
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    // Create user session (without password)
    const userData = {
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      id: newUser.id
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return Promise.resolve(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
    isRecruiter: user?.role === 'recruiter',
    isCandidate: user?.role === 'candidate'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
