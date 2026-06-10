import React from 'react';
import { useAdminData } from '../contexts/AdminDataContext';

interface Props {
  slug: string;
}

const CustomPage: React.FC<Props> = ({ slug }) => {
  const { customPages, logoConfig, headerData } = useAdminData();
  const page = customPages.find(p => p.slug === slug && p.published);

  return (
    <div className="min-h-screen bg-white">
      {/* Header minimal */}
      <header className="fixed top-0 w-full z-50 shadow-md" style={{ background: '#1E1A34' }}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            {logoConfig.type === 'image' && logoConfig.imageData ? (
              <img src={logoConfig.imageData} alt={logoConfig.imageAlt} className="h-10 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl text-white" style={{ background: '#DC582A' }}>
                {headerData.logo.text}
              </div>
            )}
            <span className="text-white font-bold text-xl">{headerData.logo.company}</span>
          </a>
          <a href="/" className="text-white text-sm hover:opacity-80 transition-opacity">← Retour au site</a>
        </div>
      </header>

      <main className="pt-24 pb-16">
        {page ? (
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8" style={{ color: '#1E1A34' }}>{page.title}</h1>
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        ) : (
          <div className="container mx-auto px-4 text-center py-24">
            <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
            <p className="text-xl text-gray-500 mb-8">Cette page n'existe pas ou n'est pas publiée.</p>
            <a href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition-colors"
              style={{ background: '#DC582A' }}>
              Retour à l'accueil
            </a>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomPage;
