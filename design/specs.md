# Store QR Design Specification

## Design Philosophy
**Efficiency, Trust, and Clarity** in a physical retail environment. Clean, minimal interface that makes customers feel in control — no surprises at checkout.

## Color Palette
- **Primary Blue**: #2563EB (trust, action, confidence)
- **Success Green**: #10B981 (confirmation, positive states)
- **Error Red**: #EF4444 (warnings, destructive actions)
- **Neutral Gray 50**: #F9FAFB (backgrounds, very light)
- **Neutral Gray 100**: #F3F4F6 (secondary backgrounds)
- **Neutral Gray 300**: #D1D5DB (borders, dividers)
- **Neutral Gray 600**: #4B5563 (secondary text)
- **Neutral Gray 900**: #111827 (primary text)
- **White**: #FFFFFF (cards, containers)

## Typography
- **Font Family**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Base Size**: 16px (mobile), 18px (desktop)
- **Line Height**: 1.5 (body), 1.3 (headings)

### Scales
- **Display**: 32px bold (page titles)
- **Heading 1**: 24px bold (section headers)
- **Heading 2**: 20px semibold (subsection headers)
- **Body**: 16px regular (standard text)
- **Small**: 14px regular (secondary text)
- **Tiny**: 12px regular (meta, timestamps)

## Spacing System (8px grid)
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

## Shadows
- **Elevation 1**: 0 1px 2px rgba(0,0,0,0.05)
- **Elevation 2**: 0 4px 6px rgba(0,0,0,0.07)
- **Elevation 3**: 0 10px 15px rgba(0,0,0,0.1)

## Border Radius
- Button/Input: 8px
- Card: 12px
- Badge: 4px

## Responsive Breakpoints
- **Mobile**: 320px - 640px (default)
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px+

---

## Customer Interface (Mobile-First)

### Home Page (`/customer`)
**Purpose**: Entry point. Scan QR or enter code to access order builder.

**Layout**:
- Full-screen centered container
- Logo/branding at top (48px spacing)
- QR code scanner component (occupies 60% of screen)
- OR divider with text
- Text input field: "Enter product code"
- Subtle help text: "Scan the product code from any item in the store"
- Optional login banner (sticky at bottom, 8px margin)

**States**:
- Initial: Ready to scan/input
- Loading: Spinner while searching product
- Not Found: Red error message "Product not found. Try again."
- Found: Success check, transitions to product confirmation

**Styling**:
- Background: Gray 50
- QR Scanner: Rounded corners, 2px border in Blue
- Input: 16px text, Blue focus ring, Gray 300 border
- CTA Button: Full width, Blue background, white text, 16px padding vertical, 12px horizontal

### Order Builder Page (`/customer/order`)
**Purpose**: Add items to "Buy" or "Deseados" (Wishlist) lists.

**Layout**:
- Top bar: "Your Order" header, close button (back)
- Two tabs: "Comprar" (active blue), "Deseados" (gray)
- List of items (scrollable)
- Bottom sticky footer: "Total: $XXX.XX", "Finalizar Compra" button

**Item Card** (each item):
- Product name (16px bold, Gray 900)
- SKU (12px, Gray 600)
- Color selector (if applicable): Small color swatches, 2px border when selected
- Price: 18px bold, Blue
- Quantity: -/+/input field, 8px padding
- Subtotal: 14px, Gray 600
- Delete button: Trash icon, 24px, Gray 400, hover→Red
- Divider: 1px Gray 100

**Empty State**:
- Centered message: "No items yet"
- Subtext: "Start scanning products to build your order"
- Illustration space (if available)

**States**:
- Item loading: Skeleton for 3 placeholder rows
- Error adding: Toast notification "Error adding item" in red, auto-dismiss 3s
- Success: Item appears with slide-in animation

**Styling**:
- Card background: White
- Borders: 1px Gray 100
- Buttons: Small, 12px text, 4px padding, Gray 100 background, Gray 900 text

### Confirmation Page (`/customer/confirmation`)
**Purpose**: Display order code and summary before presenting to cashier.

**Layout**:
- Top: "Pedido Finalizado" header with success checkmark (Green, 48px)
- Large order code box (32px monospace, centered, copyable)
- Copy button: "Copiar Código"
- Divider
- Order summary:
  - Items list (condensed, 2-3 lines max per item)
  - Subtotal, Tax (if applicable), Total (Bold, 20px Blue)
- Action buttons:
  - Primary: "Presentar en Caja" (Blue)
  - Secondary: "Volver al Inicio" (Gray)

**Styling**:
- Code box: Gray 100 background, Gray 900 text, 16px padding, 12px border radius, light Gray 300 border
- Success color: Green

---

## Cashier Panel (Responsive: Tablet/Desktop)

### Login Page (`/cashier/login`)
**Purpose**: Authenticate cashier before access to orders.

**Layout**:
- Centered card (max 400px wide)
- "Store QR - Caja" heading
- Form fields:
  - Email input
  - Password input
- Error message area (if login fails): Red text, 14px
- Submit button: "Ingresar"
- Footer: Help text "Contactar soporte"

**Styling**:
- Card: White background, Elevation 2, 16px padding
- Inputs: 16px, Blue focus ring, Gray 300 border
- Error text: Red

### Orders Page (`/cashier/orders`)
**Purpose**: List all pending orders waiting for cashier verification.

**Layout**:
- Header: "Pedidos Pendientes" (24px bold)
- Search/Filter bar: "Buscar por código de orden" (if many orders)
- Table (responsive, stacks on mobile):
  - Columns: Order Code | Items | Total | Status | Actions
  - Rows: Each order
  - Status badge: "Pendiente" (Gray), "Pagado" (Green), "Entregado" (Green), "Cancelado" (Red)
  - Action button: "Ver Detalles" (Small, Blue)
- Empty state: "No hay pedidos pendientes"

**Styling**:
- Table: White background, Gray 100 header row, 1px Gray 300 borders
- Status badge: Rounded, 4px padding, 12px font, colored backgrounds with matching text
- Rows: Hover→ Gray 50 background

### Order Detail Page (`/cashier/orders/[id]`)
**Purpose**: Verify order details and update status.

**Layout**:
- Top bar: Back button, Order code (large, bold)
- Order info section:
  - Created time (12px Gray 600)
  - Status: "Pending" with dropdown to change
- Products section:
  - Product table: Name | Qty | Unit Price | Subtotal
  - Each row: Product name, quantity, individual price, row total
- Total section:
  - Subtotal, Taxes (if applicable), Total (Bold, 18px Blue)
- Action buttons:
  - Primary: "Confirmar y Cobrar" (Blue)
  - Secondary: "Cancelar Pedido" (Red outline)
- Status history (optional): Timestamps of status changes

**Styling**:
- Card sections: White background, Elevation 1, 16px margin bottom
- Product table: White, Gray 100 header, 1px Gray 300 borders
- Confirm button: Blue background, white text, 16px padding

---

## Shared Components

### Button
**Variants**:
- Primary (Blue bg, white text, Elevation 1)
- Secondary (Gray 100 bg, Gray 900 text)
- Danger (Red bg, white text)
- Outline (Transparent, Gray 900 border, Gray 900 text)

**States**:
- Default: Full opacity
- Hover: Darker shade (apply opacity -10%)
- Active: Darker shade (opacity -15%)
- Disabled: Gray 300 bg, Gray 600 text, no cursor

**Sizing**:
- Large: 16px padding vertical, 24px horizontal, 16px font
- Medium: 12px padding vertical, 16px horizontal, 14px font
- Small: 8px padding vertical, 12px horizontal, 12px font

### Input Field
**Styling**:
- 16px padding vertical, 12px horizontal
- 1px border (Gray 300)
- Blue focus ring (2px, offset 2px)
- Placeholder: Gray 600, italic
- Error state: Red border, Red error text below (12px)
- Disabled: Gray 100 background, Gray 400 text

### Loading Skeleton
**Purpose**: Placeholder while loading data.

**Styling**:
- Background: Gray 200
- Height: Match expected content
- Border radius: 8px
- Animation: Pulse (opacity 0.5 → 1 → 0.5, 2s)
- For lists: 3 skeleton rows with 8px margin between

### Toast Notification
**Styling**:
- Position: Bottom-right (16px margin)
- Background: Gray 900
- Text: White, 14px
- Padding: 12px 16px
- Border radius: 8px
- Animation: Slide up + fade in (200ms)
- Auto-dismiss: 3s

**Variants**:
- Success: Green background
- Error: Red background
- Info: Blue background

### Status Badge
**Styling**:
- Padding: 4px 8px
- Border radius: 4px
- Font: 12px, semibold
- Colors:
  - Pending: Gray 100 bg, Gray 900 text
  - Paid: Green bg, white text
  - Delivered: Green bg, white text
  - Cancelled: Red bg, white text

---

## Interaction Patterns

### Form Validation
- Real-time feedback (on blur)
- Inline error messages below field (Red text, 12px)
- Submit button disabled until form valid
- Success states: Green checkmark next to field

### Confirmations
- Modal dialog for destructive actions
- Title, description, cancel/confirm buttons
- Confirm button: Red background
- Cancel button: Gray outline

### Loading States
- Page/section: Skeleton loaders (not spinners)
- Button: Spinner inside button, text unchanged
- Inline: Gray text "Cargando..."

### Error Handling
- API errors: Toast notification + fallback message
- Form errors: Inline validation + submit disabled
- Network errors: Retry option

---

## Accessibility
- WCAG 2.1 Level AA compliance
- Focus indicators: 2px Blue ring with 2px offset
- Color contrast: 4.5:1 minimum
- Touch targets: 44px minimum (mobile)
- Semantic HTML: Proper heading hierarchy, ARIA labels where needed
- Keyboard navigation: Tab order follows visual flow

---

## Mobile-First Approach
- Default: 320px viewport
- All layouts tested at 375px (iPhone), 768px (iPad), 1024px+ (desktop)
- Touch-friendly spacing (12px minimum between interactive elements)
- Readable text sizes (16px minimum body text)
