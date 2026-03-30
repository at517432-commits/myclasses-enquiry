import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2, GraduationCap } from "lucide-react";

export default function ThankYou() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <header className="w-full border-b border-orange-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" data-testid="link-home-logo">
            <div className="bg-orange-100 text-orange-600 p-2 rounded-lg transition-colors duration-300">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">MyClasses</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-orange-500/5 border border-orange-100 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-orange-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Thank You!</h1>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Your free demo class request has been received. Our team will contact you within 24 hours.
          </p>
          
          <p className="text-sm font-medium text-gray-500 mb-8">
            - The MyClasses Team
          </p>

          <Link href="/">
            <Button className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5" data-testid="btn-back-home">
              Go Back to Homepage
            </Button>
          </Link>
        </div>
      </main>

      <footer className="bg-white border-t border-orange-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Copyright MyClasses {new Date().getFullYear()}.
          </p>
        </div>
      </footer>
    </div>
  );
}
