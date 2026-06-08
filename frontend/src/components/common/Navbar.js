import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">👗 ShopStyle</Link>

      <div className="navbar-links">
        {user ? (
          <>
            {user.role === 'admin' ? (
              <>
                <Link to="/admin/products">Products</Link>
                <Link to="/admin/users">Users</Link>
              </>
            ) : (
              <>
                <Link to="/">Shop</Link>
                <Link to="/cart">
                  🛒 Cart
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
              </>
            )}
            <span style={{ color: '#aaa', fontSize: '0.85rem' }}>{user.name}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
