import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAdminData } from '../../contexts/AdminDataContext';
import { SectionCard } from '../AdminComponents';

type PwdField = 'current' | 'newPwd' | 'confirm';

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC582A] pr-10";

interface PasswordInputProps {
  field: PwdField;
  label: string;
  placeholder: string;
  value: string;
  visible: boolean;
  onChange: (field: PwdField, value: string) => void;
  onToggle: (field: PwdField) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ field, label, placeholder, value, visible, onChange, onToggle }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className={inputClass}
        placeholder={placeholder}
        autoComplete="new-password"
      />
      <button type="button" onClick={() => onToggle(field)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  </div>
);

const SecuritySection: React.FC = () => {
  const { changePassword } = useAdminData();
  const [form, setForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [show, setShow] = useState({ current: false, newPwd: false, confirm: false });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggle = (field: PwdField) => setShow(prev => ({ ...prev, [field]: !prev[field] }));
  const handleChange = (field: PwdField, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
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
    setIsLoading(true);
    const ok = await changePassword(form.current, form.newPwd);
    setIsLoading(false);
    if (!ok) {
      setStatus('error');
      setMessage('Mot de passe actuel incorrect.');
      return;
    }
    setStatus('success');
    setMessage('Mot de passe changé avec succès ! Il sera synchronisé automatiquement.');
    setForm({ current: '', newPwd: '', confirm: '' });
  };

  return (
    <div className="space-y-4 max-w-lg">
      <SectionCard title="Changer le mot de passe administrateur">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 p-3 bg-blue-50 rounded-lg">
            <Lock size={16} className="text-blue-500 flex-shrink-0" />
            <span>Le mot de passe est chiffré (SHA-256) et synchronisé automatiquement via JSONBin.</span>
          </div>

          <PasswordInput field="current" label="Mot de passe actuel" placeholder="Votre mot de passe actuel" value={form.current} visible={show.current} onChange={handleChange} onToggle={toggle} />
          <PasswordInput field="newPwd" label="Nouveau mot de passe" placeholder="Au moins 8 caractères" value={form.newPwd} visible={show.newPwd} onChange={handleChange} onToggle={toggle} />
          <PasswordInput field="confirm" label="Confirmer le nouveau mot de passe" placeholder="Répétez le nouveau mot de passe" value={form.confirm} visible={show.confirm} onChange={handleChange} onToggle={toggle} />

          {status === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{message}</div>
          )}
          {status === 'success' && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-center gap-2">
              <ShieldCheck size={16} /> {message}
            </div>
          )}

          <button type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-colors disabled:opacity-60"
            style={{ background: '#DC582A' }}
            onMouseEnter={e => !isLoading && (e.currentTarget.style.background = '#c24d24')}
            onMouseLeave={e => (e.currentTarget.style.background = '#DC582A')}>
            {isLoading ? 'Enregistrement…' : 'Changer le mot de passe'}
          </button>
        </form>
      </SectionCard>
    </div>
  );
};

export default SecuritySection;
