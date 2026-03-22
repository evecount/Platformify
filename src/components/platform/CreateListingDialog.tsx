
'use client';

import { useState } from 'react';
import { 
  Plus, 
  Loader2, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  MapPin, 
  Users, 
  Tag, 
  Sparkles, 
  Image as ImageIcon,
  CheckCircle2,
  Package,
  Star
} from 'lucide-react';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AIListingAssistant } from './AIListingAssistant';

interface CreateListingDialogProps {
  platformId: string;
  trigger?: React.ReactNode;
}

type Step = 'basics' | 'location' | 'amenities' | 'marketing' | 'pricing';

export function CreateListingDialog({ platformId, trigger }: CreateListingDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('basics');
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    pricePerDay: 0,
    capacity: 2,
    imageUrl: 'https://picsum.photos/seed/new/800/600',
    amenities: [] as string[],
    keyFeatures: [] as string[],
    nearbyAttractions: [] as string[],
    uniqueSellingPoints: [] as string[],
  });

  const handleSubmit = async () => {
    if (!user || !db) return;
    setLoading(true);

    const listingData = {
      platformId,
      ownerId: user.uid,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      pricePerDay: Number(formData.pricePerDay),
      capacity: Number(formData.capacity),
      imageUrl: formData.imageUrl,
      amenities: formData.amenities,
      keyFeatures: formData.keyFeatures,
      nearbyAttractions: formData.nearbyAttractions,
      uniqueSellingPoints: formData.uniqueSellingPoints,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    try {
      const listingsRef = collection(db, 'platforms', platformId, 'listings');
      addDocumentNonBlocking(listingsRef, listingData);
      
      toast({
        title: "Listing published!",
        description: `${formData.title} is now available for booking.`,
      });
      
      setOpen(false);
      resetForm();
    } catch (error) {
      // Handled globally
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('basics');
    setFormData({
      title: '',
      description: '',
      location: '',
      pricePerDay: 0,
      capacity: 2,
      imageUrl: 'https://picsum.photos/seed/new/800/600',
      amenities: [],
      keyFeatures: [],
      nearbyAttractions: [],
      uniqueSellingPoints: [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) resetForm(); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" /> Add Listing
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Create New Listing</DialogTitle>
          <DialogDescription>Setup your new listing in five simple steps.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col h-full">
          {/* Progress Indicator */}
          <div className="bg-muted/30 px-6 py-4 border-b flex justify-between items-center">
            <div className="flex gap-2">
              {(['basics', 'location', 'amenities', 'marketing', 'pricing'] as Step[]).map((s, i) => (
                <div 
                  key={s} 
                  className={cn(
                    "h-1 w-8 sm:w-12 rounded-full transition-all duration-300",
                    step === s ? "bg-primary" : (['basics', 'location', 'amenities', 'marketing', 'pricing'].indexOf(step) > i ? "bg-primary/40" : "bg-muted-foreground/20")
                  )} 
                />
              ))}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Step {(['basics', 'location', 'amenities', 'marketing', 'pricing'].indexOf(step) + 1)} of 5
            </span>
          </div>

          <div className="p-8 max-h-[60vh] overflow-y-auto">
            {step === 'basics' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-headline font-bold">The Basics</h2>
                  <p className="text-muted-foreground text-sm italic">"A good name is better than a thousand images."</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-bold">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Cliffside Zen Sanctuary"
                      value={formData.title}
                      className="h-12 text-lg"
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-end mb-2">
                      <Label htmlFor="description" className="font-bold">Description</Label>
                      <AIListingAssistant 
                        listingData={formData} 
                        onGenerated={(desc) => setFormData({...formData, description: desc})}
                      />
                    </div>
                    <Textarea
                      id="description"
                      placeholder="Describe the experience of staying here..."
                      className="min-h-[150px] leading-relaxed"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 'location' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-headline font-bold">Where's the magic?</h2>
                  <p className="text-muted-foreground text-sm">Help guests understand where they'll be staying.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="font-bold">City / Region</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        className="pl-9 h-11"
                        placeholder="e.g. Uluwatu, Bali"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity" className="font-bold">Max Capacity</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="capacity"
                        type="number"
                        className="pl-9 h-11"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 'amenities' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-headline font-bold">What's in the box?</h2>
                  <p className="text-muted-foreground text-sm">Select the amenities that define the comfort of your space.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Wi-Fi', 'Pool', 'Kitchen', 'AC', 'Free Parking', 'Pet Friendly', 'Hot Tub', 'Gym', 'Workspace'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        const next = formData.amenities.includes(item) 
                          ? formData.amenities.filter(a => a !== item)
                          : [...formData.amenities, item];
                        setFormData({...formData, amenities: next});
                      }}
                      className={cn(
                        "flex items-center gap-2 p-3 border rounded-xl transition-all text-sm font-medium",
                        formData.amenities.includes(item) 
                          ? "bg-primary/10 border-primary text-primary shadow-sm" 
                          : "bg-background hover:bg-muted"
                      )}
                    >
                      {formData.amenities.includes(item) ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border" />}
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'marketing' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-headline font-bold">Elevate your listing</h2>
                  <p className="text-muted-foreground text-sm">Add those extra details that catch a traveler's eye.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold flex items-center gap-2">
                      <Star className="h-3 w-3 text-primary" /> Key Features
                    </Label>
                    <Input 
                      placeholder="e.g. Private infinity pool (Comma separated)"
                      onChange={(e) => setFormData({...formData, keyFeatures: e.target.value.split(',').map(s => s.trim())})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-primary" /> Nearby Attractions
                    </Label>
                    <Input 
                      placeholder="e.g. 10 mins from Uluwatu Temple"
                      onChange={(e) => setFormData({...formData, nearbyAttractions: e.target.value.split(',').map(s => s.trim())})}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 'pricing' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-headline font-bold">The Price Point</h2>
                  <p className="text-muted-foreground text-sm">Set your nightly rate and you're ready to publish.</p>
                </div>
                <div className="max-w-xs mx-auto space-y-6">
                  <div className="space-y-2">
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        className="pl-12 text-4xl h-24 font-mono font-bold text-center border-2 border-primary/20 focus:border-primary"
                        value={formData.pricePerDay}
                        onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                      />
                    </div>
                    <p className="text-center text-xs text-muted-foreground font-bold uppercase tracking-widest mt-2">Price Per Day ($)</p>
                  </div>
                  
                  <div className="p-4 border rounded-2xl bg-muted/20 flex gap-4 items-center">
                    <div className="h-16 w-16 rounded-lg overflow-hidden border shrink-0">
                      <img src={formData.imageUrl} className="h-full w-full object-cover" alt="" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold truncate text-sm">{formData.title || "Untitled"}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-tight">{formData.location || "Location pending"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 border-t bg-muted/20 flex flex-row items-center justify-between sm:justify-between gap-4">
            <Button 
              variant="ghost" 
              onClick={() => {
                if(step === 'basics') setOpen(false);
                else if(step === 'location') setStep('basics');
                else if(step === 'amenities') setStep('location');
                else if(step === 'marketing') setStep('amenities');
                else if(step === 'pricing') setStep('marketing');
              }}
              className="gap-2 font-bold"
            >
              {step === 'basics' ? 'Cancel' : <><ChevronLeft className="h-4 w-4" /> Back</>}
            </Button>

            {step === 'pricing' ? (
              <Button onClick={handleSubmit} disabled={loading || !formData.title || !formData.pricePerDay} className="gap-2 px-10 shadow-lg shadow-primary/20">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Publish Listing
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  if(step === 'basics') setStep('location');
                  else if(step === 'location') setStep('amenities');
                  else if(step === 'amenities') setStep('marketing');
                  else if(step === 'marketing') setStep('pricing');
                }} 
                className="gap-2 px-10"
                disabled={step === 'basics' && !formData.title}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
