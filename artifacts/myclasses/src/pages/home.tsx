import { EnquiryForm } from "@/components/enquiry-form";
import { GraduationCap, CheckCircle2, Users, Target } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-orange-200 selection:text-orange-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-orange-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" data-testid="link-home-logo">
            <div className="bg-orange-100 text-orange-600 p-2 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">MyClasses</span>
          </Link>
          <div className="hidden sm:flex items-center gap-6">
            <a href="#benefits" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">Benefits</a>
            <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">Admin Login</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background pt-12 pb-20 lg:pt-24 lg:pb-32">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] rounded-full bg-orange-100/50 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] rounded-full bg-orange-50/60 blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              {/* Hero Copy */}
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-medium text-sm mb-6 animate-fade-in">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                  Trusted by parents across India
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 tracking-tight">
                  Start Your Learning Journey with <span className="text-orange-500">MyClasses</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                  Expert home tutors for SSC, CBSE and ICSE boards. Personalised attention and proven results that build your child's confidence and academic success.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-8" id="benefits">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">Expert, verified tutors</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">Results-oriented approach</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">1-on-1 personalized attention</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">All major boards & subjects</span>
                  </div>
                </div>
              </div>

              {/* Hero Form */}
              <div className="lg:ml-auto w-full max-w-xl">
                <EnquiryForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-orange-100 py-8 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <GraduationCap className="h-5 w-5 text-orange-500" />
            MyClasses
          </div>
          <p className="text-gray-500 text-sm">
            Copyright MyClasses 2025. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
