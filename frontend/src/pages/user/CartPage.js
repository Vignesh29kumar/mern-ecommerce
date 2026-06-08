import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Loader from '../../components/common/Loader';

const CartPage = () => {
  const { cart, cartLoading, removeFromCart, clearCart } = useCart();

  if (cartLoading) return <Loader />;

  const items = cart?.items || [];

  const total = items.reduce((sum, item) => {
    const p = item.product;
    if (!p) return sum;
    const finalPrice = p.rate - (p.rate * (p.discount || 0)) / 100;
    return sum + finalPrice * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <div>
        <div className="page-header"><h1>Your Cart</h1></div>
        <div className="empty-state">
          <span style={{ fontSize: '3rem' }}>🛒</span>
          <p>Your cart is empty</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Your Cart ({items.length} items)</h1>
        <button className="btn btn-danger btn-sm" onClick={clearCart}>Clear Cart</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>
        <div className="card">
          {items.map((item) => {
            const p = item.product;
            if (!p) return null;
            const finalPrice = p.rate - (p.rate * (p.discount || 0)) / 100;
            return (
              <div className="cart-item" key={item._id || p._id}>
                <span style={{ fontSize: '2rem' }}>👕</span>
                <div className="cart-item-info">
                  <div className="cart-item-title">{p.title}</div>
                  <div className="cart-item-price">₹{finalPrice.toFixed(2)} × {item.quantity} = ₹{(finalPrice * item.quantity).toFixed(2)}</div>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(p._id)}>Remove</button>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          {items.map((item) => {
            const p = item.product;
            if (!p) return null;
            const finalPrice = p.rate - (p.rate * (p.discount || 0)) / 100;
            return (
              <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.9rem' }}>
                <span>{p.title} ×{item.quantity}</span>
                <span>₹{(finalPrice * item.quantity).toFixed(2)}</span>
              </div>
            );
          })}
          <div className="cart-total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button className="btn btn-success btn-full" style={{ marginTop: 16 }}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
