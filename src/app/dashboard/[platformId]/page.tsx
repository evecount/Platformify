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
  Target
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

  if (!platform) return <div className="p-20 text-center text-muted-foreground">Platform not found</div>;

  const totalRevenue = bookings?.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0) || 0;
  const avgMargin = 0.28; // Simulated from "Deep Learning" engine

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="container mx-auto max-w-7xl">
          {/* Platform Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
                <Globe className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-headline font-bold tracking-tight">{platform.name}</h1>
                <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">{platform.niche || 'General'} Niche</span>
                  <Link href={`/p/${platform.id}`} target="_blank" className="hover:text-primary transition-colors flex items-center gap-1">
                    {platform.customDomain} <ExternalLink className="h-3 w-3" />
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 bg-background border-muted hover:border-primary/50">
                <BrainCircuit className="h-4 w-4 text-primary" />
                AI Insights
              </Button>
              <Button className="gap-2 shadow-lg shadow-primary/20">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-background border p-1 rounded-xl w-full sm:w-auto overflow-x-auto justify-start shadow-sm">
              <TabsTrigger value="overview" className="gap-2 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BarChart3 className="h-4 w-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="intelligence" className="gap-2 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Target className="h-4 w-4" /> Yield Intelligence
              </TabsTrigger>
              <TabsTrigger value="listings" className="gap-2 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Package className="h-4 w-4" /> Listings
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calendar className="h-4 w-4" /> Bookings
              </TabsTrigger>
              <TabsTrigger value="customers" className="gap-2 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="h-4 w-4" /> Customers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Est. Revenue", val: `$${totalRevenue.toLocaleString()}`, sub: "+12% from last month", icon: <TrendingUp className="h-4 w-4" /> },
                  { label: "Platform Margin", val: `${(avgMargin * 100).toFixed(0)}%`, sub: "0.4% above benchmark", icon: <Target className="h-4 w-4" /> },
                  { label: "Active Listings", val: listings?.length || 0, sub: "Managed by Platformify", icon: <Package className="h-4 w-4" /> },
                  { label: "Total Bookings", val: bookings?.length || 0, sub: "Sister signals recorded", icon: <Calendar className="h-4 w-4" /> },
                ].map((stat, i) => (
                  <Card key={i} className="border-none shadow-sm overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</CardTitle>
                      <div className="p-2 bg-primary/5 text-primary rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">{stat.icon}</div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.val}</div>
                      <p className="text-[10px] text-muted-foreground mt-1 font-medium">{stat.sub}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-headline">Recent Behavioral Signals</CardTitle>
                    <CardDescription>Real-time purchase events from your sister platform.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bookings && bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.slice(0, 5).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl border bg-card group hover:border-primary/50 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Users className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-bold text-sm">Booking by {booking.customerId.substring(0, 8)}...</p>
                                <p className="text-xs text-muted-foreground">{format(new Date(booking.startDate), 'MMMM do')} • ${booking.totalPrice}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="capitalize font-bold border-muted-foreground/20">{booking.status}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 text-center border-2 border-dashed rounded-2xl bg-muted/20">
                        <Clock className="h-8 w-8 mx-auto mb-2 opacity-20" />
                        <p className="text-muted-foreground font-medium">No behavioral signals recorded yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-primary/5 border-primary/10">
                  <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                      <BrainCircuit className="h-5 w-5 text-primary" />
                      Prediction Engine
                    </CardTitle>
                    <CardDescription>Cross-platform deep learning insights.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-xl bg-background border shadow-sm">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Dominant Persona</p>
                      <p className="text-lg font-bold">The Premium Seeker</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Customers in the <strong>{platform.niche}</strong> niche show 15% lower price sensitivity for celebration-based intent.</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">Yield Potential</span>
                        <span className="font-bold text-green-600">+8.4%</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">Consumer Intent</span>
                        <span className="font-bold">Celebration</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">Model Confidence</span>
                        <span className="font-bold">92%</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full bg-background border-primary/20 text-primary font-bold">
                      Run Yield Simulation
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="intelligence" className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="font-headline">Yield & Behavioral Analytics</CardTitle>
                  <CardDescription>How the "Sister Schema" optimizes your booking empire.</CardDescription>
                </CardHeader>
                <CardContent className="py-20 text-center max-w-2xl mx-auto">
                  <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BrainCircuit className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Deep Learning initialized.</h3>
                  <p className="text-muted-foreground mb-8">
                    The prediction model is currently aggregating signals from your <strong>{platform.niche}</strong> marketplace. 
                    As you collect more bookings, our agentic yield analyst will suggest dynamic pricing adjustments to maximize your {avgMargin * 100}% target margin.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-xl bg-muted/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Signals</p>
                      <p className="text-xl font-bold">{bookings?.length || 0}</p>
                    </div>
                    <div className="p-4 border rounded-xl bg-muted/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Accuracy</p>
                      <p className="text-xl font-bold">84%</p>
                    </div>
                    <div className="p-4 border rounded-xl bg-muted/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Yield Lift</p>
                      <p className="text-xl font-bold">+$1.2k</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="listings">
              <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="font-headline">Inventory Control</CardTitle>
                    <CardDescription>Manage your marketplace units and profit targets.</CardDescription>
                  </div>
                  <CreateListingDialog platformId={platform.id} />
                </CardHeader>
                <CardContent>
                  {isListingsLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : !listings || listings.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed rounded-2xl bg-muted/10">
                      <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="text-lg font-bold">Inventory is empty</h3>
                      <p className="text-muted-foreground mb-6">Start your booking empire by adding your first sister listing.</p>
                      <CreateListingDialog platformId={platform.id} />
                    </div>
                  ) : (
                    <div className="rounded-xl border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead className="w-[80px]">Preview</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Market Price</TableHead>
                            <TableHead>Base Cost</TableHead>
                            <TableHead>Margin</TableHead>
                            <TableHead className="text-right">Manage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {listings.map((listing) => (
                            <TableRow key={listing.id} className="group">
                              <TableCell>
                                <img src={listing.imageUrl || 'https://picsum.photos/seed/placeholder/100/100'} className="h-10 w-10 rounded-lg object-cover border shadow-sm" alt="" />
                              </TableCell>
                              <TableCell>
                                <p className="font-bold">{listing.title}</p>
                                <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 uppercase tracking-tighter">
                                  <MapPin className="h-2 w-2" /> {listing.location}
                                </p>
                              </TableCell>
                              <TableCell className="font-mono font-bold text-primary">${listing.pricePerDay}</TableCell>
                              <TableCell className="text-muted-foreground text-sm font-mono">${(listing.pricePerDay * 0.75).toFixed(0)}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 font-bold border-none">25%</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="icon" className="h-8 w-8"><Settings className="h-4 w-4" /></Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                    onClick={() => deleteDoc(doc(db, 'platforms', platform.id, 'listings', listing.id))}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="font-headline">Purchase Signal Log</CardTitle>
                  <CardDescription>Detailed audit of conversion triggers and intent signals.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isBookingsLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : !bookings || bookings.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed rounded-2xl bg-muted/10">
                      <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="text-lg font-bold">No signals recorded</h3>
                      <p className="text-muted-foreground">Wait for your first customer to reveal their intent.</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead>Customer Signal</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Total Yield</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Intelligence</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-bold">
                                    {booking.customerId.substring(0, 2).toUpperCase()}
                                  </div>
                                  <span className="font-medium text-sm">{booking.customerId.substring(0, 12)}...</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-xs font-medium">
                                {format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}
                              </TableCell>
                              <TableCell className="font-mono font-bold">${booking.totalPrice}</TableCell>
                              <TableCell>
                                <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="capitalize border-none shadow-sm">
                                  {booking.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="gap-2 font-bold text-primary">
                                  Signals <ChevronRight className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
