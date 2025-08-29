import React, { useState } from 'react';
import { Account, LockedSaving } from '../types';
import { SAVINGS_LOCK_PERIODS, EARLY_WITHDRAWAL_PENALTY_RATE } from '../constants';
import { LockIcon, AlertTriangleIcon } from './icons';

interface LockedSavingsProps {
    accounts: Account[];
    lockedSavings: LockedSaving[];
    onLock: (accountId: string, amount: number, period: number) => void;
    onWithdraw: (saving: LockedSaving) => void;
}

const LockedSavings: React.FC<LockedSavingsProps> = ({ accounts, lockedSavings, onLock, onWithdraw }) => {
    const [accountId, setAccountId] = useState(accounts[0]?.id || '');
    const [amount, setAmount] = useState('');
    const [period, setPeriod] = useState<number>(SAVINGS_LOCK_PERIODS[0]);

    const handleLock = (e: React.FormEvent) => {
        e.preventDefault();
        if (!accountId || !amount || parseFloat(amount) <= 0) {
             alert('Please fill all required fields correctly.');
            return;
        }

        const fromAccount = accounts.find(acc => acc.id === accountId);
        if (fromAccount && (fromAccount.balance === null || fromAccount.balance < parseFloat(amount))) {
            alert("Insufficient funds.");
            return;
        }

        onLock(accountId, parseFloat(amount), period);
        setAmount('');
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="p-4 md:p-6 bg-violet-950/40 backdrop-blur-sm border border-violet-500/20 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-violet-300 mb-6">Locked Savings</h3>
            
            <form onSubmit={handleLock} className="space-y-4 mb-8 p-4 bg-gray-900/50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="lockAccount" className="block text-sm font-medium text-gray-300 mb-1">From Account</label>
                        <select id="lockAccount" name="lockAccount" value={accountId} onChange={e => setAccountId(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-lime-400 focus:border-lime-400 transition">
                             {accounts.map(acc => (
                                <option key={acc.id} value={acc.id} disabled={acc.balance === null}>
                                    {acc.name} - {acc.balance !== null ? `$${acc.balance.toFixed(2)}` : 'Balance N/A'}
                                </option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="lockAmount" className="block text-sm font-medium text-gray-300 mb-1">Amount to Lock</label>
                        <input type="number" id="lockAmount" name="lockAmount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" autoComplete="transaction-amount" className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-lime-400 focus:border-lime-400 transition" />
                    </div>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-300 mb-1">Lock Period</label>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {SAVINGS_LOCK_PERIODS.map(p => (
                            <button key={p} type="button" onClick={() => setPeriod(p)} className={`p-3 rounded-md text-center font-semibold transition ${period === p ? 'bg-lime-500 text-purple-900' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                {p} months
                            </button>
                        ))}
                    </div>
                </div>
                <button type="submit" className="w-full bg-lime-500 hover:bg-lime-400 text-purple-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-500/20 flex items-center justify-center space-x-2">
                    <LockIcon className="w-5 h-5" />
                    <span>Lock Funds</span>
                </button>
            </form>

            <h4 className="text-xl font-semibold text-white mt-8 mb-4">Your Locked Funds</h4>
            <div className="space-y-4">
                {lockedSavings.length > 0 ? lockedSavings.map(saving => {
                    const penalty = saving.amount * EARLY_WITHDRAWAL_PENALTY_RATE;
                    const receivable = saving.amount - penalty;
                    const isMatured = new Date() > saving.endDate;

                    return (
                        <div key={saving.id} className={`p-4 rounded-lg border ${saving.isWithdrawn ? 'bg-gray-700/50 border-gray-600' : 'bg-purple-900/30 border-purple-500/50'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-2xl font-bold text-lime-300">{formatCurrency(saving.amount)}</p>
                                    <p className="text-sm text-gray-400">
                                        Locked for {saving.lockPeriodMonths} months.
                                        {saving.isWithdrawn ? ' (Withdrawn)' : ` Matures on ${saving.endDate.toLocaleDateString()}`}
                                    </p>
                                </div>
                                {!saving.isWithdrawn && (
                                     <button 
                                        onClick={() => onWithdraw(saving)}
                                        className={`font-bold py-2 px-4 rounded-lg transition-colors text-sm ${isMatured ? 'bg-green-500 hover:bg-green-400 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
                                     >
                                        {isMatured ? 'Withdraw' : 'Withdraw Early'}
                                     </button>
                                )}
                            </div>
                            {!isMatured && !saving.isWithdrawn && (
                                <div className="mt-3 p-3 bg-red-900/50 border border-red-500/50 rounded-md flex items-center space-x-3 text-sm">
                                    <AlertTriangleIcon className="w-8 h-8 text-red-400 flex-shrink-0"/>
                                    <div>
                                        <p className="font-semibold text-red-300">Early withdrawal penalty: {formatCurrency(penalty)}</p>
                                        <p className="text-red-400">You will receive {formatCurrency(receivable)}.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                }) : <p className="text-center text-gray-400 py-4">You have no funds in locked savings.</p>}
            </div>
        </div>
    );
};

export default LockedSavings;