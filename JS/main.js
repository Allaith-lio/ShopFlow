const TopSalesCards = document.querySelector(".cradsTopSales");
const ProductsContainer = document.getElementById("productsContainer");
const productDetalis = document.getElementById("productDeltalis");
const search = document.getElementById("search");
const searchingBtn = document.getElementById("searchingBtn");
const errorMessage = document.getElementById("errorMessage");
let errorMessageTimer;

const detailsBuyBtn = document.getElementById("detailsBuyBtn");

const selecting = document.getElementById("selecting");
const filteringBtn = document.getElementById("filteringBtn");
const loginPage = document.getElementById("loginPage");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const accountToggle = document.getElementById("accountToggle");
const accountSidebar = document.getElementById("accountSidebar");
const accountBackdrop = document.getElementById("accountBackdrop");
const accountClose = document.getElementById("accountClose");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartItemSummary = document.getElementById("cartItemSummary");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const checkoutBackdrop = document.getElementById("checkoutBackdrop");
const checkoutDialog = document.getElementById("checkoutDialog");
const checkoutClose = document.getElementById("checkoutClose");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutItems = document.getElementById("checkoutItems");
const checkoutItemCount = document.getElementById("checkoutItemCount");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutTransferAmount = document.getElementById(
  "checkoutTransferAmount",
);
const checkoutError = document.getElementById("checkoutError");
const checkoutSuccess = document.getElementById("checkoutSuccess");
const checkoutSuccessMessage = document.getElementById(
  "checkoutSuccessMessage",
);
const checkoutDone = document.getElementById("checkoutDone");
const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");
const themeToggle = document.getElementById("themeToggle");
const productsPagination = document.getElementById("productsPagination");
const previousPageButton = document.getElementById("previousPage");
const nextPageButton = document.getElementById("nextPage");
const paginationStatus = document.getElementById("paginationStatus");
const productsPerPage = 8;
let currentProducts = [];
let currentPage = 1;

function applyTheme(theme, persist = false) {
  const isDark = theme === "dark";
  document.body.classList.toggle("darkTheme", isDark);
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    `Switch to ${isDark ? "light" : "dark"} mode`,
  );
  themeToggle.title = `Switch to ${isDark ? "light" : "dark"} mode`;
  themeToggle.querySelector(".themeToggleIcon i").className =
    `fa-solid fa-${isDark ? "sun" : "moon"}`;
  themeToggle.querySelector(".themeToggleText").textContent = isDark
    ? "Light"
    : "Dark";

  if (persist) {
    localStorage.setItem("shopflowTheme", theme);
  }
}

try {
  applyTheme(localStorage.getItem("shopflowTheme") === "dark" ? "dark" : "light");
} catch (error) {
  console.error("Could not read the saved theme.", error);
  applyTheme("light");
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("darkTheme")
    ? "light"
    : "dark";
  try {
    applyTheme(nextTheme, true);
  } catch (error) {
    console.error("Could not save the selected theme.", error);
    applyTheme(nextTheme);
    showErrorMessage("Theme changed, but could not be saved on this device.");
  }
});

try {
  const savedLogin = JSON.parse(
    localStorage.getItem("shopflowLogin") || "null",
  );
  if (
    savedLogin &&
    savedLogin.isLoggedIn === true &&
    typeof savedLogin.username === "string" &&
    typeof savedLogin.email === "string"
  ) {
    loginPage.hidden = true;
  }
} catch (error) {
  console.error("Could not read the saved login state.", error);
  loginMessage.textContent =
    "We couldn't read the saved sign-in details. Please sign in again.";
  loginMessage.hidden = false;
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loginMessage.hidden = true;

  const formData = new FormData(loginForm);
  const username = String(formData.get("username")).trim();
  const email = String(formData.get("email")).trim();

  try {
    localStorage.setItem(
      "shopflowLogin",
      JSON.stringify({ username, email, isLoggedIn: true }),
    );
    updateAccountProfile();
    loginPage.hidden = true;
  } catch (error) {
    console.error("Could not save the login state.", error);
    loginMessage.textContent =
      "We couldn't save your sign-in details on this device. Please try again.";
    loginMessage.hidden = false;
  }
});

async function getApi() {
  const response = await fetch(`https://dummyjson.com/products`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
//NOTE
//i wont to code a detalies page to the clicking product
//and i want to handle the search and the filtering also and the quantity and less products
//and i want to bulit a fake pay card for prodcuts that the user buy it

function getDetalis(product) {
  const rating = Number(product.rating);
  const safeRating = Number.isFinite(rating)
    ? Math.min(5, Math.max(0, rating))
    : 0;
  const roundedRating = Math.round(safeRating);
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];

  productDetalis.innerHTML = `
    <article class="detailsDialog" data-id="${product.id}" role="dialog" aria-modal="true" aria-labelledby="detailsTitle">
      <button class="detailsClose" type="button" aria-label="Close product details">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
      <img class="detailsImage" src="${escapeHtml(product.images[0])}" alt="${escapeHtml(product.title)}" />
      <div class="detailsInfo">
        <span class="detailsCategory">${escapeHtml(product.category)}</span>
        <h2 id="detailsTitle">${escapeHtml(product.title)}</h2>
        <p class="detailsDescription">${escapeHtml(product.description)}</p>
        <div class="detailsRating" aria-label="Rated ${safeRating.toFixed(1)} out of 5">
          <span class="ratingStars" aria-hidden="true">${"★".repeat(roundedRating)}${"☆".repeat(5 - roundedRating)}</span>
          <strong>${safeRating.toFixed(1)}</strong>
          <span>out of 5</span>
        </div>
        <p class="detailsPrice">$${product.price.toFixed(2)}</p>
        <button class="detailsBuyBtn" type="button" id="detailsBuyBtn">
          Buy Now <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
        </button>
        <section class="detailsReviews" aria-labelledby="reviewsTitle">
          <h3 id="reviewsTitle">Customer reviews <span>(${reviews.length})</span></h3>
          ${
            reviews.length
              ? `<ul class="reviewsList">
                  ${reviews
                    .map((review) => {
                      const reviewRating = Number(review.rating);
                      const safeReviewRating = Number.isFinite(reviewRating)
                        ? Math.min(5, Math.max(0, reviewRating))
                        : 0;
                      const reviewDate = new Date(review.date);
                      const formattedDate = Number.isNaN(reviewDate.getTime())
                        ? ""
                        : reviewDate.toLocaleDateString();

                      return `
                        <li class="reviewItem">
                          <div class="reviewHeader">
                            <strong>${escapeHtml(review.reviewerName || "Customer")}</strong>
                            <span class="reviewStars" aria-label="${safeReviewRating} out of 5">
                              ${"★".repeat(Math.round(safeReviewRating))}${"☆".repeat(5 - Math.round(safeReviewRating))}
                            </span>
                          </div>
                          <p>${escapeHtml(review.comment || "")}</p>
                          ${formattedDate ? `<time>${formattedDate}</time>` : ""}
                        </li>`;
                    })
                    .join("")}
                </ul>`
              : '<p class="noReviews">No reviews yet.</p>'
          }
        </section>
      </div>
    </article>`;
  productDetalis.classList.add("is-open");
  productDetalis.setAttribute("aria-hidden", "false");
  document.body.classList.add("detailsOpen");
  productDetalis.querySelector(".detailsClose").focus();
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

function getCart() {
  const savedCart = JSON.parse(localStorage.getItem("mycards") || "[]");
  if (!Array.isArray(savedCart)) {
    throw new Error("The saved cart data is invalid.");
  }

  return savedCart.map((item) => {
    const id = Number(item.id);
    const price = Number(item.price);
    const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
    if (
      !Number.isFinite(id) ||
      typeof item.title !== "string" ||
      !Number.isFinite(price)
    ) {
      throw new Error("A saved cart item has invalid product data.");
    }

    return {
      id,
      title: item.title,
      price,
      image: typeof item.image === "string" ? item.image : "",
      quantity,
    };
  });
}

function saveCart(cart) {
  localStorage.setItem("mycards", JSON.stringify(cart));
}

function updateAccountProfile() {
  try {
    const user = JSON.parse(localStorage.getItem("shopflowLogin") || "null");
    profileUsername.textContent =
      user?.isLoggedIn && typeof user.username === "string"
        ? user.username
        : "ShopFlow shopper";
    profileEmail.textContent =
      user?.isLoggedIn && typeof user.email === "string"
        ? user.email
        : "Sign in to see your account";
  } catch (error) {
    console.error("Could not load the account profile.", error);
    profileUsername.textContent = "ShopFlow shopper";
    profileEmail.textContent = "Profile details are unavailable";
  }
}

function renderCart() {
  const cart = getCart();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  cartCount.textContent = String(totalQuantity);
  cartCount.setAttribute(
    "aria-label",
    `${totalQuantity} ${totalQuantity === 1 ? "item" : "items"} in cart`,
  );
  cartItemSummary.textContent = `${totalQuantity} ${
    totalQuantity === 1 ? "item" : "items"
  }`;
  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
  checkoutButton.disabled = cart.length === 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cartEmpty">
        <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
        <strong>Your cart is waiting</strong>
        <span>Add a product and it will show up here.</span>
      </div>`;
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <article class="cartItem">
          <img
            class="cartItemImage"
            src="${escapeHtml(item.image || "https://dummyjson.com/image/80x80")}"
            alt="${escapeHtml(item.title)}"
          />
          <div class="cartItemInfo">
            <strong>${escapeHtml(item.title)}</strong>
            <span class="cartItemPrice">$${item.price.toFixed(2)} each</span>
            <div class="cartQuantity" aria-label="Quantity controls">
              <button
                class="quantityButton"
                type="button"
                data-cart-action="decrease"
                data-product-id="${item.id}"
                aria-label="${item.quantity === 1 ? "Remove" : "Decrease quantity for"} ${escapeHtml(item.title)}"
              >
                <i class="fa-solid fa-minus" aria-hidden="true"></i>
              </button>
              <span class="quantityValue">${item.quantity}</span>
              <button
                class="quantityButton"
                type="button"
                data-cart-action="increase"
                data-product-id="${item.id}"
                aria-label="Increase quantity for ${escapeHtml(item.title)}"
              >
                <i class="fa-solid fa-plus" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <strong class="cartLineTotal">$${(item.price * item.quantity).toFixed(2)}</strong>
        </article>`,
    )
    .join("");
}

function openCheckout() {
  try {
    const cart = getCart();
    if (cart.length === 0) {
      showErrorMessage("Add an item to your cart before checkout.");
      return;
    }

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const formattedTotal = `$${total.toFixed(2)}`;

    checkoutItems.innerHTML = cart
      .map(
        (item) => `
          <article class="checkoutItem">
            <img
              src="${escapeHtml(item.image || "https://dummyjson.com/image/64x64")}"
              alt=""
            />
            <div class="checkoutItemInfo">
              <strong>${escapeHtml(item.title)}</strong>
              <span>Qty ${item.quantity} · $${item.price.toFixed(2)} each</span>
            </div>
            <strong class="checkoutItemPrice">$${(item.price * item.quantity).toFixed(2)}</strong>
          </article>`,
      )
      .join("");
    checkoutItemCount.textContent = `${itemCount} ${
      itemCount === 1 ? "item" : "items"
    }`;
    checkoutSubtotal.textContent = formattedTotal;
    checkoutTotal.textContent = formattedTotal;
    checkoutTransferAmount.textContent = formattedTotal;
    checkoutForm.reset();
    checkoutForm.hidden = false;
    checkoutSuccess.hidden = true;
    checkoutError.hidden = true;
    checkoutError.textContent = "";
    checkoutBackdrop.hidden = false;
    document.body.classList.add("checkoutOpen");
    checkoutClose.focus();
  } catch (error) {
    console.error("Could not prepare checkout.", error);
    showErrorMessage("Could not prepare checkout. Please try again.");
  }
}

function closeCheckout() {
  checkoutBackdrop.hidden = true;
  document.body.classList.remove("checkoutOpen");
  if (checkoutButton.disabled) {
    accountClose.focus();
  } else {
    checkoutButton.focus();
  }
}

checkoutButton.addEventListener("click", openCheckout);
checkoutClose.addEventListener("click", closeCheckout);
checkoutDone.addEventListener("click", closeCheckout);
checkoutBackdrop.addEventListener("click", (event) => {
  if (event.target === checkoutBackdrop) closeCheckout();
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  checkoutError.hidden = true;

  try {
    const cart = getCart();
    if (cart.length === 0) {
      throw new Error("The cart is empty.");
    }

    const orders = JSON.parse(localStorage.getItem("shopflowOrders") || "[]");
    if (!Array.isArray(orders)) {
      throw new Error("Saved order history is not a valid list.");
    }

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const orderId = `SF-${Date.now()}`;
    const order = {
      id: orderId,
      date: new Date().toISOString(),
      items: cart.map(({ id, title, price, image, quantity }) => ({
        id,
        title,
        price,
        image,
        quantity,
      })),
      total,
      paymentMethod: "Sham Cash",
      status: "Saved locally; payment not processed",
    };

    localStorage.setItem("shopflowOrders", JSON.stringify([...orders, order]));
    saveCart([]);
    renderCart();
    checkoutForm.hidden = true;
    checkoutSuccessMessage.textContent = `Order ${orderId} was saved for $${total.toFixed(2)}.`;
    checkoutSuccess.hidden = false;
    checkoutDone.focus();
  } catch (error) {
    console.error("Could not save the demo order.", error);
    checkoutError.textContent =
      "We couldn't save this demo order. Your cart has not been cleared; please try again.";
    checkoutError.hidden = false;
  }
});

function openAccountSidebar() {
  updateAccountProfile();
  try {
    renderCart();
  } catch (error) {
    console.error("Could not load the saved cart.", error);
    showErrorMessage("Could not load your saved cart.");
    return;
  }

  accountBackdrop.hidden = false;
  accountSidebar.inert = false;
  accountSidebar.setAttribute("aria-hidden", "false");
  accountSidebar.classList.add("is-open");
  accountToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("accountOpen");
  accountClose.focus();
}

function closeAccountSidebar() {
  accountSidebar.classList.remove("is-open");
  accountSidebar.setAttribute("aria-hidden", "true");
  accountSidebar.inert = true;
  accountBackdrop.hidden = true;
  accountToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("accountOpen");
  accountToggle.focus();
}

accountToggle.addEventListener("click", openAccountSidebar);
accountClose.addEventListener("click", closeAccountSidebar);
accountBackdrop.addEventListener("click", closeAccountSidebar);

cartItems.addEventListener("click", (event) => {
  const control = event.target.closest("[data-cart-action]");
  if (!control) return;

  try {
    const productId = Number(control.dataset.productId);
    const action = control.dataset.cartAction;
    const updatedCart = getCart()
      .map((item) => {
        if (item.id !== productId) return item;
        return {
          ...item,
          quantity: item.quantity + (action === "increase" ? 1 : -1),
        };
      })
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
    renderCart();
  } catch (error) {
    console.error("Could not update the cart.", error);
    showErrorMessage("Could not update your cart. Please try again.");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !checkoutBackdrop.hidden) {
    closeCheckout();
    return;
  }
  if (event.key === "Escape" && accountSidebar.classList.contains("is-open")) {
    closeAccountSidebar();
  }
});

updateAccountProfile();
try {
  renderCart();
} catch (error) {
  console.error("Could not load the saved cart.", error);
  showErrorMessage("Could not load your saved cart.");
}

function showErrorMessage(message) {
  errorMessage.querySelector(".errorMessageText").textContent = String(message);
  errorMessage.hidden = false;
  clearTimeout(errorMessageTimer);
  errorMessageTimer = setTimeout(() => {
    errorMessage.hidden = true;
  }, 6000);
}

function hideErrorMessage() {
  clearTimeout(errorMessageTimer);
  errorMessage.hidden = true;
}

errorMessage
  .querySelector(".errorMessageClose")
  .addEventListener("click", hideErrorMessage);

searchingBtn.addEventListener("click", async () => {
  try {
    const searching = search.value.trim();
    if (!searching) {
      showErrorMessage("Enter a product name to search.");
      search.focus();
      return;
    }

    const response = await fetch(
      `https://dummyjson.com/products/search?q=${encodeURIComponent(searching)}`,
    );
    if (!response.ok) {
      throw new Error(`Search request failed with status ${response.status}.`);
    }

    await renderProdctus(response.json());
  } catch (error) {
    console.error(error);
    showErrorMessage(
      "Could not search products. Check your connection and try again.",
    );
  }
});

function AddTocart(product) {
  const cart = getCart();
  const existingProduct = cart.find((item) => item.id === Number(product.id));

  if (existingProduct) {
    existingProduct.quantity += 1;
    existingProduct.title = product.title;
    existingProduct.price = Number(product.price);
    existingProduct.image =
      product.thumbnail || product.images?.[0] || existingProduct.image;
  } else {
    cart.push({
      id: Number(product.id),
      title: product.title,
      price: Number(product.price),
      image: product.thumbnail || product.images?.[0] || "",
      quantity: 1,
    });
  }

  saveCart(cart);
  renderCart();
  return cart;
}

async function handleDetailsClick(e) {
  const detailsButton = e.target.closest(".detailsBtn");
  const buyNowBtn = e.target.closest(".buyBtn");
  const buyNowDetalis = e.target.closest(".detailsBuyBtn");
  const clickedButton = detailsButton || buyNowBtn || buyNowDetalis;
  if (!clickedButton) return;

  const productCard = clickedButton.closest("[data-id]");
  if (!productCard) return;

  try {
    const productId = productCard.dataset.id;
    const response = await fetch(
      `https://dummyjson.com/products/${encodeURIComponent(productId)}`,
    );
    if (!response.ok) {
      throw new Error(`Product request failed with status ${response.status}.`);
    }
    const product = await response.json();
    if (buyNowBtn || buyNowDetalis) {
      AddTocart(product);
      console.log(`${product.title} added to cart.`);
      return;
    }

    getDetalis(product);
  } catch (error) {
    console.error(error);
    showErrorMessage(
      buyNowBtn || buyNowDetalis
        ? "Could not add this product to your cart. Please try again."
        : "Could not open product details. Please try again.",
    );
  }
}

ProductsContainer.addEventListener("click", handleDetailsClick);
TopSalesCards.addEventListener("click", handleDetailsClick);
productDetalis.addEventListener("click", handleDetailsClick);

function closeProductDetails() {
  productDetalis.classList.remove("is-open");
  productDetalis.setAttribute("aria-hidden", "true");
  document.body.classList.remove("detailsOpen");
}

productDetalis.addEventListener("click", (e) => {
  if (e.target === productDetalis || e.target.closest(".detailsClose")) {
    closeProductDetails();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && productDetalis.classList.contains("is-open")) {
    closeProductDetails();
  }
});

filteringBtn.addEventListener("click", async () => {
  console.log(selecting.value);
  const res = await fetch(
    `https://dummyjson.com/products/category/${selecting.value}`,
  );

  renderProdctus(res.json());
  console.log(res);
});

previousPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage -= 1;
    renderProductsPage();
  }
});

nextPageButton.addEventListener("click", () => {
  const totalPages = Math.ceil(currentProducts.length / productsPerPage);
  if (currentPage < totalPages) {
    currentPage += 1;
    renderProductsPage();
  }
});

async function renderTopSales() {
  try {
    let data = await fetch(`https://dummyjson.com/products?limit=5&skip=7`);
    data = await data.json();
    TopSalesCards.innerHTML = data.products
      .map(
        (product) => `
        <div class="card" data-id="${product.id}">
          <div class="cardInfo">
            <img
              src="${product.thumbnail}"
              alt="TopSalesProduct"
            />

            <h3>${product.title}</h3>
            <div class="catpri">
              <p>${product.category}</p>
              <p>${product.price}$</p>
              
            </div>
            <button class="detailsBtn" type="button">More Details</button>
          </div>
        </div>  
        `,
      )
      .join("");
  } catch (error) {
    console.error(error);
    showErrorMessage("Could not load top-selling products. Please try again.");
  }
}
async function renderProdctus(res) {
  try {
    const data = await res;
    if (!Array.isArray(data.products)) {
      throw new Error("The products response did not contain a products list.");
    }
    if (data.products.length === 0) {
      currentProducts = [];
      currentPage = 1;
      ProductsContainer.innerHTML = "";
      productsPagination.hidden = true;
      showErrorMessage(`No products found for "${search.value.trim()}".`);
      return;
    }

    currentProducts = data.products;
    currentPage = 1;
    renderProductsPage();
  } catch (error) {
    console.error(error);
    showErrorMessage(
      "Could not load products. Check your connection and try again.",
    );
  }
}

function renderProductsPage() {
  const startIndex = (currentPage - 1) * productsPerPage;
  const visibleProducts = currentProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );
  const totalPages = Math.ceil(currentProducts.length / productsPerPage);

  ProductsContainer.innerHTML = visibleProducts
      .map(
        (product) =>
          `
    <div class="productCard"  id="procard" data-id="${product.id}">
          <img
            src="${product.images[0]}"
            alt="product"
          />
          <h3>${product.title}</h3>
          <div class="cardinfo">
            <h4>${product.category}</h4>
            <h3>Price:${product.price}$</h3>
            <button class="buyBtn" type="button">Buy Now <i class="fa-solid fa-bag-shopping"></i></button>
            <button class="detailsBtn" type="button">More Details</button>
          </div>
        </div>`,
      )
      .join("");

  productsPagination.hidden = totalPages <= 1;
  previousPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === totalPages;
  paginationStatus.textContent = `Page ${currentPage} of ${totalPages}`;
}
renderProdctus(getApi());
renderTopSales();
