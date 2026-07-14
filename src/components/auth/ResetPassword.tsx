import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/useApp';
import { supabase } from '../../supabase/client';

const ResetPassword = () => {
  const { navigate } = useApp();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('No user session found. Please use the reset link from your email.');
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Your password has been updated successfully. You can now log in with your new password.');
      setPassword('');
      setConfirmPassword('');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p>Loading...</p>
        <div className="mt-4 text-center">
          <button type="button" onClick={() => navigate('login')} className="text-blue-600 hover:underline">Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Reset Password</h3>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mt-4">{message}</p>}
        {!message && !error && (
          <form onSubmit={handleUpdatePassword}>
            <div className="mt-4">
              <div>
                <label className="block" htmlFor="password">New Password</label>
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block" htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-baseline justify-between">
                <button
                  type="submit"
                  className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                >
                  Update Password
                </button>
              </div>
            </div>
          </form>
        )}
        <div className="mt-4 text-center">
          <button type="button" onClick={() => navigate('login')} className="text-blue-600 hover:underline">Back to Login</button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
