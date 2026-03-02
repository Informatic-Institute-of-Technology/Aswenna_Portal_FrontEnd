import {
  CalendarMonth,
  PlaceholderWidget,
  ProjectLegendItem,
  StatCard,
} from "@/components";
import {
  AttachMoney,
  CalendarMonth as CalendarIcon,
  CheckCircle,
  Description,
  TrendingUp,
} from "@mui/icons-material";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { farmerProjectsData } from "../../data/json";

// Import mock projects from JSON
const mockProjects = farmerProjectsData;

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

    mockProjects.forEach((project) => {
      const start = new Date(project.startDate);
      const end = new Date(project.endDate);

      const current = new Date(start.getFullYear(), start.getMonth(), 1);
      const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);

      while (current <= endMonth) {
        const monthKey = `${current.getFullYear()}-${current.getMonth()}`;
        const monthStart = new Date(
          current.getFullYear(),
          current.getMonth(),
          1,
        );
        const monthEnd = new Date(
          current.getFullYear(),
          current.getMonth() + 1,
          0,
        );

        const projectStart = new Date(project.startDate);
        const projectEnd = new Date(project.endDate);

        if (projectEnd >= monthStart && projectStart <= monthEnd) {
          monthsWithData.add(monthKey);
        }

        current.setMonth(current.getMonth() + 1);
      }
    });

    const months = Array.from(monthsWithData)
      .map((key) => {
        const [year, month] = key.split("-").map(Number);
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
    <>
      <div className="row g-3 mb-3">
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            icon={Description}
            iconBgColor="var(--color-olive-muted-strong)"
            iconColor="primary.main"
            label="Active Projects"
            value="04"
          />
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            icon={CheckCircle}
            iconBgColor="var(--color-info-blue-muted)"
            iconColor="var(--color-info-blue)"
            label="Completed Projects"
            value="06"
          />
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            icon={TrendingUp}
            iconBgColor="var(--color-amber-muted)"
            iconColor="var(--color-amber)"
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                  backgroundColor: "var(--bg-overlay)",
                  borderRadius: 2,
                  p: 3,
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 2,
                    mb: 3,
                  }}
                >
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

                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    flexWrap: "wrap",
                    justifyContent: "center",
                    pt: 2,
                    borderTop: "1px solid var(--surface-light)",
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
    </>
  );
};

export default FarmerDashboard;
