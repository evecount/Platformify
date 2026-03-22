
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
  Image as ImageIcon,
  BrainCircuit
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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BookingDialogProps {
  listing: any;
  platform: any;
  children: React.ReactNode;
}

/**
 * BookingDialog: The primary "Signal Capture" point for the Economic Sensor Network.
 * It uses AI to render a visual preview of the user's intent while recording
 * high-dimensional purchase context for the "Sister Schema".
 */
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

    /** 
     * The purchase context maps back to the Global Behavioral Taxonomy.
     * This is the "Sister Signal" that feeds the prediction model.
     */
    const bookingData = {
      platformId: platform.id,
      ownerId: platform.ownerId,
      listingId: listing.id,
      customerId: user?.uid || 'guest_' + Math.random().toString(36).substr(2, 9),
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalPrice: totalPrice,
      calculatedMargin: totalPrice * 0.25, // Protecting the 25% target margin
      status: 'pending',
      createdAt: new Date().toISOString(),
      purchaseContext: {
        intent: formData.customRequest ? 'celebration' : 'utility',
        urgency: 'high', // Calculated based on lead time in real scenario
        sensitivity: 0.2, // Seed value for price sensitivity tracking
        customRequest: formData.customRequest,
        sensorOrigin: platform.niche,
        globalSignalSync: true
      }
    };

    const customerData = {
      platformId: platform.id,
      ownerId: platform.ownerId,
      name: formData.name,
      email: formData.email,
      id: bookingData.customerId,
      lastActiveNiche: platform.niche
    };

    try {
      const bookingsRef = collection(db, 'platforms', platform.id, 'bookings');
      addDocumentNonBlocking(bookingsRef, bookingData);

      const customersRef = collection(db, 'platforms', platform.id, 'customers');
      addDocumentNonBlocking(customersRef, customerData);

      setSuccess(true);
      toast({
        title: "Booking Requested!",
        description: `Your purchase signal for ${listing.title} has been recorded.`,
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
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Book {listing.title}</DialogTitle>
          <DialogDescription>Complete your reservation details for the global signal network.</DialogDescription>
        </DialogHeader>

        {!success ? (
          <div className="flex flex-col">
            <div className="relative h-64">
              <img src={customPreview || listing.imageUrl || 'https://picsum.photos/seed/placeholder/800/600'} className="w-full h-full object-cover transition-all duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-8">
                <div className="w-full">
                  <div className="flex justify-between items-end">
                    <div>
                      <Badge className="mb-2 bg-primary/20 backdrop-blur-md border-primary/30 text-primary-foreground font-bold tracking-widest uppercase text-[10px]">
                        {customPreview ? 'Agentic Visual Preview' : (platform.niche || 'Sister Signal')}
                      </Badge>
                      <h3 className="text-3xl font-headline font-bold text-white tracking-tight">{listing.title}</h3>
                      <p className="text-white/70 text-sm flex items-center gap-1 mt-1 font-medium"><MapPin className="h-3 w-3" /> {listing.location}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Starting from</p>
                       <p className="text-3xl font-bold text-white">${listing.pricePerDay}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8 bg-background">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Arrival Signal</Label>
                  <Input type="date" className="h-11 bg-muted/20 border-muted" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Departure Signal</Label>
                  <Input type="date" className="h-11 bg-muted/20 border-muted" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>

              <div className="space-y-3 p-6 rounded-2xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <BrainCircuit className="h-12 w-12 text-primary" />
                </div>
                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary flex justify-between items-center">
                  Persona Intent & Personalization
                  <span className="flex items-center gap-1 font-bold text-[8px] bg-primary/10 px-2 py-0.5 rounded-full"><Sparkles className="h-2 w-2" /> Powered by Platformify AI</span>
                </Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Describe your specific vision or intent..." 
                    value={formData.customRequest}
                    onChange={(e) => setFormData({...formData, customRequest: e.target.value})}
                    className="flex-1 h-12 bg-background border-primary/20 focus:border-primary transition-all"
                  />
                  <Button 
                    variant="primary" 
                    size="icon" 
                    className="h-12 w-12 shrink-0 shadow-lg shadow-primary/20" 
                    onClick={handleGeneratePreview}
                    disabled={previewLoading || !formData.customRequest}
                  >
                    {previewLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground italic leading-relaxed">The visual renderer will simulate your request in real-time to optimize conversion.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Full Name" className="h-11" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <Input type="email" placeholder="Email Address" className="h-11" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>

              <div className="flex items-center justify-between pt-6 border-t">
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Target Yield</p>
                  <p className="text-3xl font-bold text-primary">${listing.pricePerDay}</p>
                </div>
                <Button size="lg" className="gap-3 h-14 px-10 text-lg font-bold shadow-xl shadow-primary/30 rounded-xl" onClick={handleBooking} disabled={loading || !formData.startDate || !formData.endDate || !formData.email}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                  Confirm Booking
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-16 text-center animate-in fade-in zoom-in duration-500 bg-background">
            <div className="h-24 w-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Check className="h-12 w-12" />
            </div>
            <h2 className="text-4xl font-headline font-bold mb-4 tracking-tight">Signal Sync Complete</h2>
            <p className="text-muted-foreground mb-10 max-w-sm mx-auto text-lg leading-relaxed">
              Your purchase intent has been recorded in the global **Sister Schema**. The marketplace owner will confirm your reservation shortly.
            </p>
            <Button className="w-full gap-2 h-14 text-lg font-bold rounded-xl" variant="outline" onClick={() => setOpen(false)}>
              Explore the Sensor Network <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
