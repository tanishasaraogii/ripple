# Ripple

**One great experience ripples into the next.**

Ripple turns the most exciting moment of a guest's day — the minutes right after they finish an experience — into the start of their next one. The instant a tour, show, or activity wraps, Ripple sends a warm, personalized WhatsApp message recommending the perfect next experience nearby, with a special post-experience offer ready to book in a single tap.

It's a live-ops growth play for Headout: meet guests at their highest-intent moment, delight them with a recommendation that feels hand-picked, and turn one great memory into two.

## Why this moment matters

A guest who just stepped out of the Colosseum is curious, energized, and already in "explore mode." They're in the city, they have the afternoon ahead of them, and they're in exactly the right mindset to say yes to something wonderful. Ripple meets them there — phone in hand, glow of a great experience still fresh — with a recommendation that fits the moment perfectly.

The result is a same-day second booking that feels like a thoughtful concierge tip rather than a sales pitch. Guests get more out of their trip, and Headout grows revenue from customers it has already won.

## How it works

1. **Sense the finish.** Ripple knows when a guest's experience is wrapping up and lines them up in a live ops queue with a countdown.
2. **Fire the moment.** The instant the experience ends, a personalized WhatsApp message lands — greeting the guest by name, celebrating what they just did, and recommending the ideal next experience close by.
3. **Make it irresistible.** Tapping the message opens the Headout app to the recommended experience, complete with a post-experience perk and a friendly countdown that keeps the moment alive.
4. **Book in a tap.** The guest checks out in seconds.
5. **Deliver instantly.** A polished e-ticket drops right back into the same WhatsApp thread, with a tappable voucher — closing the loop in the channel the guest already loves.

Throughout the demo, live counters show bookings and revenue climbing as guests convert, making the impact tangible at a glance.

## The demo

Ripple ships as a beautifully animated, phone-framed simulation you can click through end to end:

- **Landing** — the vision in one screen.
- **Ops console** — a live queue of guests about to finish, each with a real-time countdown.
- **The moment fires** — tap a guest to open the WhatsApp thread where their personalized recommendation has just arrived.
- **The offer** — the in-app experience page with imagery, highlights, a post-experience perk, and a live offer countdown.
- **Booking & e-ticket** — complete checkout and watch the e-ticket appear back in the WhatsApp thread.

Every interaction is designed to feel like the real thing: authentic WhatsApp styling, Headout's brand language, smooth motion, and thoughtful micro-details.

## Highlights

- **Perfect timing** — engages guests at the peak-intent moment, right after an experience.
- **Personalized recommendations** — suggestions tuned to what the guest just did, where they are, and how far they'd travel.
- **Native to WhatsApp** — meets guests in the messaging app they already use every day.
- **One-tap booking** — a frictionless path from message to confirmed e-ticket.
- **Same-day second bookings** — grows revenue from existing, already-delighted customers.
- **Live impact view** — bookings and revenue update in real time as guests convert.

## Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Animation:** Framer Motion
- **Language:** TypeScript
- **Monorepo:** pnpm workspaces
- **Type:** Plus Jakarta Sans
- **Brand:** Headout purple (`#8000FF`) and magenta (`#E5006E`)

## Run it

```bash
pnpm install
pnpm --filter @workspace/moment-after run dev
```

Open the preview to explore the full flow. To typecheck:

```bash
pnpm --filter @workspace/moment-after run typecheck
```

## Project structure

Ripple lives as the `moment-after` artifact inside a pnpm monorepo:

```
artifacts/moment-after/
├── index.html
├── public/experiences/      # experience photography
└── src/
    ├── components/          # ScreenLanding, ScreenDashboard, WhatsApp views,
    │                        # HeadoutVoucher, HeadoutAppOffer, PaymentGateway
    └── lib/data.ts          # guests, experience catalogue, recommendation logic
```

## Roadmap ideas

- Connect to live booking signals to fire in real production conditions.
- Smarter recommendations powered by guest history and real-time availability.
- Multi-channel delivery (WhatsApp, app push, email) chosen per guest.
- A/B-tested offers and timing windows to maximize delight and conversion.

---

*Built on Replit.*
