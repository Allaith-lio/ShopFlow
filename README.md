# ShopFlow

ShopFlow is a responsive, front-end e-commerce demo built with HTML, CSS, and
vanilla JavaScript. Browse products from the DummyJSON API, view product details,
manage a persistent cart, and save a simulated order in the browser.

> **Demo notice:** ShopFlow does not provide real authentication or process
> payments. The Sham Cash checkout is a visual payment-method example only.
> Orders are saved locally in the current browser; no money is transferred.

## Features

- Product catalog and featured products loaded from [DummyJSON](https://dummyjson.com/).
- Product search and category filtering.
- Product details dialog with ratings, reviews, and an add-to-cart action.
- Cart sidebar with item images, quantity controls, line totals, and cart total.
- Checkout review that saves an order locally and clears the cart after success.
- Persistent light and dark themes.
- Responsive layouts for desktop and mobile.
- Input, network-error, and empty-results feedback.
- Font Awesome icons and a Sham Cash logo loaded from the official Sham Cash website.

## Getting started

### Requirements

- A modern web browser.
- An internet connection to load product data and remote fonts, icons, and the
  Sham Cash logo.
- A local static web server is recommended. The app uses `fetch()` to request
  product data, which may not work consistently when `index.html` is opened
  directly as a `file://` URL.

### Run locally

1. Download or clone this project.
2. Open the project folder in Visual Studio Code.
3. Start a static server, such as the **Live Server** extension.
4. Open the local URL provided by the server (usually
   `http://127.0.0.1:5500`).

No build step, package installation, or environment variables are required.

## How to use

1. Enter a username, email address, and password on the welcome form. This is
   only a local demo sign-in; the password is not saved.
2. Browse the featured products and catalog.
3. Search for a product or choose a category and apply the filter.
4. Use **More Details** to view product information and reviews. Use **Buy Now**
   to add a product to your cart.
5. Open the profile/cart button in the navigation to review items and adjust
   quantities.
6. Choose **Continue to checkout**, review your order, and confirm that you
   understand the order is saved only in this browser.
7. Select **Save order** to save the demo order locally. Checkout does not
   communicate with Sham Cash or any payment provider.

## Project structure

```text
.
├── index.html
├── CSS/
│   └── style.css
├── JS/
│   └── main.js
├── Free Stock Photos, PNGs, Templates & Mockups _ rawpixel.png
├── SHOPFLOW-ACCOUNT-CART.md
└── README.md
```

| File                                                          | Purpose                                                                                              |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `index.html`                                                  | Single-page layout, sign-in form, navigation, product areas, cart, checkout, and footer.             |
| `CSS/style.css`                                               | Visual design, responsive layouts, dialogs, and light/dark theme styling.                            |
| `JS/main.js`                                                  | API requests, rendering, search/filtering, product details, cart, theme, and demo checkout behavior. |
| `Free Stock Photos, PNGs, Templates & Mockups _ rawpixel.png` | Local image used in the home section.                                                                |
| `SHOPFLOW-ACCOUNT-CART.md`                                    | Additional notes about the account and cart implementation.                                          |

## Product API

ShopFlow uses DummyJSON's public product endpoints:

- Catalog: `https://dummyjson.com/products`
- Featured products: `https://dummyjson.com/products?limit=5&skip=7`
- Search: `https://dummyjson.com/products/search?q={query}`
- Category: `https://dummyjson.com/products/category/{category}`
- Product details: `https://dummyjson.com/products/{id}`

The catalog displays eight products per page. Product data and images depend on
the availability of the external API.

## Browser storage

The app uses `localStorage` so demo data remains available after a page reload
in the same browser:

| Key              | Data stored                                                                  |
| ---------------- | ---------------------------------------------------------------------------- |
| `shopflowLogin`  | Demo username, email, and sign-in state. The password is never stored.       |
| `mycards`        | Cart product IDs, titles, prices, image URLs, and quantities.                |
| `shopflowTheme`  | Selected theme (`light` or `dark`).                                          |
| `shopflowOrders` | Locally saved demo orders, including items, total, date, and payment status. |

This storage is specific to the browser and device. It is not synced to an
account or server. Clearing browser site data removes the saved profile, cart,
theme choice, and orders.

## Important limitations

- The sign-in form is not connected to a server and does not authenticate users.
- Checkout only stores an order in browser storage. It does not charge a card,
  contact a bank, or make a Sham Cash transfer.
- There is no separate order-history page; saved orders are kept in
  `localStorage`.
- The app is a single-page website with sections, not a multi-page storefront.
- Product favorites and sorting controls are not currently implemented.

Do not enter real passwords, card numbers, wallet credentials, or other
sensitive payment information.
