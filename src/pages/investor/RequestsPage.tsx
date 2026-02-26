import { useState } from "react";
import {
  ConnectionJourney,
  FilterChip,
  QuickActions,
  RequestCard,
  SectionHeader,
  TabNavigation,
} from "../../components/investor/requests";
import agreementsPendingData from "../../data/json/agreementsPending.json";
import farmerRequestsData from "../../data/json/farmerRequests.json";
import sentRequestsData from "../../data/json/sentRequests.json";

interface RequestData {
  id: string;
  projectId?: string;
  partyType?: "farmer" | "landowner";
  recipientType?: "farmer" | "landowner";
  farmerName: string;
  farmerAvatar: string | null;
  farmerInitials: string;
  location: string;
  isVerified?: boolean;
  statusBadge: {
    label: string;
    variant:
      | "pending"
      | "action"
      | "review"
      | "new"
      | "accepted"
      | "rejected"
      | "pending_response"
      | "under_review"
      | "negotiating";
    color?: string;
  };
  tags: Array<{ label: string; variant: "primary" | "secondary" }>;
  description: string;
  timestamp: string;
  totalInvestment?: string;
  investmentAmount?: string;
  expectedROI?: string;
  duration?: string;
  journeySteps: Array<{
    title: string;
    description: string;
    timestamp?: string;
    status: "completed" | "active" | "pending";
    icon?: string;
  }>;
  insight: string;
  highlighted: boolean;
}

const RequestsPage = () => {
  const [activeTab, setActiveTab] = useState("incoming");
  const [sentRequestsRecipientFilter, setSentRequestsRecipientFilter] =
    useState<"landowner" | "farmer">("landowner");
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(
    null,
  );
  const [isAgreementsExpanded, setIsAgreementsExpanded] = useState(true);
  const [isFarmerRequestsExpanded, setIsFarmerRequestsExpanded] =
    useState(true);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedRequest(null); // Clear selection when switching tabs
  };

  const handleUploadAgreement = () => {
    console.log("Upload agreement clicked");
  };

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
  };

  const handleSelectRequest = (request: RequestData) => {
    setSelectedRequest(request);
  };

  const journeySteps =
    selectedRequest?.journeySteps.map((step) => {
      if (step.status === "active" && step.icon === "upload_file") {
        return {
          ...step,
          uploadArea: {
            text: "Click to upload PDF",
            onUpload: handleUploadAgreement,
          },
        };
      }
      return step;
    }) || [];

  const tabs = [
    {
      label: "Incoming Requests",
      badge: agreementsPendingData.length + farmerRequestsData.length,
      active: activeTab === "incoming",
      onClick: () => handleTabChange("incoming"),
    },
    {
      label: "My Sent Requests",
      badge: sentRequestsData.length,
      active: activeTab === "sent",
      onClick: () => handleTabChange("sent"),
    },
    {
      label: "History",
      active: activeTab === "history",
      onClick: () => handleTabChange("history"),
    },
  ];

  const quickActions =
    activeTab === "sent"
      ? [
          {
            icon: "article",
            label: "View Land Post",
            onClick: () => handleQuickAction("view-land"),
            color: "#3b82f6",
          },
          {
            icon: "message",
            label: "Message",
            onClick: () => handleQuickAction("message"),
            disabled: selectedRequest?.statusBadge.variant !== "accepted",
          },
        ]
      : [
          {
            icon: "message",
            label: "Message",
            onClick: () => handleQuickAction("message"),
          },
          {
            icon: "videocam",
            label: "Schedule Call",
            onClick: () => handleQuickAction("videocam"),
          },
          {
            icon: "summarize",
            label: "Notes",
            onClick: () => handleQuickAction("summarize"),
          },
          {
            icon: "block",
            label: "Reject",
            color: "#ef5350",
            onClick: () => handleQuickAction("reject"),
          },
        ];

  return (
    <>
      <div
        style={{
          background: "linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%)",
        }}
        className="text-gray-300 font-sans h-full flex flex-col overflow-hidden transition-colors duration-200"
      >
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-8 py-6 pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Requests Management
                </h2>
                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-primary mr-1">
                    12 Actions Needed
                  </span>
                  <span>
                    • Categorized farmer inquiries and pending agreements.
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-black text-sm font-bold rounded-lg shadow hover:shadow-primary/20 transition-all">
                  <span className="material-icons-outlined text-lg mr-2">
                    add
                  </span>
                  New Inquiry
                </button>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <TabNavigation tabs={tabs} />
              <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
                <FilterChip
                  icon="priority_high"
                  label="Urgent"
                  variant="urgent"
                />
                <FilterChip
                  icon="attach_money"
                  label="High-Value"
                  variant="high-value"
                />
                <FilterChip
                  icon="verified"
                  label="Verified"
                  variant="verified"
                />
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
            <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-8">
              {/* Incoming Requests Tab Content */}
              {activeTab === "incoming" && (
                <div className="space-y-6">
                  {/* Agreements Pending Section */}
                  <section
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(42, 42, 42, 0.6) 0%, rgba(31, 31, 31, 0.6) 100%)",
                      border: "1px solid rgba(107, 142, 35, 0.2)",
                    }}
                    className="rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <SectionHeader
                        title="Agreements Pending"
                        icon="pending_actions"
                        badge={{
                          label: String(agreementsPendingData.length),
                          variant: "primary",
                        }}
                        withGradientBar
                      />
                      <button
                        onClick={() =>
                          setIsAgreementsExpanded(!isAgreementsExpanded)
                        }
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <span className="material-icons">
                          {isAgreementsExpanded ? "expand_less" : "expand_more"}
                        </span>
                      </button>
                    </div>
                    {isAgreementsExpanded && (
                      <div className="grid grid-cols-1 gap-4">
                        {(agreementsPendingData as RequestData[]).map(
                          (agreement) => (
                            <div
                              key={agreement.id}
                              onClick={() => handleSelectRequest(agreement)}
                              className="cursor-pointer"
                            >
                              <RequestCard
                                type="agreement"
                                name={agreement.farmerName}
                                avatarUrl={agreement.farmerAvatar || undefined}
                                avatarInitials={agreement.farmerInitials}
                                location={agreement.location}
                                statusBadge={agreement.statusBadge}
                                tags={agreement.tags}
                                description={agreement.description}
                                timestamp={agreement.timestamp}
                                primaryAction={{
                                  label: "Upload Agreement",
                                  icon: "upload_file",
                                  onClick: handleUploadAgreement,
                                }}
                                highlighted={agreement.highlighted}
                                isSelected={
                                  selectedRequest?.id === agreement.id
                                }
                              />
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </section>

                  <section
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(42, 42, 42, 0.6) 0%, rgba(31, 31, 31, 0.6) 100%)",
                      border: "1px solid rgba(107, 142, 35, 0.2)",
                    }}
                    className="rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <SectionHeader
                        title="Initial Farmer Requests"
                        icon="inbox"
                        badge={{ label: String(farmerRequestsData.length) }}
                        withGradientBar
                      />
                      <button
                        onClick={() =>
                          setIsFarmerRequestsExpanded(!isFarmerRequestsExpanded)
                        }
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <span className="material-icons">
                          {isFarmerRequestsExpanded
                            ? "expand_less"
                            : "expand_more"}
                        </span>
                      </button>
                    </div>
                    {isFarmerRequestsExpanded && (
                      <div className="space-y-4">
                        {(farmerRequestsData as RequestData[]).map(
                          (request) => (
                            <div
                              key={request.id}
                              onClick={() => handleSelectRequest(request)}
                              className="cursor-pointer"
                            >
                              <RequestCard
                                type="farmer-request"
                                name={request.farmerName}
                                avatarUrl={request.farmerAvatar || undefined}
                                avatarInitials={request.farmerInitials}
                                location={request.location}
                                isVerified={request.isVerified}
                                statusBadge={request.statusBadge}
                                tags={request.tags}
                                description={request.description}
                                timestamp={request.timestamp}
                                primaryAction={{
                                  label: "Review Request",
                                  onClick: () => console.log("Review"),
                                }}
                                highlighted={request.highlighted}
                                isSelected={selectedRequest?.id === request.id}
                              />
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </section>
                </div>
              )}

              {activeTab === "sent" && (
                <div className="space-y-4">
                  <div className="flex border-b border-gray-200 dark:border-zinc-800 mb-6">
                    <button
                      onClick={() =>
                        setSentRequestsRecipientFilter("landowner")
                      }
                      className={`relative flex items-center pb-3 px-4 text-sm font-semibold transition-colors ${
                        sentRequestsRecipientFilter === "landowner"
                          ? "text-primary-dark dark:text-primary"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                    >
                      <span className="material-icons-outlined mr-2 text-lg">
                        landscape
                      </span>
                      Landowners
                      <span
                        className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          sentRequestsRecipientFilter === "landowner"
                            ? "bg-primary/10 text-primary-dark dark:text-primary"
                            : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {
                          (sentRequestsData as RequestData[]).filter(
                            (r) => r.recipientType === "landowner",
                          ).length
                        }
                      </span>
                      {sentRequestsRecipientFilter === "landowner" && (
                        <span
                          className="absolute bottom-0 left-0 right-0 h-0.5"
                          style={{
                            backgroundColor: "#4ADE80",
                            marginBottom: "-1px",
                          }}
                        ></span>
                      )}
                    </button>
                    <button
                      onClick={() => setSentRequestsRecipientFilter("farmer")}
                      className={`relative flex items-center pb-3 px-4 text-sm font-semibold transition-colors ${
                        sentRequestsRecipientFilter === "farmer"
                          ? "text-primary-dark dark:text-primary"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                    >
                      <span className="material-icons-outlined mr-2 text-lg">
                        agriculture
                      </span>
                      Farmers
                      <span
                        className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          sentRequestsRecipientFilter === "farmer"
                            ? "bg-primary/10 text-primary-dark dark:text-primary"
                            : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {
                          (sentRequestsData as RequestData[]).filter(
                            (r) => r.recipientType === "farmer",
                          ).length
                        }
                      </span>
                      {sentRequestsRecipientFilter === "farmer" && (
                        <span
                          className="absolute bottom-0 left-0 right-0 h-0.5"
                          style={{
                            backgroundColor: "#6B8E23",
                            marginBottom: "-1px",
                          }}
                        ></span>
                      )}
                    </button>
                  </div>

                  {sentRequestsRecipientFilter === "landowner" && (
                    <section className="bg-gray-50 dark:bg-surface-dark/30 rounded-2xl border border-transparent dark:border-gray-700/10 p-4">
                      <div className="flex items-center justify-between mb-4 sticky top-0 py-2 z-10">
                        <h3 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-300 font-bold flex items-center gap-2">
                          <span className="material-icons text-primary text-lg">
                            outbox
                          </span>
                          Landowner Connection Requests
                          <span className="bg-primary/10 dark:bg-primary/20 text-primary-dark dark:text-primary text-xs px-2 py-0.5 rounded-full ml-1 border border-primary/10 dark:border-primary/10">
                            {/* {(sentRequestsData as any[]).filter((r: any) => r.recipientType === 'landowner').length} */}
                            {
                              sentRequestsData.filter(
                                (r) => r.recipientType === "landowner",
                              ).length
                            }
                          </span>
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {sentRequestsData
                          .filter(
                            (request) => request.recipientType === "landowner",
                          )
                          .map((request) => (
                            <div
                              key={request.id}
                              onClick={() =>
                                handleSelectRequest(request as RequestData)
                              }
                              className={`bg-surface-light dark:bg-surface-card rounded-xl p-5 shadow-sm transition-all cursor-pointer ${
                                selectedRequest?.id === request.id
                                  ? "border-2 border-primary/30 dark:border-primary/20 shadow-lg"
                                  : "border border-gray-200/50 dark:border-gray-700/20 hover:border-green-500/50 dark:hover:border-green-500/30"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 text-lg font-bold border border-orange-200/50 dark:border-orange-900/10">
                                    {request.farmerInitials}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                      {request.farmerName}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {request.recipientType === "landowner"
                                        ? "Landowner"
                                        : "Farmer"}{" "}
                                      • {request.location}
                                    </p>
                                  </div>
                                </div>
                                <span
                                  style={{
                                    background: request.statusBadge.color
                                      ? `${request.statusBadge.color}20`
                                      : "#fef3c720",
                                    color:
                                      request.statusBadge.color || "#f59e0b",
                                    border: request.statusBadge.color
                                      ? `1px solid ${request.statusBadge.color}10`
                                      : "1px solid #f59e0b10",
                                  }}
                                  className="px-2.5 py-1 rounded text-xs font-semibold flex items-center"
                                >
                                  <span className="material-icons text-[14px] mr-1">
                                    {request.statusBadge.variant === "accepted"
                                      ? "check_circle"
                                      : request.statusBadge.variant ===
                                          "rejected"
                                        ? "block"
                                        : request.statusBadge.variant ===
                                            "under_review"
                                          ? "schedule"
                                          : "pending"}
                                  </span>
                                  {request.statusBadge.label}
                                </span>
                              </div>
                              <div className="mb-4">
                                {request.tags &&
                                  request.tags.length > 0 &&
                                  request.tags[0].label !== "Sent to Farmer" &&
                                  request.tags[0].label !==
                                    "Sent to Landowner" && (
                                    <div className="p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-lg border border-gray-100/50 dark:border-gray-700/10 mb-3">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="material-icons text-gray-400 text-sm">
                                          landscape
                                        </span>
                                        <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                          {request.tags[0].label}
                                        </h5>
                                      </div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                        Ref #{request.id} • Posted on{" "}
                                        {request.timestamp}
                                      </p>
                                    </div>
                                  )}
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {request.description}
                                </p>
                              </div>
                              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-border-dark">
                                <div className="text-xs text-gray-400">
                                  Sent: {request.timestamp}
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log("View Post");
                                    }}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-md transition-colors border border-gray-200 dark:border-zinc-700"
                                  >
                                    View Post
                                  </button>
                                  {request.statusBadge.variant ===
                                  "accepted" ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("Message");
                                      }}
                                      className="px-3 py-1.5 text-xs font-medium text-black bg-primary hover:bg-primary-dark rounded-md shadow-sm shadow-primary/20 transition-colors font-bold flex items-center"
                                    >
                                      <span className="material-icons text-[14px] mr-1">
                                        chat
                                      </span>{" "}
                                      Message
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("Withdraw");
                                      }}
                                      className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-md border border-red-100 dark:border-red-900/20 transition-colors"
                                    >
                                      Withdraw Request
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </section>
                  )}

                  {/* Farmer Requests Section */}
                  {sentRequestsRecipientFilter === "farmer" && (
                    <section className="bg-gray-50 dark:bg-surface-dark/30 rounded-2xl border border-transparent dark:border-gray-700/10 p-4">
                      <div className="flex items-center justify-between mb-4 sticky top-0 py-2 z-10">
                        <h3 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-300 font-bold flex items-center gap-2">
                          <span className="material-icons text-blue-500 text-lg">
                            engineering
                          </span>
                          Farmer Connection Requests
                          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full ml-1 border border-blue-200/50 dark:border-blue-900/10">
                            {
                              (sentRequestsData as RequestData[]).filter(
                                (r) => r.recipientType === "farmer",
                              ).length
                            }
                          </span>
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {(sentRequestsData as RequestData[])
                          .filter(
                            (request) => request.recipientType === "farmer",
                          )
                          .map((request) => (
                            <div
                              key={request.id}
                              onClick={() =>
                                handleSelectRequest(request as RequestData)
                              }
                              className={`bg-surface-light dark:bg-surface-card rounded-xl p-5 shadow-sm transition-all cursor-pointer ${
                                selectedRequest?.id === request.id
                                  ? "border-2 border-primary/30 dark:border-primary/20 shadow-lg"
                                  : "border border-gray-200/50 dark:border-gray-700/20 hover:border-blue-400/50 dark:hover:border-blue-500/30"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-lg font-bold border border-blue-200/50 dark:border-blue-900/10">
                                    {request.farmerInitials}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                      {request.farmerName}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {request.recipientType === "landowner"
                                        ? "Landowner"
                                        : "Farmer"}{" "}
                                      • {request.location}
                                    </p>
                                  </div>
                                </div>
                                <span
                                  style={{
                                    background: request.statusBadge.color
                                      ? `${request.statusBadge.color}20`
                                      : "#3b82f620",
                                    color:
                                      request.statusBadge.color || "#3b82f6",
                                    border: request.statusBadge.color
                                      ? `1px solid ${request.statusBadge.color}10`
                                      : "1px solid #3b82f610",
                                  }}
                                  className="px-2.5 py-1 rounded text-xs font-semibold flex items-center"
                                >
                                  <span className="material-icons text-[14px] mr-1">
                                    {request.statusBadge.variant === "accepted"
                                      ? "check_circle"
                                      : request.statusBadge.variant ===
                                          "rejected"
                                        ? "block"
                                        : request.statusBadge.variant ===
                                            "under_review"
                                          ? "schedule"
                                          : "pending"}
                                  </span>
                                  {request.statusBadge.label}
                                </span>
                              </div>
                              <div className="mb-4">
                                {request.tags &&
                                  request.tags.length > 0 &&
                                  request.tags[0].label !== "Sent to Farmer" &&
                                  request.tags[0].label !==
                                    "Sent to Landowner" && (
                                    <div className="p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-lg border border-gray-100/50 dark:border-gray-700/10 mb-3">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="material-icons text-gray-400 text-sm">
                                          work_outline
                                        </span>
                                        <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                          {request.tags[0].label}
                                        </h5>
                                      </div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                        Ref #{request.id} • Proposal Sent{" "}
                                        {request.timestamp}
                                      </p>
                                    </div>
                                  )}
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {request.description}
                                </p>
                              </div>
                              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-border-dark">
                                <div className="text-xs text-gray-400">
                                  Sent: {request.timestamp}
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log("View Job");
                                    }}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-md transition-colors border border-gray-200 dark:border-zinc-700"
                                  >
                                    View Job
                                  </button>
                                  {request.statusBadge.variant ===
                                  "accepted" ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("Message");
                                      }}
                                      className="px-3 py-1.5 text-xs font-medium text-black bg-primary hover:bg-primary-dark rounded-md shadow-sm shadow-primary/20 transition-colors font-bold flex items-center"
                                    >
                                      <span className="material-icons text-[14px] mr-1">
                                        chat
                                      </span>{" "}
                                      Message
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("Revoke");
                                      }}
                                      className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-md border border-red-100 dark:border-red-900/20 transition-colors"
                                    >
                                      Revoke Offer
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div
              style={{
                background: "linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%)",
                borderLeft: "1px solid rgba(107, 142, 35, 0.3)",
              }}
              className="w-full lg:w-[400px] xl:w-[450px] flex flex-col overflow-y-auto z-10"
            >
              {selectedRequest && activeTab === "incoming" && (
                <>
                  <ConnectionJourney
                    requestId={selectedRequest.id}
                    farmerName={selectedRequest.farmerName}
                    steps={journeySteps}
                  />
                  <QuickActions
                    actions={quickActions}
                    insight={{
                      text: selectedRequest.insight,
                    }}
                  />
                </>
              )}
              {selectedRequest && activeTab === "sent" && (
                <>
                  <ConnectionJourney
                    requestId={selectedRequest.id}
                    farmerName={selectedRequest.farmerName}
                    steps={journeySteps}
                  />
                  <QuickActions
                    actions={quickActions}
                    withdrawAction={{
                      label: "Withdraw Request",
                      onClick: () => handleQuickAction("withdraw"),
                    }}
                    insight={{
                      text: `${selectedRequest.recipientType === "landowner" ? "Landowners" : "Farmers"} in ${selectedRequest.location} typically respond within 48 hours. Ensure your investor profile is 100% complete to increase acceptance chances.`,
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestsPage;
