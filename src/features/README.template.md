# README Template for Features

When creating a new feature, copy this template to the feature's directory as `README.md`.

---

# [Feature Name] Feature

## Overview
Brief description of what this feature does.

## Structure
```
[feature-name]/
├── components/     # Feature-specific components
├── hooks/          # Feature-specific hooks
├── services/       # API calls and business logic
├── types/          # TypeScript types
└── index.ts        # Public API
```

## Components
- **ComponentName**: Description

## Hooks
- **useHookName**: Description

## Usage Example
```typescript
import { ComponentName, useHookName } from '@/features/[feature-name]'

function MyPage() {
  const { data } = useHookName()
  
  return <ComponentName data={data} />
}
```

## Dependencies
List any external dependencies or other features this depends on.

## API Endpoints
- `GET /api/endpoint` - Description
- `POST /api/endpoint` - Description
