import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
    const {user, authChecked} = useAuth();
    console.log("user value",user);
    console.log("authcheck value",authChecked);
    if(!authChecked) return null;
    if(user) return <Navigate to='/' replace />;
  return <Outlet/>;
}

export default PublicRoute