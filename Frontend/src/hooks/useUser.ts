import { useState, useEffect } from "react";

export interface UserProfile {
  id?: number;
  username?: string;
  email?: string;
  role?: string;
}

export function useUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserFromStorage = () => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserRole = localStorage.getItem("userRole");
    const storedUser = localStorage.getItem("user");

    setUserId(storedUserId);
    setUserRole(storedUserRole);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Gagal parsing data user dari localStorage", e);
      }
    }
  };

  useEffect(() => {
    loadUserFromStorage();
    setLoading(false);
  }, []);

  const refreshUser = () => {
    loadUserFromStorage();
  };

  return {
    userId,
    userRole,
    user,
    loading,
    refreshUser,
  };
}
