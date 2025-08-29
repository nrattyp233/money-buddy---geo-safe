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
        // In a real app, you would handle updating user metadata here.
        alert('Profile updated! (This is a demo)');
    };

    return (
        <div className="space-y-6 text-white">
            <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center font-bold text-2xl text-purple-900">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                    <h3 className="text-xl font-bold">{user.name}</h3>
                    <p className="text-gray-400">{user.email}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={user.name}
                        autoComplete="name"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-lime-400 focus:border-lime-400 transition"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={user.email}
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
                     <button type="submit" className="bg-lime-500 hover:bg-lime-400 text-purple-900 font-bold py-2 px-6 rounded-lg transition-colors">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileSettings;