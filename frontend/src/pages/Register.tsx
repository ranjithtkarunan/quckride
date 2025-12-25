import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Mail, Lock, User, Phone, Car, Wrench, ArrowRight, Loader2, Store } from 'lucide-react';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'customer' as 'customer' | 'vendor',
        vehicleDetails: { make: '', model: '', regNumber: '' },
        vendorDetails: {
            shopName: '',
            isAvailable: true,
            services: [] as string[]
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const availableServices = [
        'Tyre Repair',
        'Battery Jump Start',
        'Fuel Delivery',
        'Towing',
        'Lockout Service',
        'Minor Repairs'
    ];

    const toggleService = (service: string) => {
        setFormData(prev => ({
            ...prev,
            vendorDetails: {
                ...prev.vendorDetails,
                services: prev.vendorDetails.services.includes(service)
                    ? prev.vendorDetails.services.filter(s => s !== service)
                    : [...prev.vendorDetails.services, service]
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            // Transform data to match backend expectations
            const payload: any = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                role: formData.role
            };

            if (formData.role === 'customer') {
                // Convert vehicleDetails object to vehicles array
                payload.vehicles = [formData.vehicleDetails];
            } else {
                // Add complete vendorDetails with required fields
                payload.vendorDetails = {
                    shopName: formData.vendorDetails.shopName,
                    baseLocation: {
                        type: 'Point',
                        coordinates: [77.5946, 12.9716] // Default to Bangalore coordinates
                    },
                    isAvailable: true,
                    services: formData.vendorDetails.services,
                    rating: 0
                };
            }

            const response = await api.post('/auth/register', payload);
            login(response.data.token, response.data.user);
            navigate(response.data.user.role === 'customer' ? '/customer' : '/vendor');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl relative z-10"
            >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-slate-400">Join the QuickRide community</p>
                    </div>

                    <div className="flex bg-white/5 p-1 rounded-2xl mb-8 max-w-sm mx-auto">
                        <button
                            onClick={() => setFormData(prev => ({ ...prev, role: 'customer' }))}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${formData.role === 'customer'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-slate-400'
                                }`}
                        >
                            <Car size={18} />
                            <span>Customer</span>
                        </button>
                        <button
                            onClick={() => setFormData(prev => ({ ...prev, role: 'vendor' }))}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${formData.role === 'vendor'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-slate-400'
                                }`}
                        >
                            <Wrench size={18} />
                            <span>Vendor</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                                        placeholder="Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {formData.role === 'customer' ? (
                                <div className="space-y-6">
                                    <p className="text-sm font-semibold text-primary-400 uppercase tracking-wider ml-1">Vehicle Details</p>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Make</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.vehicleDetails.make}
                                            onChange={(e) => setFormData(prev => ({ ...prev, vehicleDetails: { ...prev.vehicleDetails, make: e.target.value } }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:ring-2 focus:ring-primary-500/50"
                                            placeholder="e.g. Toyota"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Model</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.vehicleDetails.model}
                                            onChange={(e) => setFormData(prev => ({ ...prev, vehicleDetails: { ...prev.vehicleDetails, model: e.target.value } }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:ring-2 focus:ring-primary-500/50"
                                            placeholder="e.g. Camry"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Reg Number</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.vehicleDetails.regNumber}
                                            onChange={(e) => setFormData(prev => ({ ...prev, vehicleDetails: { ...prev.vehicleDetails, regNumber: e.target.value } }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:ring-2 focus:ring-primary-500/50 font-mono tracking-widest uppercase"
                                            placeholder="KA 01 AB 1234"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <p className="text-sm font-semibold text-primary-400 uppercase tracking-wider ml-1">Vendor Details</p>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Shop Name</label>
                                        <div className="relative">
                                            <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                type="text"
                                                required
                                                value={formData.vendorDetails.shopName}
                                                onChange={(e) => setFormData(prev => ({ ...prev, vendorDetails: { ...prev.vendorDetails, shopName: e.target.value } }))}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                                                placeholder="Expert Tyres"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Services Offered</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {availableServices.map(service => (
                                                <label
                                                    key={service}
                                                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.vendorDetails.services.includes(service)
                                                            ? 'bg-primary-500/20 border-primary-500/50 text-primary-300'
                                                            : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.vendorDetails.services.includes(service)}
                                                        onChange={() => toggleService(service)}
                                                        className="w-4 h-4 rounded accent-primary-500"
                                                    />
                                                    <span className="text-sm">{service}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-2xl">
                                        <p className="text-xs text-primary-300 leading-relaxed">
                                            Vendors will be notified of nearby requests. You can toggle your availability from the dashboard.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 space-y-4">
                                {error && (
                                    <p className="text-red-400 text-sm bg-red-400/10 py-2 px-4 rounded-xl border border-red-400/20">{error}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary-600/30 flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : <><span>Sign Up</span><ArrowRight /></>}
                                </button>
                            </div>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
