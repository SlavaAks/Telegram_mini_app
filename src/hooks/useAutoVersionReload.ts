import { useEffect } from 'react';

export const useAutoVersionReload = () => {
  const currentVersion = __APP_VERSION__;

  useEffect(() => {
    const storedVersion = localStorage.getItem('app_version');

    if (storedVersion && storedVersion !== currentVersion) {
      console.log(`🔄 Обновление с версии ${storedVersion} → ${currentVersion}`);
      localStorage.setItem('app_version', currentVersion);
      window.location.reload(); // Перезагрузка с обновлением ресурсов
    } else {
      localStorage.setItem('app_version', currentVersion);
    }
  }, [currentVersion]);
};
