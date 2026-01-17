import { Box, Paper, Typography } from '@mui/material';

interface Project {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  color: string;
}

interface CalendarMonthProps {
  year: number;
  month: number;
  projects: Project[];
  getDaysInMonth: (year: number, month: number) => number;
  isDateInRange: (date: Date, startDate: string, endDate: string) => boolean;
}

const CalendarMonth = ({ 
  year, 
  month, 
  projects, 
  getDaysInMonth, 
  isDateInRange 
}: CalendarMonthProps) => {
  const daysInMonth = getDaysInMonth(year, month);
  const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long' });
  const firstDay = new Date(year, month, 1).getDay();

  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor: '#2a2a2a',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          p: 1.5,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            fontSize: '0.95rem',
          }}
        >
          {monthName} {year}
        </Typography>
      </Box>

      <Box sx={{ p: 1.5 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5,
            mb: 0.5,
          }}
        >
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <Box
              key={idx}
              sx={{
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                {day}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5,
          }}
        >
          {Array.from({ length: firstDay }).map((_, idx) => (
            <Box
              key={`empty-${idx}`}
              sx={{
                aspectRatio: '1',
                minHeight: 32,
              }}
            />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const currentDate = new Date(year, month, day);
            
            const activeProject = projects.find(project =>
              isDateInRange(currentDate, project.startDate, project.endDate)
            );

            return (
              <Box
                key={day}
                sx={{
                  aspectRatio: '1',
                  minHeight: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  backgroundColor: activeProject
                    ? activeProject.color
                    : 'rgba(255, 255, 255, 0.05)',
                  border: activeProject
                    ? `2px solid ${activeProject.color}`
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  transition: 'all 0.2s',
                  cursor: activeProject ? 'pointer' : 'default',
                  '&:hover': {
                    transform: activeProject ? 'scale(1.05)' : 'none',
                    boxShadow: activeProject ? `0 0 12px ${activeProject.color}` : 'none',
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: activeProject ? 700 : 500,
                    color: activeProject ? '#000' : 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  {day}
                </Typography>
                
                {activeProject && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 2,
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: '#000',
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default CalendarMonth;
