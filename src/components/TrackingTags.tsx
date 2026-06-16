import { useEffect, useRef } from 'react';
import { useAdminData } from '../contexts/AdminDataContext';

declare global {
  interface Window {
    tarteaucitron: any;
  }
}

const TrackingTags: React.FC = () => {
  const { trackingConfig } = useAdminData();
  const initialized = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (initialized.current) return;

    const initTAC = () => {
      const tac = window.tarteaucitron;
      if (!tac) return;

      initialized.current = true;

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

      if (trackingConfig.googleTagId) {
        if (trackingConfig.googleTagId.startsWith('GTM-')) {
          tac.user.googletagmanagerId = trackingConfig.googleTagId;
          (tac.job = tac.job || []).push('googletagmanager');
        } else {
          tac.user.gtagUa = trackingConfig.googleTagId;
          (tac.job = tac.job || []).push('gtag');
        }
      }

      if (trackingConfig.matomoUrl && trackingConfig.matomoSiteId) {
        tac.user.matomoHost = trackingConfig.matomoUrl;
        tac.user.matomoId = parseInt(trackingConfig.matomoSiteId, 10);
        (tac.job = tac.job || []).push('matomo');
      }
    };

    if (window.tarteaucitron) {
      initTAC();
    } else {
      const timer = setInterval(() => {
        if (window.tarteaucitron) {
          clearInterval(timer);
          initTAC();
        }
      }, 100);
      setTimeout(() => clearInterval(timer), 5000);
    }
  }, []);

  return null;
};

export default TrackingTags;
