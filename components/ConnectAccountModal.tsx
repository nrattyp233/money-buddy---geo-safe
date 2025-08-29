import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import Modal from './Modal';
import { Account } from '../types';
import { PlaidIcon, RefreshCwIcon, AlertTriangleIcon } from './icons';
import { getSupabase } from '../services/supabase';

interface ConnectAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConnectionSuccess: () => void; // Callback to refresh data in parent
}

const ConnectAccountModal: React.FC<ConnectAccountModalProps> = ({ isOpen, onClose, onConnectionSuccess }) => {
    const [linkToken, setLinkToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Generic error handler for Supabase function calls
    const handleFunctionError = (err: any, context: 'token creation' | 'token exchange') => {
        console.error(`Error during ${context}:`, err);
        let detailedError = `Could not initialize Plaid connection. Please try again later.`;
        if (err.message) {
            if (err.message.toLowerCase().includes('cors') || err.message.toLowerCase().includes('failed to fetch')) {
                detailedError = "Network Error: This is often due to a CORS policy on the server. Please ensure your Supabase Edge Function is configured with the correct CORS headers to accept requests from this app's domain.";
            } else {
                detailedError = `An unexpected error occurred: ${err.message}`;
            }
        }
        setError(detailedError);
    };

    // Fetch the link_token from our Supabase Edge Function
    useEffect(() => {
        if (!isOpen) return;

        const createLinkToken = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const supabase = getSupabase();
                const { data, error: funcError } = await supabase.functions.invoke('create-link-token');

                if (funcError) throw funcError;
                if (!data || !data.link_token) throw new Error("Failed to retrieve a link token from the server.");

                setLinkToken(data.link_token);
            } catch (err: any) {
                handleFunctionError(err, 'token creation');
            } finally {
                setIsLoading(false);
            }
        };

        createLinkToken();
    }, [isOpen]);

    const onSuccess = useCallback(async (public_token: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const supabase = getSupabase();
            const { error: funcError } = await supabase.functions.invoke('exchange-public-token', {
                body: { public_token },
            });

            if (funcError) throw funcError;
            
            // Success! The backend function has stored the accounts.
            // Tell the parent component to refresh its data.
            onConnectionSuccess();
            onClose();

        } catch (err: any) {
            handleFunctionError(err, 'token exchange');
            setIsLoading(false); // Keep modal open to show error
        }
    }, [onConnectionSuccess, onClose]);
    
    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess,
    });

    // Reset state when modal is closed
    useEffect(() => {
        if (!isOpen) {
            setLinkToken(null);
            setIsLoading(true);
            setError(null);
        }
    }, [isOpen]);
    
    const connectDisabled = !ready || isLoading || !linkToken || !!error;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Connect Bank Account">
            <div className="space-y-4 text-center">
                
                {error && (
                    <div className="p-3 bg-red-900/50 border border-red-500/50 rounded-md flex items-start space-x-3 text-sm text-red-300 text-left">
                        <AlertTriangleIcon className="w-8 h-8 flex-shrink-0 mt-0.5"/>
                        <span>{error}</span>
                    </div>
                )}

                <div className="pt-4">
                    <button 
                        onClick={() => open()} 
                        disabled={connectDisabled}
                        className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <RefreshCwIcon className="w-5 h-5 animate-spin"/>
                                <span>Initializing...</span>
                            </>
                        ) : (
                             <>
                                <PlaidIcon className="w-6 h-6"/>
                                <span>Continue with Plaid</span>
                            </>
                        )}
                    </button>
                </div>

                 <p className="text-xs text-gray-500 pt-2">
                    By connecting, you agree to the Plaid <a href="https://plaid.com/legal" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">End User Privacy Policy</a>.
                </p>
            </div>
        </Modal>
    );
};

export default ConnectAccountModal;