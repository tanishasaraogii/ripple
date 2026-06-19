# Ripple

**One great experience ripples into the next.**

Headout's highest-intent customer is someone who *just finished an experience*. We've been sending them nothing. Until now.

Ripple is a live-ops demo for Headout that fires a perfectly-timed, personalized WhatsApp message the moment a guest finishes an experience, recommending the ideal next bookable experience nearby — a same-day second-booking, zero-CAC revenue recovery play.

## The idea

A guest finishes, say, a Colosseum tour. Minutes later their phone buzzes: a WhatsApp message from Headout recommending a sunset rooftop aperitivo 7 minutes away — with a post-experience discount that expires in 40 minutes. They tap, book in-app, and get an e-ticket back in the same thread. No ad spend, no re-acquisition cost — just the right nudge at the highest-intent moment.

## The demo

The app is a single-screen, phone-framed simulation:

1. **Landing** — the pitch.
2. **Ops console** — a live queue of guests whose experiences are about to end, each with a countdown timer.
3. **The moment fires** — when a guest's timer hits zero, you tap their card to open the WhatsApp thread where the personalized recommendation has just landed.
4. **The offer** — tapping the message opens the Headout app view with the recommended experience, a post-experience discount, and a 40-minute countdown.
5. **Booking & e-ticket** — completing payment drops an e-ticket message back into the WhatsApp thread, with a tappable voucher.

Running totals (bookings, recovered revenue) update live as guests convert.

## Stack

- **Frontend:** React + Vite + Tailwind CSS, Framer Motion for animation
- **Language:** TypeScript
- **Monorepo:** pnpm workspaces
- **State:** in-memory only — no backend, no database (it's a demo)
- **Type:** Plus Jakarta Sans
- **Brand:** Headout purple (`#8000FF`) and magenta (`#E5006E`)

## Run it

```bash
pnpm install
pnpm --filter @workspace/moment-after run dev
```

Then open the preview. To typecheck:

```bash
pnpm --filter @workspace/moment-after run typecheck
```

## Where things live

This is a pnpm monorepo. The Ripple app is the `moment-after` artifact:

```
artifacts/moment-after/
├── index.html
├── public/experiences/      # experience photos
└── src/
    ├── components/          # ScreenLanding, ScreenDashboard, WhatsApp*, HeadoutVoucher, HeadoutAppOffer, PaymentGateway
    └── lib/data.ts          # demo guests, experience catalogue, recommendation logic
```

---

*Built on Replit. Demo only — not affiliated with or endorsed by Headout.*
