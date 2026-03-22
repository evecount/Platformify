
"use client";

import { use, useState, useEffect } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Package, 
  Settings, 
  Palette, 
  ExternalLink,
  Save,
  Trash2,
  Bell,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  Database,
  BrainCircuit,
  TrendingUp,
  Target,
  Zap,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/layout/Navbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useDoc, useFirestore, useMemoFirebase, useCollection, useUser } from '@/firebase';
import { doc, collection, query, orderBy, deleteDoc } from 'firebase/firestore';
import { CreateListingDialog } from '@/components/platform/CreateListingDialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

/**
 * Platform Management: The "Sensor Control Room" for a Sister Platform.
 * Shows yield intelligence, behavioral signals, and schema sync status.
 */
export default function PlatformManagementPage({ params }: { params: Promise<{ platformId: string }> }) {
  const { platformId } = use(params);
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  
  const platformRef = useMemoFirebase(() => {
    if (!db || !platformId) return null;
    return doc(db, 'platforms', platformId);
  }, [db, platformId]);

  const { data: platform, isLoading: isPlatformLoading } = useDoc(platformRef);

  const listingsQuery = useMemoFirebase(() => {
    if (!db || !platformId) return null;
    return query(collection(db, 'platforms', platformId, 'listings'), orderBy('createdAt', 'desc'));
  }, [db, platformId]);

  const bookingsQuery = useMemoFirebase(() => {
    if (!db || !platformId) return null;
    return query(collection(db, 'platforms', platformId, 'bookings'), orderBy('startDate', 'desc'));
  }, [db, platformId]);

  const customersQuery = useMemoFirebase(() => {
    if (!db || !platformId) return null;
    return query(collection(db, 'platforms', platformId, 'customers'), orderBy('name', 'asc'));
  }, [db, platformId]);

  const { data: listings, isLoading: isListingsLoading } = useCollection(listingsQuery);
  const { data: bookings, isLoading: isBookingsLoading } = useCollection(bookingsQuery);
  const { data: customers, isLoading: isCustomersLoading } = useCollection(customersQuery);

  if (isPlatformLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!platform) return <div className="p-20 text-center text-muted-foreground font-headline font-bold">404: Sensor Probe Not Found</div>;

  const totalRevenue = bookings?.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0) || 0;
  const avgMargin = 0.28;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="container mx-auto max-w-7xl">
          {/* Platform Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/30">
                <Globe className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-headline font-bold tracking-tight">{platform.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px]">
                    {platform.niche || 'General'} Sensor
                  </Badge>
                  <Link href={`/p/${platform.id}`} target="_blank" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 text-sm font-medium">
                    {platform.customDomain} <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-xl border shadow-sm">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sister Schema Sync: Active</span>
              </div>
              <Button variant="outline" className="gap-2 bg-background border-muted hover:border-primary/50 rounded-xl">
                <BrainCircuit className="h-4 w-4 text-primary" />
                Deep Learning Insights
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="bg-background border p-1 rounded-2xl w-full sm:w-auto overflow-x-auto justify-start shadow-sm mb-4">
              <TabsTrigger value="overview" className="gap-2 px-8 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
                <BarChart3 className="h-4 w-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="intelligence" className="gap-2 px-8 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
                <Target className="h-4 w-4" /> Yield Intelligence
              </TabsTrigger>
              <TabsTrigger value="listings" className="gap-2 px-8 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
                <Package className="h-4 w-4" /> Listings
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2 px-8 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
                <Activity className="h-4 w-4" /> Purchase Signals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Est. Revenue", val: `$${totalRevenue.toLocaleString()}`, sub: "+12% Behavioral Lift", icon: <TrendingUp className="h-5 w-5" /> },
                  { label: "Sister Margin", val: `${(avgMargin * 100).toFixed(0)}%`, sub: "0.4% above global avg", icon: <Target className="h-5 w-5" /> },
                  { label: "Active Probes", val: listings?.length || 0, sub: "Capturing niche signals", icon: <Package className="h-5 w-5" /> },
                  { label: "Total Signals", val: bookings?.length || 0, sub: "Purchase intent recorded", icon: <Activity className="h-5 w-5" /> },
                ].map((stat, i) => (
                  <Card key={i} className="border-none shadow-xl shadow-muted/50 overflow-hidden group rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</CardTitle>
                      <div className="p-2.5 bg-primary/5 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">{stat.icon}</div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold tracking-tight">{stat.val}</div>
                      <p className="text-[10px] text-muted-foreground mt-1.5 font-bold uppercase tracking-wider">{stat.sub}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-xl shadow-muted/50 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">Recent Behavioral Log</CardTitle>
                    <CardDescription>Real-time purchase signals from this sensor probe.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bookings && bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.slice(0, 5).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-5 rounded-2xl border bg-card group hover:border-primary/50 transition-all cursor-pointer shadow-sm">
                            <div className="flex items-center gap-5">
                              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Users className="h-6 w-6" />
                              </div>
                              <div>
                                <p className="font-bold text-base leading-none">Intent: {booking.purchaseContext?.intent || 'Unknown'}</p>
                                <p className="text-xs text-muted-foreground mt-1.5 font-medium">{format(new Date(booking.startDate), 'MMMM do')} • ${booking.totalPrice} Yield</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                               <Badge variant="outline" className="capitalize font-bold border-muted-foreground/20 text-[10px] px-3">{booking.status}</Badge>
                               <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-24 text-center border-2 border-dashed rounded-3xl bg-muted/10">
                        <Clock className="h-10 w-10 mx-auto mb-3 opacity-20" />
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Awaiting Global Signals...</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-primary/5 bg-primary/5 border-primary/10 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2 text-xl">
                      <BrainCircuit className="h-6 w-6 text-primary" />
                      Prediction Engine
                    </CardTitle>
                    <CardDescription>Cross-platform high-dimensional insights.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="p-5 rounded-2xl bg-background border shadow-md">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2.5">Global Persona Match</p>
                      <p className="text-2xl font-bold tracking-tight">The Premium Seeker</p>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium">
                        Signals from the <strong>{platform.niche}</strong> probe indicate a 15% lower price sensitivity for celebration-based intent across all sister sites.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Yield Potential</span>
                        <span className="font-bold text-green-600 text-lg">+8.4%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Consumer Intent</span>
                        <span className="font-bold text-lg">Celebration</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Model Confidence</span>
                        <span className="font-bold text-lg text-primary">92%</span>
                      </div>
                    </div>

                    <Button variant="primary" className="w-full py-6 text-lg font-bold rounded-xl shadow-lg shadow-primary/20">
                      Run Global Simulation
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="intelligence" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none shadow-xl shadow-primary/5 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl">
                  <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2 text-2xl">
                      <Zap className="h-6 w-6 text-primary" />
                      Calculated ROI Lift
                    </CardTitle>
                    <CardDescription>Value generated by the Agentic Orchestrator.</CardDescription>
                  </CardHeader>
                  <CardContent className="py-12 text-center">
                    <div className="text-6xl font-bold text-primary mb-3 tracking-tighter">+$1,452.00</div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Additional Yield Generated</p>
                    <div className="mt-10 grid grid-cols-2 gap-6">
                      <div className="p-5 border rounded-2xl bg-background shadow-lg shadow-muted/20">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Dynamic Upsell</p>
                        <p className="text-2xl font-bold text-green-600">+$840</p>
                      </div>
                      <div className="p-5 border rounded-2xl bg-background shadow-lg shadow-muted/20">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Visual Conversion</p>
                        <p className="text-2xl font-bold text-green-600">+$612</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-muted/50 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2 text-2xl">
                      <Target className="h-6 w-6 text-secondary" />
                      Behavioral Heatmap
                    </CardTitle>
                    <CardDescription>Sister signals across the Platformify network.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span>High Urgency (Celebration)</span>
                        <span className="text-primary">88% Match</span>
                      </div>
                      <div className="h-3 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-primary" style={{ width: '88%' }} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span>Price Sensitive (Utility)</span>
                        <span className="text-secondary">24% Match</span>
                      </div>
                      <div className="h-3 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-secondary" style={{ width: '24%' }} />
                      </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-muted/30 border-2 border-dashed mt-8">
                      <p className="text-sm leading-relaxed italic text-muted-foreground font-medium">
                        "The sensor network recommends a 15% luxury premium for weekend slots based on high 'Sister Intent' signals from the Bali Wedding probe."
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
