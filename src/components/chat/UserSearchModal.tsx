import type { ChatUser, UserRole } from '@/types/chat.types';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: ChatUser) => void;
  onSearch: (query: string, role?: UserRole) => Promise<ChatUser[]>;
}

const UserSearchModal = ({ isOpen, onClose, onSelectUser, onSearch }: UserSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim() && !selectedRole) return;
    
    setIsLoading(true);
    try {
      const results = await onSearch(searchQuery, selectedRole || undefined);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectUser = (user: ChatUser) => {
    onSelectUser(user);
    setSearchQuery('');
    setSelectedRole('');
    setSearchResults([]);
    onClose();
  };

  if (!isOpen) return null;

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'INVESTOR': return 'investor';
      case 'FARMER': return 'farmer';
      case 'LANDOWNER': return 'landowner';
      default: return 'admin';
    }
  };

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="chat-modal-header">
          <h3>Search Users</h3>
          <button className="chat-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="chat-modal-body">
          <div className="user-search-filters">
            <div className="search-input-group">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <select 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value as UserRole | '')}
              className="role-filter"
            >
              <option value="">All Roles</option>
              <option value="INVESTOR">Investor</option>
              <option value="FARMER">Farmer</option>
              <option value="LANDOWNER">Landowner</option>
            </select>
            
            <button 
              className="search-button" 
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>

          <div className="search-results">
            {searchResults.length === 0 && !isLoading && (
              <div className="empty-state">
                <Search size={48} />
                <p>No users found. Try a different search.</p>
              </div>
            )}
            
            {searchResults.map((user) => (
              <div 
                key={user.id} 
                className="user-search-item"
                onClick={() => handleSelectUser(user)}
              >
                <div className="user-avatar">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
                <span className={`role-badge ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSearchModal;
