import React, { useState } from 'react';
import { useApp } from '../../contexts/useApp';
import { supabase } from '../../supabase/client';

const ForgotPassword = () => {
  const { navigate } = useApp();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset email sent. Please check your inbox.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Forgot Password</h3>
        <form onSubmit={handleResetPassword}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button
                type="submit"
                className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
              >
                Send Reset Link
              </button>
            </div>
            {message && <p className="text-green-500 text-sm mt-4">{message}</p>}
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          </div>
        </form>
        <div className="mt-4 text-center">
          <button type="button" onClick={() => navigate('login')} className="text-blue-600 hover:underline">Back to Login</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
