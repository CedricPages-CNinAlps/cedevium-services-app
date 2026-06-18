import React, { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, ExternalLink, Edit2 } from 'lucide-react';
import { useAdminData, CustomPage } from '../../contexts/AdminDataContext';
import { FormField, SectionCard } from '../AdminComponents';
import '../../styles/custom-page.css';

function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const PageEditor: React.FC<{ page: CustomPage; onSave: (updates: Partial<CustomPage>) => void; onClose: () => void }> = ({ page, onSave, onClose }) => {
  const [local, setLocal] = useState({ ...page });
  const [preview, setPreview] = useState(false);

  const update = (field: keyof CustomPage, value: string | boolean) =>
    setLocal(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Éditer la page</h3>
        <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">← Retour à la liste</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Titre de la page" value={local.title}
          onChange={(v) => { update('title', v); if (local.slug === slugify(page.title)) update('slug', slugify(v)); }} />
        <FormField label="Slug (URL)" value={local.slug}
          onChange={(v) => update('slug', slugify(v))} placeholder="ma-page" />
      </div>

      <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
        URL de la page : <strong>{window.location.origin}{window.location.pathname}?page={local.slug || 'mon-slug'}</strong>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Contenu (HTML)</label>
          <button type="button" onClick={() => setPreview(!preview)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
            {preview ? <EyeOff size={14} /> : <Eye size={14} />}
            {preview ? 'Éditer' : 'Prévisualiser'}
          </button>
        </div>
        {preview ? (
          <div className="border border-gray-200 rounded-xl p-4 min-h-[300px] cedevium-content cedevium-content-sm"
            dangerouslySetInnerHTML={{ __html: local.content }} />
        ) : (
          <textarea value={local.content} onChange={(e) => update('content', e.target.value)} rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#DC582A] resize-none"
            placeholder={`<h1>Titre</h1>\n<p>Votre contenu HTML ici...</p>\n<ul>\n  <li>Élément 1</li>\n</ul>`} />
        )}
        <p className="text-xs text-gray-400 mt-1">Supporte le HTML. Les balises de style Tailwind ne sont pas disponibles ici.</p>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <input type="checkbox" checked={local.published} onChange={(e) => update('published', e.target.checked)} className="sr-only" />
          <div className={`w-11 h-6 rounded-full transition-colors ${local.published ? 'bg-[#DC582A]' : 'bg-gray-300'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-transform ${local.published ? 'translate-x-6' : 'translate-x-1'}`} />
          </div>
        </div>
        <span className="text-sm font-medium text-gray-700">
          {local.published ? 'Page publiée (accessible via URL)' : 'Brouillon (non accessible)'}
        </span>
      </label>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => onSave(local)}
          className="px-6 py-2 rounded-lg text-white font-semibold text-sm transition-colors"
          style={{ background: '#DC582A' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#c24d24')}
          onMouseLeave={e => (e.currentTarget.style.background = '#DC582A')}>
          Sauvegarder la page
        </button>
        {local.published && (
          <a href={`?page=${local.slug}`} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            <ExternalLink size={14} /> Voir la page
          </a>
        )}
      </div>
    </div>
  );
};

const PagesSection: React.FC = () => {
  const { customPages, addPage, updatePage, deletePage } = useAdminData();
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingPage = customPages.find(p => p.id === editingId);

  const handleCreate = () => {
    addPage({ slug: 'nouvelle-page', title: 'Nouvelle page', content: '<h1>Titre de la page</h1>\n<p>Votre contenu ici...</p>', published: false });
  };

  const handleSave = (updates: Partial<CustomPage>) => {
    if (editingId) {
      updatePage(editingId, updates);
      setEditingId(null);
    }
  };

  if (editingPage) {
    return <PageEditor page={editingPage} onSave={handleSave} onClose={() => setEditingId(null)} />;
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
        Les pages créées ici sont accessibles via <strong>?page=votre-slug</strong> dans l'URL. Exemple : <code className="bg-white px-1 rounded">votresite.com?page=a-propos</code>
      </div>

      <SectionCard title={`Pages créées (${customPages.length})`}>
        {customPages.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Aucune page créée pour l'instant.</p>
        ) : (
          <div className="space-y-2">
            {customPages.map(page => (
              <div key={page.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 truncate">{page.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${page.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {page.published ? 'Publiée' : 'Brouillon'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">?page={page.slug}</p>
                </div>
                <div className="flex gap-2 ml-3">
                  {page.published && (
                    <a href={`?page=${page.slug}`} target="_blank" rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Voir la page">
                      <ExternalLink size={15} />
                    </a>
                  )}
                  <button type="button" onClick={() => setEditingId(page.id)}
                    className="p-2 text-gray-400 hover:text-[#DC582A] hover:bg-orange-50 rounded-lg transition-colors" title="Éditer">
                    <Edit2 size={15} />
                  </button>
                  <button type="button" onClick={() => deletePage(page.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <button type="button" onClick={handleCreate}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#DC582A] hover:text-[#DC582A] transition-colors">
        <Plus size={18} /> Créer une nouvelle page
      </button>
    </div>
  );
};

export default PagesSection;
