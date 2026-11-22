import { useEffect, useRef } from 'react';
import { useAdminData } from '../contexts/AdminDataContext';

declare global {
  interface Window {
    tarteaucitron: any;
    dataLayer: unknown[];
  }
}

const TrackingTags: React.FC = () => {
  const { trackingConfig, emailConfig, remoteLoaded } = useAdminData();
  const initialized = useRef(false);
  const configRef = useRef(trackingConfig);
  configRef.current = trackingConfig;
  const recaptchaKeyRef = useRef(emailConfig.recaptchaSiteKey);
  recaptchaKeyRef.current = emailConfig.recaptchaSiteKey;

  useEffect(() => {
    if (!remoteLoaded) return;
    if (initialized.current) return;

    let timer: ReturnType<typeof setInterval> | null = null;

    const initTAC = () => {
      const tac = window.tarteaucitron;
      if (!tac) return;

      initialized.current = true;
      const config = configRef.current;

      const serviceDefaultState: boolean | 'wait' =
        config.serviceDefaultState === 'true' ? true
        : config.serviceDefaultState === 'false' ? false
        : 'wait';

      const tacOptions: Record<string, unknown> = {
        privacyUrl: config.privacyUrl,
        bodyPosition: config.bodyPosition,
        hashtag: config.hashtag,
        cookieName: config.cookieName,
        orientation: config.orientation,
        groupServices: config.groupServices,
        showDetailsOnClick: config.showDetailsOnClick,
        serviceDefaultState,
        showAlertSmall: config.showAlertSmall,
        showTitleBanner: config.showTitleBanner,
        cookieslist: config.cookieslist,
        cookieslistEmbed: config.cookieslistEmbed,
        closePopup: config.closePopup,
        showIcon: config.showIcon,
        iconPosition: config.iconPosition,
        adblocker: config.adblocker,
        DenyAllCta: config.denyAllCta,
        AcceptAllCta: config.acceptAllCta,
        highPrivacy: config.highPrivacy,
        alwaysNeedConsent: config.alwaysNeedConsent,
        handleBrowserDNTRequest: config.handleBrowserDNTRequest,
        removeCredit: config.removeCredit,
        moreInfoLink: config.moreInfoLink,
        useExternalCss: config.useExternalCss,
        useExternalJs: config.useExternalJs,
        readmoreLink: config.readmoreLink,
        mandatory: config.mandatory,
        mandatoryCta: config.mandatoryCta,
        googleConsentMode: config.googleConsentMode,
        bingConsentMode: config.bingConsentMode,
        pianoConsentMode: config.pianoConsentMode,
        pianoConsentModeEssential: config.pianoConsentModeEssential,
        softConsentMode: config.softConsentMode,
        dataLayer: config.dataLayer,
        serverSide: config.serverSide,
        partnersList: config.partnersList,
        locale: 'fr',
      };
      if (config.iconSrc) tacOptions.iconSrc = config.iconSrc;
      if (config.cookieDomain) tacOptions.cookieDomain = config.cookieDomain;
      if (config.customCloserId) tacOptions.customCloserId = config.customCloserId;

      tac.init(tacOptions);

      if (config.googleTagId) {
        if (config.googleTagId.startsWith('GTM-')) {
          // Own key: the built-in 'googletagmanager' service is typed 'api' and would be listed under "APIs" instead of "Mesure d'audience".
          const gtmId = config.googleTagId;
          const loadGtm = () => {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
            tac.addScript('https://www.googletagmanager.com/gtm.js?id=' + gtmId);
          };
          tac.services.gtmaudience = {
            key: 'gtmaudience',
            type: 'analytic',
            name: 'Google Tag Manager',
            uri: 'https://policies.google.com/privacy',
            needConsent: true,
            cookies: ['_ga', '_gat', '_gid', '__utma', '__utmb', '__utmc', '__utmt', '__utmz'],
            js: loadGtm,
            // Same as the built-in service: with Consent Mode (not soft), GTM loads with consent "denied" by default.
            fallback: () => {
              if (tac.parameters.googleConsentMode === true && tac.parameters.softConsentMode === false) loadGtm();
            },
          };
          (tac.job = tac.job || []).push('gtmaudience');
        } else {
          tac.user.gtagUa = config.googleTagId;
          (tac.job = tac.job || []).push('gtag');
        }
      }

      if (config.matomoSiteId) {
        tac.user.matomoId = parseInt(config.matomoSiteId, 10);
        (tac.job = tac.job || []).push('matomo');
        if (config.matomoUrl) {
          tac.user.matomoHost = config.matomoUrl.endsWith('/') ? config.matomoUrl : `${config.matomoUrl}/`;
        }
      }

      if (config.matomoTagManagerUrl) {
        tac.user.matomotmUrl = config.matomoTagManagerUrl;
        (tac.job = tac.job || []).push('matomotm');
      }

      // Own key so tarteaucitron's built-in 'recaptcha' service (implicit render) doesn't override it; Contact.tsx renders via onRecaptchaLoad.
      if (recaptchaKeyRef.current) {
        tac.services.recaptchacontact = {
          key: 'recaptchacontact',
          type: 'api',
          name: 'reCAPTCHA (formulaire de contact)',
          uri: 'https://policies.google.com/privacy',
          needConsent: true,
          cookies: ['_GRECAPTCHA'],
          js: () => tac.addScript('https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit&hl=fr'),
        };
        (tac.job = tac.job || []).push('recaptchacontact');
      }
    };

    if (window.tarteaucitron) {
      initTAC();
    } else {
      timer = setInterval(() => {
        if (window.tarteaucitron) {
          clearInterval(timer!);
          timer = null;
          initTAC();
        }
      }, 100);
      setTimeout(() => { if (timer) clearInterval(timer); }, 5000);
    }

    return () => { if (timer) clearInterval(timer); };
  }, [remoteLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default TrackingTags;
