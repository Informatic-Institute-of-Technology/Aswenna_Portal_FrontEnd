import DashboardLayout from '@/layouts/DashboardLayout';
import { useMemo, useState } from 'react';
import {
  ConnectionJourney,
  FilterChip,
  QuickActions,
  RequestCard,
  SectionHeader,
} from '../../components/investor/requests';

type RequestStatus = 'pending' | 'approved' | 'declined';

interface LandRequest {
  request_id: string;
  ad_id: string;
  land_name: string;
  investor_info: {
    id: string;
    name: string;
    rating: number;
    is_verified: boolean;
    company: string;
  };
  financials: {
    landowner_asking_price: number;
    currency: string;
  };
  proposal_details: {
    project_type: string;
    duration: string;
    description: string;
  };
  status: RequestStatus;
  timestamp: string;
}

const requestData: { requests: LandRequest[] } = {
  requests: [
    {
      request_id: 'REQ-7721',
      ad_id: 'LAND-001',
      land_name: 'Green Valley Plantation',
      investor_info: {
        id: 'INV-552',
        name: 'Alex Sterling',
        rating: 4.9,
        is_verified: true,
        company: 'EcoHarvest Ventures',
      },
      financials: {
        landowner_asking_price: 25000.0,
        currency: 'LKR',
      },
      proposal_details: {
        project_type: 'Organic Berries',
        duration: '15 months',
        description:
          "We plan to implement high-tech drip irrigation for a sustainable strawberry farm.",
      },
      status: 'pending',
      timestamp: '2026-02-14T09:30:00Z',
    },
    {
      request_id: 'REQ-7722',
      ad_id: 'LAND-002',
      land_name: 'Green Valley Plantation',
      investor_info: {
        id: 'INV-400',
        name: 'Samantha Gunarathne',
        rating: 4.4,
        is_verified: true,
        company: 'Samantha Agro',
      },
      financials: {
        landowner_asking_price: 25000.0,
        currency: 'LKR',
      },
      proposal_details: {
        project_type: 'Green Veg',
        duration: '12 months',
        description:
          "We plan to implement high-tech drip irrigation for a sustainable green vegetables farm.",
      },
      status: 'pending',
      timestamp: '2026-02-14T09:30:00Z',
    },
    {
      request_id: 'REQ-7723',
      ad_id: 'LAND-005',
      land_name: 'Green Valley Plantation',
      investor_info: {
        id: 'INV-708',
        name: 'Dinesh Keerthirathne',
        rating: 4.0,
        is_verified: true,
        company: 'EcoHarvest Ventures',
      },
      financials: {
        landowner_asking_price: 25000.0,
        currency: 'LKR',
      },
      proposal_details: {
        project_type: 'Fruits',
        duration: '8 months',
        description:
          "We plan to implement high-tech drip irrigation for a sustainable fruits farm.",
      },
      status: 'pending',
      timestamp: '2026-02-14T09:30:00Z',
    },
  ],
};

const formatMoney = (value: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatTimestamp = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const toStatusBadge = (status: RequestStatus) => {
  switch (status) {
    case 'approved':
      return { label: 'Approved', variant: 'accepted' as const, color: '#10b981' };
    case 'declined':
      return { label: 'Declined', variant: 'rejected' as const, color: '#ef4444' };
    case 'pending':
    default:
      return { label: 'Pending Review', variant: 'pending_response' as const, color: '#f59e0b' };
  }
};

const ReceivedRequestsPage = () => {
  const [requests, setRequests] = useState<LandRequest[]>(requestData.requests);
  const [selectedRequest, setSelectedRequest] = useState<LandRequest | null>(null);

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === 'pending'),
    [requests],
  );

  const selectedCurrency = selectedRequest?.financials.currency ?? 'LKR';

  const handleStatusChange = (requestId: string, newStatus: RequestStatus) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.request_id === requestId
          ? { ...request, status: newStatus }
          : request,
      ),
    );

    if (selectedRequest?.request_id === requestId) {
      if (newStatus === 'pending') {
        setSelectedRequest({ ...selectedRequest, status: newStatus });
      } else {
        setSelectedRequest(null);
      }
    }
  };

  const handleSelectRequest = (request: LandRequest) => {
    setSelectedRequest(request);
  };

  const handleQuickAction = (action: string) => {
    console.log(`Landowner quick action: ${action}`);
  };

  const journeySteps = selectedRequest
    ? [
        {
          title: 'Request Received',
          description: `Proposal submitted by ${selectedRequest.investor_info.name}`,
          timestamp: formatTimestamp(selectedRequest.timestamp),
          status: 'completed' as const,
          icon: 'check',
        },
        {
          title: 'Review Proposal',
          description: `${selectedRequest.proposal_details.project_type} • ${selectedRequest.proposal_details.duration}`,
          status: 'active' as const,
          icon: 'visibility',
        },
        {
          title: 'Decision',
          description: 'Approve or decline this incoming request',
          status: 'pending' as const,
          icon: '3',
        },
      ]
    : [];

  const quickActions = selectedRequest
    ? [
        {
          icon: 'chat',
          label: 'Message Investor',
          onClick: () => handleQuickAction('message-investor'),
        },
        {
          icon: 'description',
          label: 'View Ad',
          onClick: () => handleQuickAction('view-ad'),
        },
        {
          icon: 'check_circle',
          label: 'Approve',
          color: '#22c55e',
          onClick: () => handleStatusChange(selectedRequest.request_id, 'approved'),
        },
        {
          icon: 'cancel',
          label: 'Decline',
          color: '#ef4444',
          onClick: () => handleStatusChange(selectedRequest.request_id, 'declined'),
        },
      ]
    : [];

  return (
    <DashboardLayout>
      <div
        style={{ background: 'linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%)' }}
        className="text-gray-300 font-sans h-full flex flex-col overflow-hidden transition-colors duration-200"
      >
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-8 py-6 pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Received Requests</h2>
                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-[#f59e0b] mr-1">{pendingRequests.length} Pending</span>
                  <span>• Incoming investor proposals for your land ads.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm font-semibold text-gray-200">Incoming Requests Only</div>
              <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
                <FilterChip icon="priority_high" label="Pending" variant="urgent" />
                <FilterChip icon="attach_money" label="High-Value" variant="high-value" />
                <FilterChip icon="verified" label="Verified" variant="verified" />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
            <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-8">
              <section
                style={{
                  background: 'linear-gradient(145deg, rgba(42, 42, 42, 0.6) 0%, rgba(31, 31, 31, 0.6) 100%)',
                  border: '1px solid rgba(107, 142, 35, 0.2)',
                }}
                className="rounded-2xl p-4"
              >
                <SectionHeader
                  title="Incoming Investor Requests"
                  icon="inbox"
                  badge={{ label: String(pendingRequests.length), variant: 'primary' }}
                  withGradientBar
                />

                {pendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div
                        key={request.request_id}
                        onClick={() => handleSelectRequest(request)}
                        className="cursor-pointer"
                      >
                        <RequestCard
                          type="landowner-request"
                          name={request.investor_info.name}
                          avatarInitials={getInitials(request.investor_info.name)}
                          location={request.land_name}
                          isVerified={request.investor_info.is_verified}
                          statusBadge={toStatusBadge(request.status)}
                          tags={[
                            {
                              label: request.investor_info.company,
                              variant: 'primary',
                            },
                            {
                              label: `${formatMoney(request.financials.landowner_asking_price, request.financials.currency)} asking`,
                              variant: 'secondary',
                            },
                          ]}
                          description={request.proposal_details.description}
                          timestamp={formatTimestamp(request.timestamp)}
                          primaryAction={{
                            label: 'Review Request',
                            icon: 'visibility',
                            onClick: () => handleSelectRequest(request),
                          }}
                          isSelected={selectedRequest?.request_id === request.request_id}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      background: 'rgba(42, 42, 42, 0.4)',
                      border: '1px dashed rgba(107, 142, 35, 0.35)',
                    }}
                    className="rounded-xl p-8 text-center"
                  >
                    <p className="text-lg font-semibold text-gray-200">No Pending Proposals</p>
                    <p className="text-sm text-gray-400 mt-1">New investor requests will appear here.</p>
                  </div>
                )}
              </section>
            </div>

            <div
              style={{
                background: 'linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%)',
                borderLeft: '1px solid rgba(107, 142, 35, 0.3)',
              }}
              className="w-full lg:w-[400px] xl:w-[450px] flex flex-col overflow-y-auto z-10"
            >
              {selectedRequest ? (
                <>
                  <ConnectionJourney
                    requestId={selectedRequest.request_id}
                    farmerName={selectedRequest.investor_info.name}
                    steps={journeySteps}
                  />
                  <QuickActions
                    actions={quickActions}
                    insight={{
                      text: `${selectedRequest.investor_info.company} has a ${selectedRequest.investor_info.rating.toFixed(1)}/5 rating. Asking price is ${formatMoney(selectedRequest.financials.landowner_asking_price, selectedCurrency)} for ${selectedRequest.proposal_details.duration}.`,
                    }}
                  />
                </>
              ) : (
                <div className="p-6">
                  <div
                    style={{
                      background: 'rgba(107, 142, 35, 0.08)',
                      border: '1px solid rgba(107, 142, 35, 0.25)',
                    }}
                    className="rounded-xl p-5"
                  >
                    <h4 className="text-base font-semibold text-gray-100 mb-2">Select a Request</h4>
                    <p className="text-sm text-gray-400">
                      Choose an incoming request to view its journey and actions.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReceivedRequestsPage;
