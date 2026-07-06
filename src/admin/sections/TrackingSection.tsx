import React, { useState } from 'react';
import { useAdminData } from '../../contexts/AdminDataContext';
import { FormField, FormSelect, SectionCard, SaveButton, ToggleField } from '../AdminComponents';

const TrackingSection: React.FC = () => {
  const { trackingConfig, updateTrackingConfig } = useAdminData();
  const [local, setLocal] = useState({ ...trackingConfig });
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof typeof local>(field: K, value: (typeof local)[K]) =>
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
          <FormField
            label="URL conteneur Matomo Tag Manager"
            value={local.matomoTagManagerUrl || ''}
            onChange={(v) => update('matomoTagManagerUrl', v)}
            placeholder="https://cdn.matomo.cloud/votre-instance.matomo.cloud/container_XXXXXXXX.js"
          />
          {local.matomoTagManagerUrl && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-700">
              Tag Manager configuré : <strong>{local.matomoTagManagerUrl}</strong>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Tarte au Citron */}
      <SectionCard title="Tarte au Citron — Général" defaultOpen={false}>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Le gestionnaire de cookies <strong>Tarte au Citron</strong> est intégré au site.
            Ces réglages correspondent aux options de <code className="bg-gray-100 px-1 rounded">tarteaucitron.init()</code>.
          </p>
          <FormField
            label="URL de la politique de confidentialité"
            value={local.privacyUrl}
            onChange={(v) => update('privacyUrl', v)}
            placeholder="https://votre-site.fr/confidentialite"
          />
          <FormField
            label="Lien 'En savoir plus' personnalisé"
            value={local.readmoreLink}
            onChange={(v) => update('readmoreLink', v)}
            placeholder="Laisser vide pour le lien par défaut"
          />
          <FormSelect
            label="Position du bandeau (bodyPosition)"
            value={local.bodyPosition}
            onChange={(v) => update('bodyPosition', v)}
            options={[
              { value: 'top', label: 'Haut du code HTML (top)' },
              { value: 'bottom', label: 'Bas du code HTML (bottom)' },
            ]}
          />
          <FormSelect
            label="Orientation du bandeau"
            value={local.orientation}
            onChange={(v) => update('orientation', v)}
            options={[
              { value: 'middle', label: 'Milieu (middle)' },
              { value: 'top', label: 'Haut (top)' },
              { value: 'bottom', label: 'Bas (bottom)' },
              { value: 'popup', label: 'Popup' },
              { value: 'banner', label: 'Bannière (banner)' },
            ]}
          />
          <FormField
            label="Hashtag d'ouverture du panneau"
            value={local.hashtag}
            onChange={(v) => update('hashtag', v)}
            placeholder="#tarteaucitron"
          />
          <FormField
            label="Nom du cookie"
            value={local.cookieName}
            onChange={(v) => update('cookieName', v)}
            placeholder="tarteaucitron"
          />
          <FormField
            label="Domaine du cookie (optionnel)"
            value={local.cookieDomain}
            onChange={(v) => update('cookieDomain', v)}
            placeholder=".mon-domaine.fr"
          />
          <FormSelect
            label="Statut par défaut des services"
            value={local.serviceDefaultState}
            onChange={(v) => update('serviceDefaultState', v)}
            options={[
              { value: 'wait', label: "En attente du choix (wait)" },
              { value: 'true', label: 'Accepté par défaut (true)' },
              { value: 'false', label: 'Refusé par défaut (false)' },
            ]}
          />
          <ToggleField
            label="Grouper les services par catégorie"
            checked={local.groupServices}
            onChange={(v) => update('groupServices', v)}
          />
          <ToggleField
            label="Cliquer pour ouvrir la description"
            checked={local.showDetailsOnClick}
            onChange={(v) => update('showDetailsOnClick', v)}
          />
          <ToggleField
            label="Message pour cookies obligatoires"
            checked={local.mandatory}
            onChange={(v) => update('mandatory', v)}
          />
          <ToggleField
            label="Bouton pour cookies obligatoires (déconseillé)"
            checked={local.mandatoryCta}
            onChange={(v) => update('mandatoryCta', v)}
          />
        </div>
      </SectionCard>

      <SectionCard title="Tarte au Citron — Apparence du bandeau" defaultOpen={false}>
        <div className="space-y-4">
          <ToggleField
            label="Afficher la petite bannière en bas à droite"
            checked={local.showAlertSmall}
            onChange={(v) => update('showAlertSmall', v)}
          />
          <ToggleField
            label="Afficher le titre dans le bandeau"
            checked={local.showTitleBanner}
            onChange={(v) => update('showTitleBanner', v)}
          />
          <ToggleField
            label="Afficher la liste des cookies (mini bannière)"
            checked={local.cookieslist}
            onChange={(v) => update('cookieslist', v)}
          />
          <ToggleField
            label="Afficher la liste des cookies dans le panneau de contrôle"
            checked={local.cookieslistEmbed}
            onChange={(v) => update('cookieslistEmbed', v)}
          />
          <ToggleField
            label="Afficher un X pour fermer la bannière"
            checked={local.closePopup}
            onChange={(v) => update('closePopup', v)}
          />
          <ToggleField
            label="Afficher l'icône cookie persistante"
            checked={local.showIcon}
            onChange={(v) => update('showIcon', v)}
          />
          <FormField
            label="URL de l'icône (optionnel)"
            value={local.iconSrc}
            onChange={(v) => update('iconSrc', v)}
            placeholder="URL ou image en base64"
          />
          <FormSelect
            label="Position de l'icône"
            value={local.iconPosition}
            onChange={(v) => update('iconPosition', v)}
            options={[
              { value: 'BottomRight', label: 'Bas droite' },
              { value: 'BottomLeft', label: 'Bas gauche' },
              { value: 'TopRight', label: 'Haut droite' },
              { value: 'TopLeft', label: 'Haut gauche' },
            ]}
          />
          <ToggleField
            label="Afficher le nombre de partenaires sur le bandeau"
            checked={local.partnersList}
            onChange={(v) => update('partnersList', v)}
          />
          <ToggleField
            label="Afficher un message si un Adblocker est détecté"
            checked={local.adblocker}
            onChange={(v) => update('adblocker', v)}
          />
        </div>
      </SectionCard>

      <SectionCard title="Tarte au Citron — Consentement" defaultOpen={false}>
        <div className="space-y-4">
          <ToggleField
            label="Afficher le bouton 'Tout refuser'"
            checked={local.denyAllCta}
            onChange={(v) => update('denyAllCta', v)}
          />
          <ToggleField
            label="Afficher le bouton 'Tout accepter'"
            checked={local.acceptAllCta}
            onChange={(v) => update('acceptAllCta', v)}
          />
          <ToggleField
            label="Attendre le consentement (highPrivacy)"
            checked={local.highPrivacy}
            onChange={(v) => update('highPrivacy', v)}
          />
          <ToggleField
            label="Demander le consentement même pour les services 'Privacy by design'"
            checked={local.alwaysNeedConsent}
            onChange={(v) => update('alwaysNeedConsent', v)}
          />
          <ToggleField
            label="Refuser tout par défaut si Do Not Track est activé"
            checked={local.handleBrowserDNTRequest}
            onChange={(v) => update('handleBrowserDNTRequest', v)}
          />
        </div>
      </SectionCard>

      <SectionCard title="Tarte au Citron — Consent Mode & options avancées" defaultOpen={false}>
        <div className="space-y-4">
          <ToggleField
            label="Google Consent Mode v2 (Google Ads & GA4)"
            checked={local.googleConsentMode}
            onChange={(v) => update('googleConsentMode', v)}
          />
          <ToggleField
            label="Bing Consent Mode (Clarity & Bing Ads)"
            checked={local.bingConsentMode}
            onChange={(v) => update('bingConsentMode', v)}
          />
          <ToggleField
            label="Consent Mode pour Piano Analytics"
            checked={local.pianoConsentMode}
            onChange={(v) => update('pianoConsentMode', v)}
          />
          <ToggleField
            label="Activer par défaut le mode Essential de Piano"
            checked={local.pianoConsentModeEssential}
            onChange={(v) => update('pianoConsentModeEssential', v)}
          />
          <ToggleField
            label="Soft consent mode (consentement requis pour charger les tags)"
            checked={local.softConsentMode}
            onChange={(v) => update('softConsentMode', v)}
          />
          <ToggleField
            label="Retirer le lien de crédit vers tarteaucitron.io"
            checked={local.removeCredit}
            onChange={(v) => update('removeCredit', v)}
          />
          <ToggleField
            label="Afficher le lien 'En savoir plus'"
            checked={local.moreInfoLink}
            onChange={(v) => update('moreInfoLink', v)}
          />
          <ToggleField
            label="Mode expert : désactiver le chargement des .css tarteaucitron"
            checked={local.useExternalCss}
            onChange={(v) => update('useExternalCss', v)}
          />
          <ToggleField
            label="Mode expert : désactiver le chargement des .js tarteaucitron"
            checked={local.useExternalJs}
            onChange={(v) => update('useExternalJs', v)}
          />
          <ToggleField
            label="Envoyer un événement dans le dataLayer"
            checked={local.dataLayer}
            onChange={(v) => update('dataLayer', v)}
          />
          <ToggleField
            label="Server side uniquement (tags non chargés côté client)"
            checked={local.serverSide}
            onChange={(v) => update('serverSide', v)}
          />
          <FormField
            label="ID personnalisé pour ouvrir le panneau (a11y, optionnel)"
            value={local.customCloserId}
            onChange={(v) => update('customCloserId', v)}
            placeholder="mon-id-personnalise"
          />
        </div>
      </SectionCard>

      <div className="flex justify-end pt-2">
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
};

export default TrackingSection;
