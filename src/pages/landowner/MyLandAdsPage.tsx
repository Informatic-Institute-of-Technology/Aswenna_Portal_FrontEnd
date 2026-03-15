import DashboardLayout from '@/layouts/DashboardLayout';
import { useMemo, useState } from 'react';
import { FilterChip, SectionHeader } from '../../components/investor/requests';
import CreateAdPopup from '../../components/landowner/CreateAdPopup';

interface LandAd {
  id: number;
  location: string;
  landArea: string;
  soilType: string;
  rentalAmount: string;
  availablePeriod: string;
  image: string;
  status: 'open' | 'allocated' | 'expired';
  projectName?: string;
}

const getStatusConfig = (status: LandAd['status']) => {
  const statusConfig: Record<
    LandAd['status'],
    { label: string; color: string; actionLabel: string; cardOpacity?: number }
  > = {
    allocated: {
      label: 'Allocated to Active Project',
      color: '#94a3b8',
      actionLabel: 'Allocated',
      cardOpacity: 0.78,
    },
    open: {
      label: 'Open for New Projects',
      color: '#22c55e',
      actionLabel: 'Edit Details',
    },
    expired: {
      label: 'Project Completed',
      color: '#f59e0b',
      actionLabel: 'Create New Season',
    },
  };

  return statusConfig[status];
};

const MyLandAdsPage = () => {
  const [open, setOpen] = useState(false);
  const [landAds] = useState<LandAd[]>([
    {
      id: 1,
      location: 'North Valley Farm',
      landArea: '25 acres',
      soilType: 'Loamy',
      rentalAmount: 'LKR 50,000',
      availablePeriod: 'Mar 2026 - Dec 2026',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500',
      status: 'open',
    },
    {
      id: 2,
      location: 'Sunrise Fields',
      landArea: '15 acres',
      soilType: 'Clay',
      rentalAmount: 'LKR 35,000',
      availablePeriod: 'Apr 2026 - Nov 2026',
      image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=500',
      status: 'allocated',
      projectName: 'Organic Wheat Cultivation',
    },
    {
      id: 3,
      location: 'Green Meadows',
      landArea: '30 acres',
      soilType: 'Sandy',
      rentalAmount: 'LKR 45,000',
      availablePeriod: 'Jan 2026 - Aug 2026',
      image: 'https://images.unsplash.com/photo-1464226180484-05a7a0c82715?w=500',
      status: 'expired',
      projectName: 'Rice Cultivation',
    },
  ]);

  const openAdsCount = useMemo(
    () => landAds.filter((ad) => ad.status === 'open').length,
    [landAds],
  );

  const allocatedAdsCount = useMemo(
    () => landAds.filter((ad) => ad.status === 'allocated').length,
    [landAds],
  );

  const expiredAdsCount = useMemo(
    () => landAds.filter((ad) => ad.status === 'expired').length,
    [landAds],
  );

  const handleEdit = (adId: number) => {
    console.log('Edit ad:', adId);
  };

  const handleCreateNewSeason = (adId: number) => {
    console.log('Start new season from expired ad:', adId);
  };

  const handleViewDetails = (adId: number) => {
    console.log('View details:', adId);
  };

  return (
    <DashboardLayout showTopBar={false}>
      <div
        style={{ background: 'linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%)' }}
        className="text-gray-300 font-sans h-full flex flex-col overflow-hidden transition-colors duration-200"
      >
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-8 py-6 pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Land Ads</h2>
                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-[#f59e0b] mr-1">{landAds.length} Active Records</span>
                  <span>• Manage location, pricing, season availability, and reuse.</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, #6B8E23 0%, #8FA887 100%)',
                    boxShadow: '0 4px 12px rgba(184, 243, 67, 0.3)',
                  }}
                  className="flex items-center px-4 py-2 text-white text-sm font-bold rounded-lg shadow transition-all hover:opacity-90"
                >
                  <span className="material-icons-outlined text-lg mr-2">add</span>
                  Create New Land Ad
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm font-semibold text-gray-200">Land Portfolio Overview</div>
              <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
                <FilterChip icon="verified" label={`Open ${openAdsCount}`} variant="verified" />
                <FilterChip icon="attach_money" label={`Allocated ${allocatedAdsCount}`} variant="high-value" />
                <FilterChip icon="priority_high" label={`Expired ${expiredAdsCount}`} variant="urgent" />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-2">
            <section
              style={{
                background: 'linear-gradient(145deg, rgba(42, 42, 42, 0.6) 0%, rgba(31, 31, 31, 0.6) 100%)',
                border: '1px solid rgba(107, 142, 35, 0.2)',
              }}
              className="rounded-2xl p-4"
            >
              <SectionHeader
                title="Land Advertisement Cards"
                icon="landscape"
                badge={{ label: String(landAds.length), variant: 'primary' }}
                withGradientBar
              />

              {landAds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {landAds.map((ad) => {
                    const isOpen = ad.status === 'open';
                    const isAllocated = ad.status === 'allocated';
                    const isExpired = ad.status === 'expired';
                    const statusConfig = getStatusConfig(ad.status);

                    return (
                      <div
                        key={ad.id}
                        style={{
                          background: 'linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%)',
                          border: '1px solid rgba(107, 142, 35, 0.2)',
                          opacity: statusConfig.cardOpacity ?? 1,
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        className="rounded-xl overflow-hidden shadow-lg"
                        onMouseEnter={(event) => {
                          if (isAllocated) {
                            return;
                          }

                          event.currentTarget.style.transform = 'translateY(-4px)';
                          event.currentTarget.style.borderColor = 'rgba(107, 142, 35, 0.5)';
                        }}
                        onMouseLeave={(event) => {
                          if (isAllocated) {
                            return;
                          }

                          event.currentTarget.style.transform = 'translateY(0)';
                          event.currentTarget.style.borderColor = 'rgba(107, 142, 35, 0.2)';
                        }}
                      >
                        <div className="relative h-44 overflow-hidden">
                          <img
                            alt={ad.location}
                            className="w-full h-full object-cover opacity-70"
                            src={ad.image}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                          <div className="absolute top-3 left-3">
                            <span
                              style={{
                                background: `${statusConfig.color}20`,
                                color: statusConfig.color,
                                border: `1px solid ${statusConfig.color}40`,
                              }}
                              className="px-2.5 py-1 rounded text-xs font-semibold backdrop-blur-sm"
                            >
                              {statusConfig.label}
                            </span>
                          </div>
                          <div className="absolute right-3 bottom-3">
                            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-black/60 text-white border border-white/10 backdrop-blur-sm">
                              {ad.rentalAmount} / season
                            </span>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                              <h4 className="text-base font-bold text-gray-100">{ad.location}</h4>
                              <p className="text-xs text-gray-400 mt-1">Available {ad.availablePeriod}</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded border border-gray-700 text-gray-300 bg-zinc-900/60">
                              {ad.landArea}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            <span
                              style={{
                                background: 'rgba(107, 142, 35, 0.15)',
                                color: '#8FA887',
                                border: '1px solid rgba(107, 142, 35, 0.3)',
                              }}
                              className="text-xs px-2 py-1 rounded font-medium"
                            >
                              Soil: {ad.soilType}
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-border-dark">
                              Season: {ad.availablePeriod}
                            </span>
                          </div>

                          {(isAllocated || isExpired) && ad.projectName && (
                            <div className="mb-4 p-3 rounded-lg bg-zinc-900/50 border border-gray-700/20">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="material-icons text-gray-400 text-sm">folder</span>
                                <h5 className="text-sm font-medium text-gray-200">Linked Project</h5>
                              </div>
                              <p className="text-xs text-gray-400">{ad.projectName}</p>
                            </div>
                          )}

                          {isExpired && (
                            <p className="text-xs text-gray-500 mb-4">
                              This ad remains visible for reference and can be reused for a new season.
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-border-dark gap-2">
                            {isAllocated ? (
                              <button
                                disabled
                                className="flex-1 px-3 py-2 text-xs font-medium text-gray-500 bg-zinc-900 rounded-md border border-gray-700 cursor-not-allowed"
                              >
                                {statusConfig.actionLabel}
                              </button>
                            ) : (
                              <button
                                onClick={() => (isOpen ? handleEdit(ad.id) : handleCreateNewSeason(ad.id))}
                                style={{
                                  background: 'linear-gradient(135deg, #6B8E23 0%, #8FA887 100%)',
                                  boxShadow: '0 2px 8px rgba(107, 142, 35, 0.3)',
                                }}
                                className="flex-1 px-3 py-2 text-xs font-bold text-white rounded-md transition-colors flex items-center justify-center hover:opacity-90"
                              >
                                <span className="material-icons text-[16px] mr-2">
                                  {isOpen ? 'edit' : 'refresh'}
                                </span>
                                {statusConfig.actionLabel}
                              </button>
                            )}

                            <button
                              onClick={() => handleViewDetails(ad.id)}
                              className="px-3 py-2 text-xs font-medium text-gray-300 bg-zinc-900 hover:bg-zinc-800 rounded-md transition-colors border border-gray-700 flex items-center justify-center"
                            >
                              <span className="material-icons text-[16px] mr-2">visibility</span>
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  style={{
                    background: 'rgba(42, 42, 42, 0.4)',
                    border: '1px dashed rgba(107, 142, 35, 0.35)',
                  }}
                  className="rounded-xl p-8 text-center"
                >
                  <span className="material-icons text-4xl text-gray-500">landscape</span>
                  <p className="text-lg font-semibold text-gray-200 mt-3">No Land Ads Yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Create your first land ad to start connecting with investors.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <CreateAdPopup open={open} onClose={() => setOpen(false)} />
    </DashboardLayout>
  );
};

export default MyLandAdsPage;
