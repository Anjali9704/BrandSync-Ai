import { useState } from 'react';

export default function Tabs({ tabs, defaultTab, onChange, className = '' }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.value);

  const handleChange = (value) => {
    setActive(value);
    onChange?.(value);
  };

  return (
    <div className={className}>
      <div className="flex border-b border-[#DCE3DA] gap-2 overflow-x-auto" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active === tab.value}
            onClick={() => handleChange(tab.value)}
            className={[
              'px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-colors duration-150 border-b-2 -mb-px whitespace-nowrap cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#244C3A]',
              active === tab.value
                ? 'border-[#244C3A] text-[#244C3A] font-semibold'
                : 'border-transparent text-[#737B75] hover:text-[#252B27] hover:border-[#DCE3DA]',
            ].join(' ')}
          >
            {tab.icon && <span className="mr-1.5 inline-flex align-middle">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`ml-1.5 text-xs px-2 py-0.5 rounded-full ${
                  active === tab.value ? 'bg-[#EBF2ED] text-[#244C3A] font-semibold' : 'bg-[#EFEFEA] text-[#737B75]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
