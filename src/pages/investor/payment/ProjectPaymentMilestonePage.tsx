import { ProjectPaymentMilestoneContent } from "./PaymentDetailPage";

export {
  ProjectPaymentMilestoneContent,
  ProjectPaymentMilestoneDialog,
} from "./PaymentDetailPage";

export default function ProjectPaymentMilestonePage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-surface)" }}>
      <ProjectPaymentMilestoneContent />
    </div>
  );
}
