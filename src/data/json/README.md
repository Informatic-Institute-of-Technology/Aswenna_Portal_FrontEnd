# Mock Data Organization Structure

## Overview
All mock data has been centralized in JSON files located in `src/data/json/` folder. Each TypeScript file imports and types the data appropriately.

## JSON Data Files

### 1. comprehensiveProjects.json
**Location:** `src/data/json/comprehensiveProjects.json`
**Contains:** 2 comprehensive agricultural projects with full details
- Premium Rice Cultivation (PRJ-156)
- Organic Vegetable Farm (PRJ-178)

**Data Structure:**
- Project info (id, projectId, projectName, cropType, location, etc.)
- Financial details (budget, disbursed, remaining, expectedROI)
- 8 Milestones with progress tracking
- 8 Payment installments with status
- 7 Financial breakdown categories
- 3 Party members (Farmer, Investor, Landowner) with full profiles

**Imported by:**
- `src/data/mockProjectData.ts` (re-exports as comprehensiveProject & comprehensiveVegetableProject)
- `src/pages/investor/MyOffersPage.tsx` (via mockProjectData.ts)

---

### 2. directHarvestOffers.json
**Location:** `src/data/json/directHarvestOffers.json`
**Contains:** 2 direct harvest order offers
- Tomato Purchase for Sauce Production (dh-1)
- Bulk Rice Purchase for Export (dh-2)

**Data Structure:**
- Offer details (offerType, investorName, cropType, quantity, price)
- Delivery requirements (deadline, location)
- Selected farmer details
- Payment installments
- Application count and status

**Imported by:**
- `src/pages/investor/MyOffersPageNew.tsx` (as mockDirectHarvestOffers)

---

### 3. sponsorshipOffers.json
**Location:** `src/data/json/sponsorshipOffers.json`
**Contains:** 2 sponsorship investment offers
- Organic Farming Sponsorship 2026 (sp-1)
- Tea Plantation Investment Program (sp-2)

**Data Structure:**
- Sponsorship details (title, cropTypes, commission rate, investment range)
- Support type (capital, expertise, equipment, marketing)
- Project duration preferences
- Selected farmer and landowner details
- Expected harvest value and commission
- Payment installments

**Imported by:**
- `src/pages/investor/MyOffersPageNew.tsx` (as mockSponsorshipOffers)

---

### 4. completedOffers.json
**Location:** `src/data/json/completedOffers.json`
**Contains:** 1 completed offer
- Rice Purchase Completed Dec 2025 (dh-comp-1)

**Data Structure:**
- Completed offer details
- Final payment status (all paid)
- Completion timestamp

**Imported by:**
- `src/pages/investor/MyOffersPageNew.tsx` (as mockCompletedOffers)

---

### 5. farmerProjects.json
**Location:** `src/data/json/farmerProjects.json`
**Contains:** 6 calendar timeline projects
- Paddy field - Project A
- Vegetable Cultivation - B
- Organic Farming - C
- Fruit Plantation - D
- Herb Cultivation - E
- Flower Farming - F

**Data Structure:**
- Project id, name
- Start and end dates
- Color coding for calendar display

**Imported by:**
- `src/pages/dashboards/FarmerDashboard.tsx` (as mockProjects)

---

### 6. pendingProjects.json
**Location:** `src/data/json/pendingProjects.json`
**Contains:** 1 pending project
- Tea Plantation Investment (PRJ-201)

**Data Structure:**
- Basic project info (id, projectId, projectName, cropType)
- Location and financial details
- Status: pending (not yet started)
- Milestone count

**Imported by:**
- `src/pages/investor/MyOffersPage.tsx` (as pendingProjects)

---

### 7. pastProjects.json
**Location:** `src/data/json/pastProjects.json`
**Contains:** 2 completed projects
- Coconut Plantation (PRJ-133)
- Spice Garden (PRJ-089)

**Data Structure:**
- Completed project details
- 100% progress
- Full budget disbursed
- All milestones completed
- Status: completed

**Imported by:**
- `src/pages/investor/MyOffersPage.tsx` (as pastProjects)

---

## Import Patterns

### Pattern 1: Direct Import with Type Casting
```typescript
import projectsData from '../../data/json/comprehensiveProjects.json';
const projects: ProjectType[] = projectsData as ProjectType[];
```

### Pattern 2: Import via Re-export Module
```typescript
// In mockProjectData.ts
import comprehensiveProjectsData from './json/comprehensiveProjects.json';
const [project1, project2] = comprehensiveProjectsData as OfferCardProps[];
export const comprehensiveProject = project1;

// In component
import { comprehensiveProject } from '../../data/mockProjectData';
```

---

## TypeScript Configuration
**File:** `tsconfig.app.json`

Added JSON module resolution:
```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    ...
  }
}
```

This enables importing `.json` files directly in TypeScript.

---

## File Mapping

### Components/Pages → JSON Files

| Component/Page | JSON Files Used |
|----------------|-----------------|
| `src/data/mockProjectData.ts` | `comprehensiveProjects.json` |
| `src/pages/investor/MyOffersPage.tsx` | `comprehensiveProjects.json`, `pendingProjects.json`, `pastProjects.json` |
| `src/pages/investor/MyOffersPageNew.tsx` | `directHarvestOffers.json`, `sponsorshipOffers.json`, `completedOffers.json` |
| `src/pages/dashboards/FarmerDashboard.tsx` | `farmerProjects.json` |

---

## Benefits of This Structure

1. **Centralized Data Management**: All mock data in one folder
2. **Easy Maintenance**: Update JSON files without touching component logic
3. **Type Safety**: TypeScript interfaces ensure data integrity
4. **Reusability**: Same data can be imported in multiple components
5. **Separation of Concerns**: Data separated from business logic
6. **Easy Testing**: JSON files can be easily replaced for testing
7. **Backend Readiness**: JSON structure matches typical API responses

---

## Future Enhancements

When integrating with backend API:

1. Replace JSON imports with API calls:
```typescript
// Before
import projectsData from '../../data/json/comprehensiveProjects.json';

// After
import { fetchProjects } from '@/services/project.service';
const projectsData = await fetchProjects();
```

2. Keep JSON files for:
   - Development/testing
   - Offline mode
   - Storybook stories
   - Unit tests

---

## Folder Structure
```
src/
├── data/
│   ├── json/
│   │   ├── comprehensiveProjects.json
│   │   ├── directHarvestOffers.json
│   │   ├── sponsorshipOffers.json
│   │   ├── completedOffers.json
│   │   ├── farmerProjects.json
│   │   ├── pendingProjects.json
│   │   └── pastProjects.json
│   └── mockProjectData.ts (re-export module)
├── pages/
│   ├── dashboards/
│   │   └── FarmerDashboard.tsx
│   └── investor/
│       ├── MyOffersPage.tsx
│       └── MyOffersPageNew.tsx
└── ...
```

---

## Summary

✅ **7 JSON files** created with comprehensive mock data
✅ **4 TypeScript files** updated to import from JSON
✅ **Type safety** maintained with proper interfaces
✅ **Zero duplication** of data across files
✅ **Easy to extend** - add new JSON files as needed
✅ **Backend-ready** structure for easy API integration

All mock data is now centralized, organized, and easily maintainable!
