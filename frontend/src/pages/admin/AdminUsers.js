import React, { useState, useEffect } from 'react';
import Loader from '../../components/common/Loader';
import { userAPI } from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await userAPI.delete(id);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <h1>Registered Users</h1>
        <span style={{ color: '#888', fontSize: '0.9rem' }}>{users.length} total</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#999' }}>No users found</td></tr>
            ) : users.map((user, i) => (
              <tr key={user._id}>
                <td>{i + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span style={{
                    background: user.role === 'admin' ? '#1a1a2e' : '#eee',
                    color: user.role === 'admin' ? 'white' : '#555',
                    padding: '2px 8px',
                    borderRadius: '3px',
                    fontSize: '0.8rem',
                  }}>
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  {user.role !== 'admin' && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
