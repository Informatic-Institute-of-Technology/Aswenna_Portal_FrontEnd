import { CardHeaderWithIcon } from "@/components";
import { PieChart as PieChartIcon } from "@mui/icons-material";
import { Box, Card, CardContent, Divider } from "@mui/material";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CHART_COLORS, genericFormatter, TOOLTIP_STYLE } from "./chartUtils";
import type { CropAllocationEntry, RegionalEntry, StakeholderEntry } from "./types";

interface Props {
    cropTypeAllocation: CropAllocationEntry[];
    regionalDistribution: RegionalEntry[];
    stakeholderStatus: StakeholderEntry[];
}

const DonutChart = ({
    data,
    title,
    colorOffset = 0,
}: {
    data: { name: string; value: number }[];
    title: string;
    colorOffset?: number;
}) => (
    <Card
        elevation={0}
        sx={{ height: "100%", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 3 }}
    >
        <CardHeaderWithIcon icon={PieChartIcon} title={title} />
        <Divider />
        <CardContent>
            <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((_, i) => (
                                <Cell
                                    key={`cell-${i}`}
                                    fill={CHART_COLORS[(i + colorOffset) % CHART_COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={genericFormatter}
                            contentStyle={TOOLTIP_STYLE}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </Box>
        </CardContent>
    </Card>
);

const PortfolioComposition = ({ cropTypeAllocation, regionalDistribution, stakeholderStatus }: Props) => (
    <div className="row g-4 mb-4">
        <div className="col-12 col-lg-4">
            <DonutChart data={cropTypeAllocation} title="Investment by Crop Type" colorOffset={0} />
        </div>
        <div className="col-12 col-lg-4">
            <DonutChart data={regionalDistribution} title="Regional Distribution" colorOffset={1} />
        </div>
        <div className="col-12 col-lg-4">
            <DonutChart data={stakeholderStatus} title="Stakeholder Status" colorOffset={2} />
        </div>
    </div>
);

export default PortfolioComposition;
