import React, { useState } from 'react';
import { Mail, ExternalLink, CheckCircle, AlertCircle, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useAdminData } from '../../contexts/AdminDataContext';
import { FormField, SectionCard, SaveButton } from '../AdminComponents';

const EmailSection: React.FC = () => {
  const { emailConfig, updateEmailConfig } = useAdminData();
  const [local, setLocal] = useState(() => JSON.parse(JSON.stringify(emailConfig)));
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  const update = (field: string, value: string | boolean) =>
    setLocal((prev: typeof emailConfig) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    updateEmailConfig(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async () => {
    if (!local.serviceId || !local.templateId || !local.publicKey) {
      setTestStatus('error');
      setTestMessage('Veuillez remplir le Service ID, Template ID et Public Key avant de tester.');
      return;
    }
    // Sauvegarder avant le test pour que le formulaire front utilise les mêmes credentials
    updateEmailConfig(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setTestStatus('sending');
    setTestMessage('');
    const testVars = {
      from_name: 'Test Back Office',
      from_email: local.recipientEmail || 'test@cedevium.fr',
      name: 'Client Test',
      email: local.recipientEmail || 'test@cedevium.fr',
      telephone: '06 00 00 00 00',
      title: 'Développement Web & SaaS',
      subject: 'Test email - Back Office Cedevium',
      message: 'Ceci est un email de test envoyé depuis le back office de Cedevium Services.',
      reply_to: local.recipientEmail || 'test@cedevium.fr',
      to_email: local.recipientEmail || 'test@cedevium.fr',
      time: new Date().toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' }),
    };
    try {
      await emailjs.send(local.serviceId, local.templateId, testVars, local.publicKey);
    } catch (e: any) {
      setTestStatus('error');
      setTestMessage(`Erreur (notification) : ${e?.text || e?.message || 'Vérifiez vos identifiants EmailJS.'}`);
      return;
    }
    if (local.confirmationTemplateId) {
      try {
        await emailjs.send(local.serviceId, local.confirmationTemplateId, testVars, local.publicKey);
      } catch (e: any) {
        setTestStatus('error');
        setTestMessage(`Erreur (confirmation client) : ${e?.text || e?.message || 'Vérifiez le Template ID de confirmation.'}`);
        return;
      }
    }
    setTestStatus('success');
    setTestMessage(`Email${local.confirmationTemplateId ? 's' : ''} de test envoyé${local.confirmationTemplateId ? 's' : ''} avec succès ! Vérifiez votre boîte mail.`);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
        <div className="flex items-start gap-2">
          <Mail size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            <strong>Configuration EmailJS</strong>
            <p className="mt-1">EmailJS permet d'envoyer des emails depuis un site statique sans serveur. Créez un compte gratuit sur{' '}
              <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer"
                className="underline font-medium inline-flex items-center gap-1">
                emailjs.com <ExternalLink size={12} />
              </a>
              , créez un Service Email et un Template, puis copiez vos identifiants ci-dessous.
            </p>
          </div>
        </div>
      </div>

      <SectionCard title="Activer l'envoi d'emails">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input type="checkbox" checked={local.enabled} onChange={(e) => update('enabled', e.target.checked)} className="sr-only" />
            <div className={`w-11 h-6 rounded-full transition-colors ${local.enabled ? 'bg-[#DC582A]' : 'bg-gray-300'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-transform ${local.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {local.enabled ? 'Envoi actif (via EmailJS)' : 'Désactivé (simulation uniquement)'}
          </span>
        </label>
      </SectionCard>

      <SectionCard title="Identifiants EmailJS" defaultOpen={local.enabled}>
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-500 space-y-1">
            <p>1. Connectez-vous sur <strong>emailjs.com</strong> → Email Services → ajoutez Gmail/Outlook</p>
            <p>2. Email Templates → créez un template avec les variables : <code className="bg-white px-1 rounded">{'{{from_name}}'}</code> <code className="bg-white px-1 rounded">{'{{from_email}}'}</code> <code className="bg-white px-1 rounded">{'{{message}}'}</code> <code className="bg-white px-1 rounded">{'{{subject}}'}</code></p>
            <p>3. Account → copiez votre <strong>Public Key</strong></p>
          </div>
          <FormField label="Service ID" value={local.serviceId} onChange={(v) => update('serviceId', v)} placeholder="service_xxxxxxx" />
          <FormField label="Template ID (notification admin)" value={local.templateId} onChange={(v) => update('templateId', v)} placeholder="template_xxxxxxx" />
          <FormField label="Template ID (confirmation client)" value={local.confirmationTemplateId} onChange={(v) => update('confirmationTemplateId', v)} placeholder="template_xxxxxxx" />
          <FormField label="Public Key" value={local.publicKey} onChange={(v) => update('publicKey', v)} placeholder="xxxxxxxxxxxxxxxxxxxx" />
          <FormField label="Email de réception" value={local.recipientEmail} onChange={(v) => update('recipientEmail', v)} placeholder="contact@cedevium-services.fr" type="email" />
        </div>
      </SectionCard>

      <SectionCard title="Test d'envoi" defaultOpen={false}>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Envoie un email de test pour vérifier que la configuration est correcte.</p>
          <button type="button" onClick={handleTest} disabled={testStatus === 'sending'}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-60 transition-colors"
            style={{ background: '#1E1A34' }}>
            <Send size={16} />
            {testStatus === 'sending' ? 'Envoi...' : 'Envoyer un email de test'}
          </button>
          {testStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-600 text-sm p-3 bg-green-50 rounded-lg">
              <CheckCircle size={16} /> {testMessage}
            </div>
          )}
          {testStatus === 'error' && (
            <div className="flex items-start gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" /> {testMessage}
            </div>
          )}
        </div>
      </SectionCard>

      <div className="flex justify-end pt-2">
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
};

export default EmailSection;
