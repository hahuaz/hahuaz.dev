---
title: "Shopify product search but with slider"
summary: "Product search with slider section is a great way to showcase your products in a stylish and interactive manner."
createdAt: "2023-01-29"
tags: ['shopify', 'liquid']
image: '/images/posts/shopify-product-search-but-with-slider/shopify.webp'
---
The Search Slider Shopify section is a great way to showcase your
products in a stylish and interactive manner. It consists of a
search bar and a slider that displays a set of products. The slider
is powered by Swiper, a popular JavaScript library for creating
sliders and carousels. The section allows customers to search for
products by typing in a product name in the search bar. The slider
will then display only the products that match the search query.

## What will we build?

<div>
  <video src="/images/posts/shopify-product-search-but-with-slider/2023-01-29 15-30-17.mkv" autoPlay loop muted></video>
</div>

The Shopify documentation only covers the basics of working with the [Form tag](https://shopify.dev/themes/architecture/templates/search) and lacks technical depth. While they aim for simplicity, this results in developers having to search through theme code in their IDE rather than finding the information they need in the documentation. Our landing page will display a server-side rendered slider, and user inputs will dynamically update it via AJAX requests for a seamless experience.

For improved user experience, we'll implement a debounced input that instantly displays the products as soon as the user finishes typing, actually after one second, eliminating the need to hit enter.

The completed section can be found in this [dawn theme](https://github.com/hahuaz/shopify-themes/blob/dev/dawn-main/sections/search-slide.liquid). You can clone the repo and directly start your own development environment.

## Prerequisites

- Having experience with [Shopify theme architecture](https://shopify.dev/themes/architecture).
- Having experience with DOM manipulation.

### Start typing...

#### Create initial HTML content on server side:

```html
<!-- Slides -->
{% for product in collections.all.products %}
  <div class="swiper-slide">
    <div class="swiper__container">
      <div class="image__container">
        {{ product | image_url: width: 300 | image_tag }}
        <div class="add-cart">ADD TO CART</div>

        <div class="badge"><span>Best</span><span>Seller</span></div>
      </div>
      <div class="product__content">
        <p class="product__title">{{ product.title }}</p>
        <p class="product__price">{{ product.price | money_without_currency }} $</p>
      </div>
    </div>
  </div>
{% endfor %}
```
- To show the slide on initial load, access `collections.all.products` object on the server side and loop over them.
- You can target a specific category here or stop the loop by using `loop.index`, which is available inside the loop.

#### Create Swiper class in isolation:

```js
(function () {
let swiper;
const createSwiper = () => {
  swiper = new Swiper('.{{ section.id }} .swiper', {
    slidesPerGroupAuto: true,
    breakpoints: {
      0: {
        slidesPerView: 3,
        //spaceBetween: 20,
      },
    },
    pagination: {
      el: '.{{ section.id }} .swiper-pagination',
      dynamicBullets: true,
      clickable: true,
    },
    // autoplay: {
    //  delay: 5000,
    // },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
};
createSwiper();

if (Shopify.designMode) {
  // This will only render in the theme editor
  document.addEventListener('shopify:section:load', function (event) {
    createSwiper();
  });
})();
  ```

- We can use IIF to encapsulate scope.   
The purpose of an IIFE is to execute code in its own scope,
which helps prevent variable collisions and protect the data
privacy. It's crucial to encapsulate scope if we use same slider
section on the page multiple times.
-  Pay attention how We utilize `{{ section.id }}` in javascript to access unique swiper element.

#### Re-initiate Swiper on Shopify editor:
  
```js
if (Shopify.designMode) {
  // This will only render in the theme editor
  document.addEventListener('shopify:section:load', function (event) {
    createSwiper();
  });
}
  ```

- When a user makes changes in the Shopify editor, the DOM is refreshed but script files are not executed again, which means event listeners are removed and Swiper lost its functionality.   
To fix this, we added an event listener to the document for the
shopify.section:load event, which re-initiates the Swiper
instance between edits.

#### How to bounce search AJAX requests while the user is typing?
  
```js
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
} 
  ```

-  The debounce function is a utility function that helps limit the
                frequency of function calls. It is often used when working with
                events that can fire rapidly, such as scroll, resize, or input
                events, and you want to prevent expensive or slow functions from
                being executed too frequently.

#### Completed search-slide dot liquid file:

```html
{{ 'swiper-bundle.min.css' | asset_url | stylesheet_tag }}
{{ 'swiper-bundle.min.js' | asset_url | script_tag }}

{{ 'search-slide.css' | asset_url | stylesheet_tag }}

<!-- Slider main container -->
<div class="{{ section.id }} search-slide">
  <div class="search__container">
    <span>Search:</span>
    <input
      class=""
      type="text"
      placeholder="Type product name"
    >
  </div>

  <div class="swiper-outer">
    <div class="swiper">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
        <!-- Slides -->
        {% for product in collections.all.products %}
          <div class="swiper-slide">
            <div class="swiper__container">
              <div class="image__container">
                {{ product | image_url: width: 300 | image_tag }}
                <div class="add-cart">ADD TO CART</div>

                <div class="badge"><span>Best</span><span>Seller</span></div>
              </div>
              <div class="product__content">
                <p class="product__title">{{ product.title }}</p>
                <p class="product__price">{{ product.price | money_without_currency }} $</p>
              </div>
            </div>
          </div>
        {% endfor %}
      </div>
      <!-- If we need pagination -->
      <div class="swiper-pagination"></div>

      <!-- If we need navigation buttons -->
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>

      <!-- If we need scrollbar -->
      <div class="swiper-scrollbar"></div>
    </div>
  </div>
</div>

<script>
  (function () {
    let swiper;
    const createSwiper = () => {
      swiper = new Swiper('.{{ section.id }} .swiper', {
        slidesPerGroupAuto: true,
        breakpoints: {
          0: {
            slidesPerView: 3,
            //spaceBetween: 20,
          },
        },
        pagination: {
          el: '.{{ section.id }} .swiper-pagination',
          dynamicBullets: true,
          clickable: true,
        },
        // autoplay: {
        //  delay: 5000,
        // },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    };
    createSwiper();

    if (Shopify.designMode) {
      // This will only render in the theme editor
      document.addEventListener('shopify:section:load', function (event) {
        createSwiper();
      });
    }

    const sectionId = '{{ section.id }}';
    const SWIPER_OUTER = document.querySelector(`.${sectionId} .swiper-outer`);
    const SEARCH_EL = document.querySelector('.search__container input');

    const initialSlider = SWIPER_OUTER.innerHTML;

    const debouncedSearchProduct = debounce(searchProduct, 1000);

    SEARCH_EL.addEventListener('input', (e) => {
      const inputValue = e.target.value.trim();
      if (!inputValue) {
        swiper.destroy(true, true);
        SWIPER_OUTER.innerHTML = initialSlider;
        createSwiper();
        return;
      }
      debouncedSearchProduct(inputValue);
    });

    async function searchProduct(query) {
      console.log('query for:', query);
      const response = await fetch(`/search/suggest.json?q=${query}&resources[type]=product`);
      const {
        resources: {
          results: { products },
        },
      } = await response.json();
      console.log(products);

      // don't update ui if input value is changed since start of fetch.
      if (SEARCH_EL.value.trim() !== query) {
        return console.log('Query is changed since start of fetch. Doing nothing...');
      }

      if (!products || products.length === 0) {
        swiper.destroy(true, true);
        SWIPER_OUTER.innerHTML = `<div style="text-align:center; padding: 20px; font-size:20px; color:red;">There is no product for this query.</div>`;
        return;
      }

      // recreate html of swiper
      const slideItems = products.map((product) => {
        const slideItem = `<div class="swiper-slide">
          <div class="swiper__container">
            <div class="image__container">
              <img src="${product.image}" alt="bold star" width="300" height="200">
              <div class="add-cart">ADD TO CART</div>

              <div class="badge"><span>Best</span><span>Seller</span></div>
            </div>
            <div class="product__content">
              <p class="product__title">${product.title}</p>
              <p class="product__price">${product.price} $</p>
            </div>
          </div>
        </div>`;
        return slideItem;
      });

      const newSwiperContent = `<div class="swiper">
        <div class="swiper-wrapper">
          ${slideItems}
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination"></div>
    
        <!-- If we need navigation buttons -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
    
        <!-- If we need scrollbar -->
        <div class="swiper-scrollbar"></div>
      </div>`;

      SWIPER_OUTER.innerHTML = newSwiperContent;
      swiper.destroy(true, true);
      createSwiper();
    }

    function debounce(fn, delay) {
      let timeoutId;
      return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
      };
    }
  })();
</script>
```

- Install swiper bundles from [here](https://www.jsdelivr.com/package/npm/swiper) and add them to your assets folder.
- There is no re-render method on Swiper class. We need to destroy the existing instance to remove event listeners and create a new instance with brand new HTML content for every query.

#### search-slide dot scss file:
  
```css
.search-slide {
position: relative;

.search__container {
  text-align: center;
  margin: 3rem;
  input {
    outline: none;
    width: 250px;
  }
}

.swiper__container {
  max-width: 300px;
  margin: auto;
}

.image__container {
  position: relative;
  img {
    height: 250px;
    width: 100%;
    object-fit: cover !important;
  }
}
.add-cart {
  text-align: center;
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  padding: 0.7rem 0;
  border: none;
  letter-spacing: 0.04em;
  line-height: 1.4;
  text-transform: uppercase;
  font-weight: 600;
  border-radius: 50px;
  background-color: #937aad;
  color: #fff;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  transform: translateY(5px);
  transition: opacity 0.25s ease, transform 0.25s ease-out,
    background 0.4s ease;
}
.swiper-slide:hover .add-cart {
  opacity: 1;
  transform: translateY(-10px);
  transition: opacity 0.25s ease, transform 0.25s ease-out;
}

.badge {
  padding: 0;
  position: absolute;
  width: 45px;
  height: 45px;
  top: 1rem;
  right: 1rem;
  border-radius: 100%;
  background-color: #b29669;
  color: white;
  font-size: 13px;
  font-weight: thin;
  font-family: serif;
  display: grid;
  align-content: center;
  span {
    line-height: 1.2rem;
  }
}

.swiper-slide:nth-child(even) .badge {
  display: none;
}

.product__content {
  margin: 2rem 0;
}
.product__title {
  color: gray;
  font-weight: bold;
  font-size: 2rem;
  text-transform: uppercase;
  margin: 0;
}
.product__price {
  color: gray;
  font-weight: bold;
  margin: 0;
}

// config swiper
.swiper {
  max-width: 1300px;
}
.swiper-wrapper {
}

.swiper-button-prev,
.swiper-button-next {
  display: flex !important;
  color: black;
}
.swiper-pagination-bullet-active {
  background-color: black;
}
  ```