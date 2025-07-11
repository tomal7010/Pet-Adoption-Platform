import React, { use } from 'react';
import { AuthContext } from '../contexts/AuthProvider';


const useAuth = () => {
    const authInfo = use(AuthContext);
    return authInfo;
};

export default useAuth;

/*
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthProvider';


const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
*/