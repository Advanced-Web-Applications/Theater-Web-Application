import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('owner' | 'staff' | 'customer')[];
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const role = data.role;
          setUserRole(role);

          // Check if user's role is allowed
          if (allowedRoles.includes(role)) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } else {
          // Token invalid
          localStorage.removeItem('token');
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        localStorage.removeItem('token');
        setIsAuthorized(false);
      }
    };

    verifyAuth();
  }, [allowedRoles]);

  // Still loading
  if (isAuthorized === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: '#00BCD4'
      }}>
        Loading...
      </div>
    );
  }

  // Not authorized - redirect based on user role or to login
  if (!isAuthorized) {
    if (userRole === 'customer') {
      return <Navigate to="/home" replace />;
    } else if (userRole === 'staff') {
      return <Navigate to="/StaffHomePage" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  // Authorized
  return <>{children}</>;
}
