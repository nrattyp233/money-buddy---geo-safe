import React, { useState } from 'react';
import { getSupabase } from '../services/supabase';
import { MascotIcon, ShieldCheckIcon, AlertTriangleIcon, CheckCircleIcon } from './icons';

const Auth: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleAuthError = (authError: Error) => {
        if (authError.message.toLowerCase().includes('failed to fetch')) {
            setError('Network error: Could not connect to the server. Please check your internet connection and try again.');
        } else if (authError.message.toLowerCase().includes('email not confirmed')) {
            setError('Your email is not confirmed. Please check your inbox for the confirmation link.');
        } else {
            setError(authError.message);
        }
    };
    
    const handleRegister = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name
                }
            }
        });
        
        setLoading(false);
        if (error) {
            handleAuthError(error);
        } else if (data.user) {
            // Seeding is now handled in App.tsx on the first successful login
            // to ensure Row Level Security policies are respected.
            setSuccessMessage("Success! To complete setup, please click the confirmation link sent to your email. (Note: In this demo, you may be able to log in directly if emails are disabled).");
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        const supabase = getSupabase();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);
        if (error) {
            handleAuthError(error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoginView) {
            handleLogin();
        } else {
            handleRegister();
        }
    };

    return (
        <div className="min-h-screen text-white font-sans antialiased flex items-center justify-center p-4 animate-fade-in-down">
             <div className="relative z-10 w-full max-w-md">
                <div className="bg-black/30 backdrop-blur-lg border border-lime-400/20 rounded-2xl shadow-2xl shadow-lime-500/10 p-8">
                    <div className="text-center mb-8">
                        <MascotIcon className="w-24 h-24 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-white tracking-wide">
                            {isLoginView ? 'Welcome Back!' : 'Create Account'}
                        </h1>
                        <p className="text-lime-300/80 font-mono">Money Buddy - Geo Safe</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLoginView && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                <input type="text" id="name" name="name" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" autoComplete="name" className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-lime-400 focus:border-lime-400 transition" />
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                            <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email" className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-lime-400 focus:border-lime-400 transition" />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                            <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" autoComplete={isLoginView ? 'current-password' : 'new-password'} className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-lime-400 focus:border-lime-400 transition" />
                        </div>
                        
                        {successMessage && (
                            <div className="p-3 bg-green-900/50 border border-green-500/50 rounded-md flex items-start space-x-3 text-sm text-green-300">
                                <CheckCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5"/>
                                <span>{successMessage}</span>
                            </div>
                        )}
                        {error && (
                            <div className="p-3 bg-red-900/50 border border-red-500/50 rounded-md flex items-start space-x-3 text-sm text-red-300">
                                <AlertTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5"/>
                                <span>{error}</span>
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="w-full bg-lime-500 hover:bg-lime-400 text-purple-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-500/20 flex items-center justify-center space-x-2 disabled:bg-gray-600 disabled:cursor-not-allowed">
                             <ShieldCheckIcon className="w-6 h-6" />
                            <span>{loading ? 'Processing...' : (isLoginView ? 'Sign In Securely' : 'Create My Account')}</span>
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <button onClick={() => { setIsLoginView(!isLoginView); setError(null); setSuccessMessage(null); }} className="text-sm text-lime-400 hover:text-lime-300 hover:underline">
                            {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;