interface Step {
  title: string;
  description: string;
  timestamp?: string;
  status: "completed" | "active" | "pending";
  icon?: string;
  uploadArea?: {
    text: string;
    onUpload: () => void;
  };
}

interface ConnectionJourneyProps {
  requestId: string;
  farmerName: string;
  steps: Step[];
}

const ConnectionJourney = ({ farmerName, steps }: ConnectionJourneyProps) => {
  return (
    <div
      style={{
        background: "transparent",
      }}
      className="p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Connection Journey
        </h3>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <span className="material-icons-outlined">info</span>
        </button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Tracking connection with{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          {farmerName}
        </span>
      </p>
      <div className="relative pl-2">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <div
              key={index}
              className={`step-item relative flex gap-4 ${!isLast ? "pb-8" : ""}`}
            >
              {!isLast && (
                <div className="absolute left-4 top-8 bottom-0 w-[2px] -ml-[1px] bg-white/10"></div>
              )}

              <div
                style={
                  step.status === "completed" && step.icon === "close"
                    ? {
                        background: "#f87171",
                        border: "2px solid rgba(248,113,113,0.3)",
                      }
                    : step.status === "completed"
                      ? {
                          background: "#4ade80",
                          border: "2px solid rgba(74,222,128,0.3)",
                        }
                      : step.status === "active"
                        ? {
                            background: "#fbbf24",
                            border: "2px solid rgba(251,191,36,0.3)",
                          }
                        : {
                            background: "rgba(255,255,255,0.05)",
                            border: "2px solid rgba(255,255,255,0.1)",
                          }
                }
                className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow ${
                  step.status === "active" ? "animate-pulse" : ""
                }`}
              >
                {step.status === "completed" &&
                  (!step.icon || step.icon === "check") && (
                    <span className="material-icons text-white text-sm">
                      check
                    </span>
                  )}
                {step.status === "completed" && step.icon === "visibility" && (
                  <span className="material-icons text-white text-sm">
                    visibility
                  </span>
                )}
                {step.status === "completed" && step.icon === "close" && (
                  <span className="material-icons text-white text-sm">
                    close
                  </span>
                )}
                {step.status === "active" && step.icon && (
                  <span className="material-icons text-black text-sm">
                    {step.icon}
                  </span>
                )}
                {step.status === "pending" && step.icon && (
                  <span className="text-gray-500 text-xs font-bold">
                    {step.icon}
                  </span>
                )}
              </div>

              <div className={step.uploadArea ? "flex-1" : ""}>
                <h4
                  className={`text-sm font-semibold ${
                    step.status === "pending"
                      ? "text-gray-400 dark:text-gray-500"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {step.title}
                </h4>
                <p
                  className={`text-xs mt-0.5 ${
                    step.status === "pending"
                      ? "text-gray-400 dark:text-gray-600"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step.description}
                </p>
                {step.timestamp && (
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {step.timestamp}
                  </span>
                )}
                {step.status === "active" && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-500 mt-1">
                    In Progress
                  </span>
                )}

                {step.uploadArea && (
                  <div
                    style={{
                      background: "var(--bg-subtle)",
                      border: "2px dashed var(--color-olive-glow)",
                      transition: "all 0.3s ease",
                    }}
                    className="mt-3 p-3 rounded-lg text-center cursor-pointer"
                    onClick={step.uploadArea.onUpload}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor =
                        "var(--color-olive-glow)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor =
                        "var(--color-olive-glow)")
                    }
                  >
                    <span className="material-icons text-gray-400 text-2xl mb-1">
                      cloud_upload
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {step.uploadArea.text}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectionJourney;
