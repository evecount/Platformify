
import Link from 'next/link';
import { Globe, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background py-20 lg:py-32">
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6 animate-in fade-in slide-in-from-bottom-3">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                The Future of White-label Marketplaces
              </div>
              <h1 className="text-4xl font-headline font-bold tracking-tight text-foreground sm:text-6xl mb-6">
                Launch Your Own <span className="text-primary italic">Booking Empire</span> in Minutes
              </h1>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Platformify empowers you to create custom-branded booking platforms for anything—from wedding venues in Bali to local workshop spaces. Total control, zero code.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="h-12 px-8 text-base gap-2 w-full sm:w-auto" asChild>
                  <Link href="/dashboard">
                    Get Started Free <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 text-base w-full sm:w-auto">
                  View Live Demo
                </Button>
              </div>
            </div>

            <div className="mt-20 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl opacity-30" />
              <div className="relative rounded-2xl border bg-card shadow-2xl overflow-hidden aspect-video mx-auto max-w-5xl">
                <img 
                  src="https://picsum.photos/seed/h1/1200/800" 
                  alt="Platform Dashboard" 
                  className="w-full h-full object-cover"
                  data-ai-hint="modern dashboard"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-muted/30 py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-headline font-bold mb-4">Everything You Need to Scale</h2>
              <p className="text-muted-foreground">Focus on your business strategy while we handle the complex booking infrastructure.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "White-label Everything",
                  desc: "Custom domains, logos, and themes that match your brand identity perfectly.",
                  icon: <Globe className="h-6 w-6" />
                },
                {
                  title: "AI-Powered Listings",
                  desc: "Generate high-converting listing descriptions automatically with our GenAI assistant.",
                  icon: <Zap className="h-6 w-6" />
                },
                {
                  title: "Isolated Multi-Tenancy",
                  desc: "Each platform has its own customer database, booking engine, and security protocols.",
                  icon: <ShieldCheck className="h-6 w-6" />
                }
              ].map((feature, i) => (
                <div key={i} className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-headline font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1">
                <h2 className="text-3xl font-headline font-bold mb-6">From Event Venues to Yacht Rentals</h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Our flexible schema allows you to redefine what a "listing" is. Whether you're booking time slots or daily rentals, Platformify adapts to your niche.
                </p>
                <ul className="space-y-4">
                  {[
                    "Manage unlimited white-labeled platforms",
                    "Integrated availability calendars",
                    "Custom pricing models per platform",
                    "Detailed customer booking history"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <img src="https://picsum.photos/seed/v1/400/500" className="rounded-2xl shadow-lg mt-8" alt="Venue" data-ai-hint="luxury villa" />
                <img src="https://picsum.photos/seed/v2/400/500" className="rounded-2xl shadow-lg" alt="Event" data-ai-hint="event space" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Globe className="h-6 w-6 text-primary" />
            <span className="text-xl font-headline font-bold">Platformify</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 Platformify Bookings. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
