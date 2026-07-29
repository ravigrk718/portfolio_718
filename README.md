# SportSphere Shopping Website

A sports-themed shopping website built with Next.js for the storefront, a Node.js
Express backend for product and checkout APIs, and plain CSS for styling.

## Features

- Responsive sports ecommerce landing page
- Product search and sport category filters
- Cart quantity controls and total calculation
- Express API with product listing, product detail, health check, and checkout estimate endpoints
- Shared product catalog in `data/products.json`

## Getting started

Install dependencies:

```bash
npm install
```

Run the frontend and backend together:

```bash
npm run dev
```

The Next.js app runs at `http://localhost:3000` and the API runs at
`http://localhost:4000`.

## Useful scripts

```bash
npm run dev       # Run Next.js and Express together
npm run dev:web   # Run only the Next.js frontend
npm run dev:api   # Run only the Node.js backend
npm run build     # Build the Next.js frontend
npm start         # Start both production commands
```

## API endpoints

- `GET /api/health`
- `GET /api/products`
- `GET /api/products?category=Running`
- `GET /api/products?search=shoes`
- `GET /api/products/:id`
- `POST /api/checkout`

Checkout request body:

```json
{
  "items": [
    { "id": "aero-runner-shoes", "quantity": 1 }
  ]
}
```
