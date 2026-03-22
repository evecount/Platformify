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

### 3. Time-Based Consulting & Yield Optimization
For service-based platforms (e.g., "Venue Hire"), the "Cost" isn't just physical items—it's **overhead per hour**. 
- **Dynamic Pricing:** The AI should calculate if a specific booking time-slot is "profitable" considering staff costs, utility overheads, and historical demand.
- **Deep Learning Loop:** As the platform collects data, agents should analyze `/bookings` to identify high-traffic windows and automatically suggest higher "Yield" prices for those peak times.

### 4. Example Schema for a Niche Assistant
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

## Recommended Tools for Agents
- **Inventory Check:** Querying `/platforms/{pId}/listings`.
- **Margin Calculator:** Adjusting `totalPrice` based on `baseCost` metadata to ensure profitability.
- **Visualizer:** Calling `ai.generate` with the `googleai/imagen-4.0` model to create a realistic mock-up of the service/product.
- **Yield Analyst:** Aggregating historical booking data to predict optimal pricing for future time-slots.
