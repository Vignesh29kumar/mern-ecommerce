import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/common/ProductCard';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import { productAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';

const CLOTH_TYPES = ['', 'shirt', 'pant', 'dress', 'jacket', 'shoes', 'accessories', 'other'];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [clothType, setClothType] = useState('');
  const [toast, setToast] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [page, clothType]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productAPI.getAll({ page, limit: 8, search, clothType });
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      showToast('Added to cart!');
    } catch (err) {
      showToast('Failed to add to cart');
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div>
      {toast && <div className="alert alert-success" style={{ position: 'fixed', top: 70, right: 16, zIndex: 300, minWidth: 180 }}>{toast}</div>}

      <div className="page-header">
        <h1>Shop</h1>
      </div>

      <div className="filter-bar">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        <select value={clothType} onChange={(e) => { setClothType(e.target.value); setPage(1); }}>
          <option value="">All Types</option>
          {CLOTH_TYPES.filter(Boolean).map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {loading ? <Loader /> : products.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: '2.5rem' }}>🛍️</span>
          <p>No products found</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} isAdmin={false} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default ProductList;
