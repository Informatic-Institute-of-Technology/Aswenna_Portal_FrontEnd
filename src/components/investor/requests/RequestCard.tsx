interface RequestCardProps {
  type: 'agreement' | 'farmer-request' | 'sent-request' | 'landowner-request';
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
          background: 'rgba(107, 142, 35, 0.2)',
          color: '#8FA887',
          border: '1px solid rgba(107, 142, 35, 0.4)',
          backdropFilter: 'blur(10px)',
        };
      case 'pending':
        return {
          background: 'rgba(107, 142, 35, 0.15)',
          color: '#8FA887',
          border: '1px solid rgba(107, 142, 35, 0.3)',
          backdropFilter: 'blur(10px)',
        };
      case 'review':
        return {
          background: 'rgba(255, 193, 7, 0.2)',
          color: '#ffc107',
          border: '1px solid rgba(255, 193, 7, 0.3)',
        };
      case 'new':
        return {
          background: 'rgba(128, 128, 128, 0.2)',
          color: '#a0a0a0',
          border: '1px solid rgba(128, 128, 128, 0.3)',
        };
      case 'accepted':
        return {
          background: 'rgba(16, 185, 129, 0.2)',
          color: '#10b981',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        };
      case 'rejected':
        return {
          background: 'rgba(239, 68, 68, 0.2)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        };
      case 'pending_response':
        return {
          background: 'rgba(245, 158, 11, 0.2)',
          color: '#f59e0b',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        };
      case 'under_review':
        return {
          background: 'rgba(59, 130, 246, 0.2)',
          color: '#3b82f6',
          border: '1px solid rgba(59, 130, 246, 0.3)',
        };
      case 'negotiating':
        return {
          background: 'rgba(245, 158, 11, 0.2)',
          color: '#f59e0b',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        };
      default:
        return {};
    }
  };

  const cardStyle = isSelected
    ? {
        background: 'linear-gradient(145deg, rgba(26, 46, 26, 0.4) 0%, rgba(42, 58, 42, 0.4) 100%)',
        border: '2px solid rgba(107, 142, 35, 0.8)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 0 25px rgba(107, 142, 35, 0.4)',
      }
    : {
        background: 'linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%)',
        border: '1px solid rgba(107, 142, 35, 0.2)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSelected) return; // Don't apply hover effect if already selected
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.borderColor = 'rgba(107, 142, 35, 0.5)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSelected) return; // Keep selected state
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '';
    e.currentTarget.style.borderColor = 'rgba(107, 142, 35, 0.2)';
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
                background: 'linear-gradient(135deg, #6B8E23 0%, #8FA887 100%)',
                border: '2px solid rgba(107, 142, 35, 0.4)',
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
                        background: 'rgba(107, 142, 35, 0.15)',
                        color: '#8FA887',
                        border: '1px solid rgba(107, 142, 35, 0.3)',
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
                ? 'linear-gradient(135deg, #6B8E23 0%, #8FA887 100%)'
                : undefined,
              boxShadow: type === 'agreement'
                ? '0 4px 12px rgba(107, 142, 35, 0.3)'
                : '0 2px 8px rgba(107, 142, 35, 0.3)',
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
