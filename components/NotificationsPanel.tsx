import React from 'react';
import { Transaction, LockedSaving, TransactionStatus } from '../types';
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon, DollarSignIcon } from './icons';

interface NotificationsPanelProps {
    transactions: Transaction[];
    lockedSavings: LockedSaving[];
    currentUserEmail: string;
    onApproveRequest: (transaction: Transaction) => void;
    onDeclineRequest: (transaction: Transaction) => void;
    onWithdraw: (saving: LockedSaving) => void;
    onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ transactions, lockedSavings, currentUserEmail, onApproveRequest, onDeclineRequest, onWithdraw, onClose }) => {
    const incomingRequests = transactions.filter(tx => tx.type === 'request' && tx.status === TransactionStatus.PENDING && tx.to_details === currentUserEmail);
    const pendingTransactions = transactions.filter(tx => tx.status === TransactionStatus.PENDING && tx.type === 'send');
    const failedTransactions = transactions.filter(tx => tx.status === TransactionStatus.FAILED);
    const maturedSavings = lockedSavings.filter(s => !s.isWithdrawn && new Date() > new Date(s.endDate));

    const allNotifications = [
        ...maturedSavings,
        ...incomingRequests,
        ...pendingTransactions,
        ...failedTransactions,
    ];

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="absolute top-20 right-4 z-30 w-full max-w-md bg-gray-800 border border-lime-400/30 rounded-2xl shadow-2xl shadow-lime-500/10 animate-fade-in-down">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-lg font-bold text-lime-300">Notifications</h3>
                 <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <XCircleIcon className="w-7 h-7" />
                </button>
            </div>
            <div className="p-2 max-h-96 overflow-y-auto">
                {allNotifications.length > 0 ? (
                    <ul className="space-y-2">
                        {maturedSavings.map(saving => (
                            <li key={`saving-${saving.id}`} className="p-3 bg-gray-900/50 rounded-lg flex items-center justify-between gap-3 transition-all hover:bg-gray-900">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500/20 rounded-full flex-shrink-0"><CheckCircleIcon className="w-6 h-6 text-green-400" /></div>
                                    <div>
                                        <p className="text-white font-semibold">Savings Matured</p>
                                        <p className="text-sm text-gray-400">Your locked saving of {formatCurrency(saving.amount)} is ready.</p>
                                    </div>
                                </div>
                                <button onClick={() => onWithdraw(saving)} className="text-sm bg-lime-600 text-white px-3 py-1 rounded-md hover:bg-lime-500 transition whitespace-nowrap">
                                    Withdraw
                                </button>
                            </li>
                        ))}
                         {incomingRequests.map(tx => (
                             <li key={`tx-req-${tx.id}`} className="p-3 bg-gray-900/50 rounded-lg flex items-center justify-between gap-3 transition-all hover:bg-gray-900">
                                <div className="flex items-center gap-3 flex-grow">
                                    <div className="p-2 bg-blue-500/20 rounded-full flex-shrink-0"><DollarSignIcon className="w-6 h-6 text-blue-400" /></div>
                                    <div>
                                        <p className="text-white font-semibold">Money Request</p>
                                        <p className="text-sm text-gray-400">{tx.description} for {formatCurrency(tx.amount)}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => onDeclineRequest(tx)} className="text-sm bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-500 transition whitespace-nowrap">
                                        Decline
                                    </button>
                                    <button onClick={() => onApproveRequest(tx)} className="text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-500 transition whitespace-nowrap">
                                        Approve
                                    </button>
                                </div>
                            </li>
                        ))}
                        {pendingTransactions.map(tx => (
                             <li key={`tx-${tx.id}`} className="p-3 bg-gray-900/50 rounded-lg flex items-center justify-between gap-3 transition-all hover:bg-gray-900">
                                 <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-500/20 rounded-full flex-shrink-0"><AlertTriangleIcon className="w-6 h-6 text-yellow-400" /></div>
                                    <div>
                                        <p className="text-white font-semibold">Payment Sent</p>
                                        <p className="text-sm text-gray-400">{tx.description} of {formatCurrency(tx.amount)} is awaiting claim.</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                         {failedTransactions.map(tx => (
                             <li key={`tx-${tx.id}`} className="p-3 bg-gray-900/50 rounded-lg flex items-center justify-between gap-3 transition-all hover:bg-gray-900">
                                 <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500/20 rounded-full flex-shrink-0"><XCircleIcon className="w-6 h-6 text-red-400" /></div>
                                    <div>
                                        <p className="text-white font-semibold">Transaction Failed</p>
                                        <p className="text-sm text-gray-400">{tx.description} of {formatCurrency(tx.amount)}</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="text-sm bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-500 transition whitespace-nowrap">
                                    Dismiss
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        <p>No new notifications.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPanel;