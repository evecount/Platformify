
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Shield, User, Globe, Save } from 'lucide-react';
import { useUser } from '@/firebase';

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-headline font-bold">Account Settings</h1>
            <p className="text-muted-foreground">Manage your platformify account and preferences.</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Profile Information</CardTitle>
                <CardDescription>Update your personal details and how you're identified.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input value={user?.email || ''} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input defaultValue={user?.displayName || 'Platform Owner'} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Notifications</CardTitle>
                <CardDescription>Configure how you receive updates about your platforms.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "New Booking Alerts", desc: "Get notified as soon as a customer makes a reservation." },
                  { label: "Platform Status Updates", desc: "Receive alerts if your custom domain has issues." },
                  { label: "Weekly Performance Reports", desc: "Summary of revenue and traffic across all sites." }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-bold text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Security</CardTitle>
                <CardDescription>Protect your account with advanced safety features.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">Enable Two-Factor Authentication</Button>
                <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">Delete Account</Button>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="outline">Cancel</Button>
              <Button className="gap-2"><Save className="h-4 w-4" /> Save Changes</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
