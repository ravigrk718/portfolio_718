const express = require("express");
const cors = require("cors");
const products = require("../data/products.json");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "sports-shop-api" });
});

app.get("/api/products", (req, res) => {
  const { category, search } = req.query;
  const normalizedCategory = String(category || "").toLowerCase();
  const normalizedSearch = String(search || "").toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !normalizedCategory || product.category.toLowerCase() === normalizedCategory;
    const matchesSearch =
      !normalizedSearch ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.category.toLowerCase().includes(normalizedSearch) ||
      product.description.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  res.json({ products: filteredProducts });
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json({ product });
});

app.post("/api/checkout", (req, res) => {
  const cartItems = Array.isArray(req.body.items) ? req.body.items : [];

  if (cartItems.length === 0) {
    return res.status(400).json({ message: "Add at least one item to checkout." });
  }

  const lineItems = [];
  for (const cartItem of cartItems) {
    const product = products.find((item) => item.id === cartItem.id);
    const quantity = Number(cartItem.quantity);

    if (!product || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Your cart contains an invalid item." });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: `${product.name} has only ${product.stock} items available.`
      });
    }

    lineItems.push({
      id: product.id,
      name: product.name,
      quantity,
      price: product.price,
      subtotal: Number((product.price * quantity).toFixed(2))
    });
  }

  const subtotal = lineItems.reduce((total, item) => total + item.subtotal, 0);
  const shipping = subtotal >= 150 ? 0 : 9.99;
  const tax = subtotal * 0.0825;
  const total = subtotal + shipping + tax;

  return res.json({
    orderId: `SS-${Date.now()}`,
    lineItems,
    subtotal: Number(subtotal.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2)),
    message: "Checkout estimate created successfully."
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => {
  console.log(`Sports Shop API running at http://localhost:${port}`);
});
