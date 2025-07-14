import { Navigate } from 'react-router';
import useAdminCheck from './useAdminCheck';


const AdminRoute = ({ children }) => {
  const { isAdmin, isLoading } = useAdminCheck();

  if (isLoading) {
    return <div className="text-center py-10">Loading admin check...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
