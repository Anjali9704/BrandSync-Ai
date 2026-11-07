export default function PageHeader({ title, description, action, breadcrumbs }) {
  return (
    <div className="mb-6">
      {breadcrumbs && (
        <nav className="flex items-center gap-1.5 text-xs text-[#737B75] mb-2 font-medium" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span>/</span>}
              <span className={i === breadcrumbs.length - 1 ? 'text-[#252B27] font-semibold' : ''}>{crumb}</span>
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#252B27] tracking-tight">{title}</h1>
          {description && <p className="text-xs sm:text-sm text-[#737B75] mt-1 leading-relaxed">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
