import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const CATEGORIES = [
  { name: 'Food', icon: '🍚', color: 'bg-orange-100 text-orange-700' },
  { name: 'Jeep', icon: '🛺', color: 'bg-blue-100 text-blue-700' },
  { name: 'Photocopy', icon: '📄', color: 'bg-purple-100 text-purple-700' },
  { name: 'Boarding', icon: '🏠', color: 'bg-red-100 text-red-700' },
  { name: 'Load', icon: '📱', color: 'bg-cyan-100 text-cyan-700' },
  { name: 'School', icon: '🎓', color: 'bg-green-100 text-green-700' },
  { name: 'Others', icon: '💸', color: 'bg-zinc-100 text-zinc-700' },
];

export default function Clark({ auth }) {
    const user = auth?.user;
    const isLoggedIn =!!user;

    // User-scoped keys so Clark's data doesn't show on another account
    const EXPENSE_KEY = `cpsu-expenses-${user?.id || 'guest'}`;
    const ALLOWANCE_KEY = `cpsu-allowance-${user?.id || 'guest'}`;

    const [expenses, setExpenses] = useState(() => {
        const s = localStorage.getItem(EXPENSE_KEY);
        if (s) return JSON.parse(s);
        // Default demo data only for guest / first time
        return [
            { id: 1, title: 'Jeep to CPSU Main', amount: 20, category: 'Jeep', date: new Date().toISOString().split('T')[0] },
            { id: 2, title: 'Adobo Rice', amount: 80, category: 'Food', date: new Date().toISOString().split('T')[0] },
        ];
    });
    const [allowance, setAllowance] = useState(() => localStorage.getItem(ALLOWANCE_KEY) || 5000);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => { localStorage.setItem(EXPENSE_KEY, JSON.stringify(expenses)); }, [expenses, EXPENSE_KEY]);
    useEffect(() => { localStorage.setItem(ALLOWANCE_KEY, allowance); }, [allowance, ALLOWANCE_KEY]);

    // Re-load when user logs in/out
    useEffect(() => {
        const s = localStorage.getItem(EXPENSE_KEY);
        if (s) setExpenses(JSON.parse(s));
        const a = localStorage.getItem(ALLOWANCE_KEY);
        if (a) setAllowance(a);
    }, [user?.id]);

    const filtered = expenses.filter(e => e.date === date);
    const totalToday = filtered.reduce((a,b)=>a+Number(b.amount),0);
    const totalAll = expenses.reduce((a,b)=>a+Number(b.amount),0);
    const balance = Number(allowance) - totalAll;

    const handleLogout = () => {
        router.post('/logout');
    };

    const add = (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            router.get('/login');
            return;
        }
        if(!title ||!amount) return;
        setExpenses([{ id: Date.now(), title, amount: Number(amount), category, date },...expenses]);
        setTitle(''); setAmount('');
    };

    return (
        <>
            <Head title="Clark - CPSU Tracker" />
            <div className="min-h-screen bg-[#f8faf8] text-zinc-900 p-4">
                <div className="max-w-6xl mx-auto">
                    <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-700 rounded-xl grid place-items-center text-white font-black">₱</div>
                            <div><p className="font-black">CPSU EXPENSE TRACKER</p><p className="text-xs text-green-700 font-bold uppercase">{isLoggedIn? `CLARK JAMES - ${user.name}` : 'Please Log In'}</p></div>
                        </div>
                        <div className="flex gap-2 items-center">
                            {!isLoggedIn? (
                                <>
                                    <Link href="/login" className="px-5 py-2 rounded-full bg-zinc-900 text-white font-bold text-sm">Log in</Link>
                                    <Link href="/register" className="px-5 py-2 rounded-full bg-white border font-bold text-sm">Register</Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/dashboard" className="px-4 py-2 rounded-full bg-zinc-100 font-bold text-sm">Dashboard</Link>
                                    <button onClick={handleLogout} className="px-4 py-2 rounded-full bg-red-600 text-white font-bold text-sm hover:bg-red-700">Log out</button>
                                </>
                            )}
                        </div>
                    </header>

                    {!isLoggedIn && (
                        <div className="bg-white border-2 border-dashed border-green-700/20 p-8 rounded-2xl shadow-sm mb-6 text-center">
                            <h2 className="text-2xl font-black">Welcome, Clark!</h2>
                            <p className="text-sm text-zinc-500 mt-2">Log in to save your expenses securely and access them anywhere.</p>
                            <Link href="/login" className="inline-block mt-4 px-6 py-3 rounded-full bg-green-700 text-white font-bold">Log in to Continue</Link>
                        </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm"><p className="text-xs font-bold text-zinc-500">ALLOWANCE</p><p className="text-3xl font-black mt-1">₱{allowance}</p><input type="number" value={allowance} onChange={e=>setAllowance(e.target.value)} className="mt-3 w-full border rounded-full px-3 py-2 text-sm" disabled={!isLoggedIn} /></div>
                        <div className="bg-green-700 text-white p-6 rounded-2xl shadow-sm"><p className="text-xs font-bold opacity-80">BALANCE LEFT</p><p className="text-3xl font-black mt-1">₱{balance.toLocaleString()}</p><p className="text-xs mt-2">{balance<500?'⚠ Tipid na!':'Nice budgeting!'}</p></div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm"><p className="text-xs font-bold text-zinc-500">TODAY - {date}</p><p className="text-3xl font-black mt-1 text-red-600">-₱{totalToday}</p><p className="text-xs mt-2 text-zinc-500">{filtered.length} expenses</p></div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm h-fit">
                            <h3 className="font-bold mb-4">Add Expense {isLoggedIn? '' : '(Login required)'}</h3>
                            <form onSubmit={add} className="space-y-3">
                                <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm" />
                                <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="What? ex: Kwek2x, Jeep" className="w-full border rounded-xl px-4 py-3 text-sm" required />
                                <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" placeholder="Amount" className="w-full border rounded-xl px-4 py-3 text-sm" required />
                                <div className="grid grid-cols-2 gap-2">
                                    {CATEGORIES.map(c=>(
                                        <button key={c.name} type="button" onClick={()=>setCategory(c.name)} className={`text-xs font-bold px-3 py-2.5 rounded-full border ${category===c.name? c.color : 'bg-zinc-50'}`}>{c.icon} {c.name}</button>
                                    ))}
                                </div>
                                <button className="w-full bg-green-700 text-white font-bold py-3 rounded-full hover:bg-green-800">{isLoggedIn? 'Add Expense' : 'Log in to Add'}</button>
                            </form>
                        </div>

                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold mb-4">Expenses on {date}</h3>
                            <div className="space-y-2 max-h- overflow-auto">
                                {filtered.length===0 && <p className="text-center py-10 text-zinc-500 text-sm">No expenses today. Tipid! 😎</p>}
                                {filtered.map(exp=>{
                                    const cat = CATEGORIES.find(x=>x.name===exp.category);
                                    return (
                                        <div key={exp.id} className="flex justify-between items-center p-4 bg-zinc-50 rounded-2xl">
                                            <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-full grid place-items-center ${cat?.color}`}>{cat?.icon}</div><div><p className="font-bold text-sm">{exp.title}</p><p className="text-xs text-zinc-500">{exp.category}</p></div></div>
                                            <div className="flex gap-3 items-center"><p className="font-black text-sm">-₱{exp.amount}</p><button onClick={()=>setExpenses(expenses.filter(x=>x.id!==exp.id))} className="text-zinc-400">✕</button></div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}