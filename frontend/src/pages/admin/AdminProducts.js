import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/common/ProductCard';
import ProductForm from '../../components/admin/ProductForm';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import { productAPI } from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productAPI.getAll({ page, limit: 8 });
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editProduct) {
        await productAPI.update(editProduct._id, formData);
      } else {
        await productAPI.create(formData);
      }
      setShowForm(false);
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to save';
      setError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Manage Products</h1>
        <button className="btn btn-primary" onClick={handleCreate}>+ Add Product</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? <Loader /> : products.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: '2.5rem' }}>📦</span>
          <p>No products yet. Create one!</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} onEdit={handleEdit} onDelete={handleDelete} isAdmin />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {showForm && (
        <ProductForm
          product={editProduct}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditProduct(null); }}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default AdminProducts;
