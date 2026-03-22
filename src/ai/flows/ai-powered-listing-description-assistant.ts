'use server';
/**
 * @fileOverview An AI assistant that helps platform owners generate detailed and engaging descriptions for their listings.
 *
 * - generateListingDescription - A function that generates a listing description based on provided details.
 * - GenerateListingDescriptionInput - The input type for the generateListingDescription function.
 * - GenerateListingDescriptionOutput - The return type for the generateListingDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateListingDescriptionInputSchema = z.object({
  listingName: z.string().describe('The name or title of the listing.'),
  location: z.string().describe('The geographical location of the listing (e.g., city, region, country).'),
  shortDescription: z.string().describe('A brief, user-provided summary of the listing.'),
  keyFeatures: z.array(z.string()).describe('A list of primary selling points or standout features (e.g., "Private infinity pool", "Ocean view").'),
  capacity: z.number().int().positive().describe('The maximum number of guests or occupants the listing can accommodate.'),
  pricePerNight: z.number().positive().describe('The price of the listing per night.'),
  amenities: z.array(z.string()).describe('A list of available amenities (e.g., "Wi-Fi", "Air conditioning", "Smart TV").'),
  nearbyAttractions: z.array(z.string()).describe('A list of notable attractions or landmarks close to the listing.'),
  uniqueSellingPoints: z.array(z.string()).describe('Any unique aspects that differentiate this listing (e.g., "Award-winning architecture", "Personal chef available").'),
});
export type GenerateListingDescriptionInput = z.infer<typeof GenerateListingDescriptionInputSchema>;

const GenerateListingDescriptionOutputSchema = z.object({
  generatedDescription: z.string().describe('The AI-generated, detailed, and engaging description for the listing.'),
  keywords: z.array(z.string()).describe('A list of relevant SEO keywords for the listing.'),
});
export type GenerateListingDescriptionOutput = z.infer<typeof GenerateListingDescriptionOutputSchema>;

const generateListingDescriptionPrompt = ai.definePrompt({
  name: 'generateListingDescriptionPrompt',
  input: {schema: GenerateListingDescriptionInputSchema},
  output: {schema: GenerateListingDescriptionOutputSchema},
  prompt: `You are an expert marketing copywriter for a high-end booking platform. Your goal is to create a highly engaging, detailed, and attractive listing description based on the provided information. Use a compelling and persuasive tone.

Craft a description that highlights the listing's unique appeal, key features, and what makes it an unforgettable experience for potential guests. Also, generate a list of SEO-friendly keywords.

Listing Name: {{{listingName}}}
Location: {{{location}}}
Short Description: {{{shortDescription}}}
Key Features: {{#each keyFeatures}}- {{{this}}}{{/each}}
Capacity: {{{capacity}}} guests
Price Per Night: {{{pricePerNight}}}
Amenities: {{#each amenities}}- {{{this}}}{{/each}}
Nearby Attractions: {{#each nearbyAttractions}}- {{{this}}}{{/each}}
Unique Selling Points: {{#each uniqueSellingPoints}}- {{{this}}}{{/each}}

Focus on storytelling and sensory details to paint a vivid picture for the reader. Emphasize the benefits and experiences, not just the features.

Return the output in the specified JSON format.`,
});

const generateListingDescriptionFlow = ai.defineFlow(
  {
    name: 'generateListingDescriptionFlow',
    inputSchema: GenerateListingDescriptionInputSchema,
    outputSchema: GenerateListingDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await generateListingDescriptionPrompt(input);
    return output!;
  }
);

export async function generateListingDescription(input: GenerateListingDescriptionInput): Promise<GenerateListingDescriptionOutput> {
  return generateListingDescriptionFlow(input);
}
