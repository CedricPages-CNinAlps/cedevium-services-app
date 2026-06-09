import React, { useState } from 'react';
import { Lock, X, Eye, EyeOff } from 'lucide-react';
import { useAdminData } from '../contexts/AdminDataContext';

const AdminLogin: React.FC = () => {
  const { login, closeAdmin } = useAdminData();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(password)) {
      setError('Mot de passe incorrect');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center" style={{ background: 'rgba(30,26,52,0.92)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#DC582A' }}>
              <Lock size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#1E1A34' }}>Back Office</h2>
              <p className="text-gray-500 text-sm">Cedevium Services</p>
            </div>
          </div>
          <button onClick={closeAdmin} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe administrateur</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': '#DC582A' } as React.CSSProperties}
                placeholder="••••••••••••"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full text-white font-bold py-3 px-6 rounded-lg transition-colors"
            style={{ background: '#DC582A' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#c24d24')}
            onMouseLeave={e => (e.currentTarget.style.background = '#DC582A')}
          >
            Accéder au back office
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-6">
          Raccourci clavier : <kbd className="bg-gray-100 px-1 rounded">Ctrl</kbd> + <kbd className="bg-gray-100 px-1 rounded">Shift</kbd> + <kbd className="bg-gray-100 px-1 rounded">A</kbd>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
