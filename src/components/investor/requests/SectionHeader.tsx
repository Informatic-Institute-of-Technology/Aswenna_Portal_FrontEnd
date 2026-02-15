interface SectionHeaderProps {
  title: string;
  icon?: string;
  badge?: {
    label: string;
    variant?: 'default' | 'primary';
  };
  action?: {
    label: string;
    onClick: () => void;
  };
  withGradientBar?: boolean;
}

const SectionHeader = ({
  title,
  icon,
  badge,
  action,
  withGradientBar = false,
}: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4 sticky top-0 py-2 z-10">
      <h3
        className="text-sm uppercase tracking-wide font-bold flex items-center gap-2"
        style={{ color: '#e0e0e0', display: 'flex', alignItems: 'center' }}
      >
        {withGradientBar && (
          <span
            style={{
              content: '""',
              width: '4px',
              height: '24px',
              background: 'linear-gradient(180deg, #6B8E23 0%, #8FA887 100%)',
              borderRadius: '4px',
              marginRight: '8px',
            }}
          ></span>
        )}
        {icon && (
          <span style={{ color: '#8FA887' }} className="material-icons text-lg">
            {icon}
          </span>
        )}
        {title}
        {badge && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full ml-1 ${
              badge.variant === 'primary'
                ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/10'
                : 'bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            {badge.label}
          </span>
        )}
      </h3>
      {action && (
        <button
          onClick={action.onClick}
          className="text-xs text-primary hover:text-primary-dark font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
