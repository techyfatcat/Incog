import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Check, RefreshCw, ChevronDown, X } from 'lucide-react';
import Stepper, { Step } from './Stepper';
import api from '../utils/api'; // <--- UPDATED: Import your custom api instance

// --- HELPER: CONSISTENT AVATAR LOGIC ---
const getAvatarUrl = (seed) => {
    // Falls back to Dicebear if your custom avatar API isn't set
    const apiBase = import.meta.env.VITE_API_URL;
    return apiBase
        ? `${apiBase}/avatar/${seed}`
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
};

// Validation Constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

export default function Auth() {
    const navigate = useNavigate();
    const location = useLocation();

    // UI State
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    // Form State
    const [usernameStatus, setUsernameStatus] = useState('idle');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        avatar: getAvatarUrl('initial-bot'),
        purpose: ''
    });

    // OTP State
    const [generatedOtp, setGeneratedOtp] = useState(false);
    const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
    const [otpError, setOtpError] = useState("");
    const [otpTimer, setOtpTimer] = useState(0);

    // --- STEP VALIDATION LOGIC ---
    const isStepValid = useCallback((step) => {
        if (isLogin) return true;
        switch (step) {
            case 1: return EMAIL_REGEX.test(formData.email);
            case 2: return generatedOtp && otpVerified;
            case 3: return USERNAME_REGEX.test(formData.username);
            case 4: return true;
            case 5: return PASSWORD_REGEX.test(formData.password);
            case 6: return formData.purpose !== '';
            default: return false;
        }
    }, [formData, otpVerified, generatedOtp, isLogin]);

    // --- OTP HANDLERS ---
    const sendOtp = async () => {
        if (!EMAIL_REGEX.test(formData.email)) return;
        try {
            setIsLoading(true);
            setOtpError("");
            // UPDATED: Using 'api' instance and relative path
            await api.post('/auth/send-otp', { email: formData.email });
            setGeneratedOtp(true);
            setOtpTimer(60);
        } catch (error) {
            setOtpError(error.response?.data?.error || "Email already registered");
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOtp = async () => {
        const otpCode = otpDigits.join("");
        if (otpCode.length !== 6) {
            setOtpError("Enter complete 6 digit code");
            return;
        }
        try {
            setIsLoading(true);
            setOtpError("");
            // UPDATED: Using 'api' instance
            await api.post('/auth/verify-otp', {
                email: formData.email,
                otp: otpCode
            });
            setOtpVerified(true);
        } catch (error) {
            setOtpError(error.response?.data?.error || "Invalid code");
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setIsLoading(false);
        }
    };

    // --- FINAL ACTIONS ---
    const handleFinalAuth = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setOtpError("");

        try {
            // UPDATED: Logic to hit /auth/login or /auth/register via 'api'
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : { ...formData, otp: otpDigits.join("") };

            const res = await api.post(endpoint, payload);

            // Store Auth Data
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userName", res.data.user.username);
            localStorage.setItem("userAvatar", res.data.user.avatar);

            const from = location.state?.from || "/";
            navigate(from, { replace: true });
        } catch (error) {
            setOtpError(error.response?.data?.error || "Authentication failed");
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setIsLoading(false);
        }
    };

    // --- UI HELPERS ---
    const handleOtpChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otpDigits];
        newOtp[index] = value;
        setOtpDigits(newOtp);
        if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const generateNewAvatar = () => {
        const newSeed = Math.random().toString(36).substring(7);
        setFormData(prev => ({ ...prev, avatar: getAvatarUrl(newSeed) }));
    };

    // Timer Effect
    useEffect(() => {
        let interval;
        if (otpTimer > 0) interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [otpTimer]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#e5e5e5] dark:bg-[#080B16] transition-colors duration-500 font-sans relative overflow-hidden">

            {/* Background Decorative Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/5 dark:bg-blue-600/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-white/20 dark:bg-purple-900/5 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-[440px] bg-white dark:bg-[#0A0C14] border border-white dark:border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 lg:p-10"
            >
                {/* ERROR TOAST POPUP */}
                <AnimatePresence>
                    {otpError && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-500/20 p-4 rounded-2xl shadow-lg"
                        >
                            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                                <AlertCircle size={20} />
                                <span className="text-sm font-medium">{otpError}</span>
                            </div>
                            <button onClick={() => setOtpError("")} className="text-red-400 hover:text-red-600">
                                <X size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                        {isLogin ? "Sign in to Incog" : "Create account"}
                    </h1>
                </div>

                <AnimatePresence mode="wait">
                    {isLogin ? (
                        <motion.form
                            key="login-form"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-4"
                            onSubmit={handleFinalAuth}
                        >
                            <motion.div animate={shake && isLogin ? { x: [-10, 10, -10, 10, 0] } : {}} className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    required
                                    type="text"
                                    placeholder="Email or username"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-2xl py-4 pl-12 text-sm outline-none focus:border-blue-500 transition-all dark:text-white"
                                />
                            </motion.div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-12 text-sm outline-none focus:border-blue-500 transition-all dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 py-4 rounded-2xl text-white font-medium text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isLoading && <RefreshCw size={16} className="animate-spin" />}
                                Sign in
                            </button>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="register-stepper"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                        >
                            <Stepper
                                initialStep={1}
                                onFinalStepCompleted={handleFinalAuth}
                                isStepValid={isStepValid}
                            >
                                <Step title="Email">
                                    <div className="py-2 space-y-3">
                                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider ml-1">Email</p>
                                        <motion.div animate={shake && !isLogin ? { x: [-10, 10, -10, 10, 0] } : {}}>
                                            <input
                                                type="email"
                                                autoFocus
                                                value={formData.email}
                                                placeholder="name@example.com"
                                                className={`w-full bg-gray-50 dark:bg-white/[0.03] border rounded-2xl py-4 px-5 text-sm outline-none transition-all dark:text-white ${otpError ? 'border-red-500' : 'border-gray-100 dark:border-white/5 focus:border-blue-500'}`}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, email: e.target.value });
                                                    if (otpError) setOtpError("");
                                                }}
                                            />
                                        </motion.div>
                                    </div>
                                </Step>

                                <Step title="Verify Email">
                                    <div className="py-4 space-y-6">
                                        <div className="text-center space-y-1">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {generatedOtp ? `We sent a code to ${formData.email}` : "Verify your email to continue"}
                                            </p>
                                        </div>

                                        {!generatedOtp ? (
                                            <button
                                                type="button"
                                                onClick={sendOtp}
                                                disabled={isLoading || !EMAIL_REGEX.test(formData.email)}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-sm font-medium transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                                            >
                                                {isLoading ? <RefreshCw className="animate-spin mx-auto" size={18} /> : "Send Verification Code"}
                                            </button>
                                        ) : (
                                            <div className="space-y-6">
                                                <motion.div
                                                    animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
                                                    className="flex justify-between gap-2"
                                                >
                                                    {otpDigits.map((digit, index) => (
                                                        <input
                                                            key={index}
                                                            id={`otp-${index}`}
                                                            type="text"
                                                            inputMode="numeric"
                                                            maxLength={1}
                                                            value={digit}
                                                            onChange={(e) => handleOtpChange(e.target.value, index)}
                                                            onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                                            disabled={otpVerified || isLoading}
                                                            className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all outline-none
                                                                ${otpVerified
                                                                    ? 'bg-green-50/50 border-green-500 text-green-600 dark:bg-green-500/10'
                                                                    : 'bg-gray-50 dark:bg-white/[0.03] border-gray-100 dark:border-white/10 focus:border-blue-500 dark:text-white'}`}
                                                        />
                                                    ))}
                                                </motion.div>

                                                {!otpVerified && (
                                                    <button
                                                        type="button"
                                                        onClick={verifyOtp}
                                                        className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
                                                    >
                                                        {isLoading ? "Verifying..." : "Verify Code"}
                                                    </button>
                                                )}

                                                <div className="flex flex-col items-center gap-4">
                                                    <AnimatePresence mode="wait">
                                                        {otpVerified && (
                                                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 text-green-600 bg-green-600/10 px-4 py-2 rounded-full">
                                                                <Check size={16} strokeWidth={3} />
                                                                <span className="text-sm font-semibold">Verification Successful</span>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>

                                                    {!otpVerified && (
                                                        <div className="flex items-center justify-between w-full px-1">
                                                            {otpTimer > 0 ? (
                                                                <span className="text-xs text-gray-400 font-medium">Resend in <span className="text-blue-500">{otpTimer}s</span></span>
                                                            ) : (
                                                                <button type="button" onClick={sendOtp} className="text-xs text-blue-600 font-bold uppercase tracking-wider">Resend Code</button>
                                                            )}
                                                            <button type="button" onClick={() => {
                                                                setGeneratedOtp(false);
                                                                setOtpVerified(false);
                                                                setOtpDigits(Array(6).fill(""));
                                                                setOtpError("");
                                                            }} className="text-xs text-gray-400 underline">Change Email</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Step>

                                <Step title="Username">
                                    <div className="py-2 space-y-3">
                                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider ml-1">Username</p>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.username}
                                                placeholder="choose a name"
                                                className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-2xl py-4 px-5 text-sm outline-none focus:border-blue-500 dark:text-white"
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </Step>

                                <Step title="Avatar">
                                    <div className="py-2 flex flex-col items-center gap-4">
                                        <div className="p-3 bg-gray-50 dark:bg-white/[0.03] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-inner">
                                            <img
                                                src={formData.avatar}
                                                alt="avatar"
                                                className="w-20 h-20 rounded-2xl bg-white"
                                                onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.username || 'bot'}` }}
                                            />
                                        </div>
                                        <button type="button" onClick={generateNewAvatar} className="text-sm text-blue-600 font-medium hover:underline">Randomize Bot</button>
                                    </div>
                                </Step>

                                <Step title="Password">
                                    <div className="py-2 space-y-3">
                                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider ml-1">Password</p>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            placeholder="Min 8 chars, 1 letter & 1 number"
                                            className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-2xl py-4 px-5 text-sm outline-none focus:border-blue-500 dark:text-white"
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </Step>

                                <Step title="Purpose">
                                    <div className="py-2 space-y-3">
                                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider ml-1">I'm here for</p>
                                        <div className="relative group">
                                            <select
                                                value={formData.purpose}
                                                className="w-full bg-gray-50 dark:bg-[#151821] border border-gray-100 dark:border-white/5 rounded-2xl py-4 px-5 text-sm outline-none focus:border-blue-500 dark:text-white appearance-none cursor-pointer"
                                                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                            >
                                                <option value="" disabled>Select an option</option>
                                                <option value="networking">Professional Networking</option>
                                                <option value="salary">Salary Insights</option>
                                                <option value="community">Community Discussion</option>
                                                <option value="other">Other</option>
                                            </select>
                                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" size={16} />
                                        </div>
                                    </div>
                                </Step>
                            </Stepper>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-8 text-center border-t border-gray-100 dark:border-white/5 pt-6">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setOtpError("");
                        }}
                        className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 transition-colors"
                    >
                        {isLogin ? "New to Incog? Sign up" : "Have an account? Sign in"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}