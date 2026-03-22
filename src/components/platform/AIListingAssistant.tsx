
"use client";

import { useState } from 'react';
import { Wand2, Sparkles, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { generateListingDescription, GenerateListingDescriptionInput } from '@/ai/flows/ai-powered-listing-description-assistant';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AIListingAssistantProps {
  onGenerated: (description: string) => void;
  listingData: Partial<GenerateListingDescriptionInput>;
}

export function AIListingAssistant({ onGenerated, listingData }: AIListingAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ description: string; keywords: string[] } | null>(null);
  const [open, setOpen] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const input: GenerateListingDescriptionInput = {
        listingName: listingData.listingName || 'Elegant Event Space',
        location: listingData.location || 'Downtown',
        shortDescription: listingData.shortDescription || 'A versatile space for events.',
        keyFeatures: listingData.keyFeatures || ['Modern decor', 'High-speed Wi-Fi'],
        capacity: listingData.capacity || 50,
        pricePerNight: listingData.pricePerNight || 500,
        amenities: listingData.amenities || ['Projector', 'Coffee station'],
        nearbyAttractions: listingData.nearbyAttractions || ['Central Station'],
        uniqueSellingPoints: listingData.uniqueSellingPoints || ['Award winning design'],
      };

      const { generatedDescription, keywords } = await generateListingDescription(input);
      setResult({ description: generatedDescription, keywords });
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyChanges = () => {
    if (result) {
      onGenerated(result.description);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10">
          <Sparkles className="h-4 w-4" />
          AI Description Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Wand2 className="h-5 w-5 text-primary" />
            AI Listing Assistant
          </DialogTitle>
          <DialogDescription>
            Generate an engaging, SEO-optimized description for your listing based on the details you've provided.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!result ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl bg-muted/30">
              <Sparkles className="h-10 w-10 text-primary/40 mb-4" />
              <p className="text-sm text-muted-foreground text-center mb-6">
                Ready to transform your listing details into <br /> compelling marketing copy?
              </p>
              <Button onClick={handleGenerate} disabled={loading} className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                {loading ? 'Generating...' : 'Magic Generate'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Generated Copy</label>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-accent/50">
                  <p className="text-sm leading-relaxed">{result.description}</p>
                </ScrollArea>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Keywords</label>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((kw, i) => (
                    <Badge key={i} variant="secondary">{kw}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setResult(null)}>Retry</Button>
                <Button className="gap-2" onClick={applyChanges}>
                  <Check className="h-4 w-4" />
                  Use this Description
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
