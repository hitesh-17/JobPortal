import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Jobs from "../pages/Jobs";
import SavedJobs from "../pages/SavedJobs";
import Register from "../pages/Register";
import MyApplication from "../pages/MyApplication";
import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";
import JobDetails from "../pages/JobDetails";
import ProfilePage from "../pages/ProfilePage";
import RecruiterDashBoard from "../pages/RecruiterDashBoard";
import MyJobs from "../pages/MyJobs";
import CreateJob from "../pages/CreateJob";
import JobApplicants from "../pages/JobApplicants";
import EditJob from "../pages/EditJob";
import Home from "../pages/Home";

const AppRoute = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home/>} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={["jobseeker"]} />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/my-applications" element={<MyApplication />} />
          </Route>
          <Route element={<RoleRoute allowedRoles={["recruiter"]} />}>
            <Route
              path="/recruiter/dashboard"
              element={<RecruiterDashBoard />}
            />
            <Route path="/recruiter/jobs" element={<MyJobs />} />
            <Route path="/recruiter/jobs/create" element={<CreateJob />} />
            <Route path="/recruiter/jobs/create" element={<CreateJob />} />
            <Route
              path="/recruiter/jobs/:jobId/applications"
              element={<JobApplicants />}/>
              <Route
              path="/recruiter/jobs/:jobId/edit"
              element={<EditJob />}/>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoute;
