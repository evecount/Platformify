# AI Orchestration Guide: Building Niche Assistants

This guide is for AI Agents/Orchestrators looking to extend Platformify with intelligent, niche-specific booking assistants.

## The "Florist" Pattern: Intent to Structured Output

When building an assistant like the "Florist Bouquet Builder," follow this Genkit-centric pattern:

### 1. Define the Business Logic (The "Constraints")
Don't just ask the AI to "suggest a bouquet." Pass it the hard constraints as context:
- **Inventory:** What items are in stock? (Fetch from `/platforms/{pId}/listings`)
- **Margins:** What is the raw cost vs. retail price?
- **Seasonality:** Is the item currently available?

### 2. Implementation Strategy: The "Intelligent Consultant"
- **Tools over Prompts:** Use `ai.defineTool` to give the AI access to the `listings` collection. The AI should "lookup" current prices and availability before suggesting a package.
- **Profit Protection:** In the system prompt, instruct the AI: "Your goal is to maximize customer satisfaction while maintaining a minimum 30% profit margin based on the provided raw costs."
- **Visual Validation:** Use `imagen-4.0` (Text-to-Image) to render a preview of the custom "product" (e.g., a specific bouquet arrangement or a room setup) to increase conversion.

### 3. Example Schema for a Niche Assistant
```typescript
const RecommendationSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number(),
    reason: z.string().describe("Why this fits the user's budget/style")
  })),
  totalCost: z.number(),
  marginHealth: z.enum(['high', 'medium', 'low']),
  previewImageUrl: z.string().describe("A data URI of the generated visual preview"),
  customerSummary: z.string().describe("Marketing copy for the client")
});
```

### 4. Multi-Tenant AI
When an agent creates a new AI flow, it must be scoped to the `platformId`. 
- **System Prompt:** "You are the expert consultant for [PlatformName], specializing in [Niche]. You have access to our catalog and cost basis."
- **Context:** Fetch the `Platform` document and its associated inventory metadata before calling the LLM.

## Recommended Tools for Agents
- **Inventory Check:** Querying `/platforms/{pId}/listings`.
- **Pricing Calculator:** Adjusting `totalPrice` based on dynamic variables (e.g., "urgent delivery fee").
- **Visualizer:** Calling `ai.generate` with the `googleai/imagen-4.0` model to create a realistic mock-up of the service/product.

## Time-Based Consulting
For service-based platforms (e.g., "Venue Hire"), the "Cost" isn't just physical items—it's **overhead per hour**. The AI should calculate if a specific booking time-slot is "profitable" considering staff costs and utility overheads before recommending it to the customer.
