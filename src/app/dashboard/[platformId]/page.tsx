
"use client";

import { use, useState } from 'react';
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
  Database
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

  // Queries for metrics and tables
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

  if (!platform) return <div className="p-20 text-center">Platform not found</div>;

  const themeConfig = platform.themeConfig ? JSON.parse(platform.themeConfig) : { primaryColor: '#20A2FF', accentColor: '#3347CC' };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-headline font-bold">{platform.name}</h1>
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Link href={`/p/${platform.id}`} target="_blank" className="hover:text-primary transition-colors flex items-center gap-1 font-medium">
                    {platform.customDomain} <ExternalLink className="h-3 w-3" />
                  </Link>
                  • Platform Configuration
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 bg-background">
                <Bell className="h-4 w-4" />
                Alerts
              </Button>
              <Button className="gap-2 shadow-md">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-background border p-1 rounded-xl w-full sm:w-auto overflow-x-auto justify-start">
              <TabsTrigger value="overview" className="gap-2 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BarChart3 className="h-4 w-4" /> Overview
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
              <TabsTrigger value="theme" className="gap-2 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Palette className="h-4 w-4" /> Theme
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Est. Revenue", val: `$${bookings?.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0) || 0}`, icon: <BarChart3 className="h-4 w-4" /> },
                  { label: "Bookings", val: bookings?.length || 0, icon: <Calendar className="h-4 w-4" /> },
                  { label: "Active Listings", val: listings?.length || 0, icon: <Package className="h-4 w-4" /> },
                  { label: "Customers", val: customers?.length || 0, icon: <Users className="h-4 w-4" /> },
                ].map((stat, i) => (
                  <Card key={i} className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</CardTitle>
                      <div className="p-2 bg-primary/10 text-primary rounded-lg">{stat.icon}</div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.val}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="font-headline">Recent Activity</CardTitle>
                    <CardDescription>Latest events on your platform.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bookings && bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.slice(0, 5).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/5 group hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Calendar className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-bold text-sm">New booking for {booking.listingId}</p>
                                <p className="text-xs text-muted-foreground">{format(new Date(booking.startDate), 'MMM d, yyyy')}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="capitalize">{booking.status}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-muted/20">
                        <Clock className="h-8 w-8 mx-auto mb-2 opacity-20" />
                        <p>No activity recorded yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">Platform Health</CardTitle>
                    <CardDescription>Status and identity summary.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-xl bg-green-50/50">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <div>
                          <p className="font-bold text-sm capitalize">{platform.status} Status</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Marketplace Live</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Active</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Tenant ID</span>
                        <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">{platform.id.substring(0, 8)}...</code>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Niche</span>
                        <span className="font-medium">{platform.niche || 'General'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Domain</span>
                        <span className="font-medium text-primary flex items-center gap-1">{platform.customDomain}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="listings">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="font-headline">Listing Management</CardTitle>
                    <CardDescription>Manage your marketplace offerings and inventory.</CardDescription>
                  </div>
                  <CreateListingDialog platformId={platform.id} />
                </CardHeader>
                <CardContent>
                  {isListingsLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : !listings || listings.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed rounded-2xl bg-muted/10">
                      <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="text-lg font-bold">Your inventory is empty</h3>
                      <p className="text-muted-foreground mb-6">Create your first listing to start accepting bookings.</p>
                      <CreateListingDialog platformId={platform.id} />
                    </div>
                  ) : (
                    <div className="rounded-xl border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Price/Day</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {listings.map((listing) => (
                            <TableRow key={listing.id}>
                              <TableCell>
                                <img 
                                  src={listing.imageUrl || 'https://picsum.photos/seed/placeholder/100/100'} 
                                  className="h-10 w-10 rounded-lg object-cover border" 
                                  alt="" 
                                />
                              </TableCell>
                              <TableCell className="font-bold">{listing.title}</TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {listing.location}
                                </div>
                              </TableCell>
                              <TableCell className="font-mono font-bold">${listing.pricePerDay}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3 text-muted-foreground" />
                                  {listing.capacity}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" className="h-8 w-8"><Settings className="h-4 w-4" /></Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Bookings</CardTitle>
                  <CardDescription>Monitor and manage all guest reservations.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isBookingsLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : !bookings || bookings.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed rounded-2xl bg-muted/10">
                      <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="text-lg font-bold">No bookings yet</h3>
                      <p className="text-muted-foreground">Reservations will appear here once guests start booking your listings.</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Listing</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-bold">{booking.customerId}</TableCell>
                              <TableCell>{booking.listingId}</TableCell>
                              <TableCell className="text-sm font-medium">
                                {format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}
                              </TableCell>
                              <TableCell className="font-mono font-bold">${booking.totalPrice}</TableCell>
                              <TableCell>
                                <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="capitalize">
                                  {booking.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="gap-1">
                                  View <ChevronRight className="h-3 w-3" />
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

            <TabsContent value="customers">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Customer Base</CardTitle>
                  <CardDescription>View and manage profiles of users who have engaged with your platform.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isCustomersLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : !customers || customers.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed rounded-2xl bg-muted/10">
                      <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="text-lg font-bold">No customers found</h3>
                      <p className="text-muted-foreground">Your customer list grows as people register and book on your marketplace.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {customers.map((customer) => (
                        <Card key={customer.id} className="shadow-none border-muted hover:border-primary/50 transition-colors">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs uppercase">
                                {customer.name.substring(0, 2)}
                              </div>
                              {customer.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm space-y-2">
                            <p className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="h-3 w-3" /> {customer.email}
                            </p>
                            <div className="flex justify-between pt-2 border-t">
                              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Bookings</span>
                              <Badge variant="secondary">{customer.booking_history?.length || 0}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="theme">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Visual Identity</CardTitle>
                  <CardDescription>Customise how your customers see your platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Primary Brand Color</Label>
                        <div className="flex gap-3">
                          <Input type="color" className="w-12 h-10 p-1" defaultValue={themeConfig.primaryColor} />
                          <Input defaultValue={themeConfig.primaryColor} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Accent Color</Label>
                        <div className="flex gap-3">
                          <Input type="color" className="w-12 h-10 p-1" defaultValue={themeConfig.accentColor} />
                          <Input defaultValue={themeConfig.accentColor} />
                        </div>
                      </div>
                      <Button className="w-full gap-2">
                        <Palette className="h-4 w-4" /> Update Theme
                      </Button>
                    </div>
                    
                    <div className="border rounded-2xl p-6 bg-accent/20 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                        <Database className="h-10 w-10 text-primary" />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Live Preview</p>
                      <div className="bg-background rounded-xl border shadow-lg h-40 overflow-hidden flex flex-col">
                        <div className="h-8 border-b flex items-center px-4 justify-between" style={{ borderTop: `2px solid ${themeConfig.primaryColor}` }}>
                          <div className="h-3 w-12 rounded-full" style={{ backgroundColor: `${themeConfig.primaryColor}20` }} />
                          <div className="flex gap-2">
                            <div className="h-2 w-4 bg-muted rounded-full" />
                            <div className="h-2 w-4 bg-muted rounded-full" />
                          </div>
                        </div>
                        <div className="flex-1 p-4">
                          <div className="h-4 w-24 bg-foreground/10 rounded-full mb-2" />
                          <div className="h-2 w-32 bg-muted rounded-full mb-4" />
                          <div className="h-10 w-full rounded-lg flex items-center justify-center" style={{ backgroundColor: themeConfig.primaryColor }}>
                            <div className="h-2 w-12 bg-white/40 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
