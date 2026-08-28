import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound, AlertCircle, ArrowLeft } from 'lucide-react';
import { GununganIcon } from '../common/JavaneseIcons';
import { loginAdmin } from '../../services/api';
import { AdminUser } from '../../types';

interface AdminLoginViewProps {
  onLoginSuccess: (user: AdminUser, token: string) => void;
  onBackToCustomer: () => void;
}

export function AdminLoginView({ onLoginSuccess, onBackToCustomer }: AdminLoginViewProps) {
  const [email, setEmail] = useState('admin@example.local');
  const [password, setPassword] = useState('ChangeMe123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginAdmin(email, password);
      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setError(err.message || 'Login gagal. Periksa kembali email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@example.local');
    setPassword('ChangeMe123!');
    setError(null);
  };

  return (
    <div id="admin-login-screen" className="min-h-screen bg-[#F5EFEB] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Javanese background icon */}
      <div className="absolute -right-16 -bottom-16 w-96 h-96 opacity-5 pointer-events-none text-[#C26B38]">
        <GununganIcon className="w-full h-full" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C26B38] to-[#8C431F] flex items-center justify-center text-white shadow-lg">
            <GununganIcon className="w-8 h-8 text-amber-100" />
          </div>
        </div>
        <h2 className="text-center font-serif text-3xl font-bold text-[#3A2413]">
          Portal Pengelola
        </h2>
        <p className="mt-1 text-center text-xs uppercase tracking-widest text-[#8C5D38] font-semibold">
          Nusantara Wayang CMS
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-[#E8DFD5] space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-bold text-[#3A2413] uppercase tracking-wider mb-1.5">
                Email Pengelola
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.local"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-sm text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-bold text-[#3A2413] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-sm text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                id="admin-login-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#C26B38] hover:bg-[#A8582B] text-white font-semibold text-sm shadow-md transition-colors disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <span>Memproses Masuk...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Masuk ke Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Demo Account Callout */}
          <div className="pt-4 border-t border-[#F0E8DF] bg-[#FAF7F2] rounded-2xl p-3.5 text-xs text-[#5C4A3C] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#8C431F] flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Akun Demo Development:
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] font-bold text-[#C26B38] hover:underline cursor-pointer"
              >
                Isi Otomatis
              </button>
            </div>
            <p className="font-mono text-[11px] text-[#7A6B5D]">
              Email: <strong>admin@example.local</strong><br />
              Password: <strong>ChangeMe123!</strong>
            </p>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onBackToCustomer}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#7A6B5D] hover:text-[#C26B38] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Website Pelanggan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
