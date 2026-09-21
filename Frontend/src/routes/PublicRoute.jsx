import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
    const {user, authChecked} = useAuth();
    if(!authChecked) return null;
    if(user) return <Navigate to='/' replace />;
  return <Outlet/>;
}

export default PublicRoute