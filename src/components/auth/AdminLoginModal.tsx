import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Store, KeyRound } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
}) => {
  const [email, setEmail] = useState('admin@ndfstore.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Harap isi email dan password.');
      return;
    }
    // Accept standard demo credentials or any valid input
    sessionStorage.setItem('biolink_admin_auth', 'true');
    setError('');
    onSuccess();
  };

  const handleQuickDemoLogin = () => {
    sessionStorage.setItem('biolink_admin_auth', 'true');
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative">
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md">
          <ShieldCheck size={28} />
        </div>

        <h3 className="text-lg font-bold text-slate-900">Login Dashboard Admin</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Kelola toko, desain, link, dan pengaturan Bio Link Anda
        </p>

        {error && (
          <div className="p-2.5 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">Email / Username</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 text-slate-400" size={15} />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ndfstore.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">Kata Sandi</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 text-slate-400" size={15} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm mt-2"
          >
            <span>Masuk ke Dashboard</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
          >
            Masuk Cepat Demo (Instan 1-Klik)
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Kembali ke Halaman Publik
          </button>
        </div>
      </div>
    </div>
  );
};
