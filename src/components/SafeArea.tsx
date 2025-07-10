import React from 'react';

export const SafeArea: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paddingTop, setPaddingTop] = React.useState('80px');
  const [paddingBottom, setPaddingBottom] = React.useState('54px');

  React.useEffect(() => {
    function updatePadding() {
      let pt = 10, pb = 34;
      const isMobile = window.innerWidth <= 600 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isMobile) {
        pt = 40;
        pb = 54;
        if (isIOS) pt += 50;
      }
      setPaddingTop(`calc(var(--tg-viewport-safe-area-inset-top, 0px) + ${pt}px)`);
      setPaddingBottom(`calc(var(--tg-viewport-safe-area-inset-bottom, 0px) + ${pb}px)`);
    }
    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  return (
    <div
      style={{
        paddingTop,
        paddingBottom,
        minHeight: '100vh',
        boxSizing: 'border-box',
        background: '#000',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
};

export default SafeArea; 