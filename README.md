# Store QR Frontend

Modern, mobile-first web application for self-managed order creation in retail environments.

## Features

### Customer Interface
- **Home**: Entry point with navigation to customer or cashier panels
- **Order Builder** (`/customer`): Search products by SKU, add to cart (Comprar/Deseados lists), manage quantities and colors
- **Confirmation** (`/customer/confirmation`): Review order summary, receive unique order code

### Cashier Panel
- **Login** (`/cashier/login`): Authentication with email/password
- **Order Lookup** (`/cashier/orders`): Search orders by code, verify details
- **Order Details** (`/cashier/orders/[id]`): Update order status (pending→paid→delivered), view full breakdown

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4
- **State**: React hooks + localStorage
- **API Client**: Axios + Zod validation
- **Build**: Vercel Next.js build system

## Project Structure

```
app/
├── page.tsx                    # Landing page
├── layout.tsx                  # Root layout
├── customer/
│   ├── page.tsx               # Order builder
│   ├── confirmation/
│   │   └── page.tsx           # Order confirmation
│   └── layout.tsx             # Customer layout with header
├── cashier/
│   ├── login/
│   │   └── page.tsx           # Login form
│   ├── orders/
│   │   ├── page.tsx           # Order search & lookup
│   │   ├── [id]/
│   │   │   └── page.tsx       # Order detail & actions
│   │   └── layout.tsx         # Cashier layout with header
│   └── layout.tsx
components/
├── Button.tsx                 # Primary, secondary, danger, ghost variants
├── Input.tsx                  # Text input with label, error, helper text
├── Card.tsx                   # Container component
├── Alert.tsx                  # Error, success, warning, info alerts
├── Skeleton.tsx               # Loading placeholders
└── ConfirmationClient.tsx     # Order confirmation logic
lib/
├── api.ts                     # Typed API client with Zod schemas
└── hooks.ts                   # useProductSearch, useOrder, useAuth
design/
└── specs.md                   # Design specification (colors, typography, components)
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_ENABLE_PAYMENT=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Installation & Running

```bash
npm install
npm run dev    # Start dev server on http://localhost:3000
npm run build  # Production build
npm start      # Start production server
npm run lint   # Run linter
```

## Type Safety

TypeScript strict mode enabled with:
- No implicit any
- Strict null checks
- No unused variables/parameters
- Exhaustive switch cases
- Interface validation with Zod

Run type check: `npx tsc --noEmit`

## Design System

- **Color Palette**: Blue (#2563EB), Green (#10B981), Red (#EF4444), Grays
- **Typography**: System fonts, 16px base, 1.5 line-height
- **Spacing**: 8px grid (xs/sm/md/lg/xl/2xl)
- **Shadows**: Three elevation levels for depth
- **Border Radius**: 8px buttons/inputs, 12px cards
- **Responsive**: Mobile-first (320px→768px→1024px+)

See `design/specs.md` for complete specification.

## API Integration

Uses typed Axios client (`lib/api.ts`) with endpoints:
- Products: Search, get, list, create, update, delete
- Orders: Create, retrieve by code, list, get by ID, update status
- Auth: Register, login

All API calls validate response types with Zod schemas.

## Features Implemented

✅ Customer order builder with buy/wishlist separation
✅ SKU search with product details (name, price, colors, stock)
✅ Quantity management and color selection
✅ Order confirmation with unique code generation
✅ Cashier authentication and session management
✅ Order lookup and verification
✅ Order status workflow (pending→paid→delivered→cancelled)
✅ Loading skeletons and error handling
✅ Responsive design (mobile, tablet, desktop)
✅ Tailwind CSS styling per design specs
✅ TypeScript strict mode compliance
