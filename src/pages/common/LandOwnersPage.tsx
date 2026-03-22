// const LandOwnersPage = () => {
//   return (
//     <>
//       <div className="widget-card">
//         <div className="widget-card-header">
//           <h2 className="widget-card-title">Land Owners</h2>
//         </div>
//         <div className="widget-card-content">
//           <p>Search land listings and request access or partnership.</p>
//           <div className="chart-placeholder" style={{ marginTop: "2rem" }}>
//              Browse available land with filters
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LandOwnersPage;


import {
  Box,
  Chip,
  CircularProgress,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import {
  getLandownerAds,
  type LandownerAdApiItem,
} from "../../services/landownerAds.service";
import Notification from "../../shared/components/Notification";
import LandownerAdCard from "../../components/common/LandownerAdCard";

const LandOwnersPage = () => {
  const [landownerAds, setLandownerAds] = useState<LandownerAdApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAd, setSelectedAd] = useState<LandownerAdApiItem | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
