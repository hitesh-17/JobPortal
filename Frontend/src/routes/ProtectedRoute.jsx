import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
    const {user,authChecked} = useAuth();
    if(!authChecked){
        return null;
    }
    if(!user){  
        return <Navigate to='/login' replace/>;
    };
  return <Outlet/>;
};

export default ProtectedRoute;