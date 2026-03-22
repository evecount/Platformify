
"use client";

import { use, useState } from 'react';
import { Search, Globe, MapPin, Star, Calendar, Users, Filter, Menu, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useDoc, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where, orderBy } from 'firebase/firestore';
import { BookingDialog } from '@/components/platform/BookingDialog';

export default function PublicPlatformPage({ params }: { params: Promise<{ platformId: string }> }) {
  const { platformId } = use(params);
  const db = useFirestore();
  
  const platformRef = useMemoFirebase(() => {
    if (!db || !platformId) return null;
    return doc(db, 'platforms', platformId);
  }, [db, platformId]);

  const listingsQuery = useMemoFirebase(() => {
    if (!db || !platformId) return null;
    return query(
      collection(db, 'platforms', platformId, 'listings'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
  }, [db, platformId]);

  const { data: platform, isLoading: isPlatformLoading } = useDoc(platformRef);
  const { data: listings, isLoading: isListingsLoading } = useCollection(listingsQuery);

  if (isPlatformLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!platform) return <div className="p-20 text-center">404 - Platform Not Found</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Platform Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href={`/p/${platform.id}`} className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <Globe className="h-6 w-6" />
            </div>
            <span className="text-xl font-headline font-bold tracking-tight">{platform.name}</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <Link href="#" className="hover:text-primary transition-colors">Destinations</Link>
            <Link href="#" className="hover:text-primary transition-colors">Special Offers</Link>
            <Link href="#" className="hover:text-primary transition-colors">Support</Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden"><Menu className="h-6 w-6" /></Button>
            <Button variant="outline" className="hidden sm:inline-flex">Sign In</Button>
            <Button className="hidden sm:inline-flex" onClick={() => {
              document.getElementById('listings-grid')?.scrollIntoView({ behavior: 'smooth' });
            }}>Start Booking</Button>
          </div>
        </div>
      </header>

      {/* Hero / Search */}
      <section className="relative py-12 lg:py-24 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-headline font-bold mb-6">Find the Perfect Space</h1>
            <p className="text-lg text-muted-foreground mb-8">Exclusive venues hand-picked by {platform.name}.</p>
          </div>

          <div className="max-w-5xl mx-auto bg-card border rounded-2xl shadow-xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Where are you going?" className="pl-9 h-12" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Dates</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Check in / out" className="pl-9 h-12" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Guests</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="How many?" className="pl-9 h-12" />
              </div>
            </div>
            <div className="flex items-end">
              <Button size="lg" className="w-full h-12 gap-2 shadow-lg shadow-primary/20">
                <Search className="h-4 w-4" /> Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Listings Grid */}
      <main id="listings-grid" className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-headline font-bold">Recommended for You</h2>
            <p className="text-muted-foreground">Top-rated venues in {platform.niche || 'this region'}.</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>

        {isListingsLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : !listings || listings.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed rounded-2xl">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
            <p className="text-muted-foreground">No active listings found on this platform.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {listings.map((listing) => (
              <BookingDialog key={listing.id} listing={listing} platform={platform}>
                <Card className="border-none shadow-none group cursor-pointer overflow-hidden rounded-none bg-transparent">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
                    <img 
                      src={listing.imageUrl || 'https://picsum.photos/seed/placeholder/800/600'} 
                      alt={listing.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <Button variant="ghost" size="icon" className="absolute top-3 right-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1 px-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{listing.title}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-sm font-bold">New</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {listing.location}
                    </p>
                    <div className="pt-2 flex items-baseline gap-1">
                      <span className="text-lg font-bold">${listing.pricePerDay}</span>
                      <span className="text-sm text-muted-foreground">/ night</span>
                    </div>
                  </div>
                </Card>
              </BookingDialog>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
            <div className="col-span-2">
              <Link href="#" className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                  <Globe className="h-4 w-4" />
                </div>
                <span className="text-lg font-headline font-bold">{platform.name}</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {platform.name} is a curated marketplace for finding unique booking experiences. Powered by Platformify.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Help Center</Link></li>
                <li><Link href="#" className="hover:text-primary">Safety Center</Link></li>
                <li><Link href="#" className="hover:text-primary">Cancellation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary">Careers</Link></li>
                <li><Link href="#" className="hover:text-primary">Newsroom</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2024 {platform.name}. Built with Platformify.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-primary">Privacy</Link>
              <Link href="#" className="hover:text-primary">Terms</Link>
              <Link href="#" className="hover:text-primary">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
