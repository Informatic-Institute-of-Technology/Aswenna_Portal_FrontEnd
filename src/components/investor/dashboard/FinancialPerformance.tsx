import { CardHeaderWithIcon } from "@/components";
import { BarChart as BarChartIcon, Timeline } from "@mui/icons-material";
import { Box, Card, CardContent, Divider } from "@mui/material";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { moneyFormatter, TOOLTIP_STYLE } from "./chartUtils";
import type { PayoutEntry, RevenueEntry, YieldEntry } from "./types";

interface Props {
    revenueVsInvestment: RevenueEntry[];
    monthlyPayoutTrend: PayoutEntry[];
    estimatedVsActualYield: YieldEntry[];
}

const GRID_STROKE = "#333";
const AXIS_STROKE = "#888";

const FinancialPerformance = ({
    revenueVsInvestment,
    monthlyPayoutTrend,
    estimatedVsActualYield,
}: Props) => (
    <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
            <Card
                elevation={0}
                sx={{ height: "100%", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 3 }}
            >
                <CardHeaderWithIcon icon={BarChartIcon} title="Revenue vs. Investment" />
                <Divider />
                <CardContent>
                    <Box sx={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={revenueVsInvestment}
                                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                                <XAxis dataKey="project" stroke={AXIS_STROKE} tick={{ fontSize: 12 }} />
                                <YAxis stroke={AXIS_STROKE} />
                                <Tooltip
                                    formatter={moneyFormatter}
                                    contentStyle={TOOLTIP_STYLE}
                                />
                                <Legend />
                                <Bar dataKey="investment" name="Investment" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="projectedProfit" name="Projected Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Card>
        </div>

        <div className="col-12 col-lg-6">
            <Card
                elevation={0}
                sx={{ height: "100%", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 3 }}
            >
                <CardHeaderWithIcon icon={BarChartIcon} title="Estimated vs. Actual Yield (kg)" />
                <Divider />
                <CardContent>
                    <Box sx={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={estimatedVsActualYield}
                                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                                <XAxis dataKey="project" stroke={AXIS_STROKE} tick={{ fontSize: 12 }} />
                                <YAxis stroke={AXIS_STROKE} />
                                <Tooltip contentStyle={TOOLTIP_STYLE} />
                                <Legend />
                                <Bar dataKey="estimated" name="Estimated Yield" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="actual" name="Actual Yield" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Card>
        </div>

        <div className="col-12">
            <Card
                elevation={0}
                sx={{ height: "100%", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 3 }}
            >
                <CardHeaderWithIcon icon={Timeline} title="Monthly Payout Trend" />
                <Divider />
                <CardContent>
                    <Box sx={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={monthlyPayoutTrend}
                                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                                <XAxis dataKey="month" stroke={AXIS_STROKE} />
                                <YAxis stroke={AXIS_STROKE} />
                                <Tooltip
                                    formatter={moneyFormatter}
                                    contentStyle={TOOLTIP_STYLE}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="payout"
                                    name="Milestone Payouts"
                                    stroke="#f43f5e"
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Card>
        </div>
    </div>
);

export default FinancialPerformance;
