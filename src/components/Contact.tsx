import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useAdminData } from '../contexts/AdminDataContext';
import SectionTitle from '../animations/SectionTitle';

const Contact: React.FC = () => {
  const { contactData, emailConfig, prefilledSubject, setPrefilledSubject } = useAdminData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [renderedAt] = useState(() => Date.now());
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const siteKey = emailConfig.recaptchaSiteKey;

  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // The script is loaded by tarteaucitron (TrackingTags) once the visitor consents; re-render the widget when the form remounts.
  useEffect(() => {
    if (!siteKey || isSubmitted) return;
    const w = window as any;
    const render = () => {
      if (recaptchaRef.current && !recaptchaRef.current.hasChildNodes()) {
        widgetId.current = w.grecaptcha.render(recaptchaRef.current, { sitekey: siteKey });
        setRecaptchaReady(true);
      }
    };
    w.onRecaptchaLoad = render;
    if (w.grecaptcha?.render) render();
  }, [siteKey, isSubmitted]);

  const resetRecaptcha = () => {
    if (widgetId.current !== null) (window as any).grecaptcha?.reset(widgetId.current);
  };

  useEffect(() => {
    if (prefilledSubject) {
      setFormData(prev => ({ ...prev, subject: prefilledSubject }));
      setPrefilledSubject('');
    }
  }, [prefilledSubject, setPrefilledSubject]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Bot: hidden field filled or form submitted faster than a human could. Fake success so the bot doesn't retry.
    const isBot = honeypot !== '' || Date.now() - renderedAt < 3000;

    const recaptchaToken = siteKey && widgetId.current !== null
      ? (window as any).grecaptcha?.getResponse(widgetId.current) ?? ''
      : '';
    if (!isBot && siteKey && !recaptchaToken) {
      setIsSubmitting(false);
      setSubmitError(recaptchaReady
        ? 'Veuillez cocher la case « Je ne suis pas un robot ».'
        : 'Pour envoyer le formulaire, autorisez reCAPTCHA dans la gestion des cookies.');
      setTimeout(() => setSubmitError(''), 6000);
      return;
    }

    if (!isBot && emailConfig.enabled && emailConfig.serviceId && emailConfig.templateId && emailConfig.publicKey) {
      const subjectLabel = contactData.form.fields.subject.options.find(o => o.value === formData.subject)?.label ?? formData.subject;
      const time = new Date().toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' });
      const templateVars = {
        from_name: formData.name,
        from_email: formData.email,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        telephone: formData.phone,
        subject: formData.subject,
        title: subjectLabel,
        message: formData.message,
        reply_to: formData.email,
        to_email: emailConfig.recipientEmail,
        time,
      };

      try {
        // A reCAPTCHA token is single-use, so only the notification template can verify it.
        await emailjs.send(emailConfig.serviceId, emailConfig.templateId,
          { ...templateVars, 'g-recaptcha-response': recaptchaToken }, emailConfig.publicKey);
      } catch (err: any) {
        console.error('EmailJS error (admin):', err);
        resetRecaptcha();
        setIsSubmitting(false);
        setSubmitError("Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous contacter directement.");
        setTimeout(() => setSubmitError(''), 6000);
        return;
      }

      if (emailConfig.confirmationTemplateId) {
        try {
          await emailjs.send(
            emailConfig.serviceId,
            emailConfig.confirmationTemplateId,
            { ...templateVars, to_email: formData.email },
            emailConfig.publicKey
          );
        } catch (err: any) {
          console.error('EmailJS error (confirmation):', err);
        }
      }
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'Mail': return Mail;
      case 'Phone': return Phone;
      case 'MapPin': return MapPin;
      default: return Mail;
    }
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-green-100 border border-green-400 text-green-700 px-8 py-6 rounded-lg">
              <CheckCircle size={48} className="mx-auto mb-4 text-green-600" />
              <h3 className="text-2xl font-bold mb-2">{contactData.successMessage.title}</h3>
              <p className="text-lg">
                {contactData.successMessage.text}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="relative py-24 pb-32 bg-gray-50 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-orange/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-blue-night/10 blur-3xl" />
      <div className="relative container mx-auto px-4">
        <SectionTitle eyebrow="Parlons de votre projet" lead="Contactez" highlight="Nous" subtitle={contactData.subtitle} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            className="bg-white rounded-3xl shadow-xl ring-1 ring-black/5 p-8 md:p-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-2xl font-bold mb-6 text-primary">{contactData.form.title}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
                <label>
                  Ne pas remplir
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={e => setHoneypot(e.target.value)}
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {contactData.form.fields.name.label} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus-accent focus:border-transparent transition-all duration-300`}
                    placeholder={contactData.form.fields.name.placeholder}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {contactData.form.fields.email.label} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus-accent focus:border-transparent transition-all duration-300`}
                    placeholder={contactData.form.fields.email.placeholder}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {contactData.form.fields.phone.label}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus-accent focus:border-transparent transition-all duration-300`}
                  placeholder={contactData.form.fields.phone.placeholder}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {contactData.form.fields.subject.label} *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus-accent focus:border-transparent transition-all duration-300`}
                >
                  {contactData.form.fields.subject.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {contactData.form.fields.message.label} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={contactData.form.fields.message.rows}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus-accent focus:border-transparent transition-all duration-300 resize-none`}
                  placeholder={contactData.form.fields.message.placeholder}
                />
              </div>

              {siteKey && <div ref={recaptchaRef} />}
              {siteKey && !recaptchaReady && (
                <p className="text-sm text-gray-600">
                  Ce formulaire est protégé par reCAPTCHA (Google).{' '}
                  <button
                    type="button"
                    className="underline text-accent"
                    onClick={() => window.tarteaucitron?.userInterface.openPanel()}
                  >
                    Autoriser reCAPTCHA
                  </button>
                </p>
              )}

              {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {submitError}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="group/send relative w-full overflow-hidden bg-orange border-2 border-orange enabled:hover:border-blue-night text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {/* Remplissage bleu nuit qui glisse de gauche à droite au survol */}
                <span className={`absolute inset-0 origin-left scale-x-0 bg-blue-night transition-transform duration-300 ease-out ${isSubmitting ? '' : 'group-hover/send:scale-x-100'}`} />
                {isSubmitting ? (
                  <>
                    <div className="relative animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="relative">{contactData.form.submitButton.loadingText}</span>
                  </>
                ) : (
                  <>
                    <Send size={20} className="relative transition-transform duration-300 group-hover/send:translate-x-1 group-hover/send:-translate-y-0.5" />
                    <span className="relative">{contactData.form.submitButton.text}</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <h3 className={`text-2xl font-bold mb-6 text-primary`}>{contactData.info.title}</h3>
              
              <div className="space-y-6">
                {contactData.info.items.map((info, index) => {
                  const IconComponent = getIconComponent(info.icon);
                  return (
                    <motion.a
                      key={info.title}
                      href={info.action}
                      className="flex items-start space-x-4 p-5 bg-white rounded-2xl shadow ring-1 ring-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="w-12 h-12 bg-orange/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange group-hover:rotate-6 transition-all duration-300">
                        <IconComponent size={24} className="text-orange group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div>
                        <h4 className={`font-semibold text-primary mb-1`}>{info.title}</h4>
                        <p className="text-gray-600">{info.content}</p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            <div className="animated-border rounded-2xl">
            <div className="relative overflow-hidden bg-blue-night text-white p-7 rounded-2xl">
              <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-orange/20 blur-2xl" />
              <h4 className="text-xl font-bold mb-3">{contactData.whyChooseUs.title}</h4>
              <ul className="space-y-2 text-gray-200">
                {contactData.whyChooseUs.points.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className={`w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0`}></div>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
