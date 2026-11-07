export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white border border-[#DCE3DA] rounded-lg">
      {icon && (
        <div className="w-12 h-12 rounded-full bg-[#EBF2ED] text-[#244C3A] flex items-center justify-center mb-3">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-[#252B27] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#737B75] max-w-sm mb-4 leading-relaxed">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
