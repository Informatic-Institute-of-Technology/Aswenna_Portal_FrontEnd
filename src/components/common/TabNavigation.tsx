import { Box, Chip, Tab, Tabs } from '@mui/material';
import type { ReactNode } from 'react';

export interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface TabNavigationProps {
  activeTab: string;
  tabs: TabItem[];
  onChange: (value: string) => void;
  variant?: 'default' | 'dark' | 'colored';
}

const TabNavigation = ({
  activeTab,
  tabs,
  onChange,
  variant = 'dark',
}: TabNavigationProps) => {
  const getTabStyles = (isActive: boolean) => {
    const baseStyles = {
      minHeight: 48,
      textTransform: 'none' as const,
      fontSize: '0.95rem',
      fontWeight: 600,
      px: 3,
      py: 1.5,
      borderRadius: 3,
      transition: 'all 0.3s ease',
    };

    if (variant === 'dark') {
      return {
        ...baseStyles,
        color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
        background: isActive
          ? 'linear-gradient(135deg, #2c2c2c 0%, #3f3f3f 100%)'
          : 'transparent',
        border: isActive
          ? '1px solid rgba(255,255,255,0.15)'
          : '1px solid rgba(255,255,255,0.1)',
        '&:hover': {
          background: isActive
            ? 'linear-gradient(135deg, #3a3a3a 0%, #4f4f4f 100%)'
            : 'rgba(255,255,255,0.05)',
        },
        '& .MuiTab-iconWrapper': {
          color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
        },
      };
    }

    return baseStyles;
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => onChange(newValue)}
        sx={{
          minHeight: 'auto',
          '& .MuiTabs-indicator': {
            display: 'none',
          },
          '& .MuiTabs-flexContainer': {
            gap: 2,
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            iconPosition="start"
            label={
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  color: '#fff',
                }}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <Chip
                    label={tab.count}
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      bgcolor:
                        activeTab === tab.value
                          ? 'rgba(0,0,0,0.2)'
                          : 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      border:
                        activeTab === tab.value
                          ? 'none'
                          : '1px solid rgba(255,255,255,0.2)',
                    }}
                  />
                )}
              </Box>
            }
            value={tab.value}
            sx={getTabStyles(activeTab === tab.value)}
          />
        ))}
      </Tabs>
      <Box sx={{ height: 1, bgcolor: 'rgba(255,255,255,0.08)', mt: 3 }} />
    </Box>
  );
};

export default TabNavigation;
