import { useGetEnquiries } from "@workspace/api-client-react";
import { GraduationCap, LayoutDashboard, Loader2, RefreshCcw } from "lucide-react";
import { Link } from "wouter";
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

export default function Admin() {
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
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Dashboard</span>
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
            <RefreshCcw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
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
                    <TableHead className="font-semibold text-gray-900">Board & Class</TableHead>
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
