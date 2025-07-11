import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router';



const PrivateRoute = ({ children }) => {
    const {user, loading} = useAuth()



    if (loading) {
        return <span className="loading loading-spinner loading-xl"></span>
    }

    if (!user) {
        return <Navigate to="/auth/login"></Navigate>
    }

    return children;
};

export default PrivateRoute;
/*
// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router';
import useAuth from '../hooks/useAuth';


const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <span className="loading loading-spinner loading-xl"></span>
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;


import React, { use } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../contexts/AuthProvider';
import Loading from '../pages/Loading';

const PrivateRoute = ({children}) => {
    const { user, loading } = use(AuthContext);
    //console.log(user);
    

    if (loading){
        return <Loading></Loading>;
    }

    if (user && user?.email){
        return children;
    }
    return <Navigate to='/auth/login'></Navigate>
};

export default PrivateRoute;
*/