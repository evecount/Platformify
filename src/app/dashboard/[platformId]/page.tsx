
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
  Loader2
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
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import { CreateListingDialog } from '@/components/platform/CreateListingDialog';

export default function PlatformManagementPage({ params }: { params: Promise<{ platformId: string }> }) {
  const { platformId } = use(params);
  const db = useFirestore();
  
  const platformRef = useMemoFirebase(() => {
    if (!db || !platformId) return null;
    return doc(db, 'platforms', platformId);
  }, [db, platformId]);

  const { data: platform, isLoading: isPlatformLoading } = useDoc(platformRef);

  const listingsQuery = useMemoFirebase(() => {
    if (!db || !platformId) return null;
    return query(collection(db, 'platforms', platformId, 'listings'), orderBy('createdAt', 'desc'));
  }, [db, platformId]);

  const { data: listings, isLoading: isListingsLoading } = useCollection(listingsQuery);

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
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-headline font-bold">{platform.name}</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Link href={`/p/${platform.id}`} target="_blank" className="hover:text-primary transition-colors flex items-center gap-1">
                    {platform.customDomain} <ExternalLink className="h-3 w-3" />
                  </Link>
                  • Platform Configuration
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
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
            <TabsList className="bg-background border p-1 rounded-xl">
              <TabsTrigger value="overview" className="gap-2 px-6 rounded-lg">
                <BarChart3 className="h-4 w-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="listings" className="gap-2 px-6 rounded-lg">
                <Package className="h-4 w-4" /> Listings
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2 px-6 rounded-lg">
                <Calendar className="h-4 w-4" /> Bookings
              </TabsTrigger>
              <TabsTrigger value="customers" className="gap-2 px-6 rounded-lg">
                <Users className="h-4 w-4" /> Customers
              </TabsTrigger>
              <TabsTrigger value="theme" className="gap-2 px-6 rounded-lg">
                <Palette className="h-4 w-4" /> Theme
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Revenue", val: "$0", icon: <BarChart3 className="h-4 w-4" /> },
                  { label: "Bookings", val: "0", icon: <Calendar className="h-4 w-4" /> },
                  { label: "Active Listings", val: listings?.length || 0, icon: <Package className="h-4 w-4" /> },
                  { label: "Customers", val: "0", icon: <Users className="h-4 w-4" /> },
                ].map((stat, i) => (
                  <Card key={i} className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                      <div className="p-2 bg-primary/10 text-primary rounded-lg">{stat.icon}</div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.val}</div>
                      <p className="text-xs text-muted-foreground mt-1">Ready for launch</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">Recent Activity</CardTitle>
                    <CardDescription>Latest events on your platform.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="py-8 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-muted/20">
                      <p>No bookings or customer activity yet.</p>
                      <Button variant="link" className="mt-2">Invite customers</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">Platform Status</CardTitle>
                    <CardDescription>Health and usage summary.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <div>
                          <p className="font-semibold capitalize">{platform.status} Status</p>
                          <p className="text-xs text-muted-foreground">Accessible at {platform.customDomain}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Configure DNS</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-xl">
                      <div>
                        <p className="font-semibold">Tenant ID</p>
                        <p className="text-xs text-muted-foreground font-mono">{platform.id}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(platform.id)}>Copy</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="listings">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-headline">Listing Management</CardTitle>
                    <CardDescription>Add, edit or disable your marketplace offerings.</CardDescription>
                  </div>
                  <CreateListingDialog platformId={platform.id} />
                </CardHeader>
                <CardContent>
                  {isListingsLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : listings?.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed rounded-2xl bg-muted/10">
                      <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="text-lg font-bold">No listings yet</h3>
                      <p className="text-muted-foreground mb-6">Create your first listing to start accepting bookings.</p>
                      <CreateListingDialog platformId={platform.id} />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Price/Day</TableHead>
                          <TableHead>Capacity</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {listings?.map((listing) => (
                          <TableRow key={listing.id}>
                            <TableCell>
                              <img src={listing.imageUrl} className="h-10 w-10 rounded-lg object-cover" alt="" />
                            </TableCell>
                            <TableCell className="font-semibold">{listing.title}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{listing.location}</TableCell>
                            <TableCell className="font-mono">${listing.pricePerDay}</TableCell>
                            <TableCell>{listing.capacity} guests</TableCell>
                            <TableCell className="text-right flex justify-end gap-2">
                              <Button variant="ghost" size="icon"><Settings className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
                    </div>
                    
                    <div className="border rounded-2xl p-6 bg-accent/20">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Live Preview</p>
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
