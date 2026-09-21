import React from "react";
import "./App.css";
import AppRoute from "./routes/AppRoute";
import { useAuth } from "./context/AuthContext";
import AuthLoadingScreen from "./pages/AuthLoadingScreen ";

const App = () => {
  const { loading } = useAuth();
  return  loading ?  <AuthLoadingScreen/> : <AppRoute/>

};
  
export default App;
