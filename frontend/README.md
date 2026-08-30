# Agreement Risk Scanner : Frontend

The React frontend for the Agreement Risk Scanner. This application allows users to upload or paste Terms of Service agreements and uses AI to identify clauses that may require closer legal review.

## Features

- **Onboarding Flow:** A smooth, animated 3-step get-started flow to introduce new users to the product.
- **Document Analysis:** Upload `.txt`, `.pdf`, `.docx`, and other text formats, or paste text directly, and instantly generate a risk analysis.
- **Risk Visualization:** Interactive dashboard displaying clause counts, severity levels, and risk distribution.
- **Smart Filtering:** Sort findings by High, Medium, and Fair priorities to focus on what matters most.
- **User Account Management:** Secure JWT authentication, personalized profile page, and scan history management.
- **Responsive Design:** Fully responsive UI built with CSS custom properties.

## Tech Stack

- **Framework:** [Next.js 13+ (App Router)](https://nextjs.org/docs/app)
- **Language:** JavaScript / React
- **Styling:** Custom CSS with Global Variables (CSS Modules for local styles)
- **Authentication:** JWT (JSON Web Tokens) with `localStorage` persistence
- **Document Parsing:** `pdfjs-dist` (PDF) & `mammoth` (DOCX)
- **HTTP Client:** Native `fetch` API

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

````

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root of the `frontend` directory and add the following environment variables:

   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

| Variable              | Description                                  | Example                                              |
| :-------------------- | :------------------------------------------- | :--------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | The base URL for the backend FastAPI server. | `https://agreement-risk-scanner.onrender.com/api/v1` |

## Available Scripts

- **`npm run dev`** - Starts the development server with hot-reload.
- **`npm run build`** - Builds the application for production.
- **`npm start`** - Starts the production server.
- **`npm run lint`** - Lints the codebase for errors.

## Folder Structure

```text
frontend/
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/                # Next.js App Router (Pages & Routing)
│   │   ├── profile/        # User profile and logout page
│   │   ├── scan/           # Agreement scanning page
│   │   ├── history/        # Scan history archive
│   │   ├── results/        # Analysis results dashboard
│   │   ├── onboarding/     # Multi-step user onboarding
│   │   └── layout.js       # Global layout (Navbar & Footer)
│   ├── components/         # Reusable UI components
│   ├── context/            # Global state (Auth, Theme)
│   ├── lib/                # API & utility functions
│   └── styles/             # Global CSS styles
└── package.json
```

## Deployment

This application is designed to be deployed on [Vercel](https://vercel.com) or any Node.js hosting platform.

When deploying, make sure to set the `NEXT_PUBLIC_API_URL` environment variable in your hosting platform's settings to point to your production backend.


````
