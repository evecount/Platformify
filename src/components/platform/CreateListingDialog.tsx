
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
  Wand2, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
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

type Step = 'basics' | 'location' | 'amenities' | 'pricing';

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
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    try {
      const listingsRef = collection(db, 'platforms', platformId, 'listings');
      addDocumentNonBlocking(listingsRef, listingData);
      
      toast({
        title: "Listing created!",
        description: `${formData.title} is now live on your platform.`,
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
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) resetForm(); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Listing
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Create New Listing</DialogTitle>
          <DialogDescription>Setup your new listing in four steps.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col h-full">
          {/* Progress Indicator */}
          <div className="bg-muted/30 px-6 py-4 border-b flex justify-between items-center">
            <div className="flex gap-2">
              {(['basics', 'location', 'amenities', 'pricing'] as Step[]).map((s, i) => (
                <div 
                  key={s} 
                  className={cn(
                    "h-1.5 w-10 rounded-full transition-all duration-300",
                    step === s ? "bg-primary w-14" : (i < ['basics', 'location', 'amenities', 'pricing'].indexOf(step) ? "bg-primary/40" : "bg-muted-foreground/20")
                  )} 
                />
              ))}
            </div>
          </div>

          <div className="p-8">
            {step === 'basics' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-headline font-bold">What are you hosting?</h2>
                  <p className="text-muted-foreground text-sm">Start with a catchy title and a description that tells a story.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Listing Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Minimalist Zen Studio"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-end mb-2">
                      <Label htmlFor="description">Description</Label>
                      <AIListingAssistant 
                        listingData={{ listingName: formData.title, location: formData.location }} 
                        onGenerated={(desc) => setFormData({...formData, description: desc})}
                      />
                    </div>
                    <Textarea
                      id="description"
                      placeholder="Tell your guests what makes this place special..."
                      className="min-h-[120px]"
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
                  <h2 className="text-2xl font-headline font-bold">Where is it located?</h2>
                  <p className="text-muted-foreground text-sm">Help guests find their way and know what's nearby.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location / Area</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        className="pl-9"
                        placeholder="e.g. Seminyak, Bali"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Maximum Guests</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="capacity"
                        type="number"
                        className="pl-9"
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
                  <h2 className="text-2xl font-headline font-bold">What's included?</h2>
                  <p className="text-muted-foreground text-sm">Select the amenities that make your listing comfortable.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['Wi-Fi', 'Pool', 'Kitchen', 'Free Parking', 'Air Conditioning', 'Pets Allowed'].map((item) => (
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
                        "flex items-center gap-2 p-3 border rounded-xl transition-all text-sm",
                        formData.amenities.includes(item) 
                          ? "bg-primary/10 border-primary text-primary font-bold" 
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

            {step === 'pricing' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-headline font-bold">Finally, the price</h2>
                  <p className="text-muted-foreground text-sm">Set a competitive price for your offering.</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price Per Day ($)</Label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        className="pl-9 text-2xl h-16 font-mono font-bold"
                        value={formData.pricePerDay}
                        onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="p-4 border rounded-2xl bg-muted/20">
                    <div className="flex gap-4">
                      <div className="h-20 w-20 rounded-xl overflow-hidden border">
                        <img src={formData.imageUrl} className="h-full w-full object-cover" alt="" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{formData.title || "Untitled Listing"}</p>
                        <p className="text-xs text-muted-foreground">{formData.location || "No location set"}</p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                            <ImageIcon className="h-3 w-3" /> Change Photo
                          </Button>
                        </div>
                      </div>
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
                else if(step === 'pricing') setStep('amenities');
              }}
              className="gap-2"
            >
              {step === 'basics' ? 'Cancel' : <><ChevronLeft className="h-4 w-4" /> Back</>}
            </Button>

            {step === 'pricing' ? (
              <Button onClick={handleSubmit} disabled={loading || !formData.title || !formData.pricePerDay} className="gap-2 px-8">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Publish Listing
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  if(step === 'basics') setStep('location');
                  else if(step === 'location') setStep('amenities');
                  else if(step === 'amenities') setStep('pricing');
                }} 
                className="gap-2 px-8"
                disabled={step === 'basics' && !formData.title}
              >
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
