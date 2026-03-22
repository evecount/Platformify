
'use client';

import { useState } from 'react';
import { Plus, Globe, Palette, Loader2, Check, ChevronRight, ChevronLeft, Rocket, Sparkles, Layout } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CreatePlatformDialogProps {
  trigger?: React.ReactNode;
}

type Step = 'identity' | 'branding' | 'launch';

export function CreatePlatformDialog({ trigger }: CreatePlatformDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('identity');
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    customDomain: '',
    primaryColor: '#20A2FF',
    accentColor: '#3347CC',
  });

  const handleSubmit = async () => {
    if (!user || !db) return;
    setLoading(true);

    const platformData = {
      ownerId: user.uid,
      name: formData.name,
      niche: formData.niche,
      customDomain: formData.customDomain,
      status: 'active',
      themeConfig: JSON.stringify({
        primaryColor: formData.primaryColor,
        accentColor: formData.accentColor,
      }),
      createdAt: new Date().toISOString(),
    };

    try {
      const platformsRef = collection(db, 'platforms');
      addDocumentNonBlocking(platformsRef, platformData);
      
      toast({
        title: "Platform created!",
        description: `${formData.name} is now being provisioned.`,
      });
      
      setOpen(false);
      resetForm();
    } catch (error) {
      // Handled by global listener
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('identity');
    setFormData({
      name: '',
      niche: '',
      customDomain: '',
      primaryColor: '#20A2FF',
      accentColor: '#3347CC',
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) resetForm(); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            New Platform
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Create New Platform</DialogTitle>
          <DialogDescription>Setup your white-label booking platform in three steps.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col h-full">
          {/* Progress Header */}
          <div className="bg-muted/30 px-6 py-4 border-b flex justify-between items-center">
            <div className="flex gap-2">
              {(['identity', 'branding', 'launch'] as Step[]).map((s, i) => (
                <div 
                  key={s} 
                  className={cn(
                    "h-1.5 w-12 rounded-full transition-all duration-300",
                    step === s ? "bg-primary w-16" : (i < ['identity', 'branding', 'launch'].indexOf(step) ? "bg-primary/40" : "bg-muted-foreground/20")
                  )} 
                />
              ))}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Step {(['identity', 'branding', 'launch'].indexOf(step) + 1)} of 3
            </span>
          </div>

          <div className="p-8">
            {step === 'identity' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-headline font-bold">What are we building?</h2>
                  <p className="text-muted-foreground text-sm">Give your marketplace a name and a niche focus.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Marketplace Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Tropical Stay"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="niche">Target Niche</Label>
                    <Input
                      id="niche"
                      placeholder="e.g. Luxury Villas in Bali"
                      value={formData.niche}
                      onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 'branding' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-headline font-bold">Dress it up</h2>
                  <p className="text-muted-foreground text-sm">Define your brand colors to give your platform a unique feel.</p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-center justify-between p-4 border rounded-xl bg-accent/5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg shadow-inner" style={{ backgroundColor: formData.primaryColor }} />
                      <div>
                        <p className="text-sm font-semibold">Primary Color</p>
                        <p className="text-xs text-muted-foreground">Buttons, links, and highlights</p>
                      </div>
                    </div>
                    <Input 
                      type="color" 
                      className="w-12 h-10 p-1 border-none bg-transparent cursor-pointer" 
                      value={formData.primaryColor} 
                      onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-xl bg-accent/5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg shadow-inner" style={{ backgroundColor: formData.accentColor }} />
                      <div>
                        <p className="text-sm font-semibold">Accent Color</p>
                        <p className="text-xs text-muted-foreground">Secondary UI elements</p>
                      </div>
                    </div>
                    <Input 
                      type="color" 
                      className="w-12 h-10 p-1 border-none bg-transparent cursor-pointer" 
                      value={formData.accentColor} 
                      onChange={(e) => setFormData({...formData, accentColor: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 'launch' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-headline font-bold">Ready for lift-off?</h2>
                  <p className="text-muted-foreground text-sm">Connect your domain and prepare for launch.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Custom Domain</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="domain"
                        className="pl-9"
                        placeholder="yourbrand.com"
                        value={formData.customDomain}
                        onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="p-4 border rounded-xl bg-primary/5 border-primary/20">
                    <div className="flex gap-3">
                      <div className="mt-1 p-2 bg-primary/10 text-primary rounded-lg">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Almost there!</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Your platform will be initialized with a standard schema for bookings, listings, and customers.
                        </p>
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
              onClick={() => step === 'identity' ? setOpen(false) : setStep(step === 'launch' ? 'branding' : 'identity')}
              className="gap-2"
            >
              {step === 'identity' ? 'Cancel' : <><ChevronLeft className="h-4 w-4" /> Back</>}
            </Button>

            {step === 'launch' ? (
              <Button onClick={handleSubmit} disabled={loading || !formData.customDomain} className="gap-2 px-8">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                Launch Platform
              </Button>
            ) : (
              <Button 
                onClick={() => setStep(step === 'identity' ? 'branding' : 'launch')} 
                className="gap-2 px-8"
                disabled={step === 'identity' && !formData.name}
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
