import React from 'react';

export const SafeArea: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paddingTop, setPaddingTop] = React.useState('80px');
  const [paddingBottom, setPaddingBottom] = React.useState('54px');

  React.useEffect(() => {
    function updatePadding() {
      if (window.innerWidth <= 600) {
        setPaddingTop('40px'); // Мобильные
        setPaddingBottom('54px'); // 34 + 20
      } else {
        setPaddingTop('10px'); // Десктоп
        setPaddingBottom('34px');
      }
    }
    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  return (
    <div
      style={{
        paddingTop: paddingTop,
        paddingBottom: paddingBottom,
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