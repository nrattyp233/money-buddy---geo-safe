import React, { useState } from 'react';
import { DollarSignIcon } from './icons';

interface RequestMoneyProps {
    onRequest: (to: string, amount: number, description: string) => void;
}

const RequestMoney: React.FC<RequestMoneyProps> = ({ onRequest }) => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipient || !amount || parseFloat(amount) <= 0 || !description) {
            alert('Please fill all fields correctly.');
            return;
        }

        onRequest(recipient, parseFloat(amount), description);
        setRecipient('');
        setAmount('');
        setDescription('');
    };

    return (
        <div className="p-4 md:p-6 bg-emerald-950/40 backdrop-blur-sm border border-emerald-500/20 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-emerald-300 mb-6">Request Money</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="request-recipient" className="block text-sm font-medium text-gray-300 mb-1">Request from (Email)</label>
                    <input type="email" id="request-recipient" name="request-recipient" value={recipient} onChange={e => setRecipient(e.target.value)} required placeholder="buddy@example.com" autoComplete="email" className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-lime-400 focus:border-lime-400 transition" />
                </div>
                 <div>
                    <label htmlFor="request-amount" className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
                    <input type="number" id="request-amount" name="request-amount" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="0.00" autoComplete="transaction-amount" className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-lime-400 focus:border-lime-400 transition" />
                </div>
                <div>
                    <label htmlFor="request-description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <input type="text" id="request-description" name="request-description" value={description} onChange={e => setDescription(e.target.value)} required placeholder="e.g., Pizza night" autoComplete="off" className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-lime-400 focus:border-lime-400 transition" />
                </div>
                <button type="submit" className="w-full bg-lime-500 hover:bg-lime-400 text-purple-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-500/20 flex items-center justify-center space-x-2">
                    <DollarSignIcon className="w-5 h-5"/>
                    <span>Send Request</span>
                </button>
            </form>
        </div>
    );
};

export default RequestMoney;