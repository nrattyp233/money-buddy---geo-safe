import React from 'react';
import { User } from '../types';
import { getSupabase } from '../services/supabase';

interface ProfileSettingsProps {
  user: User;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  const handleLogout = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated! (This is a demo)');
  };

  const handleConnectStripe = async () => {
    try {
      // Get Supabase access token
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      const resp = await fetch('https://thdmywgjbhdtgtqnqizn.functions.supabase.co/create-express-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          user_id: user.email,
          email: user.email,
          refresh_url: 'https://your-app.com/onboard/refresh',
          return_url: 'https://your-app.com/onboard/return',
        }),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error('Stripe onboarding failed:', resp.status, errorText);
        alert('Unable to create onboarding link');
        return;
      }

      const data = await resp.json();
      if (data?.link_url) {
        window.open(data.link_url, '_blank');
      } else {
        alert('No onboarding link returned');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Something went wrong while connecting to Stripe');
    }
  };

  const initials = (user?.name ?? '')
    .split(' ')
    .map(n => n[0] ?? '')
    .join('')
    .toUpperCase();

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center font-bold text-2xl text-purple-900">
          {initials || '?'}
        </div>
        <div>
          <h3 className="text-xl font-bold">{user?.name ?? 'Unknown User'}</h3>
          <p className="text-gray-400">{user?.email ?? 'No email available'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={user?.name ?? ''}
            autoComplete="name"
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-lime-400 focus:border-lime-400 transition"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={user?.email ?? ''}
            autoComplete="email"
            disabled
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-lime-400 focus:border-lime-400 transition disabled:opacity-70"
          />
        </div>
        <div className="pt-4 flex justify-between items-center">
          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Sign Out
          </button>
          <button
            type="button"
            onClick={handleConnectStripe}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Connect Stripe
          </button>
          <button
            type="submit"
            className="bg-lime-500 hover:bg-lime-400 text-purple-900 font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;