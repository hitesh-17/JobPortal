import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
    const {user,authChecked} = useAuth();
    console.log("protected user",user)
    console.log("authchecked ",authChecked);
    if(!authChecked){
        return null;
    }
    if(!user){
        console.log("Hello")
        return <Navigate to='/login' replace/>;
    };
  return <Outlet/>;
};

export default ProtectedRoute;