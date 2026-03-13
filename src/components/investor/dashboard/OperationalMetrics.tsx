import { CardHeaderWithIcon } from "@/components";
import { TableChart } from "@mui/icons-material";
import {
    Card,
    Chip,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import type { MilestoneEntry, ProjectHealthEntry } from "./types";

interface Props {
    upcomingMilestones: MilestoneEntry[];
    projectHealth: ProjectHealthEntry[];
}

const headCellSx = { color: "text.secondary", fontWeight: "bold" };

const powColor = (pow: string) => {
    if (pow === "Verified") return "success";
    if (pow === "In Review") return "warning";
    return "default";
};

const dealLockSx = (status: string) => ({
    bgcolor: status === "Locked" ? "rgba(59,130,246,0.1)" : "rgba(244,63,94,0.1)",
    color: status === "Locked" ? "#3b82f6" : "#f43f5e",
});

const MilestoneTable = ({ rows }: { rows: MilestoneEntry[] }) => (
    <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: "transparent" }}>
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell sx={headCellSx}>Due Date</TableCell>
                    <TableCell sx={headCellSx}>Farmer</TableCell>
                    <TableCell sx={headCellSx}>Phase</TableCell>
                    <TableCell sx={headCellSx} align="right">Amount</TableCell>
                    <TableCell sx={headCellSx} align="center">Proof of Work</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell>{row.dueDate}</TableCell>
                        <TableCell>{row.farmer}</TableCell>
                        <TableCell>{row.phase}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>{row.amount}</TableCell>
                        <TableCell align="center">
                            <Chip label={row.proofOfWork} size="small" color={powColor(row.proofOfWork)} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

const ProjectHealthTable = ({ rows }: { rows: ProjectHealthEntry[] }) => (
    <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: "transparent" }}>
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell sx={headCellSx}>Project</TableCell>
                    <TableCell sx={headCellSx} align="center">Verification</TableCell>
                    <TableCell sx={headCellSx}>Current Phase</TableCell>
                    <TableCell sx={headCellSx} align="center">Deal Lock</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell sx={{ fontWeight: "bold" }}>{row.name}</TableCell>
                        <TableCell align="center">
                            <Chip
                                label={row.verificationStatus}
                                size="small"
                                color={row.verificationStatus === "Verified" ? "success" : "warning"}
                                variant="outlined"
                            />
                        </TableCell>
                        <TableCell>{row.currentPhase}</TableCell>
                        <TableCell align="center">
                            <Chip label={row.dealLockStatus} size="small" sx={dealLockSx(row.dealLockStatus)} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

const OperationalMetrics = ({ upcomingMilestones, projectHealth }: Props) => (
    <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
            <Card
                elevation={0}
                sx={{ height: "100%", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 3 }}
            >
                <CardHeaderWithIcon icon={TableChart} title="Upcoming Milestones" />
                <Divider />
                <MilestoneTable rows={upcomingMilestones} />
            </Card>
        </div>
        <div className="col-12 col-lg-6">
            <Card
                elevation={0}
                sx={{ height: "100%", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 3 }}
            >
                <CardHeaderWithIcon icon={TableChart} title="Project Health Tracker" />
                <Divider />
                <ProjectHealthTable rows={projectHealth} />
            </Card>
        </div>
    </div>
);

export default OperationalMetrics;
