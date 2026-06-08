import React, { useState, useEffect } from 'react';

const CLOTH_TYPES = ['shirt', 'pant', 'dress', 'jacket', 'shoes', 'accessories', 'other'];

const INITIAL = { title: '', description: '', rate: '', discount: '0', clothType: 'shirt', stock: '', imageUrl: '' };

const ProductForm = ({ product, onSubmit, onClose, loading }) => {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) setForm({ ...product, rate: product.rate.toString(), discount: product.discount.toString(), stock: product.stock.toString() });
    else setForm(INITIAL);
  }, [product]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.rate || isNaN(form.rate) || Number(form.rate) < 0) e.rate = 'Valid rate is required';
    if (isNaN(form.discount) || Number(form.discount) < 0 || Number(form.discount) > 100) e.discount = 'Discount must be 0–100';
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) e.stock = 'Valid stock is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, rate: Number(form.rate), discount: Number(form.discount), stock: Number(form.stock) });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{product ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} className={errors.title ? 'error' : ''} />
            {errors.title && <div className="error-text">{errors.title}</div>}
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" rows={3} value={form.description} onChange={handleChange} className={errors.description ? 'error' : ''} />
            {errors.description && <div className="error-text">{errors.description}</div>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Rate (₹)</label>
              <input name="rate" type="number" value={form.rate} onChange={handleChange} className={errors.rate ? 'error' : ''} />
              {errors.rate && <div className="error-text">{errors.rate}</div>}
            </div>
            <div className="form-group">
              <label>Discount (%)</label>
              <input name="discount" type="number" value={form.discount} onChange={handleChange} className={errors.discount ? 'error' : ''} />
              {errors.discount && <div className="error-text">{errors.discount}</div>}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Cloth Type</label>
              <select name="clothType" value={form.clothType} onChange={handleChange}>
                {CLOTH_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} className={errors.stock ? 'error' : ''} />
              {errors.stock && <div className="error-text">{errors.stock}</div>}
            </div>
          </div>
          <div className="form-group">
            <label>Image URL (optional)</label>
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
