# AI Orchestration Guide: Building Niche Assistants

This guide is for AI Agents/Orchestrators looking to extend Platformify with intelligent, niche-specific booking assistants.

## The "Florist" Pattern: Intent to Structured Output

When building an assistant like the "Florist Bouquet Builder," follow this Genkit-centric pattern:

### 1. Define the Business Logic (The "Constraints")
Don't just ask the AI to "suggest a bouquet." Pass it the hard constraints as context:
- **Inventory:** What flowers are in stock?
- **Margins:** What is the cost vs. retail price?
- **Seasonality:** Is it currently available?

### 2. Implementation Strategy
- **Tools over Prompts:** Use `ai.defineTool` to give the AI access to the `listings` collection (inventory).
- **Structured Output:** Always use Zod schemas for the output. An AI should return a JSON object that the UI can immediately render as a "Recommended Booking."

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
  customerSummary: z.string().describe("Marketing copy for the client")
});
```

### 4. Multi-Tenant AI
When an agent creates a new AI flow, it must be scoped to the `platformId`. 
- **System Prompt:** "You are the expert assistant for [PlatformName], specializing in [Niche]."
- **Context:** Fetch the `Platform` document first to inject the brand voice into the LLM.

## Recommended Tools for Agents
- **Inventory Check:** Querying `/platforms/{pId}/listings`.
- **Pricing Calculator:** Adjusting `totalPrice` based on dynamic variables (e.g., "urgent delivery").
- **Visualizer:** Using `imagen-4.0` to generate a preview of the custom "product" before the customer books.
