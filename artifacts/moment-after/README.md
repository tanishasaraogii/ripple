# The Moment After — Post-Experience Trigger Engine

After a guest finishes a Headout experience, they're standing somewhere amazing at peak euphoria with hours left in their day — and Headout sends them nothing. **The Moment After** fires one perfectly-timed, hyper-personalized WhatsApp message at the exact moment an experience ends, recommending the ideal next bookable experience nearby. It's a revenue-recovery play: same-day second bookings from customers who already trust the brand — zero new users, zero customer acquisition cost.

## How to run

```bash
pnpm install
pnpm --filter @workspace/moment-after run dev
```

The app runs entirely client-side — no API keys, no database, no backend, no network calls. All state is in-memory.

## Demo flow

1. **Landing** — the argument: Headout's highest-intent customer is someone who just finished an experience.
2. **Dashboard** — left panel shows 4 live guest bookings with countdown timers; right panel is the message preview.
3. **Trigger fires (automatic)** — Sarah's booking ends ~8 seconds after the dashboard loads. Her status pulses to FIRING NOW and the composed WhatsApp message slides in.
4. **Book Now** — clicking the CTA confirms a booking, increments the same-day second-booking counter, and surfaces "Revenue recovered · CAC: €0".
5. **What changes** — the closing summary: same-day second bookings, €0 CAC, sub-60-second trigger latency.

The other three guests (James, Priya, Marco) fire at staggered offsets, each producing a different, personalized recommendation to prove the engine adapts to category, distance, party size, and slot scarcity.

## The business case

- **Same-day second booking** from existing, high-intent customers at peak travel euphoria.
- **Zero CAC** — these are people who already booked and trust the brand.
- **Sub-60-second trigger latency** from experience end to message delivery.

## How it works

- **Recommendation engine** (deterministic, no ML): never the same category as what they just did; under 20 min walking; weighted by party size (solo → food/adventure, group → landmark/show); lowest available slots first as a scarcity signal.
- **Message composer**: builds a short, friendly WhatsApp-style message from the chosen recommendation.
- **Simulated delivery**: the WhatsApp UI is rendered on screen — no real WhatsApp API.

## Stack

React + Vite + Tailwind, framer-motion for animation. In-memory state only.
