import React, { useState, useEffect } from 'react';
import { generateSecurityTip } from '../services/geminiService';
import { ShieldCheckIcon, RefreshCwIcon } from './icons';

const SecurityTip: React.FC = () => {
    const [tip, setTip] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchTip = async () => {
        setIsLoading(true);
        const newTip = await generateSecurityTip();
        setTip(newTip);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchTip();
    }, []);

    return (
        <div className="p-4 md:p-6 bg-blue-900/70 backdrop-blur-lg border border-blue-400/20 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <ShieldCheckIcon className="w-7 h-7 text-blue-300" />
                    <h3 className="text-lg font-semibold text-blue-200">Security Tip</h3>
                </div>
                <button 
                    onClick={fetchTip} 
                    className={`text-blue-300 hover:text-white transition-transform duration-500 disabled:opacity-50 ${isLoading ? 'animate-spin' : ''}`} 
                    disabled={isLoading}
                    aria-label="Refresh security tip"
                >
                    <RefreshCwIcon className="w-5 h-5"/>
                </button>
            </div>
            {isLoading ? (
                <div className="h-10 bg-gray-700/50 rounded-md animate-pulse"></div>
            ) : (
                 <p className="text-blue-100 leading-relaxed font-medium">
                    "{tip}"
                </p>
            )}
        </div>
    );
};

export default SecurityTip;
