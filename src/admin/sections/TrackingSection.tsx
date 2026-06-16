import React, { useState } from 'react';
import { useAdminData } from '../../contexts/AdminDataContext';
import { FormField, SectionCard, SaveButton } from '../AdminComponents';

const TrackingSection: React.FC = () => {
  const { trackingConfig, updateTrackingConfig } = useAdminData();
  const [local, setLocal] = useState({ ...trackingConfig });
  const [saved, setSaved] = useState(false);

  const update = (field: keyof typeof local, value: string) =>
    setLocal(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    updateTrackingConfig(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 text-sm text-blue-800">
        <strong>Important :</strong> Les tags de suivi sont gérés via{' '}
        <strong>Tarte au Citron</strong> (gestionnaire de consentement cookies).
        Ils ne s'activent qu'après l'accord de l'utilisateur. Tout changement
        prend effet au prochain rechargement de la page.
      </div>

      {/* Google Analytics / GTM */}
      <SectionCard title="Google Analytics / Tag Manager">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Entrez votre ID Google Analytics 4 (<code className="bg-gray-100 px-1 rounded">G-XXXXXXXXXX</code>) ou
            Google Tag Manager (<code className="bg-gray-100 px-1 rounded">GTM-XXXXXXX</code>).
          </p>
          <FormField
            label="ID Google Tag (GA4 ou GTM)"
            value={local.googleTagId}
            onChange={(v) => update('googleTagId', v)}
            placeholder="G-XXXXXXXXXX ou GTM-XXXXXXX"
          />
          {local.googleTagId && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-700">
              Tag configuré : <strong>{local.googleTagId}</strong>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Matomo */}
      <SectionCard title="Matomo (Piwik)">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Entrez l'URL de votre instance Matomo et l'ID du site à tracker.
          </p>
          <FormField
            label="URL Matomo"
            value={local.matomoUrl}
            onChange={(v) => update('matomoUrl', v)}
            placeholder="https://votre-matomo.fr/"
          />
          <FormField
            label="Site ID Matomo"
            value={local.matomoSiteId}
            onChange={(v) => update('matomoSiteId', v)}
            placeholder="1"
          />
          {local.matomoUrl && local.matomoSiteId && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-700">
              Matomo configuré : site {local.matomoSiteId} sur {local.matomoUrl}
            </div>
          )}
        </div>
      </SectionCard>

      {/* Tarte au Citron info */}
      <SectionCard title="Tarte au Citron — Gestion du consentement" defaultOpen={false}>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            Le gestionnaire de cookies <strong>Tarte au Citron</strong> est déjà intégré au site.
            Il affiche une bannière de consentement conforme au RGPD et ne déclenche les scripts
            de tracking que si l'utilisateur les accepte.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-500">
            <li>Bannière positionnée en bas de page</li>
            <li>Boutons "Tout accepter" / "Tout refuser"</li>
            <li>Liste des cookies avec détails</li>
            <li>Icône persistante pour modifier le consentement</li>
          </ul>
          <p className="text-xs text-gray-400">
            Pour personnaliser davantage (politique de confidentialité, couleurs, textes),
            modifiez la configuration dans <code>TrackingTags.tsx</code>.
          </p>
        </div>
      </SectionCard>

      <div className="flex justify-end pt-2">
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
};

export default TrackingSection;
