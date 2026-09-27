# Order Tracking Screen

React + Vite + Tailwind CSS order tracking UI based on the supplied brief.

## Run

```bash
npm install
npm run dev
```

## Included

- Responsive 360–430px mobile-first layout
- Clear visual delivery timeline
- On-time, delayed, and delivered-but-not-received states
- Contextual next-step messaging
- Estimated delivery date/time
- Product/order summary
- Order details modal
- Contact/report issue support modal
- Loading skeleton
- Static JSON data in `src/data/orders.json`

## Production integration

The small "Preview status" control at the top is only for demonstrating the three required states. In a real app, remove it and set `selectedState` from your API/order status.

Replace the static `orders.json` import with your API request when backend data is available.
