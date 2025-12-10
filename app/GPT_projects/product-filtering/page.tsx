"use client";

import React, { useMemo, useState } from "react";

type ProductType = "cameras" | "smartphones" | "games" | "televisions";

type Product = {
  name: string;
  url: string;
  type: ProductType;
  price: number;
};

const PRODUCTS: Product[] = [
  {
    name: "Sony Playstation 5",
    url: "/img/playstation_5.png",
    type: "games",
    price: 499.99,
  },
  {
    name: "Samsung Galaxy",
    url: "/img/samsung_galaxy.png",
    type: "smartphones",
    price: 399.99,
  },
  {
    name: "Cannon EOS Camera",
    url: "/img/cannon_eos_camera.png",
    type: "cameras",
    price: 749.99,
  },
  {
    name: "Sony A7 Camera",
    url: "/img/sony_a7_camera.png",
    type: "cameras",
    price: 1999.99,
  },
  {
    name: "LG TV",
    url: "/img/lg_tv.png",
    type: "televisions",
    price: 799.99,
  },
  {
    name: "Nintendo Switch",
    url: "/img/nintendo_switch.png",
    type: "games",
    price: 299.99,
  },
  {
    name: "Xbox Series X",
    url: "/img/xbox_series_x.png",
    type: "games",
    price: 499.99,
  },
  {
    name: "Samsung TV",
    url: "/img/samsung_tv.png",
    type: "televisions",
    price: 1099.99,
  },
  {
    name: "Google Pixel",
    url: "/img/google_pixel.png",
    type: "smartphones",
    price: 499.99,
  },
  {
    name: "Sony ZV1F Camera",
    url: "/img/sony_zv1f_camera.png",
    type: "cameras",
    price: 799.99,
  },
  {
    name: "Toshiba TV",
    url: "/img/toshiba_tv.png",
    type: "televisions",
    price: 499.99,
  },
  {
    name: "iPhone 14",
    url: "/img/iphone_14.png",
    type: "smartphones",
    price: 999.99,
  },
];

const CATEGORY_CONFIG: { id: ProductType; label: string }[] = [
  { id: "cameras", label: "Cameras" },
  { id: "smartphones", label: "Smartphones" },
  { id: "games", label: "Games" },
  { id: "televisions", label: "Televisions" },
];

const ProductFilteringPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<ProductType[]>([]);
  const [cartMap, setCartMap] = useState<Record<string, boolean>>({});

  const cartCount = useMemo(
    () => Object.values(cartMap).filter(Boolean).length,
    [cartMap]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (categoryId: ProductType) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleToggleCart = (productName: string) => {
    setCartMap((prev) => {
      const nextState = { ...prev };
      nextState[productName] = !nextState[productName];
      return nextState;
    });
  };

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return PRODUCTS.filter((product) => {
      const matchesSearch =
        term.length === 0 || product.name.toLowerCase().includes(term);

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.type);

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategories]);

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <nav className="bg-gray-900 p-4 mb-6">
        <div className="container max-w-6xl mx-auto flex flex-col sm:flex-row gap-8 items-center">
          {/* Search area */}
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-gray-700 rounded-full p-2 pl-10 transition focus:w-full outline-none"
              placeholder="Search products..."
            />
            <svg
              className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
              <path d="M21 21l-6 -6" />
            </svg>
          </div>

          {/* Cart button */}
          <button
            id="cartButton"
            type="button"
            className="relative flex items-center justify-center"
            aria-label="Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z" />
              <path d="M9 11v-5a3 3 0 0 1 6 0v5" />
            </svg>
            <small
              id="cartCount"
              className="bg-red-500 text-xs text-white w-4 h-4 absolute -top-2 -right-2 rounded-full flex items-center justify-center"
            >
              {cartCount}
            </small>
          </button>
        </div>
      </nav>

      <main className="flex flex-col md:flex-row container mx-auto max-w-6xl">
        {/* Filters */}
        <section className="space-y-4 p-2 w-full md:max-w-[10rem]">
          <h2 className="text-2xl">Filters</h2>
          <h3 className="text-xl mb-2">Category</h3>
          <div className="text-xl space-y-2">
            {CATEGORY_CONFIG.map((category) => {
              const checked = selectedCategories.includes(category.id);
              return (
                <div key={category.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={category.id}
                    className="check cursor-pointer"
                    checked={checked}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                  <label
                    htmlFor={category.id}
                    className="cursor-pointer select-none"
                  >
                    {category.label}
                  </label>
                </div>
              );
            })}
          </div>
        </section>

        {/* Products */}
        <section
          id="products-wrapper"
          className="w-full max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 place-content-center p-4"
        >
          {filteredProducts.map((product) => {
            const inCart = !!cartMap[product.name];
            const buttonLabel = inCart ? "Remove From Cart" : "Add To Cart";
            const statusBg = inCart ? "bg-red-600" : "bg-gray-800";

            return (
              <div key={product.name} className="item space-y-2">
                <div className="bg-gray-100 flex justify-center relative overflow-hidden group cursor-pointer border">
                  <img
                    src={product.url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleToggleCart(product.name)}
                    className={`status text-white absolute bottom-0 left-0 right-0 text-center py-2 translate-y-full transition group-hover:translate-y-0 ${statusBg}`}
                  >
                    {buttonLabel}
                  </button>
                </div>
                <p className="text-xl">{product.name}</p>
                <strong>${product.price.toLocaleString()}</strong>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default ProductFilteringPage;
