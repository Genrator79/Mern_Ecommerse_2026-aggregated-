# MERN E-Commerce Project Milestones & Progress Tracker

This document serves as the single source of truth for the project milestones, implementation status, and verification progress.

---

## Milestone Progress Overview

| Milestone | Title | Status | Approval | Notes |
| :--- | :--- | :---: | :---: | :--- |
| **Milestone 1** | Environment Setup & Native Authentication Migration | `Completed` | ✅ Completed | Remove Clerk, implement native JWT + bcrypt, role-based auth |
| **Milestone 2** | Product & Category Management + Cloudinary Integration | `Completed` | ✅ Completed | Admin CRUD, customer catalog, filters, search, Cloudinary uploads |
| **Milestone 3** | Shopping Cart, Wishlist & Address Management | `Completed` | ✅ Completed | Guest/User cart sync, inventory validation, address CRUD & selector |
| **Milestone 4** | Backend Order Validation, Simulated Payment Engine & Atomic Stock | `Completed` | ✅ Completed | Server-side price & stock check, simulated payment (Success/Failure), atomic decrement |
| **Milestone 5** | Order Confirmation, Customer Tracking/Returns & Admin Dashboard | `Pending Approval` | ⏳ Awaiting | Order confirmation, customer order history, returns, admin order status & dashboard stats |
| **Milestone 6** | End-to-End System Testing & Final Acceptance Verification | `Pending` | — | Full testing across all flows, payment edge cases, clean builds |

---

## Detailed Milestone Breakdown

### Milestone 1: Environment Setup & Native Authentication Migration
- **Status**: `Completed`
- **Scope & Objectives**:
  - [x] Install missing dependencies in `server` and `client` (including `bcryptjs`, `jsonwebtoken`, and type definitions).
  - [x] Align database connection to use `MONGODB_URI` from `.env`.
  - [x] Update `User` model:
    - [x] Add `password` field (hashed with bcrypt).
    - [x] Ensure `email` is unique and lowercase.
    - [x] Make `clerkUserId` optional/remove dependency.
    - [x] Support roles: `user` and `admin`.
  - [x] Implement native backend auth routes (`server/src/routes/auth/auth.routes.ts`):
    - [x] `POST /auth/register` (hashes password, assigns `admin` if email matches `ADMIN_EMAILS`, otherwise `user`).
    - [x] `POST /auth/login` (verifies credentials, generates JWT token).
    - [x] `GET /auth/me` (returns current user profile and role using JWT).
    - [x] `POST /auth/logout`.
  - [x] Update auth middlewares (`server/src/middleware/auth.ts`):
    - [x] `requireAuth` to verify Bearer JWT token from `Authorization` header.
    - [x] `requireAdmin` to enforce `role === "admin"`.
  - [x] Clean up backend server:
    - [x] Remove `@clerk/express` and `clerkMiddleware()` from `server/src/server.ts`.
    - [x] Remove Clerk environment variables from `server/.env`.
  - [x] Update client-side authentication:
    - [x] Remove `@clerk/react` provider from `client/src/main.tsx`.
    - [x] Implement native Sign-In and Sign-Up UI forms with email/password in `client/src/pages/auth/` using existing Shadcn components.
    - [x] Update auth store (`client/src/features/auth/store.ts` and `api.ts`) to manage JWT token in storage.
    - [x] Wire up `setApiTokenGetter` in `client/src/lib/api.ts` to attach JWT token.
    - [x] Ensure `RoleGuardLayout` and `ProtectedLayout` work seamlessly with native auth state.
    - [x] Remove Clerk environment variables from `client/.env`.
- **Milestone 1 Acceptance Criteria**:
  - Customer can register and log in; Admin can register/log in with admin email and get admin privileges.
  - Token persists on refresh; unauthenticated users cannot access protected routes.
  - Clerk completely removed from project.

---

### Milestone 2: Product & Category Management with Cloudinary Integration
- **Status**: `Completed`
- **Scope & Objectives**:
  - [x] Category Management (Admin):
    - [x] Category listing, creation, updating, and deletion (`/admin/categories`).
  - [x] Product Management (Admin):
    - [x] Product creation with title, description, category, brand, stock, price, sale percentage, sizes, colors.
    - [x] Product update and deletion (`DELETE /admin/products/:id`).
    - [x] Cloudinary image upload pipeline (`uploadManyBuffersToCloudinary`) with graceful local fallback buffer handling.
    - [x] Stock and inventory editing (`PATCH /admin/products/:id/stock`).
  - [x] Customer Catalog:
    - [x] Product listing with category filtering, brand filtering, color/size filtering, and sorting (price, recency).
    - [x] Product search functionality across title, brand, and description.
    - [x] Product details page with image gallery, size/color selectors, and stock indicator.
- **Milestone 2 Acceptance Criteria**:
  - Admin can manage categories and products with images uploaded to Cloudinary.
  - Customer can browse, search, and view product details accurately.

---

### Milestone 3: Shopping Cart, Wishlist & Address Management
- **Status**: `Completed`
- **Scope & Objectives**:
  - [x] Shopping Cart Backend:
    - [x] Endpoints for fetching cart, adding items, updating quantities, removing items, and clearing cart (`DELETE /cart`).
    - [x] Cart synchronization when guest user logs in (`POST /cart/sync` bug fixes: batching outside loop & Cart.create).
    - [x] Live stock validation when adding/updating items (stock check on add/increase).
    - [x] Duplicate item prevention bug fix (`itemIndex >= 0`).
  - [x] Shopping Cart Frontend:
    - [x] Cart drawer component with item list, quantity controls (`+` / `-`), remove button, clear all button.
    - [x] Guest cart support via localStorage syncing upon sign-in.
    - [x] Open cart drawer upon adding to cart from product details.
  - [x] Customer Address Management:
    - [x] Address CRUD in profile (fullName, address, state, postalCode, isDefault).
    - [x] Address selector during checkout workflow with quick management toggle.
    - [x] Automatic address state synchronization between profile and checkout drawer.
  - [x] Wishlist verification and integration (add, list, remove).
- **Milestone 3 Acceptance Criteria**:
  - Cart operations (add/remove/quantity adjust) update correctly and reflect actual product availability.
  - Addresses can be created, edited, and selected for checkout.

---

### Milestone 4: Backend Order Validation, Simulated Payment Engine & Atomic Stock Processing
- **Status**: `Completed`
- **Scope & Objectives**:
  - [x] Server-Side Calculation & Validation:
    - [x] Recalculate all item prices, promo discounts, and total order amounts strictly on the backend using database prices.
    - [x] Verify product stock and active status before initiating order.
    - [x] Never trust frontend prices or totals.
  - [x] Simulated / Dummy Payment Implementation:
    - [x] Provide options for payment simulation: `Simulate Success` vs `Simulate Failure / Cancel`.
    - [x] Retain Razorpay credentials as optional future config without requiring active Razorpay credentials.
    - [x] Payment simulation modal in client allowing testers/users to trigger success or failure outcomes.
  - [x] Atomic Stock & Order State Handling:
    - [x] On Payment Success:
      - [x] Atomically decrement product inventory (e.g. `$inc: { stock: -qty }` with stock condition) to prevent overselling.
      - [x] Decrement promo usage count if applied.
      - [x] Set `paymentStatus = "paid"` and `orderStatus = "placed"`.
      - [x] Award customer reward points (10% cashback in points).
      - [x] Save payment transaction details in MongoDB.
      - [x] Clear customer cart items.
    - [x] On Payment Failure / Cancel:
      - [x] Mark payment as `failed`.
      - [x] Do NOT deduct inventory or decrement promo code.
      - [x] Retain customer cart items.
      - [x] Prevent duplicate payment processing.
  - [x] Independent lifecycle management for `paymentStatus` and `orderStatus`.
- **Milestone 4 Acceptance Criteria**:
  - Successful payments create a confirmed order, deduct stock atomically, and clear the cart.
  - Failed payments do not alter stock or empty the cart, and display appropriate error feedback.

---

### Milestone 5: Order Confirmation, Customer Tracking/Returns & Admin Dashboard
- **Status**: `Pending`
- **Scope & Objectives**:
  - [ ] Order Confirmation UI:
    - [ ] Dedicated order confirmation screen showing order code, items, delivery details, and final amount.
  - [ ] Customer Order History & Tracking:
    - [ ] View list of previous orders with statuses (`placed`, `shipped`, `delivered`, `returned`, `cancelled`).
    - [ ] Order return/cancellation functionality with automatic stock restoration.
  - [ ] Admin Order Management:
    - [ ] Order listing with customer details, item breakdown, and current payment/order statuses.
    - [ ] Update order status (`placed` -> `shipped` -> `delivered` -> `returned`).
  - [ ] Admin Dashboard Statistics:
    - [ ] Metrics for total products, total categories, total orders, returned orders, and total sales (from paid orders).
- **Milestone 5 Acceptance Criteria**:
  - Customer can track orders and initiate returns/cancellations.
  - Admin can view orders, update statuses, and monitor dashboard sales analytics.

---

### Milestone 6: End-to-End System Testing & Final Acceptance Verification
- **Status**: `Pending`
- **Scope & Objectives**:
  - [ ] Verify complete e-commerce journey:
    - [ ] Admin creates product with image upload and stock.
    - [ ] Customer registers/logs in.
    - [ ] Customer browses products, filters, searches, and adds to cart.
    - [ ] Customer proceeds to checkout with delivery address.
    - [ ] Test simulated failed payment -> Verify proper error, cart intact, stock unchanged.
    - [ ] Test simulated successful payment -> Verify order confirmed, stock deducted, cart cleared.
    - [ ] Customer views order in order history.
    - [ ] Admin updates order status in Admin Orders view.
    - [ ] Admin verifies dashboard sales metrics increase.
  - [ ] Final security, code cleanup, and TypeScript compilation audit across server and client.
- **Milestone 6 Acceptance Criteria**:
  - Complete end-to-end journey works without errors.
  - All acceptance criteria satisfied.

---

## Current Execution Focus

**Milestone 1 Completed**: Native authentication system successfully migrated and verified.
**Milestone 2 Completed**: Product & category management, Cloudinary integration, and search/filtering completed and verified.
**UI Polish Committed** (`210a489`): Frontend aesthetic improvements — hero CTA overlay, product card hover effects + quick-view pill, rounded swatches, solid sale badge, sign-in/sign-up spacing fixes, Collections empty state icon. Pushed to `main`.
**Milestone 3 Completed**: Shopping cart (CRUD, stock check, duplicate fix, guest sync, clear cart), wishlist, and customer address management (CRUD, checkout selector, real-time sync).
**Milestone 4 Completed**: Server-side price calculation, simulated payment engine (Success / Failure simulation modal), atomic inventory decrement, reward points, and cart clearing.
**Currently Pending Approval**: `Milestone 5: Order Confirmation, Customer Tracking/Returns & Admin Dashboard`
