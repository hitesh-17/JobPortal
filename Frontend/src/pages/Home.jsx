import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HeroHome from "../components/HeroHome";
import UserHero from "../components/UserHero";

const Home = () => {
  const { user, authChecked } = useAuth();
  if (!authChecked) {
    return null;
  }
  return (
    <div>
      <UserHero/>
      {/* {user ? <UserHero/> : <HeroHome />} */}

      {/* Features */}

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything You Need
            </h2>

            <p className="mt-3 text-gray-600">
              A simple platform to connect talent with opportunities.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Feature 1 */}

            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-xl">
                🔎
              </div>

              <h3 className="text-xl font-semibold text-gray-900">Find Jobs</h3>

              <p className="mt-3 leading-7 text-gray-600">
                Search and filter jobs based on your skills, experience and
                preferred location.
              </p>
            </div>

            {/* Feature 2 */}

            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-xl">
                📝
              </div>

              <h3 className="text-xl font-semibold text-gray-900">
                Apply Easily
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Upload your resume and apply for jobs without complicated
                processes.
              </p>
            </div>

            {/* Feature 3 */}

            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-xl">
                📊
              </div>

              <h3 className="text-xl font-semibold text-gray-900">
                Track Applications
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Keep track of your applications and see their current status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Find Your Next Opportunity?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Create your HireHub account and start exploring opportunities today.
          </p>

          <Link
            to="/jobs"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-gray-100"
          >
            Explore Jobs
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
