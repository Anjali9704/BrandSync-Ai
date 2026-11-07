export default function Card({ children, className = '', hover = false, padding = true }) {
  return (
    <div
      className={[
        'bg-white border border-[#DCE3DA] rounded-lg shadow-sm',
        hover ? 'hover:shadow-card hover:border-[#CBD4C8] transition-all duration-150' : '',
        padding ? 'p-5 sm:p-6' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
