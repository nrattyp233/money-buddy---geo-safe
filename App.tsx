import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PrivacyPolicy from './components/PrivacyPolicy';
import { Account, Transaction, LockedSaving, TransactionStatus, GeoFence, TimeRestriction } from './types';
import { EARLY_WITHDRAWAL_PENALTY_RATE } from './constants';
import Header from './components/Header';
import BalanceSummary from './components/BalanceSummary';
import SendMoney from './components/SendMoney';
import LockedSavings from './components/LockedSavings';
import TransactionHistory from './components/TransactionHistory';
import Modal from './components/Modal';
import ProfileSettings from './components/ProfileSettings';
import SecurityTip from './components/SecurityTip';
import ConnectAccountModal from './components/ConnectAccountModal';
import type { User as SupabaseUser } from 'https://esm.sh/@supabase/supabase-js@2';
import NotificationsPanel from './components/NotificationsPanel';
import RequestMoney from './components/RequestMoney';
import TransactionDetailModal from './components/TransactionDetailModal';
import Auth from './components/Auth';
import { getSupabase } from './services/supabase';

type ActiveTab = 'send' | 'lock' | 'history' | 'request';

const App: React.FC = () => {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [lockedSavings, setLockedSavings] = useState<LockedSaving[]>([]);
    const [activeTab, setActiveTab] = useState<ActiveTab>('send');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isConnectAccountModalOpen, setIsConnectAccountModalOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    useEffect(() => {
        const supabase = getSupabase();
        
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    const fetchData = useCallback(async () => {
        if (!user || !user.email) return;
        const supabase = getSupabase();

        try {
            const [accountsRes, transactionsRes, savingsRes] = await Promise.all([
                supabase.from('accounts').select('*').eq('user_id', user.id),
                supabase.from('transactions').select('*').or(`user_id.eq.${user.id},to_details.eq.${user.email}`).order('created_at', { ascending: false }),
                supabase.from('locked_savings').select('*').eq('user_id', user.id)
            ]);

            if (accountsRes.error) throw accountsRes.error;
            if (transactionsRes.error) throw transactionsRes.error;
            if (savingsRes.error) throw savingsRes.error;

            setAccounts(accountsRes.data as Account[]);
            
            const formattedTransactions = transactionsRes.data.map(tx => ({
                ...tx,
                date: new Date(tx.created_at), // Map created_at to date
                geoFence: tx.geo_fence,
                timeRestriction: tx.time_restriction,
            })) as Transaction[];
            setTransactions(formattedTransactions);

            const formattedSavings = savingsRes.data.map(s => ({
                ...s,
                accountId: s.account_id,
                lockPeriodMonths: s.lock_period_months,
                startDate: new Date(s.start_date),
                endDate: new Date(s.end_date),
                isWithdrawn: s.is_withdrawn
            })) as LockedSaving[];
            setLockedSavings(formattedSavings);

        } catch (error: any) {
            const errorMessage = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
            console.error("Error fetching data:", errorMessage);
            alert(`Could not fetch your data. Reason: ${errorMessage}`);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [user, fetchData]);

    // --- Action Handlers ---

    const handleSendMoney = async (fromAccountId: string, to: string, amount: number, description: string, geoFence: GeoFence | undefined, timeRestriction: TimeRestriction | undefined) => {
        if (!user || !user.email) return;
        const fromAccount = accounts.find(acc => acc.id === fromAccountId);
        if (!fromAccount || fromAccount.balance === null || fromAccount.balance < amount) {
            alert("Insufficient funds.");
            return;
        }
        
        const supabase = getSupabase();
        try {
            // 1. Update sender's account balance
            const { error: updateError } = await supabase
                .from('accounts')
                .update({ balance: fromAccount.balance - amount })
                .eq('id', fromAccountId);
            if (updateError) throw updateError;

            // 2. Insert new transaction
            const { error: insertError } = await supabase.from('transactions').insert({
                user_id: user.id,
                from_details: user.email,
                to_details: to,
                amount: amount,
                description: description,
                type: 'send',
                status: 'Pending',
                geo_fence: geoFence,
                time_restriction: timeRestriction,
            });
            if (insertError) throw insertError;

            await fetchData();
            setActiveTab('history');

        } catch (error: any) {
            console.error("Error sending money:", error);
            alert(`Failed to send money. Reason: ${error.message || 'An unknown error occurred.'}`);
            // Optional: Rollback balance update if transaction insert fails
        }
    };

    const handleRequestMoney = async (to: string, amount: number, description: string) => {
        if (!user || !user.email) return;
        const supabase = getSupabase();
        try {
            const { error } = await supabase.from('transactions').insert({
                user_id: user.id,
                from_details: user.email,
                to_details: to,
                amount: amount,
                description: description,
                type: 'request',
                status: 'Pending',
            });
            if (error) throw error;
            await fetchData();
            setActiveTab('history');
        } catch (error: any) {
            console.error("Error requesting money:", error);
            alert(`Failed to send request. Reason: ${error.message || 'An unknown error occurred.'}`);
        }
    };

    const handleLock = async (accountId: string, amount: number, period: number) => {
        if (!user) return;
        const fromAccount = accounts.find(acc => acc.id === accountId);
        if (!fromAccount || fromAccount.balance === null || fromAccount.balance < amount) {
            alert("Insufficient funds.");
            return;
        }

        const supabase = getSupabase();
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + period);

        try {
            // 1. Update account balance
            const { error: updateError } = await supabase
                .from('accounts')
                .update({ balance: fromAccount.balance - amount })
                .eq('id', accountId);
            if (updateError) throw updateError;
            
            // 2. Insert into locked_savings
            const { error: lockError } = await supabase.from('locked_savings').insert({
                user_id: user.id,
                account_id: accountId,
                amount,
                lock_period_months: period,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
            });
            if (lockError) throw lockError;

            // 3. Insert into transactions for history
            const { error: txError } = await supabase.from('transactions').insert({
                user_id: user.id,
                from_details: fromAccount.name,
                to_details: 'Locked Savings',
                amount,
                description: `Locked for ${period} months`,
                type: 'lock',
                status: 'Locked',
            });
            if (txError) throw txError;
            
            await fetchData();
        } catch (error: any) {
            console.error("Error locking funds:", error);
            alert(`Failed to lock funds. Reason: ${error.message || 'An unknown error occurred.'}`);
        }
    };

    const handleWithdraw = async (saving: LockedSaving) => {
        if (!user) return;
        const supabase = getSupabase();
        const targetAccount = accounts.find(acc => acc.id === saving.accountId) || accounts[0];
        if (!targetAccount || targetAccount.balance === null) {
            alert("No valid account to withdraw to.");
            return;
        }

        const isEarly = new Date() < new Date(saving.endDate);
        const penalty = isEarly ? saving.amount * EARLY_WITHDRAWAL_PENALTY_RATE : 0;
        const receivable = saving.amount - penalty;

        try {
            // 1. Mark saving as withdrawn
            const { error: saveError } = await supabase.from('locked_savings').update({ is_withdrawn: true }).eq('id', saving.id);
            if (saveError) throw saveError;
            
            // 2. Update account balance
            const { error: accountError } = await supabase.from('accounts').update({ balance: targetAccount.balance + receivable }).eq('id', targetAccount.id);
            if (accountError) throw accountError;

            // 3. Add transactions for history
            if (isEarly) {
                await supabase.from('transactions').insert({
                    user_id: user.id, from_details: 'Locked Savings', to_details: 'Penalty', amount: penalty,
                    description: 'Early withdrawal penalty', type: 'penalty', status: 'Completed',
                });
            }
            await supabase.from('transactions').insert({
                user_id: user.id, from_details: 'Locked Savings', to_details: targetAccount.name, amount: receivable,
                description: `Withdrawal from savings`, type: 'receive', status: 'Completed',
            });
            
            await fetchData();
        } catch (error: any) {
            console.error("Error withdrawing funds:", error);
            alert(`Failed to withdraw funds. Reason: ${error.message || 'An unknown error occurred.'}`);
        }
    };
    
    const handleApproveRequest = async (tx: Transaction) => {
        if (!user) return;
        const fromAccount = accounts[0]; // For simplicity, use first account
        if (!fromAccount || fromAccount.balance === null || fromAccount.balance < tx.amount) {
            alert("Insufficient funds to approve this request.");
            return;
        }
        const supabase = getSupabase();
        try {
            // 1. Update user's balance
            await supabase.from('accounts').update({ balance: fromAccount.balance - tx.amount }).eq('id', fromAccount.id);
            // 2. Update transaction to completed
            await supabase.from('transactions').update({ status: 'Completed' }).eq('id', tx.id);
            await fetchData();
        } catch (error: any) {
            console.error("Error approving request:", error);
            alert(`Failed to approve request. Reason: ${error.message || 'An unknown error occurred.'}`);
        }
    };

    const handleDeclineRequest = async (tx: Transaction) => {
        const supabase = getSupabase();
        try {
            await supabase.from('transactions').update({ status: 'Declined' }).eq('id', tx.id);
            await fetchData();
        } catch (error: any) {
            console.error("Error declining request:", error);
            alert(`Failed to decline request. Reason: ${error.message || 'An unknown error occurred.'}`);
        }
    };

    const handleConnectionSuccess = async () => {
        // The backend function handled creating accounts, we just need to refresh
        await fetchData();
        setIsConnectAccountModalOpen(false);
    };

    // --- Derived State ---
    const notificationCount = transactions.filter(tx => (tx.type === 'request' && tx.to_details === user?.email && tx.status === TransactionStatus.PENDING)).length
        + lockedSavings.filter(s => !s.isWithdrawn && new Date() > new Date(s.endDate)).length;

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
    }

    if (!user) {
        return <Auth />;
    }

    // --- Render Logic ---
    const tabStyle = "px-4 py-3 font-bold rounded-lg transition-all duration-300 w-full text-center";
    const activeTabStyle = "bg-lime-500 text-indigo-900 shadow-lg shadow-lime-500/20";
    const inactiveTabStyle = "bg-gray-700/50 hover:bg-gray-600 text-white";

    return (
        <div className="relative min-h-screen z-10">
            <Header 
                onProfileClick={() => setIsProfileModalOpen(true)}
                notificationCount={notificationCount}
                onBellClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            />
            <Router>
                <div className="app-container">
                    <nav style={{ textAlign: 'right', margin: '16px 0' }}>
                        <Link to="/privacy-policy">Privacy Policy</Link>
                    </nav>
                    {isNotificationsOpen && user?.email && (
                        <NotificationsPanel 
                            transactions={transactions}
                            lockedSavings={lockedSavings}
                            currentUserEmail={user.email}
                            onApproveRequest={handleApproveRequest}
                            onDeclineRequest={handleDeclineRequest}
                            onWithdraw={handleWithdraw}
                            onClose={() => setIsNotificationsOpen(false)}
                        />
                    )}
                    <Routes>
                        <Route path="/" element={
                            <main className="p-4 md:p-8 space-y-8">
                                <BalanceSummary accounts={accounts} onConnectClick={() => setIsConnectAccountModalOpen(true)} />
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 p-2 bg-black/20 rounded-xl">
                                    <button onClick={() => setActiveTab('send')} className={`${tabStyle} ${activeTab === 'send' ? activeTabStyle : inactiveTabStyle}`}>Send</button>
                                    <button onClick={() => setActiveTab('request')} className={`${tabStyle} ${activeTab === 'request' ? activeTabStyle : inactiveTabStyle}`}>Request</button>
                                    <button onClick={() => setActiveTab('lock')} className={`${tabStyle} ${activeTab === 'lock' ? activeTabStyle : inactiveTabStyle}`}>Lock</button>
                                    <button onClick={() => setActiveTab('history')} className={`${tabStyle} ${activeTab === 'history' ? activeTabStyle : inactiveTabStyle}`}>History</button>
                                </div>
                                <div className="animate-fade-in-up">
                                    {activeTab === 'send' && <SendMoney accounts={accounts} onSend={handleSendMoney} />}
                                    {activeTab === 'request' && <RequestMoney onRequest={handleRequestMoney} />}
                                    {activeTab === 'lock' && <LockedSavings accounts={accounts} lockedSavings={lockedSavings} onLock={handleLock} onWithdraw={handleWithdraw} />}
                                    {activeTab === 'history' && user?.email && (
                                        <TransactionHistory 
                                            transactions={transactions} 
                                            currentUserEmail={user.email}
                                            onTransactionClick={setSelectedTransaction}
                                            onApproveRequest={handleApproveRequest}
                                            onDeclineRequest={handleDeclineRequest}
                                        />
                                    )}
                                </div>
                                <SecurityTip />
                                <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)}>
                                    <ProfileSettings user={user} />
                                </Modal>
                                <ConnectAccountModal 
                                    isOpen={isConnectAccountModalOpen}
                                    onClose={() => setIsConnectAccountModalOpen(false)}
                                    onConnectionSuccess={handleConnectionSuccess}
                                />
                                <TransactionDetailModal
                                    isOpen={!!selectedTransaction}
                                    onClose={() => setSelectedTransaction(null)}
                                    transaction={selectedTransaction}
                                />
                            </main>
                        } />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    </Routes>
                </div>
            </Router>
export default App;