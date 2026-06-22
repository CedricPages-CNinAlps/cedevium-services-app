import { useEffect, useRef } from 'react';
import { useAdminData } from '../contexts/AdminDataContext';

declare global {
  interface Window {
    tarteaucitron: any;
  }
}

const TrackingTags: React.FC = () => {
  const { trackingConfig, remoteLoaded } = useAdminData();
  const initialized = useRef(false);
  const configRef = useRef(trackingConfig);
  configRef.current = trackingConfig;

  useEffect(() => {
    if (!remoteLoaded) return;
    if (initialized.current) return;

    let timer: ReturnType<typeof setInterval> | null = null;

    const initTAC = () => {
      const tac = window.tarteaucitron;
      if (!tac) return;

      initialized.current = true;
      const config = configRef.current;

      tac.init({
        privacyUrl: '',
        bodyPosition: 'bottom',
        hashtag: '#tarteaucitron',
        cookieName: 'tarteaucitron',
        orientation: 'bottom',
        groupServices: false,
        showAlertSmall: false,
        cookieslist: true,
        closePopup: false,
        showIcon: true,
        iconSrc: '',
        iconPosition: 'BottomRight',
        adblocker: false,
        DenyAllCta: true,
        AcceptAllCta: true,
        highPrivacy: true,
        handleBrowserDNTRequest: false,
        removeCredit: false,
        moreInfoLink: true,
        useExternalCss: false,
        useExternalJs: false,
        locale: 'fr',
        readmoreLink: '',
      });

      if (config.googleTagId) {
        if (config.googleTagId.startsWith('GTM-')) {
          tac.user.googletagmanagerId = config.googleTagId;
          (tac.job = tac.job || []).push('googletagmanager');
        } else {
          tac.user.gtagUa = config.googleTagId;
          (tac.job = tac.job || []).push('gtag');
        }
      }

      if (config.matomoUrl && config.matomoSiteId) {
        tac.user.matomoHost = config.matomoUrl;
        tac.user.matomoId = parseInt(config.matomoSiteId, 10);
        (tac.job = tac.job || []).push('matomo');
      } else if (config.matomoSiteId) {
        tac.user.matomoId = parseInt(config.matomoSiteId, 10);
        (tac.job = tac.job || []).push('matomocloud');
      }

      if (config.matomoTagManagerUrl) {
        tac.user.matomotmUrl = config.matomoTagManagerUrl;
        (tac.job = tac.job || []).push('matomotm');
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
