import { CalendarMonth, PlaceholderWidget, ProjectLegendItem, StatCard } from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    AttachMoney,
    CalendarMonth as CalendarIcon,
    CheckCircle,
    Description,
    TrendingUp,
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
} from '@mui/material';

// Mock project data (non-conflicting - sequential bookings)
const mockProjects = [
  { 
    id: 1, 
    name: "Paddy field - Project A", 
    startDate: "2026-12-05", 
    endDate: "2026-12-31", 
    color: "#E3C957" 
  },
  { 
    id: 2, 
    name: "Vegetable Cultivation - B", 
    startDate: "2026-02-01", 
    endDate: "2026-02-20", 
    color: "#4CAF50" 
  },
  { 
    id: 3, 
    name: "Organic Farming - C", 
    startDate: "2026-02-22", 
    endDate: "2026-03-18", 
    color: "#FF9800" 
  },
  { 
    id: 4, 
    name: "Fruit Plantation - D", 
    startDate: "2026-03-20", 
    endDate: "2026-04-15", 
    color: "#9C27B0" 
  },
  {
    id: 5, 
    name: "Herb Cultivation - E", 
    startDate: "2026-04-18", 
    endDate: "2026-05-10", 
    color: "#03A9F4" 
  },
  {
    id: 6, 
    name: "Flower Farming - F", 
    startDate: "2026-05-12", 
    endDate: "2026-06-05", 
    color: "#FF5722" 
  }
];

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const isDateInRange = (date: Date, startDate: string, endDate: string) => {
  const current = new Date(date);
  current.setHours(0, 0, 0, 0);
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  return current >= start && current <= end;
};

const FarmerDashboard = () => {
  const getProjectDateRange = () => {
    const monthsWithData = new Set<string>();
    
    mockProjects.forEach(project => {
      const start = new Date(project.startDate);
      const end = new Date(project.endDate);
      
      const current = new Date(start.getFullYear(), start.getMonth(), 1);
      const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
      
      while (current <= endMonth) {
        const monthKey = `${current.getFullYear()}-${current.getMonth()}`;
        const monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
        const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
        
        const projectStart = new Date(project.startDate);
        const projectEnd = new Date(project.endDate);
        
        if (projectEnd >= monthStart && projectStart <= monthEnd) {
          monthsWithData.add(monthKey);
        }
        
        current.setMonth(current.getMonth() + 1);
      }
    });
    
    const months = Array.from(monthsWithData)
      .map(key => {
        const [year, month] = key.split('-').map(Number);
        return { year, month, key };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      })
      .map((m, index) => ({
        year: m.year,
        month: m.month,
        offset: index,
      }));
    
    return months;
  };

  const monthsToDisplay = getProjectDateRange();

  return (
    <DashboardLayout>
      <div className="row g-3 mb-3">
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            icon={Description}
            iconBgColor="rgba(107, 142, 35, 0.2)"
            iconColor="primary.main"
            label="Active Projects"
            value="04"
          />
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            icon={CheckCircle}
            iconBgColor="rgba(59, 130, 246, 0.2)"
            iconColor="#3b82f6"
            label="Completed Projects"
            value="06"
          />
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            icon={TrendingUp}
            iconBgColor="rgba(251, 191, 36, 0.2)"
            iconColor="#fbbf24"
            label="New Requests"
            value="13+"
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12">
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney />
                  <Typography variant="h6" component="span">
                    Funding Status by Project
                  </Typography>
                </Box>
              }
            />
            <CardContent>
              <PlaceholderWidget
                icon="📊"
                title="Funding Status Chart"
                description="Budget secured vs. Required budget visualization"
              />
            </CardContent>
          </Card>
        </div>

        {/* Master Schedule */}
        <div className="col-12">
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon />
                  <Typography variant="h6" component="span">
                    Master Schedule - Project Timeline
                  </Typography>
                </Box>
              }
            />
            <CardContent>
              <Box
                sx={{
                  backgroundColor: '#1e1e1e',
                  borderRadius: 2,
                  p: 3,
                }}
              >
                {/* Single unified calendar showing all projects */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 2,
                    mb: 3,
                  }}
                >
                  {/* Display months dynamically based on project date ranges */}
                  {monthsToDisplay.map((monthData) => (
                    <CalendarMonth
                      key={`${monthData.year}-${monthData.month}`}
                      year={monthData.year}
                      month={monthData.month}
                      projects={mockProjects}
                      getDaysInMonth={getDaysInMonth}
                      isDateInRange={isDateInRange}
                    />
                  ))}
                </Box>

                {/* Project Legend - Shows all projects in unified view */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 3,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    pt: 2,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {mockProjects.map((project) => (
                    <ProjectLegendItem
                      key={project.id}
                      name={project.name}
                      color={project.color}
                      startDate={project.startDate}
                      endDate={project.endDate}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </div>

        {/* Insights Widget */}
        <div className="col-12">
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp />
                  <Typography variant="h6" component="span">
                    Crop Prices & Market Trends
                  </Typography>
                </Box>
              }
            />
            <CardContent>
              <PlaceholderWidget
                icon="📈"
                title="Crop Price Graphs and Market Trends"
                description="Real-time market data and price predictions"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FarmerDashboard;
