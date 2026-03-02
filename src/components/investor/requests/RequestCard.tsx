interface RequestCardProps {
  type: 'agreement' | 'farmer-request' | 'sent-request';
  name: string;
  avatarUrl?: string;
  avatarInitials?: string;
  location: string;
  statusBadge: {
    label: string;
    variant: 'action' | 'pending' | 'review' | 'new' | 'accepted' | 'rejected' | 'pending_response' | 'under_review' | 'negotiating';
    color?: string;
  };
  tags?: { label: string; variant: 'primary' | 'secondary' }[];
  description: string;
  timestamp: string;
  primaryAction: {
    label: string;
    icon?: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  isVerified?: boolean;
  highlighted?: boolean;
  isSelected?: boolean;
}

const RequestCard = ({
  type,
  name,
  avatarUrl,
  avatarInitials,
  location,
  statusBadge,
  tags = [],
  description,
  timestamp,
  primaryAction,
  secondaryAction,
  isVerified = false,
  isSelected = false,
}: RequestCardProps) => {
  const getStatusStyles = () => {
    // If custom color is provided, use it
    if (statusBadge.color) {
      return {
        background: `${statusBadge.color}20`,
        color: statusBadge.color,
        border: `1px solid ${statusBadge.color}40`,
        backdropFilter: 'blur(10px)',
      };
    }

    switch (statusBadge.variant) {
      case 'action':
        return {
          background: 'var(--color-olive-muted-strong)',
          color: 'var(--color-olive-light)',
          border: '1px solid var(--color-olive-glow)',
          backdropFilter: 'blur(10px)',
        };
      case 'pending':
        return {
          background: 'var(--color-olive-glow-sm)',
          color: 'var(--color-olive-light)',
          border: '1px solid var(--color-olive-glow)',
          backdropFilter: 'blur(10px)',
        };
      case 'review':
        return {
          background: 'var(--color-warning-bg)',
          color: 'var(--color-amber)',
          border: '1px solid var(--color-warning-border)',
        };
      case 'new':
        return {
          background: 'var(--surface-muted)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--surface-light)',
        };
      case 'accepted':
        return {
          background: 'var(--color-success-bg)',
          color: 'var(--color-success)',
          border: '1px solid var(--color-success-border)',
        };
      case 'rejected':
        return {
          background: 'var(--color-error-bg)',
          color: 'var(--color-overdue)',
          border: '1px solid var(--color-overdue-border)',
        };
      case 'pending_response':
        return {
          background: 'var(--color-warning-bg)',
          color: 'var(--color-pending)',
          border: '1px solid var(--color-pending-border)',
        };
      case 'under_review':
        return {
          background: 'var(--color-info-blue-muted)',
          color: 'var(--color-info-blue)',
          border: '1px solid var(--color-info-blue-border)',
        };
      case 'negotiating':
        return {
          background: 'var(--color-warning-bg)',
          color: 'var(--color-pending)',
          border: '1px solid var(--color-pending-border)',
        };
      default:
        return {};
    }
  };

  const cardStyle = isSelected
    ? {
        background: 'linear-gradient(145deg, var(--color-nature-deep) 0%, var(--color-nature-mid) 100%)',
        border: '2px solid var(--color-olive-glow)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 0 25px var(--color-olive-glow)',
      }
    : {
        background: 'linear-gradient(145deg, var(--bg-subtle) 0%, var(--bg-overlay) 100%)',
        border: '1px solid var(--color-olive-muted-strong)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSelected) return; // Don't apply hover effect if already selected
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.borderColor = 'var(--color-olive-glow)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSelected) return; // Keep selected state
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '';
    e.currentTarget.style.borderColor = 'var(--color-olive-muted-strong)';
  };

  return (
    <div
      style={cardStyle}
      className="rounded-xl p-5 shadow-lg relative cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              alt={name}
              className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              src={avatarUrl}
            />
          ) : (
            <div
              style={{
                background: 'linear-gradient(135deg, var(--color-olive) 0%, var(--color-olive-light) 100%)',
                border: '2px solid var(--color-olive-glow)',
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
            >
              {avatarInitials}
            </div>
          )}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {name}
              {isVerified && (
                <span className="material-icons text-green-500 text-sm" title="Verified Farmer">
                  verified
                </span>
              )}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{location}</p>
          </div>
        </div>
        <span
          style={getStatusStyles()}
          className={`px-2.5 py-1 rounded text-xs font-semibold ${statusBadge.variant === 'action' ? 'animate-pulse' : ''}`}
        >
          {statusBadge.label}
        </span>
      </div>

      {tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                style={
                  tag.variant === 'primary'
                    ? {
                        background: 'var(--color-olive-glow-sm)',
                        color: 'var(--color-olive-light)',
                        border: '1px solid var(--color-olive-glow)',
                      }
                    : {}
                }
                className={
                  tag.variant === 'secondary'
                    ? 'text-xs px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-border-dark'
                    : 'text-xs px-2 py-1 rounded font-medium'
                }
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">{description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-border-dark">
        <div className="text-xs text-gray-400">{timestamp}</div>
        <div className="flex gap-2 w-full sm:w-auto">
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-md transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}
          <button
            onClick={primaryAction.onClick}
            style={{
              background: type === 'agreement'
                ? 'linear-gradient(135deg, var(--color-olive) 0%, var(--color-olive-light) 100%)'
                : undefined,
              boxShadow: type === 'agreement'
                ? '0 4px 12px var(--color-olive-glow)'
                : '0 2px 8px var(--color-olive-glow)',
            }}
            className={
              type === 'agreement'
                ? 'flex-1 sm:flex-none flex items-center justify-center px-4 py-2 text-xs font-bold text-white hover:opacity-90 rounded-lg transition-all transform active:scale-95'
                : 'px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-md shadow-sm transition-all font-bold'
            }
          >
            {primaryAction.icon && (
              <span className="material-icons text-[16px] mr-2">{primaryAction.icon}</span>
            )}
            {primaryAction.label}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
