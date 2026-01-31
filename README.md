# CustPay - Customer Payment Dashboard

A high-performance, pixel-perfect dashboard for managing customer payments, built with modern React best practices. This project demonstrates clean architecture, efficient state management, and strict TypeScript patterns.

**🚀 [View Live Demo](https://customer-payment-dashboard-lilac.vercel.app/)**
## 🛠 Tech Stack

* **Framework:** React 18 (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + Shadcn UI
* **State Management:**
    * *Server State:* TanStack Query (React Query)
    * *Client State:* Zustand
* **Forms & Validation:** React Hook Form + Zod
* **Data Table:** TanStack Table (Headless UI)
* **Icons:** Lucide React

## ✨ Features

* **Responsive Data Table:** Sortable columns, custom cell renderers, and responsive layouts that handle long text gracefully.
* **Smart CRUD Operations:** Add, Update, and Delete customers with optimistic UI updates.
* **Robust Validation:** Strict Zod schemas ensure data integrity (e.g., preventing negative deposits).
* **Mock API Layer:** Simulated network latency (800ms) to demonstrate loading states and Skeleton UI.
* **Status Management:** Visual indicators for payment statuses (Paid, Due, Open, Inactive).
* **Currency Handling:** Locale-aware formatting for Canadian Dollars (CAD) to match the design (e.g., `$123.00` vs `CA$123.00`).

## 🏗 Architecture & Design Decisions

This project follows a **Separation of Concerns** architecture to avoid "God Components" and ensure maintainability.

### 1. State Separation
I strictly separated "Server State" from "Client State" to avoid synchronization bugs:
* **TanStack Query:** Handles all data fetching, caching, and invalidation. The UI never manually syncs this data to a local store.
* **Zustand:** Handles purely UI state (Modal visibility, Row selections) that doesn't need to persist to the server.

### 2. Component Composition
* **`DataTable.tsx`:** Acts as a pure presentational wrapper. It doesn't know *what* data it displays, only *how* to display it.
* **`useTableStore`:** A dedicated Zustand slice that manages table sorting and filtering, keeping the component logic clean.
* **`CustomerForm.tsx`:** Isolated form logic with its own validation schema, separate from the modal or table.

### 3. Mock Service Layer
Instead of hardcoding data in components, I created a `customerService.ts` layer. This mimics a real REST API with `Promises` and latency, making it trivial to swap out for a real backend (e.g., Axios/Fetch) in the future without refactoring the UI.

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/bhargavbapatla/Customer-Payment-Dashboard.git
    ```
2.  Install dependencies:
    ```bash
    cd payments-dashboard
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 📂 Project Structure

```text
src/
├── api/            # Mock Service Layer (simulates REST API)
├── components/     
│   ├── ui/         # Reusable Shadcn components
│   ├── table/      # DataTable logic (Columns, Pagination, Toolbar)
│   └── customers/  # Customer-specific forms and modals
├── hooks/          # Custom React Query hooks (useCustomers, useCreateCustomer)
├── lib/            # Utilities (cn, currency formatting)
├── store/          # Zustand stores (UI State, Table State)
└── types/          # Shared TypeScript interfaces
