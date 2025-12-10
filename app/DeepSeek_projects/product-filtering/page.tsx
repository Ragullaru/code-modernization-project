'use client';

import { useState, useEffect } from 'react';

type Product = {
  name: string;
  url: string;
  type: string;
  price: number;
};

type CartItem = {
  product: Product;
  added: boolean;
};

export default function ProductFiltering() {
  // Products data
  const products: Product[] = [
    {
      name: 'Sony Playstation 5',
      url: '/img/playstation_5.png',
      type: 'games',
      price: 499.99,
    },
    {
      name: 'Samsung Galaxy',
      url: '/img/samsung_galaxy.png',
      type: 'smartphones',
      price: 399.99,
    },
    {
      name: 'Cannon EOS Camera',
      url: '/img/cannon_eos_camera.png',
      type: 'cameras',
      price: 749.99,
    },
    {
      name: 'Sony A7 Camera',
      url: '/img/sony_a7_camera.png',
      type: 'cameras',
      price: 1999.99,
    },
    {
      name: 'LG TV',
      url: '/img/lg_tv.png',
      type: 'televisions',
      price: 799.99,
    },
    {
      name: 'Nintendo Switch',
      url: '/img/nintendo_switch.png',
      type: 'games',
      price: 299.99,
    },
    {
      name: 'Xbox Series X',
      url: '/img/xbox_series_x.png',
      type: 'games',
      price: 499.99,
    },
    {
      name: 'Samsung TV',
      url: '/img/samsung_tv.png',
      type: 'televisions',
      price: 1099.99,
    },
    {
      name: 'Google Pixel',
      url: '/img/google_pixel.png',
      type: 'smartphones',
      price: 499.99,
    },
    {
      name: 'Sony ZV1F Camera',
      url: '/img/sony_zv1f_camera.png',
      type: 'cameras',
      price: 799.99,
    },
    {
      name: 'Toshiba TV',
      url: '/img/toshiba_tv.png',
      type: 'televisions',
      price: 499.99,
    },
    {
      name: 'iPhone 14',
      url: '/img/iphone_14.png',
      type: 'smartphones',
      price: 999.99,
    },
  ];

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, boolean>>({
    cameras: false,
    smartphones: false,
    games: false,
    televisions: false,
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Initialize cart items
  useEffect(() => {
    const initialCartItems = products.map(product => ({
      product,
      added: false,
    }));
    setCartItems(initialCartItems);
  }, []);

  // Filter products whenever search term or filters change
  useEffect(() => {
    const checkedCategories = Object.entries(filters)
      .filter(([_, isChecked]) => isChecked)
      .map(([category]) => category);

    const filtered = products.filter(product => {
      const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const isInCheckedCategory = 
        checkedCategories.length === 0 || 
        checkedCategories.includes(product.type);
      
      return matchesSearchTerm && isInCheckedCategory;
    });

    setFilteredProducts(filtered);
  }, [searchTerm, filters]);

  // Calculate cart item count
  const cartItemCount = cartItems.filter(item => item.added).length;

  // Handle filter checkbox change
  const handleFilterChange = (category: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    setCartItems(prev => 
      prev.map(item => 
        item.product.name === product.name 
          ? { ...item, added: !item.added }
          : item
      )
    );
  };

  // Check if product is in cart
  const isProductInCart = (product: Product) => {
    const cartItem = cartItems.find(item => item.product.name === product.name);
    return cartItem?.added || false;
  };

  // Render product element
  const renderProduct = (product: Product) => {
    const isAdded = isProductInCart(product);
    const isHovered = hoveredProduct === product.name;

    return (
      <div 
        key={`${product.name}-${product.type}`} 
        className="item space-y-2"
        onMouseEnter={() => setHoveredProduct(product.name)}
        onMouseLeave={() => setHoveredProduct(null)}
      >
        <div className="bg-gray-100 flex justify-center relative overflow-hidden group cursor-pointer border h-48">
          <img
            src={product.url}
            alt={product.name}
            className="w-full h-full object-contain p-4"
          />
          <span
            className={`status ${isAdded ? 'bg-red-600' : 'bg-black'} text-white absolute bottom-0 left-0 right-0 text-center py-2 transition-all duration-300 cursor-pointer ${
              isHovered || isAdded ? 'translate-y-0' : 'translate-y-full'
            }`}
            onClick={() => handleAddToCart(product)}
          >
            {isAdded ? 'Remove From Cart' : 'Add To Cart'}
          </span>
        </div>
        <p className="text-xl font-medium">{product.name}</p>
        <strong className="text-lg">${product.price.toLocaleString()}</strong>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <nav className="bg-gray-900 p-4 mb-6">
        <div className="container max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 sm:gap-8 items-center">
          {/* Search area */}
          <div className="relative w-full sm:w-auto sm:flex-1">
            <input
              type="text"
              id="search"
              className="bg-gray-700 rounded-full p-3 pl-10 w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2"
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
          <button id="cartButton" className="relative p-2 hover:bg-gray-800 rounded-lg transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z"
              />
              <path d="M9 11v-5a3 3 0 0 1 6 0v5" />
            </svg>
            {cartItemCount > 0 && (
              <small
                className="bg-red-500 text-xs text-white w-6 h-6 absolute -top-1 -right-1 rounded-full flex items-center justify-center font-bold"
              >
                {cartItemCount}
              </small>
            )}
          </button>
        </div>
      </nav>

      <main className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar */}
          <div className="w-full md:w-48 space-y-6">
            <div className="bg-gray-900 rounded-lg p-4">
              <h2 className="text-2xl font-bold mb-4">Filters</h2>
              <h3 className="text-xl font-semibold mb-3">Category</h3>
              <div id="filters-container" className="space-y-3">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded accent-blue-500"
                    id="cameras" 
                    checked={filters.cameras}
                    onChange={() => handleFilterChange('cameras')}
                  />
                  <label htmlFor="cameras" className="ml-3 text-lg cursor-pointer">Cameras</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded accent-blue-500"
                    id="smartphones" 
                    checked={filters.smartphones}
                    onChange={() => handleFilterChange('smartphones')}
                  />
                  <label htmlFor="smartphones" className="ml-3 text-lg cursor-pointer">Smartphones</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded accent-blue-500"
                    id="games" 
                    checked={filters.games}
                    onChange={() => handleFilterChange('games')}
                  />
                  <label htmlFor="games" className="ml-3 text-lg cursor-pointer">Games</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded accent-blue-500"
                    id="televisions" 
                    checked={filters.televisions}
                    onChange={() => handleFilterChange('televisions')}
                  />
                  <label htmlFor="televisions" className="ml-3 text-lg cursor-pointer">Televisions</label>
                </div>
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="flex-1">
            <div
              id="products-wrapper"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.map(product => renderProduct(product))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">No products found. Try changing your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}