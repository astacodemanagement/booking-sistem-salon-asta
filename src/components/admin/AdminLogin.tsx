import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowLeft, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToCustomer: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToCustomer,
}) => {
  const [username, setUsername] = useState('admin@salonasta.com');
  const [password, setPassword] = useState('asta123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const validUsername = username.trim().toLowerCase() === 'admin@salonasta.com' || username.trim().toLowerCase() === 'admin';
      const validPassword = password === 'asta123' || password === '1234';

      if (validUsername && validPassword) {
        localStorage.setItem('asta_admin_authenticated', 'true');
        localStorage.setItem('asta_admin_user', username.trim());
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('Email atau password salah. Silakan periksa kembali kredensial Anda.');
      }
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    setUsername('admin@salonasta.com');
    setPassword('asta123');
    localStorage.setItem('asta_admin_authenticated', 'true');
    localStorage.setItem('asta_admin_user', 'admin@salonasta.com');
    onLoginSuccess();
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-[#faf8f5]">
      <div className="w-full max-w-md bg-white border border-[#eae3d5] rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Top gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b58c54] via-[#dfc19a] to-[#b58c54]" />

        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#faf5eb] border border-[#d9c4aa] text-[#9c7540] flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Portal Khusus Staff & Admin
          </h2>
          <p className="text-xs text-stone-500">
            Halaman internal Salon Asta untuk mengelola jadwal kunjungan, master data cabang, dan layanan.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Username / Email Staff
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin@salonasta.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#fdfbf7] border border-stone-300 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#b58c54] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Kata Sandi / Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-[#fdfbf7] border border-stone-300 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#b58c54] focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Info */}
          <div className="p-3 rounded-xl bg-[#faf6ef] border border-[#ebdccb] text-[11px] text-stone-600 space-y-1">
            <div className="flex items-center justify-between font-bold text-stone-800">
              <span>Akun Demo Staff:</span>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="text-[#9c7540] hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Masuk Otomatis</span>
              </button>
            </div>
            <div>Email: <strong className="text-stone-900">admin@salonasta.com</strong> (atau: <strong>admin</strong>)</div>
            <div>Password: <strong className="text-stone-900">asta123</strong> (atau: <strong>1234</strong>)</div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#b58c54] hover:bg-[#a07742] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onBackToCustomer}
            className="text-stone-500 hover:text-stone-900 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Website Tamu</span>
          </button>

          <span className="text-[10px] text-stone-400 font-mono">Salon Asta Staff</span>
        </div>
      </div>
    </div>
  );
};
