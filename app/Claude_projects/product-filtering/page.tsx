'use client';

import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag } from 'lucide-react';

interface Product {
  name: string;
  url: string;
  type: string;
  price: number;
}

const products: Product[] = [
  { name: 'Sony Playstation 5', url: '/img/playstation_5.png', type: 'games', price: 499.99 },
  { name: 'Samsung Galaxy', url: '/img/samsung_galaxy.png', type: 'smartphones', price: 399.99 },
  { name: 'Cannon EOS Camera', url: '/img/cannon_eos_camera.png', type: 'cameras', price: 749.99 },
  { name: 'Sony A7 Camera', url: '/img/sony_a7_camera.png', type: 'cameras', price: 1999.99 },
  { name: 'LG TV', url: '/img/lg_tv.png', type: 'televisions', price: 799.99 },
  { name: 'Nintendo Switch', url: '/img/nintendo_switch.png', type: 'games', price: 299.99 },
  { name: 'Xbox Series X', url: '/img/xbox_series_x.png', type: 'games', price: 499.99 },
  { name: 'Samsung TV', url: '/img/samsung_tv.png', type: 'televisions', price: 1099.99 },
  { name: 'Google Pixel', url: '/img/google_pixel.png', type: 'smartphones', price: 499.99 },
  { name: 'Sony ZV1F Camera', url: '/img/sony_zv1f_camera.png', type: 'cameras', price: 799.99 },
  { name: 'Toshiba TV', url: '/img/toshiba_tv.png', type: 'televisions', price: 499.99 },
  { name: 'iPhone 14', url: '/img/iphone_14.png', type: 'smartphones', price: 999.99 },
];

const categories = [
  { id: 'cameras', label: 'Cameras' },
  { id: 'smartphones', label: 'Smartphones' },
  { id: 'games', label: 'Games' },
  { id: 'televisions', label: 'Televisions' },
];

export default function ModernProductFilter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleCart = (productName: string) => {
    setCart(prev => {
      const newCart = new Set(prev);
      if (newCart.has(productName)) {
        newCart.delete(productName);
      } else {
        newCart.add(productName);
      }
      return newCart;
    });
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.type);
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategories]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              TechStore
            </div>
            
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-full pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                placeholder="Search products..."
              />
            </div>

            <button className="relative p-2 hover:bg-slate-800 rounded-full transition-colors group">
              <ShoppingBag className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" />
              {cart.size > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold animate-pulse">
                  {cart.size}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Filters
              </h2>
              
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Category</h3>
                {categories.map(category => (
                  <label
                    key={category.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/30 cursor-pointer transition-all group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="w-5 h-5 rounded border-2 border-slate-600 bg-slate-700 checked:bg-gradient-to-r checked:from-blue-500 checked:to-purple-500 checked:border-transparent focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 transition-all cursor-pointer"
                    />
                    <span className="text-slate-300 group-hover:text-white transition-colors">
                      {category.label}
                    </span>
                  </label>
                ))}
              </div>

              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="mt-4 w-full text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-slate-400">
                Showing <span className="text-white font-semibold">{filteredProducts.length}</span> of{' '}
                <span className="text-white font-semibold">{products.length}</span> products
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => {
                const inCart = cart.has(product.name);
                return (
                  <div
                    key={index}
                    className="group bg-slate-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                  >
                    <div className="relative aspect-square bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <img
                        src={product.url}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <button
                        onClick={() => toggleCart(product.name)}
                        className={`absolute bottom-0 left-0 right-0 py-3 font-semibold transition-all duration-300 ${
                          inCart
                            ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white translate-y-0'
                            : 'bg-slate-900/95 text-white translate-y-full group-hover:translate-y-0'
                        }`}
                      >
                        {inCart ? 'Remove from Cart' : 'Add to Cart'}
                      </button>
                    </div>
                    
                    <div className="p-4 space-y-2">
                      <h3 className="text-white font-medium line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        ${product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-slate-500 text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
                <p className="text-slate-400">Try adjusting your filters or search term</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}