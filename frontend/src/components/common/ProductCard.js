import React from 'react';

const CLOTH_EMOJI = {
  shirt: '👕', pant: '👖', dress: '👗', jacket: '🧥',
  shoes: '👟', accessories: '👜', other: '🛍️',
};

const ProductCard = ({ product, onAddToCart, onEdit, onDelete, isAdmin }) => {
  const finalPrice = product.rate - (product.rate * product.discount) / 100;

  return (
    <div className="product-card">
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span>{CLOTH_EMOJI[product.clothType] || '🛍️'}</span>
        )}
      </div>
      <div className="product-info">
        <div className="product-title" title={product.title}>{product.title}</div>
        <div className="product-type">{product.clothType}</div>
        <div className="product-price">
          <span className="price-final">₹{finalPrice.toFixed(2)}</span>
          {product.discount > 0 && (
            <>
              <span className="price-original">₹{product.rate}</span>
              <span className="discount-badge">{product.discount}% off</span>
            </>
          )}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '10px' }}>
          Stock: {product.stock}
        </div>

        {isAdmin ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-outline btn-sm" onClick={() => onEdit(product)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(product._id)}>Delete</button>
          </div>
        ) : (
          <button
            className="btn btn-primary btn-full"
            onClick={() => onAddToCart(product._id)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
