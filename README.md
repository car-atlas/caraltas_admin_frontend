# CarAtlas Admin Frontend

Admin portal for managing agencies and platform.

## Port
Runs on port **3277**

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3377
```

3. Run development server:
```bash
npm run dev
```

## Features

- Agency approval workflow
- Platform analytics
- Agency management

## API Endpoints

- `/admin/agencies/pending` - Get pending agencies
- `/admin/agencies/all` - Get all agencies
- `/admin/agencies/:id/approve` - Approve agency
- `/admin/agencies/:id/reject` - Reject agency
- `/admin/agencies/:id/activate` - Activate agency
- `/admin/agencies/:id/deactivate` - Deactivate agency
