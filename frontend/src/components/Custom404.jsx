import React from "react";
import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";

const Custom404 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Large 404 Text */}
        <div className="mb-8">
          <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-600 animate-pulse">
            404
          </h1>
          <div className="mt-2">
            <span className="text-6xl">🦁</span>
            <span className="text-6xl mx-2">🐘</span>
            <span className="text-6xl">🦒</span>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8 space-y-3">
          <h2 className="text-3xl font-bold text-slate-900">
            Oops! This animal escaped!
          </h2>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            The page you're looking for has wandered off into the wild. Let's
            get you back to safety.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>

          <Link
            to="/animals"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 border-2 border-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-all duration-200"
          >
            <Search className="w-5 h-5" />
            Explore Animals
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-4">Quick Links:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/about"
              className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              About Us
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/contact"
              className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Contact
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/tickets"
              className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Book Tickets
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Custom404;
