
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
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/layout/Navbar';
import { MOCK_PLATFORMS, MOCK_LISTINGS, MOCK_BOOKINGS, MOCK_CUSTOMERS } from '@/app/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AIListingAssistant } from '@/components/platform/AIListingAssistant';
import Link from 'next/link';

export default function PlatformManagementPage({ params }: { params: Promise<{ platformId: string }> }) {
  const { platformId } = use(params);
  const platform = MOCK_PLATFORMS.find(p => p.id === platformId);
  const [description, setDescription] = useState("");

  if (!platform) return <div>Platform not found</div>;

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
                <h1 className="text-3xl font-headline font-bold">{platform.platform_name}</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Link href={`/p/${platform.id}`} target="_blank" className="hover:text-primary transition-colors flex items-center gap-1">
                    {platform.custom_domain} <ExternalLink className="h-3 w-3" />
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
                  { label: "Total Revenue", val: "$12,450", icon: <BarChart3 className="h-4 w-4" /> },
                  { label: "Bookings", val: "48", icon: <Calendar className="h-4 w-4" /> },
                  { label: "Active Listings", val: "12", icon: <Package className="h-4 w-4" /> },
                  { label: "Customers", val: "32", icon: <Users className="h-4 w-4" /> },
                ].map((stat, i) => (
                  <Card key={i} className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                      <div className="p-2 bg-primary/10 text-primary rounded-lg">{stat.icon}</div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.val}</div>
                      <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">Recent Bookings</CardTitle>
                    <CardDescription>Latest customer activities on your platform.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Listing</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {MOCK_BOOKINGS.filter(b => b.platform_id === platformId).map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.customer_email}</TableCell>
                            <TableCell>Villa #1</TableCell>
                            <TableCell>{booking.start_date}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">{booking.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
                          <p className="font-semibold">Live Status</p>
                          <p className="text-xs text-muted-foreground">Accessible at {platform.custom_domain}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Configure DNS</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-xl">
                      <div>
                        <p className="font-semibold">Storage Usage</p>
                        <p className="text-xs text-muted-foreground">Listing images and documents</p>
                      </div>
                      <p className="text-sm font-bold">12% / 5GB</p>
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
                    <CardDescription>Add, edit or disable your offerings.</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <AIListingAssistant 
                      listingData={{ listingName: "Paradise Villa", location: "Bali", pricePerNight: 1000 }}
                      onGenerated={(desc) => setDescription(desc)} 
                    />
                    <Button className="gap-2"><Plus className="h-4 w-4" /> Add Listing</Button>
                  </div>
                </CardHeader>
                <CardContent>
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
                      {MOCK_LISTINGS.filter(l => l.platform_id === platformId).map((listing) => (
                        <TableRow key={listing.id}>
                          <TableCell>
                            <img src={listing.imageUrl} className="h-10 w-10 rounded-lg object-cover" alt="" />
                          </TableCell>
                          <TableCell className="font-semibold">{listing.title}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{listing.location}</TableCell>
                          <TableCell className="font-mono">${listing.price_per_day}</TableCell>
                          <TableCell>{listing.capacity} guests</TableCell>
                          <TableCell className="text-right flex justify-end gap-2">
                            <Button variant="ghost" size="icon"><Settings className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                          <Input type="color" className="w-12 h-10 p-1" defaultValue={platform.theme_config.primaryColor} />
                          <Input defaultValue={platform.theme_config.primaryColor} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Accent Color</Label>
                        <div className="flex gap-3">
                          <Input type="color" className="w-12 h-10 p-1" defaultValue={platform.theme_config.accentColor} />
                          <Input defaultValue={platform.theme_config.accentColor} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-2xl p-6 bg-accent/20">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Preview (Desktop)</p>
                      <div className="bg-background rounded-xl border shadow-lg h-40 overflow-hidden flex flex-col">
                        <div className="h-8 border-b flex items-center px-4 justify-between">
                          <div className="h-3 w-12 bg-primary/20 rounded-full" />
                          <div className="flex gap-2">
                            <div className="h-2 w-4 bg-muted rounded-full" />
                            <div className="h-2 w-4 bg-muted rounded-full" />
                          </div>
                        </div>
                        <div className="flex-1 p-4">
                          <div className="h-4 w-24 bg-foreground/10 rounded-full mb-2" />
                          <div className="h-2 w-32 bg-muted rounded-full mb-4" />
                          <div className="h-10 w-full bg-primary rounded-lg flex items-center justify-center">
                            <div className="h-2 w-12 bg-white/20 rounded-full" />
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
