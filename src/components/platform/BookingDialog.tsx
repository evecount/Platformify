
"use client";

import { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Check, 
  Loader2, 
  ArrowRight,
  CreditCard,
  MapPin,
  Sparkles,
  Wand2,
  Image as ImageIcon
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking, useFirestore, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { generateVisualPreview } from '@/ai/flows/generate-visual-preview-flow';
import { cn } from '@/lib/utils';

interface BookingDialogProps {
  listing: any;
  platform: any;
  children: React.ReactNode;
}

export function BookingDialog({ listing, platform, children }: BookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [customPreview, setCustomPreview] = useState<string | null>(null);
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    guests: 1,
    name: '',
    email: '',
    customRequest: '',
  });

  const handleGeneratePreview = async () => {
    if (!formData.customRequest) return;
    setPreviewLoading(true);
    try {
      const { previewUrl } = await generateVisualPreview({
        platformNiche: platform.niche || 'General',
        listingTitle: listing.title,
        aiMetadata: listing.aiMetadata,
        userIntent: formData.customRequest,
      });
      setCustomPreview(previewUrl);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Preview failed', description: 'AI renderer is busy.' });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!db) return;
    setLoading(true);

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
    const totalPrice = days * listing.pricePerDay;

    // The purchase context maps back to the Sister Schema Taxonomy
    const bookingData = {
      platformId: platform.id,
      ownerId: platform.ownerId,
      listingId: listing.id,
      customerId: user?.uid || 'guest_' + Math.random().toString(36).substr(2, 9),
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalPrice: totalPrice,
      calculatedMargin: totalPrice * 0.25, // Mock target margin
      status: 'pending',
      createdAt: new Date().toISOString(),
      purchaseContext: {
        intent: formData.customRequest ? 'celebration' : 'utility',
        urgency: 'medium',
        customRequest: formData.customRequest
      }
    };

    const customerData = {
      platformId: platform.id,
      ownerId: platform.ownerId,
      name: formData.name,
      email: formData.email,
      id: bookingData.customerId
    };

    try {
      const bookingsRef = collection(db, 'platforms', platform.id, 'bookings');
      addDocumentNonBlocking(bookingsRef, bookingData);

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
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) { setSuccess(false); setCustomPreview(null); } }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Book {listing.title}</DialogTitle>
          <DialogDescription>Complete your reservation details.</DialogDescription>
        </DialogHeader>

        {!success ? (
          <div className="flex flex-col">
            <div className="relative h-56">
              <img src={customPreview || listing.imageUrl || 'https://picsum.photos/seed/placeholder/800/600'} className="w-full h-full object-cover transition-all duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                <div>
                  <Badge className="mb-2 bg-primary/20 backdrop-blur-md border-primary/30 text-primary-foreground font-bold">
                    {customPreview ? 'AI Generated Preview' : (platform.niche || 'Listing')}
                  </Badge>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{listing.title}</h3>
                  <p className="text-white/70 text-sm flex items-center gap-1"><MapPin className="h-3 w-3" /> {listing.location}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest opacity-70">Check-in</Label>
                  <Input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest opacity-70">Check-out</Label>
                  <Input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-70 flex justify-between">
                  Personalization Intent
                  <span className="text-primary normal-case font-medium">Powered by Platformify AI</span>
                </Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g. A lush red bouquet for an anniversary..." 
                    value={formData.customRequest}
                    onChange={(e) => setFormData({...formData, customRequest: e.target.value})}
                    className="flex-1"
                  />
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="shrink-0" 
                    onClick={handleGeneratePreview}
                    disabled={previewLoading || !formData.customRequest}
                  >
                    {previewLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground italic">Visual Renderer uses Imagen 4 to stage your request.</p>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  <Input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-xl flex items-center justify-between border border-primary/10">
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Total Yield</p>
                  <p className="text-2xl font-bold text-primary">${listing.pricePerDay} <span className="text-xs font-normal text-muted-foreground">/ night</span></p>
                </div>
                <Button size="lg" className="gap-2 shadow-lg shadow-primary/20 px-8" onClick={handleBooking} disabled={loading || !formData.startDate || !formData.endDate || !formData.email}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Confirm Booking
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center animate-in fade-in zoom-in duration-300">
            <div className="h-20 w-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-headline font-bold mb-4">Signal Captured!</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Your purchase intent has been recorded in our sister schema. The host for <strong>{listing.title}</strong> will confirm your booking shortly.
            </p>
            <Button className="w-full gap-2 py-6 text-lg" variant="outline" onClick={() => setOpen(false)}>
              Explore More Listings <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
