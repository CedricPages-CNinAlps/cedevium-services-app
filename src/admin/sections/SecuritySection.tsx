import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAdminData } from '../../contexts/AdminDataContext';
import { SectionCard } from '../AdminComponents';

const SecuritySection: React.FC = () => {
  const { changePassword } = useAdminData();
  const [form, setForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [show, setShow] = useState({ current: false, newPwd: false, confirm: false });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const toggle = (field: 'current' | 'newPwd' | 'confirm') =>
    setShow(prev => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    setMessage('');

    if (form.newPwd.length < 8) {
      setStatus('error');
      setMessage('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (form.newPwd !== form.confirm) {
      setStatus('error');
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!changePassword(form.current, form.newPwd)) {
      setStatus('error');
      setMessage('Mot de passe actuel incorrect.');
      return;
    }
    setStatus('success');
    setMessage('Mot de passe changé avec succès !');
    setForm({ current: '', newPwd: '', confirm: '' });
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC582A] pr-10";

  const PasswordInput = ({ field, label, placeholder }: { field: 'current' | 'newPwd' | 'confirm'; label: string; placeholder: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show[field] ? 'text' : 'password'}
          value={form[field]}
          onChange={(e) => setForm(prev => ({ ...prev, [field]: e.target.value }))}
          className={inputClass}
          placeholder={placeholder}
          autoComplete="new-password"
        />
        <button type="button" onClick={() => toggle(field)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show[field] ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 max-w-lg">
      <SectionCard title="Changer le mot de passe administrateur">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 p-3 bg-blue-50 rounded-lg">
            <Lock size={16} className="text-blue-500 flex-shrink-0" />
            <span>Le mot de passe est stocké localement dans votre navigateur.</span>
          </div>

          <PasswordInput field="current" label="Mot de passe actuel" placeholder="Votre mot de passe actuel" />
          <PasswordInput field="newPwd" label="Nouveau mot de passe" placeholder="Au moins 8 caractères" />
          <PasswordInput field="confirm" label="Confirmer le nouveau mot de passe" placeholder="Répétez le nouveau mot de passe" />

          {status === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{message}</div>
          )}
          {status === 'success' && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-center gap-2">
              <ShieldCheck size={16} /> {message}
            </div>
          )}

          <button type="submit"
            className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-colors"
            style={{ background: '#DC582A' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#c24d24')}
            onMouseLeave={e => (e.currentTarget.style.background = '#DC582A')}>
            Changer le mot de passe
          </button>
        </form>
      </SectionCard>
    </div>
  );
};

export default SecuritySection;
