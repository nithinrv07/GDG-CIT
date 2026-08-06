import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/context/AuthContext';
import { DotBackground } from '../../components/home/DotBackground';
import { motion } from 'framer-motion';

export default function Login() {
    const { login, user } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (user) {
        navigate('/admin', { replace: true });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const res = await login(email, password);
        setIsSubmitting(false);

        if (res.success) {
            navigate('/admin', { replace: true });
        } else {
            setError(res.error);
        }
    };

    const fillCredentials = (type) => {
        if (type === 'superadmin') {
            setEmail(import.meta.env.VITE_SUPERADMIN_EMAIL || 'superadmin@gdgcit.com');
            setPassword(import.meta.env.VITE_SUPERADMIN_PASSWORD || 'GDG#SuperAdmin2026!');
        } else if (type === 'events') {
            setEmail(import.meta.env.VITE_EVENTSTEAM_EMAIL || 'events@gdgcit.com');
            setPassword(import.meta.env.VITE_EVENTSTEAM_PASSWORD || 'GDG#EventsTeam2026!');
        }
        setError('');
    };

    return (
        <div className="min-h-screen bg-[#fcf9f1] flex items-center justify-center p-4 relative overflow-hidden text-black font-sans">
            <DotBackground />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md bg-white border-[3px] border-black p-8 rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10 relative"
            >
                {/* Header Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-[#FFD700] px-4 py-2 rounded-full border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
                        <div className="flex gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-[#4285F4] border border-black" />
                            <span className="w-3 h-3 rounded-full bg-[#EA4335] border border-black" />
                            <span className="w-3 h-3 rounded-full bg-[#FBBC04] border border-black" />
                            <span className="w-3 h-3 rounded-full bg-[#34A853] border border-black" />
                        </div>
                        <span className="font-black text-xs uppercase text-black tracking-wider">
                            GDG CIT Control Center
                        </span>
                    </div>

                    <h1 className="text-3xl font-black uppercase text-black tracking-tight" style={{ WebkitTextStroke: '1px black' }}>
                        Admin Portal
                    </h1>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-tight mt-1">
                        Sign in to access management controls
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-2xl bg-[#EA4335] text-white border-[3px] border-black font-black text-xs flex items-center gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <span className="text-lg">⚠️</span>
                        <span>{error}</span>
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-black uppercase text-black mb-2 tracking-wider">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@gdgcit.com"
                            className="w-full px-4 py-3 rounded-2xl bg-[#fcf9f1] border-[3px] border-black text-black font-bold text-sm focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase text-black mb-2 tracking-wider">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full px-4 py-3 rounded-2xl bg-[#fcf9f1] border-[3px] border-black text-black font-bold text-sm focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black uppercase text-black hover:underline"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-4 bg-[#4285F4] hover:bg-[#34A853] text-white font-black text-sm uppercase tracking-wider rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            'Sign In to Dashboard →'
                        )}
                    </button>
                </form>

                {/* Quick Demo Accounts Helper */}
                <div className="mt-8 pt-6 border-t-[3px] border-black">
                    <p className="text-[11px] font-black text-black uppercase tracking-wider mb-3 text-center">
                        Quick Demo Credentials (.env loaded)
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => fillCredentials('superadmin')}
                            className="p-3 text-left rounded-2xl bg-[#FFD700] hover:bg-[#FBBC04] border-[2.5px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-1.5 mb-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335] border border-black" />
                                <span className="text-xs font-black text-black">Super Admin</span>
                            </div>
                            <p className="text-[10px] font-bold text-black opacity-80">Full Control</p>
                        </button>

                        <button
                            type="button"
                            onClick={() => fillCredentials('events')}
                            className="p-3 text-left rounded-2xl bg-[#34A853] hover:bg-[#2e9649] text-white border-[2.5px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-1.5 mb-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD700] border border-black" />
                                <span className="text-xs font-black text-white">Events Team</span>
                            </div>
                            <p className="text-[10px] font-bold text-white opacity-90">Events & Gallery</p>
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <a
                        href="/"
                        className="inline-block text-xs font-black uppercase text-black hover:bg-[#FFD700] px-3 py-1.5 rounded-full border-[2px] border-black transition-colors"
                    >
                        ← Back to Public Website
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
