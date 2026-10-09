const fs = require("fs");
const path = require("path");

const DATA = path.join(__dirname, "../data/products.json");
const PAGE = path.join(__dirname, "../index.html");
const START = "<!-- cards:start -->";
const END = "<!-- cards:end -->";

function readProducts(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error(`❌ Помилка зчитування або парсингу файлу ${filePath}:`, e.message);
    process.exit(1);
  }
}

function renderCard(product) {
  return `          <article class="product-card">
            <div class="product-card__image">
              <img src="${product.image}" alt="${product.title}" loading="lazy">
              <button class="product-card__add" aria-label="Add to cart">+</button>
            </div>
            <h3 class="product-card__title">${product.title}</h3>
            <div class="product-card__price">
              <span class="price-current">$${product.price.toFixed(2)}</span>
              ${product.oldPrice ? `<span class="price-old">$${product.oldPrice.toFixed(2)}</span>` : ""}
            </div>
          </article>`;
}

function inject(html, markup) {
  const startIndex = html.indexOf(START);
  const endIndex = html.indexOf(END);

  if (startIndex === -1 || endIndex === -1) {
    console.error(`❌ Маркери ${START} або ${END} не знайдено у файлі HTML!`);
    process.exit(1);
  }

  return (
    html.slice(0, startIndex + START.length) +
    "\n" +
    markup +
    "\n        " +
    html.slice(endIndex)
  );
}


const products = readProducts(DATA);
const markup = products.map(renderCard).join("\n");
const html = fs.readFileSync(PAGE, "utf8");

fs.writeFileSync(PAGE, inject(html, markup));
console.log(`✅ Згенеровано карток: ${products.length}`);