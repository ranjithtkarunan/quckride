import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, MapPin, CheckCircle, Navigation, Phone, AlertCircle, Wrench, ChevronRight, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/client';

const VendorDashboard: React.FC = () => {
    const { logout } = useAuth();
    const [nearbyRequests, setNearbyRequests] = useState<any[]>([]);
    const [myJobs, setMyJobs] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'nearby' | 'active'>('nearby');

    const fetchData = async () => {
        try {
            const [nearbyRes, myJobsRes] = await Promise.all([
                api.get('/services/nearby'),
                api.get('/services/my')
            ]);
            setNearbyRequests(nearbyRes.data);
            setMyJobs(myJobsRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, []);

    const handleAcceptJob = async (requestId: string) => {
        try {
            await api.put(`/services/${requestId}/accept`);
            fetchData();
            setActiveTab('active');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            {/* Header */}
            <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-white">QuickRide</h1>
                        <span className="bg-primary-600/20 text-primary-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-primary-600/30">Vendor</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium">Online</span>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
                        >
                            <LogOut size={22} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-10">
                <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Puncture Requests</h2>
                        <p className="text-slate-400">Available service requests in your area</p>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-2xl w-full sm:w-auto">
                        <button
                            onClick={() => setActiveTab('nearby')}
                            className={`flex-1 sm:px-8 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'nearby' ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-slate-400'
                                }`}
                        >
                            Nearby ({nearbyRequests.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`flex-1 sm:px-8 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'active' ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-slate-400'
                                }`}
                        >
                            My Jobs ({myJobs.filter(j => j.status === 'accepted').length})
                        </button>
                    </div>
                </header>

                <section className="space-y-6">
                    {activeTab === 'nearby' ? (
                        nearbyRequests.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                                <AlertCircle className="mx-auto mb-4 text-slate-500" size={48} />
                                <p className="text-slate-400">No requests available at the moment.<br />You'll be notified when someone needs help!</p>
                            </div>
                        ) : (
                            nearbyRequests.map((req) => (
                                <motion.div
                                    key={req._id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden group hover:border-primary-500/50 transition-all shadow-xl"
                                >
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex gap-4">
                                                <div className="w-14 h-14 bg-primary-600/10 rounded-2xl flex items-center justify-center text-primary-500">
                                                    <Car size={28} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold">{req.vehicleInfo.make} {req.vehicleInfo.model}</h3>
                                                    <p className="text-primary-400 font-mono text-sm tracking-wider">{req.vehicleInfo.regNumber}</p>
                                                </div>
                                            </div>
                                            <div className="bg-white/5 px-4 py-2 rounded-2xl text-xs text-slate-400">
                                                {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                            <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl">
                                                <MapPin className="text-primary-500 shrink-0 mt-0.5" size={18} />
                                                <p className="text-sm text-slate-300 leading-snug">{req.location.address}</p>
                                            </div>
                                            <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl">
                                                <Phone className="text-primary-500 shrink-0 mt-0.5" size={18} />
                                                <p className="text-sm text-slate-300">Contact: {req.customer?.phone || 'Hidden'}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleAcceptJob(req._id)}
                                            className="w-full bg-white text-slate-900 font-bold py-4 rounded-2xl hover:bg-primary-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 group-hover:shadow-xl group-hover:shadow-primary-600/20 active:scale-[0.98]"
                                        >
                                            <span>Accept Job Request</span>
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )
                    ) : (
                        myJobs.filter(j => j.status === 'accepted').length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                                <Wrench className="mx-auto mb-4 text-slate-500" size={48} />
                                <p className="text-slate-400">You don't have any active jobs.<br />Go to 'Nearby' to find requests.</p>
                            </div>
                        ) : (
                            myJobs.filter(j => j.status === 'accepted').map((req) => (
                                <motion.div
                                    key={req._id}
                                    className="bg-primary-600/10 border border-primary-600/30 rounded-[32px] p-8 relative overflow-hidden shadow-2xl"
                                >
                                    <div className="absolute top-0 right-0 p-6">
                                        <div className="bg-primary-600 text-xs font-bold px-3 py-1 rounded-full animate-pulse">ACTIVE</div>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-4">{req.vehicleInfo.make} {req.vehicleInfo.model}</h3>
                                    <div className="flex items-center gap-3 text-slate-300 mb-8">
                                        <MapPin size={18} />
                                        <span>{req.location.address}</span>
                                    </div>

                                    <div className="flex gap-4">
                                        <button className="flex-1 bg-primary-600 hover:bg-primary-500 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-600/30 active:scale-[0.98]">
                                            <Navigation size={20} />
                                            Navigate
                                        </button>
                                        <button className="flex-1 bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-white/10 active:scale-[0.98]">
                                            <CheckCircle size={20} />
                                            Complete
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )
                    )}
                </section>
            </main>
        </div>
    );
};

export default VendorDashboard;
