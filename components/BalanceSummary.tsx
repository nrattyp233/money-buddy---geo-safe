import React from 'react';
import { Account } from '../types';
import { PlusCircleIcon, BankIcon, StripeIcon, PayPalIcon, ChaseIcon, BankOfAmericaIcon, WellsFargoIcon, CapitalOneIcon } from './icons';

interface BalanceSummaryProps {
  accounts: Account[];
  onConnectClick: () => void;
  onRemoveAccount: (accountId: string) => void;
}

const getLogoForProvider = (provider: string) => {
    switch(provider) {
        case 'Chase': return <ChaseIcon className="w-6 h-6" />;
        case 'Bank of America': return <BankOfAmericaIcon className="w-6 h-6" />;
        case 'Wells Fargo': return <WellsFargoIcon className="w-6 h-6" />;
        case 'Capital One': return <CapitalOneIcon className="w-6 h-6" />;
        case 'Stripe': return <StripeIcon className="w-6 h-6" />;
        case 'PayPal': return <PayPalIcon className="w-6 h-6" />;
        default: return <BankIcon className="w-6 h-6" />;
    }
};

const BalanceSummary: React.FC<BalanceSummaryProps> = ({ accounts, onConnectClick, onRemoveAccount }) => {
  const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="p-4 md:p-6 bg-indigo-900/60 backdrop-blur-lg border border-indigo-400/30 rounded-2xl shadow-xl">
      <h2 className="text-lg font-semibold text-indigo-200 mb-4">Total Balance</h2>
      <p className="text-4xl lg:text-5xl font-bold text-lime-300 tracking-tighter mb-6">
        {formatCurrency(totalBalance)}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <div key={account.id} className="bg-gray-800 border border-white/10 p-4 rounded-xl shadow-lg transition-all duration-300 hover:bg-gray-700 hover:-translate-y-1 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-400">{account.name}</span>
              <div className="text-lime-400">
                {account.logo ? <img src={account.logo} alt={`${account.provider} logo`} className="w-6 h-6 rounded-md" /> : getLogoForProvider(account.provider)}
              </div>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">{formatCurrency(account.balance)}</p>
            <button
              className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-600 bg-gray-900/80 rounded px-2 py-1"
              title="Remove Account"
              onClick={() => onRemoveAccount(account.id)}
            >Remove</button>
          </div>
        ))}
         <button 
            onClick={onConnectClick}
            className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-gray-600 hover:border-lime-400 text-gray-400 hover:text-lime-400 transition-all duration-300 hover:bg-gray-800/50 hover:-translate-y-1"
            >
            <PlusCircleIcon className="w-8 h-8 mb-2" />
            <span className="font-semibold">Connect New Account</span>
        </button>
      </div>
    </div>
  );
};

export default BalanceSummary;
