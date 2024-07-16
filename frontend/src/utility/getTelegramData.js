export const getTelegramData = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        return tg.initDataUnsafe.user;
      }
    }
    console.error('Telegram WebApp or user data is not available');
    return null;
  };
