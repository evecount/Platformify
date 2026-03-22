# AI Orchestration Guide: Building Niche Assistants

This guide is for AI Agents/Orchestrators looking to extend Platformify with intelligent, niche-specific booking assistants.

## The "Sister Schema" Architecture
Platformify is designed around the concept of **Sister Schemas**. While each platform is a separate tenant with its own brand and niche, they all operate under a standardized data contract (`Listing`, `Booking`, `Customer`). 

### Why this matters for Deep Learning:
- **Standardized Data Lakes:** Because every "Bali Villa" and "London Studio" follows the same schema, the platform can aggregate anonymized data to identify global patterns in consumer behavior.
- **Cross-Tenant Intelligence:** An AI agent trained on one tenant's successful booking patterns can offer "Best Practice" recommendations to a new tenant (e.g., "In the 'Villa' niche, listings with 5+ amenities convert 30% better").
- **Predictive Yield Models:** The "Sister" nature of these schemas allows for a massive dataset where time-based performance can be predicted across similar (but independent) markets.

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
- **Deep Learning Loop:** As the platform collects data across all "Sister" platforms, agents analyze aggregate `/bookings` to identify high-traffic windows and automatically suggest higher "Yield" prices for those peak times globally.

## Recommended Tools for Agents
- **Inventory Check:** Querying `/platforms/{pId}/listings`.
- **Margin Calculator:** Adjusting `totalPrice` based on `baseCost` metadata to ensure profitability.
- **Visualizer:** Calling `ai.generate` with the `googleai/imagen-4.0` model to create a realistic mock-up of the service/product.
- **Yield Analyst:** Aggregating historical booking data across "Sister Schemas" to predict optimal pricing for future time-slots.
