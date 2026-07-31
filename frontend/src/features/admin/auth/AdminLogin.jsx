import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate authentication
    setTimeout(() => {
      // Here you would typically dispatch a login action that sets the user role to 'admin'
      localStorage.setItem("role", "admin"); // Mocking admin session
      navigate("/admin");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects specifically for Admin */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-rose-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <ShieldCheck className="w-8 h-8 text-rose-500" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-white">
          DeployX Admin
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Authorized personnel only.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-rose-900/10 sm:rounded-2xl sm:px-10 border border-slate-800/80">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300"
              >
                Administrator Email
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue="admin@deployx.dev"
                  className="block w-full rounded-xl border-0 py-2.5 pl-10 bg-slate-950/50 text-white shadow-sm ring-1 ring-inset ring-slate-800 focus:ring-2 focus:ring-inset focus:ring-rose-500 sm:text-sm sm:leading-6 transition-all"
                  placeholder="admin@company.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300"
              >
                Secure Password
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  defaultValue="hunter2"
                  className="block w-full rounded-xl border-0 py-2.5 pl-10 bg-slate-950/50 text-white shadow-sm ring-1 ring-inset ring-slate-800 focus:ring-2 focus:ring-inset focus:ring-rose-500 sm:text-sm sm:leading-6 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-800 bg-slate-950/50 text-rose-500 focus:ring-rose-500 focus:ring-offset-slate-900"
                />

                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-slate-400"
                >
                  Remember me on this device
                </label>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center bg-rose-600 hover:bg-rose-500 text-white border-transparent focus:ring-rose-500/20 shadow-lg shadow-rose-900/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Secure Login
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Access attempts are logged and monitored. Return to{" "}
              <a
                href="/login"
                className="text-rose-400 hover:text-rose-300 transition-colors"
              >
                Public Login
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
