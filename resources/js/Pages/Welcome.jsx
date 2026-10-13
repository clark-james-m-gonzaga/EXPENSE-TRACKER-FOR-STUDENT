import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="CPSU Expense Tracker" />
            <div className="min-h-screen bg-[#f8faf8] text-zinc-900">
                <header className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-700 grid place-items-center text-white font-black text-xl">₱</div>
                        <div><p className="font-black text-sm">CPSU</p><p className="text- font-bold text-green-700 tracking-widest">EXPENSE TRACKER</p></div>
                    </div>
                    <div className="flex gap-2">
                        {auth.user? (
                            <Link href="/dashboard" className="bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-bold">Dashboard</Link>
                        ) : (
                            <>
                                <Link href="/login" className="px-5 py-2.5 rounded-full text-sm font-bold border">Log in</Link>
                                <Link href="/register" className="bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-bold">Get Started</Link>
                            </>
                        )}
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-5xl font-black leading-none">Track your <br/><span className="text-green-700">baon.</span><br/>Master your budget.</h1>
                        <p className="mt-6 text-lg text-zinc-600 max-w-lg">Monitor allowance, boarding, jeep, photocopy, food. Never run out before payday.</p>
                        <div className="mt-8">
                            <Link href="/register" className="bg-green-700 text-white px-8 py-4 rounded-full font-bold inline-block">Start Tracking →</Link>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-8 shadow-2xl">
                        <div className="flex justify-between mb-6"><h3 className="font-bold">My Allowance - Oct</h3><span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">₱3,500 left</span></div>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b py-2"><span>Jeep</span><span className="font-bold">-₱150</span></div>
                            <div className="flex justify-between border-b py-2"><span>Food</span><span className="font-bold">-₱280</span></div>
                            <div className="flex justify-between py-2 text-green-600 font-bold"><span>Allowance</span><span>+₱5000</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}