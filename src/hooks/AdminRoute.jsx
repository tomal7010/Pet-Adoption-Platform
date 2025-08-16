import { Navigate } from 'react-router';
import useAdminCheck from './useAdminCheck';


const AdminRoute = ({ children }) => {
  const { isAdmin, isLoading } = useAdminCheck();

  if (isLoading) {
    return <div className="text-center py-10">


      <span className="loading loading-bars loading-xs"></span>
      <span className="loading loading-bars loading-sm"></span>
      <span className="loading loading-bars loading-md"></span>
      <span className="loading loading-bars loading-lg"></span>
      <span className="loading loading-bars loading-xl"></span>


    </div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
