"use client";

interface BenefitItemProps {
  icon: React.ReactNode;
  text: string;
}

const BenefitItem = ({ icon, text }: BenefitItemProps) => (
  <div className="flex flex-col items-center flex-1">
    <div className="w-10 h-10 text-orange-400 mb-2">
      {icon}
    </div>
    <span className="text-base text-white font-semibold">{text}</span>
  </div>
);

export const Benefits = () => {
  const benefits = [
    {
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      ),
      text: "Все локации"
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M4 12h16"/>
          <path d="M12 4v16"/>
        </svg>
      ),
      text: "Безлимит"
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M13 2.05A10 10 0 1 1 2.05 13"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
      text: "Скорость"
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" rx="4"/>
        </svg>
      ),
      text: "5 устройств"
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <polygon points="10,9 16,12 10,15"/>
        </svg>
      ),
      text: "Стриминг"
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto flex justify-between items-center gap-4 bg-[#232323]/80 backdrop-blur-md rounded-2xl shadow-lg py-6 px-8 mb-12 border border-[#333]">
      {benefits.map((benefit, index) => (
        <BenefitItem
          key={index}
          icon={benefit.icon}
          text={benefit.text}
        />
      ))}
    </div>
  );
}; 