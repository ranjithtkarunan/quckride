import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, MapPin, Car, Plus, Clock, CheckCircle, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';

const CustomerDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [requests, setRequests] = useState<any[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newRequest, setNewRequest] = useState({
        location: { address: '', coordinates: [0, 0] },
        description: '',
    });

    const fetchRequests = async () => {
        try {
            const response = await api.get('/services/my');
            setRequests(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleCreateRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/services', {
                ...newRequest,
                vehicleInfo: user?.vehicles?.[0],
            });
            setIsCreating(false);
            fetchRequests();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            {/* Header */}
            <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold tracking-tight">QuickRide</h1>
                    <div className="flex items-center gap-6">
                        <span className="text-slate-400 hidden sm:inline">Hello, <span className="text-white font-medium">{user?.name}</span></span>
                        <button
                            onClick={logout}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
                        >
                            <LogOut size={22} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-6"
                        >
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Car className="text-primary-500" size={20} />
                                My Vehicle
                            </h2>
                            <div className="space-y-3">
                                <p className="text-slate-400 text-sm italic">Registered Vehicle</p>
                                <div className="bg-white/5 p-4 rounded-2xl">
                                    <p className="font-bold text-lg">{user?.vehicles?.[0]?.make} {user?.vehicles?.[0]?.model}</p>
                                    <p className="text-primary-400 font-mono tracking-wider mt-1">{user?.vehicles?.[0]?.regNumber}</p>
                                </div>
                            </div>
                        </motion.div>

                        <button
                            onClick={() => setIsCreating(true)}
                            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                            <Plus size={24} />
                            Request Assistance
                        </button>
                    </div>

                    {/* Main Content - Active Requests */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            Service History
                            <span className="text-sm font-normal text-slate-500 bg-white/5 px-3 py-1 rounded-full">
                                {requests.length} Requests
                            </span>
                        </h2>

                        <div className="space-y-4">
                            {requests.length === 0 ? (
                                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                    <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Clock className="text-slate-500" size={32} />
                                    </div>
                                    <p className="text-slate-400">No requests yet. Create your first request to get help.</p>
                                </div>
                            ) : (
                                requests.map((req) => (
                                    <motion.div
                                        key={req._id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-colors group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl ${req.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                                    req.status === 'accepted' ? 'bg-primary-500/10 text-primary-500' :
                                                        'bg-emerald-500/10 text-emerald-500'
                                                    }`}>
                                                    {req.status === 'pending' ? <Clock size={20} /> : <CheckCircle size={20} />}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-lg capitalize">{req.status}</p>
                                                    <p className="text-xs text-slate-500">{new Date(req.createdAt).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-slate-300">ID: ...{req._id.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 text-slate-400 text-sm mb-4">
                                            <MapPin size={18} className="shrink-0 mt-0.5" />
                                            <p>{req.location.address}</p>
                                        </div>

                                        {req.status === 'accepted' && (
                                            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-xs font-bold">V</div>
                                                    <p className="text-sm text-slate-300">Vendor is on the way</p>
                                                </div>
                                                <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-slate-300">
                                                    <Navigation size={14} />
                                                    Track
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Create Request Modal */}
            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreating(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-3xl p-8 shadow-2xl relative z-10"
                        >
                            <h2 className="text-2xl font-bold mb-6">Raise Puncture Service</h2>
                            <form onSubmit={handleCreateRequest} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">My Current Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={newRequest.location.address}
                                            onChange={(e) => setNewRequest(prev => ({ ...prev, location: { ...prev.location, address: e.target.value } }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-primary-500/50"
                                            placeholder="Street, City, State"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Details (Optional)</label>
                                    <textarea
                                        value={newRequest.description}
                                        onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:ring-2 focus:ring-primary-500/50 h-32 resize-none"
                                        placeholder="E.g. Rear left tyre flat, need urgent help"
                                    />
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary-600/30 transition-all active:scale-[0.98]"
                                    >
                                        Confirm Request
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomerDashboard;
