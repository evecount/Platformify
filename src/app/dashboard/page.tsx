
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Globe, Settings, ExternalLink, MoreVertical, LayoutGrid, CalendarCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Navbar } from '@/components/layout/Navbar';
import { MOCK_PLATFORMS } from '@/app/lib/mock-data';

export default function DashboardPage() {
  const [platforms] = useState(MOCK_PLATFORMS);

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Navbar />
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-headline font-bold">My Platforms</h1>
              <p className="text-muted-foreground">Manage your white-label booking sites.</p>
            </div>
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" />
              New Platform
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <Card key={platform.id} className="overflow-hidden group hover:border-primary/50 transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Globe className="h-5 w-5" />
                    </div>
                    <Badge variant={platform.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                      {platform.status}
                    </Badge>
                  </div>
                  <CardTitle className="font-headline text-xl">{platform.platform_name}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 text-primary hover:underline cursor-pointer">
                    <Globe className="h-3 w-3" />
                    {platform.custom_domain}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="grid grid-cols-3 gap-4 border-t pt-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Listings</p>
                      <p className="text-lg font-bold">12</p>
                    </div>
                    <div className="text-center border-x">
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Bookings</p>
                      <p className="text-lg font-bold">48</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Customers</p>
                      <p className="text-lg font-bold">32</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 p-4 gap-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
                    <Link href={`/dashboard/${platform.id}`}>
                      <Settings className="h-3.5 w-3.5" />
                      Manage
                    </Link>
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1 gap-1.5" asChild>
                    <Link href={`/p/${platform.id}`} target="_blank">
                      <ExternalLink className="h-3.5 w-3.5" />
                      View Site
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Duplicate Site</DropdownMenuItem>
                      <DropdownMenuItem>Suspended Site</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete Permanently</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}

            {/* Empty State / Add New Placeholder */}
            <button className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl border-muted hover:border-primary/50 hover:bg-accent/50 transition-all group">
              <div className="h-12 w-12 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
                <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
              </div>
              <p className="font-semibold text-muted-foreground group-hover:text-primary">Create Another Platform</p>
              <p className="text-xs text-muted-foreground mt-1 text-center px-4">Expand your white-label business with a new niche booking site.</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
