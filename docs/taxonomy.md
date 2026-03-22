
# Behavioral Taxonomy: Universal Purchase Signals

This is the dictionary of "Hidden Variables" that the Platformify agents track across all niches. These are the inputs for the Global Prediction Model.

| Signal Key | Description | Prediction Weight |
|------------|-------------|-------------------|
| `urgency` | Lead time before the booking event. | High (Impacts Dynamic Pricing) |
| `intent` | Gift, Business, Celebration, or Utility. | Medium (Impacts Vibe & Upsell) |
| `sensitivity` | Ratio of rejected lower-priced options. | High (Impacts Yield Lift) |
| `aesthetic` | Preferred visual style (Minimal, Lush, etc). | Low (Impacts GenAI Previews) |
| `overhead` | Ratio of `baseCost` to `totalPrice`. | Critical (Impacts Profit Margin) |

## The Global Purchase Persona
Agents should aim to categorize every `Customer` into a cross-platform persona:
1. **The Premium Seeker:** High budget, low sensitivity, aesthetic-driven (Celebration intent).
2. **The Utility Optimizer:** High sensitivity, logic-driven, urgent (Business/Utility intent).
3. **The Relationship Builder:** High intent (Gift), emotional-driven, requires visual proof.

## Real-World Commodity Tracking
Aggregate movements in these signals allow the Orchestrator to predict:
- **Liquidity Shifts:** Regional changes in `sensitivity`.
- **Commodity Scarcity:** Upward pressure on `baseCost` across "Sister" niches.
- **Sentiment Volatility:** Shifts in `intent` distribution.
