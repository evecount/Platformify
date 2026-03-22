
"use client";

import { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Star, 
  Check, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking, useFirestore, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';

interface BookingDialogProps {
  listing: any;
  platform: any;
  children: React.ReactNode;
}

export function BookingDialog({ listing, platform, children }: BookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    guests: 1,
    name: '',
    email: '',
  });

  const handleBooking = async () => {
    if (!db) return;
    setLoading(true);

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
    const totalPrice = days * listing.pricePerDay;

    const bookingData = {
      platformId: platform.id,
      ownerId: platform.ownerId,
      listingId: listing.id,
      customerId: user?.uid || 'guest_' + Math.random().toString(36).substr(2, 9),
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalPrice: totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const customerData = {
      platformId: platform.id,
      ownerId: platform.ownerId,
      name: formData.name,
      email: formData.email,
      id: bookingData.customerId
    };

    try {
      // 1. Create the booking
      const bookingsRef = collection(db, 'platforms', platform.id, 'bookings');
      addDocumentNonBlocking(bookingsRef, bookingData);

      // 2. Create the customer record (or update)
      const customersRef = collection(db, 'platforms', platform.id, 'customers');
      addDocumentNonBlocking(customersRef, customerData);

      setSuccess(true);
      toast({
        title: "Booking Requested!",
        description: `Your reservation for ${listing.title} has been submitted.`,
      });
    } catch (e) {
      // Handled globally
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) setSuccess(false); }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Book {listing.title}</DialogTitle>
          <DialogDescription>Complete your reservation details.</DialogDescription>
        </DialogHeader>

        {!success ? (
          <div className="flex flex-col">
            <div className="relative h-48">
              <img src={listing.imageUrl || 'https://picsum.photos/seed/placeholder/800/600'} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{listing.title}</h3>
                  <p className="text-white/80 text-sm flex items-center gap-1"><MapPin className="h-3 w-3" /> {listing.location}</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Check-in</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-9" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Check-out</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-9" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Guests</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="number" className="pl-9" value={formData.guests} min={1} max={listing.capacity} onChange={(e) => setFormData({...formData, guests: Number(e.target.value)})} />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Guest Info</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  <Input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-bold">Total Price</p>
                  <p className="text-2xl font-bold text-primary">${listing.pricePerDay} <span className="text-xs font-normal text-muted-foreground">/ night</span></p>
                </div>
                <Button size="lg" className="gap-2 shadow-lg shadow-primary/20" onClick={handleBooking} disabled={loading || !formData.startDate || !formData.endDate || !formData.email}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                  Reserve Now
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center animate-in fade-in zoom-in duration-300">
            <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-headline font-bold mb-4">Request Sent!</h2>
            <p className="text-muted-foreground mb-8">
              We've received your booking request for <strong>{listing.title}</strong>. 
              The host will review and contact you at <strong>{formData.email}</strong> shortly.
            </p>
            <Button className="w-full gap-2" variant="outline" onClick={() => setOpen(false)}>
              Got it, thanks! <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
