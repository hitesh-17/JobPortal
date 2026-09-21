import React from 'react'
import { useAuth } from '../context/AuthContext'
import ResumeUpload from '../components/ResumeUpload';

const ProfilePage = () => {
const {user} = useAuth();
  return (
     <section className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your account and resume.
          </p>
        </div>

        {/* User information */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Personal Information
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="font-medium text-gray-900">
                {user?.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="font-medium text-gray-900">
                {user?.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Account Type
              </p>

              <p className="font-medium capitalize text-gray-900">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Resume */}
        {user?.role === "jobseeker" && <ResumeUpload />}

      </div>
    </section>
  )
}

export default ProfilePage