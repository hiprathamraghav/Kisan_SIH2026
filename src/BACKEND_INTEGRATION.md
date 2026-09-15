# Kisan backend integration

## Authentication routes

| User | Route | Credential |
| --- | --- | --- |
| Kisan registration | `/auth/kisan/signup` | Name, mobile, state, district, password |
| Kisan login | `/auth/kisan/login` | Mobile number or generated Kisan ID, plus password |
| Admin login | `/auth/admin/login` | Mobile number or Admin ID, plus password |

Credentials are checked by the two NextAuth providers in `src/auth.ts`. The callback route is `/api/auth/[...nextauth]`; sessions use signed JWTs. The `/farmer/*` and `/operator/*` route layouts enforce the matching role before a page is rendered.

## Server action to screen mapping

| Existing Kisan screen | Action | UI event |
| --- | --- | --- |
| Farmer registration | `registerKisan` | Signup submit; display returned `kisanId` |
| Farmer dashboard / status / payment | `getKisanDashboard` | Initial server-side page load or client refresh |
| Book procurement slot | `createBooking` | Confirm booking after crop, centre, slot, quantity selection |
| Notifications | `markNotificationRead` | Notification is opened |
| Operator dashboard / slots / queue | `getOperatorDashboard` | Initial server-side page load or client refresh |
| Operator check-in | `checkInBooking` | Check-in confirmation |
| Operator queue | `callNextFarmer` | Call next farmer |
| Procurement processing | `completeProcurement` | Confirm weight, grade, rate, remarks |
| Payment management | `updatePaymentStatus` | Processing / received action |

All mutations validate inputs with Zod and check the current session on the server. Client forms should use `useServerAction` to surface `isPending`, an action error, and returned data. The supplied signup form is the reference implementation using React Hook Form plus `zodResolver`; `LoginForm` follows the same validation pattern and delegates credential exchange to NextAuth.

## Replacing prototype state

The current `src/components/prototype/prototype-store.tsx` is intentionally a local demo store. Replace each mutation there with the matching action in the table above, then refresh its state from `getKisanDashboard` or `getOperatorDashboard`. Do not write procurement, payment, or booking state to localStorage once Neon is configured; local state should only hold transient UI choices such as an open dialog and a selected slot.

## Environment and startup

1. Copy `.env.example` to `.env` and add the Neon pooled connection URL as `DATABASE_URL`.
2. Set a high-entropy `AUTH_SECRET`.
3. Run `pnpm db:migrate --name initial_kisan_schema`, followed by `pnpm db:seed` for development data.
4. Start with `pnpm dev`.

The development seed credentials are `9876543210` / `Kisan@123` for the Kisan and `ADM-MEERUT-01` / `Kisan@123` for the administrator.
