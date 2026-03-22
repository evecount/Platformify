'use server';
/**
 * @fileOverview A Yield Prediction Agent that calculates price premiums based on behavioral signals.
 * 
 * - predictYield - Calculates a suggested premium and confidence score.
 * - PredictYieldInput - The input behavioral signals (from the Taxonomy).
 * - PredictYieldOutput - The suggested pricing adjustment.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PredictYieldInputSchema = z.object({
  urgency: z.enum(['low', 'medium', 'high']).describe('How fast the user needs to book.'),
  intent: z.enum(['gift', 'business', 'celebration', 'utility']).describe('The primary reason for the purchase.'),
  sensitivity: z.number().min(0).max(1).describe('Calculated price sensitivity based on rejected options.'),
  historicalMargin: z.number().describe('The average margin for this specific sister-platform niche.'),
  platformNiche: z.string().describe('The domain vertical (e.g., Florist, Villa).'),
});
export type PredictYieldInput = z.infer<typeof PredictYieldInputSchema>;

const PredictYieldOutputSchema = z.object({
  suggestedPremium: z.number().describe('Percentage increase/decrease suggested (e.g., 0.15 for 15%).'),
  confidenceScore: z.number().min(0).max(1).describe('The model confidence in this prediction.'),
  reasoning: z.string().describe('Explanation of the behavioral triggers found.'),
  persona: z.string().describe('The categorized purchase persona (e.g., "The Premium Seeker").'),
});
export type PredictYieldOutput = z.infer<typeof PredictYieldOutputSchema>;

const predictYieldPrompt = ai.definePrompt({
  name: 'predictYieldPrompt',
  input: { schema: PredictYieldInputSchema },
  output: { schema: PredictYieldOutputSchema },
  prompt: `You are the Lead Yield Analyst for Platformify, a global Consumer Prediction Model.
You analyze "Sister Schema" signals to optimize profit margins.

Analyze the following purchase signals for a booking in the {{{platformNiche}}} niche:
- Urgency: {{{urgency}}}
- Intent: {{{intent}}}
- Price Sensitivity: {{{sensitivity}}}
- Historical Niche Margin: {{{historicalMargin}}}%

Your goal is to identify if the customer matches a "Premium Seeker" (low sensitivity, high celebration intent) or a "Utility Optimizer" (high urgency, high sensitivity).

Suggest a price premium that protects the owner's 25% target profit margin while maximizing yield based on urgency.

Return the JSON prediction.`,
});

export async function predictYield(input: PredictYieldInput): Promise<PredictYieldOutput> {
  const { output } = await predictYieldPrompt(input);
  return output!;
}
