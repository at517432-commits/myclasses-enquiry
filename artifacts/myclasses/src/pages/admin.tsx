import { useGetEnquiries } from "@workspace/api-client-react";
import { GraduationCap, LayoutDashboard, Loader2, RefreshCcw, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ADMIN_PASSWORD = "numpy₹#@!1234";
const SESSION_KEY = "mc_admin_auth";

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      onSuccess();
    } else {
      setError("Incorrect password. Please try again.");
      setIsShaking(true);
      setPassword("");
      setTimeout(() => setIsShaking(false), 500);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className={`w-full max-w-sm ${isShaking ? "animate-bounce" : ""}`}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-orange-500 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-3">
              <Lock className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Admin Access</h1>
            <p className="text-orange-100 text-sm mt-1">MyClasses Dashboard</p>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter admin password"
                  className="pr-10"
                  autoFocus
                  data-testid="input-admin-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  data-testid="btn-toggle-password-visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-1.5" data-testid="text-login-error">{error}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              data-testid="btn-admin-login"
            >
              Sign In
            </Button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          MyClasses Admin — Authorised Personnel Only
        </p>
      </div>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { data: enquiries, isLoading, refetch, isRefetching } = useGetEnquiries();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50/50">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" data-testid="link-home-logo">
            <div className="bg-gray-100 text-gray-600 p-2 rounded-lg group-hover:bg-gray-200 transition-colors duration-300">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">MyClasses Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600 hidden sm:block">Dashboard</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="text-gray-500 hover:text-red-600 hover:border-red-200"
              data-testid="btn-admin-logout"
            >
              <Lock className="h-4 w-4 mr-1.5" />
              Lock
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Enquiries</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all demo class requests.</p>
          </div>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="rounded-xl"
            data-testid="btn-refresh"
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500" data-testid="admin-loading">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-4" />
              <p>Loading enquiries...</p>
            </div>
          ) : !enquiries || enquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500" data-testid="admin-empty">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <LayoutDashboard className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-1">No enquiries yet</p>
              <p className="text-sm">When someone requests a demo class, it will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">Date</TableHead>
                    <TableHead className="font-semibold text-gray-900">Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Contact Info</TableHead>
                    <TableHead className="font-semibold text-gray-900">Board &amp; Class</TableHead>
                    <TableHead className="font-semibold text-gray-900">Subject</TableHead>
                    <TableHead className="font-semibold text-gray-900">Location</TableHead>
                    <TableHead className="font-semibold text-gray-900 max-w-[200px]">Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enquiries.map((enquiry) => (
                    <TableRow key={enquiry.id} className="hover:bg-gray-50/50 transition-colors" data-testid={`row-enquiry-${enquiry.id}`}>
                      <TableCell className="whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(enquiry.createdAt), "MMM d, yyyy")}
                        <div className="text-xs text-gray-400">{format(new Date(enquiry.createdAt), "h:mm a")}</div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">{enquiry.name}</TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">{enquiry.phone}</div>
                        <div className="text-sm text-gray-500">{enquiry.email}</div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {enquiry.boardClass}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">{enquiry.subject}</TableCell>
                      <TableCell className="text-sm text-gray-700">{enquiry.location}</TableCell>
                      <TableCell className="text-sm text-gray-600 max-w-[200px] truncate" title={enquiry.message || ""}>
                        {enquiry.message || <span className="text-gray-400 italic">No message</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Copyright MyClasses 2025. Admin Dashboard.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
