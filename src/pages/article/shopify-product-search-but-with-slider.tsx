import { useEffect } from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import {
  gradientDark as terminalStyle,
  vs2015 as codeStyle,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';

import Prism from 'prismjs';
// import 'prismjs/themes/prism-okaidia.css';
import 'prism-themes/themes/prism-vsc-dark-plus.css';

export default function Article() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <>
      <main className="max-w-screen-xl mx-auto  py-9">
        <div className="max-w-screen-md [&>.code]:max-w-screen-md space-y-3">
          <span className="text-sm text-github-white-comment"> 2023-01-29</span>
          <h1 className=" text-3xl text-github-white-link pb-2 font-semibold">
            Shopify product search but with slider
          </h1>
          <p>
            The Search Slider Shopify section is a great way to showcase your
            products in a stylish and interactive manner. It consists of a
            search bar and a slider that displays a set of products. The slider
            is powered by Swiper, a popular JavaScript library for creating
            sliders and carousels. The section allows customers to search for
            products by typing in a product name in the search bar. The slider
            will then display only the products that match the search query.{' '}
            <br />
          </p>
          <section>
            <h3 className="text-2xl font-semibold text-github-white-link !mt-12">
              # What will we build?
            </h3>
            <div>
              <video
                src="/article/shopify-product-search-but-with-slider/2023-01-29 15-30-17.mkv"
                autoPlay
                loop
                muted
              ></video>
            </div>
            <p>
              The Shopify documentation only covers the basics of working with{' '}
              <a
                className="text-blue-400"
                target="_blank"
                href="https://shopify.dev/themes/architecture/templates/search"
                rel="noreferrer"
              >
                the Form tag
              </a>{' '}
              and lacks technical depth. While they aim for simplicity, this
              results in developers having to search through theme code in their
              IDE rather than finding the information they need in the
              documentation. Our landing page will display a server-side
              rendered slider, and user inputs will dynamically update it via
              AJAX requests for a seamless experience.
            </p>
            <p>
              For improved user experience, we'll implement a debounced input
              that instantly displays the products as soon as the user finishes
              typing, actually after one second, eliminating the need to hit
              enter.
            </p>
            <p className="mt-4">
              Completed section can found in this{' '}
              <a
                className="text-blue-400"
                target="_blank"
                href="https://github.com/hahuaz/shopify-themes/blob/dev/dawn-main/sections/search-slide.liquid"
                rel="noreferrer"
              >
                dawn theme
              </a>
              . You can clone the repo and directly start your own dev
              environment.
            </p>
          </section>
          <section>
            <h3 className="text-2xl font-semibold text-github-white-link !mt-12">
              # Prerequisites
            </h3>
            <ul className="list-disc list-inside">
              <li>
                Having exprience with{' '}
                <a
                  className="text-blue-400"
                  target="_blank"
                  href="https://shopify.dev/themes/architecture"
                  rel="noreferrer"
                >
                  Shopify theme architecture
                </a>
                .
              </li>
              <li>Having exprience with DOM manipulation.</li>
            </ul>
          </section>

          <h3 className="text-2xl font-semibold text-github-white-link !mt-12">
            # Start typing...
          </h3>
          <section>
            <h5 className="text-xl text-github-white-link ">
              Create initial HTML content on server side:
            </h5>
            <pre>
              <code className={`language-html`}>
                {`<!-- Slides -->
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
`}
              </code>
            </pre>
            <ul className="list-disc list-inside">
              <li>
                To show slide on initial load, access collections.all.products
                object on server side and loop over them.
              </li>
              <li>
                You can target specific category in here or stop the loop by
                using loop.index, which is available inside the loop.
              </li>
            </ul>
          </section>
          <section>
            <h5 className="text-xl text-github-white-link ">
              Create Swiper class in isolation:
            </h5>
            <pre>
              <code className={`language-javascript`}>
                {`(function () {
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
})()
`}
              </code>
            </pre>
            <ul className="list-disc list-inside">
              <li>
                We can use IIF to encapsulate scope. <br />
                The purpose of an IIFE is to execute code in its own scope,
                which helps prevent variable collisions and protect the data
                privacy. It's crucial to encapsulate scope if we use same slider
                section on the page multiple times.
              </li>
              <li>
                Pay attention how We utilize {`{{ section.id }}`} in javascript
                to access unique swiper element.
              </li>
            </ul>
          </section>

          <section>
            <h5 className="text-xl text-github-white-link ">
              Re-initiate Swiper on Shopify editor:
            </h5>
            <pre>
              <code className={`language-javascript`}>
                {`if (Shopify.designMode) {
  // This will only render in the theme editor
  document.addEventListener('shopify:section:load', function (event) {
    createSwiper();
  });
}
`}
              </code>
            </pre>
            <ul className="list-disc list-inside">
              <li>
                When a user makes changes in the Shopify editor, the DOM is
                refreshed but script files are not executed again, which means
                event listeners are removed and Swiper lost its functionality.
                <br />
                To fix this, we added an event listener to the document for the
                shopify.section:load event, which re-initiates the Swiper
                instance between edits.
              </li>
            </ul>
          </section>

          <section>
            <h5 className="text-xl text-github-white-link ">
              How to bounce search AJAX requests while the user is typing?
            </h5>
            <pre>
              <code className={`language-javascript`}>
                {`function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
`}
              </code>
            </pre>
            <ul className="list-disc list-inside">
              <li>
                The debounce function is a utility function that helps limit the
                frequency of function calls. It is often used when working with
                events that can fire rapidly, such as scroll, resize, or input
                events, and you want to prevent expensive or slow functions from
                being executed too frequently.
              </li>
            </ul>
          </section>
          <section>
            <h5 className="text-xl text-github-white-link ">
              Completed search-slide dot liquid file:
            </h5>
            <pre>
              <code className={`language-html`}>
                {`{{ 'swiper-bundle.min.css' | asset_url | stylesheet_tag }}
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
    const SWIPER_OUTER = document.querySelector(\`.\${sectionId} .swiper-outer\`);
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
      const response = await fetch(\`/search/suggest.json?q=\${query}&resources[type]=product\`);
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
        SWIPER_OUTER.innerHTML = \`<div style="text-align:center; padding: 20px; font-size:20px; color:red;">There is no product for this query.</div>\`;
        return;
      }

      // recreate html of swiper
      const slideItems = products.map((product) => {
        const slideItem = \`<div class="swiper-slide">
          <div class="swiper__container">
            <div class="image__container">
              <img src="\${product.image}" alt="bold star" width="300" height="200">
              <div class="add-cart">ADD TO CART</div>

              <div class="badge"><span>Best</span><span>Seller</span></div>
            </div>
            <div class="product__content">
              <p class="product__title">\${product.title}</p>
              <p class="product__price">\${product.price} $</p>
            </div>
          </div>
        </div>\`;
        return slideItem;
      });

      const newSwiperContent = \`<div class="swiper">
        <div class="swiper-wrapper">
          \${slideItems}
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination"></div>
    
        <!-- If we need navigation buttons -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
    
        <!-- If we need scrollbar -->
        <div class="swiper-scrollbar"></div>
      </div>\`;

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
</script>`}
              </code>
            </pre>
            <ul className="list-disc list-inside">
              <li>
                Install swiper bundles from{' '}
                <a
                  className="text-blue-400"
                  target="_blank"
                  href="https://www.jsdelivr.com/package/npm/swiper"
                  rel="noreferrer"
                >
                  here
                </a>{' '}
                and add them to your assets folder.
              </li>
              <li>
                There is no re-render method on Swiper class. We need to destroy
                the existing instance to remove event listeners and create new
                instance with brand new HTML content for every query.
              </li>
            </ul>
          </section>
          <section>
            <h5 className="text-xl text-github-white-link">
              search-slide dot scss file:
            </h5>
            <pre>
              <code className={`language-css`}>
                {`.search-slide {
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
}
`}
              </code>
            </pre>
            <ul className="list-disc list-inside"></ul>
          </section>
        </div>
      </main>
    </>
  );
}
