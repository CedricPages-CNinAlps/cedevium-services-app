import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { contactData, colors } from '../data';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler l'envoi du formulaire
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset du message de succès après 5 secondes
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 2000);
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
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Contactez <span className="text-orange">Nous</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {contactData.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-blue-night">{contactData.form.title}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent transition-all duration-300`}
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
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent transition-all duration-300`}
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
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent transition-all duration-300`}
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
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent transition-all duration-300`}
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
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent transition-all duration-300 resize-none`}
                  placeholder={contactData.form.fields.message.placeholder}
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-orange hover:bg-orange/90 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{contactData.form.submitButton.loadingText}</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>{contactData.form.submitButton.text}</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h3 className={`text-2xl font-bold mb-6 text-blue-night`}>{contactData.info.title}</h3>
              
              <div className="space-y-6">
                {contactData.info.items.map((info, index) => {
                  const IconComponent = getIconComponent(info.icon);
                  return (
                    <motion.a
                      key={info.title}
                      href={info.action}
                      className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 group"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className={`w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange/20 transition-colors duration-300`}>
                        <IconComponent size={24} className={`text-orange`} />
                      </div>
                      <div>
                        <h4 className={`font-semibold text-blue-night mb-1`}>{info.title}</h4>
                        <p className="text-gray-600">{info.content}</p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            <div className={`bg-blue-night text-white p-6 rounded-lg`}>
              <h4 className="text-xl font-bold mb-3">{contactData.whyChooseUs.title}</h4>
              <ul className="space-y-2 text-gray-200">
                {contactData.whyChooseUs.points.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className={`w-2 h-2 bg-orange rounded-full mt-2 flex-shrink-0`}></div>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
