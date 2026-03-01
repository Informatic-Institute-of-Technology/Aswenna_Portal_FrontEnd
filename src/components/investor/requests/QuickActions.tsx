interface QuickAction {
  icon: string;
  label: string;
  color?: string;
  onClick: () => void;
  disabled?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
  insight?: {
    text: string;
  };
  withdrawAction?: {
    label: string;
    onClick: () => void;
  };
}

const QuickActions = ({ actions, insight, withdrawAction }: QuickActionsProps) => {
  return (
    <div
      style={{
        background: 'linear-gradient(145deg, var(--bg-subtle) 0%, var(--bg-overlay) 100%)',
      }}
      className="p-6"
    >
      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h4>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            style={{
              border: '1px solid var(--color-olive-glow)',
              transition: 'all 0.3s ease',
              opacity: action.disabled ? 0.5 : 1,
              cursor: action.disabled ? 'not-allowed' : 'pointer',
            }}
            className="flex flex-col items-center justify-center p-4 rounded-xl group"
            onMouseEnter={(e) => {
              if (!action.disabled) {
                e.currentTarget.style.background = 'var(--color-olive-muted)';
                e.currentTarget.style.borderColor = 'var(--color-olive-glow)';
              }
            }}
            onMouseLeave={(e) => {
              if (!action.disabled) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'var(--color-olive-glow)';
              }
            }}
          >
            <span
              style={{ color: action.disabled ? 'var(--neutral-500)' : (action.color || 'var(--color-olive-light)') }}
              className="material-icons mb-2 group-hover:scale-110 transition-transform"
            >
              {action.icon}
            </span>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {action.label}
            </span>
          </button>
        ))}
      </div>

      {withdrawAction && (
        <button
          onClick={withdrawAction.onClick}
          className="w-full mt-3 flex flex-col items-center justify-center p-4 rounded-xl border border-red-100 dark:border-red-900/20 hover:border-red-200 dark:hover:border-red-900/40 transition-all group col-span-2"
          style={{
            background: 'transparent',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <span className="material-icons text-red-500 mb-2 group-hover:scale-110 transition-transform">
            cancel
          </span>
          <span className="text-xs font-medium text-red-600 dark:text-red-400">
            {withdrawAction.label}
          </span>
        </button>
      )}

      {insight && (
        <div
          style={{
            background: 'var(--color-olive-muted)',
            border: '1px solid var(--color-olive-glow)',
            backdropFilter: 'blur(10px)',
          }}
          className="mt-6 p-4 rounded-lg"
        >
          <div className="flex gap-3">
            <span style={{ color: 'var(--color-olive-light)' }} className="material-icons text-sm mt-0.5">
              lightbulb
            </span>
            <div>
              <h5 style={{ color: 'var(--color-olive-light)' }} className="text-sm font-semibold">
                Insight
              </h5>
              <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-1">
                {insight.text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
