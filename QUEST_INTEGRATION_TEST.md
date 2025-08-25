# Quest Page Integration Test Guide

This document provides instructions for testing the frontend-backend integration for the quest page.

## Integration Overview

The quest page has been successfully integrated with the backend APIs:

### ✅ Completed Integration Features

1. **API Service Layer** - Complete service layer with TypeScript interfaces
2. **Quest Data Integration** - Dynamic quest loading from `/quests` API
3. **Quest Progress Tracking** - Real-time progress from `/quests/progress` API  
4. **DeFi Portfolio Integration** - Portfolio data from `/quests/defi/portfolio` API
5. **Transaction Preparation** - DeFi transaction prep via `/quests/defi/prepare-transaction` API
6. **Gas Delegation** - Transaction execution via `/blockchain/gas-delegation/delegate` API
7. **Authentication** - JWT-based authentication with mock login for development
8. **Error Handling** - Comprehensive error handling and loading states

### 🔧 API Service Architecture

```
/src/services/
├── config.ts              # API configuration and auth headers
├── types.ts               # TypeScript interfaces
├── questService.ts        # General quest operations
├── defiQuestService.ts    # DeFi-specific quest operations  
├── gasDelegationService.ts # Gas delegation and transactions
├── authService.ts         # Authentication management
└── index.ts               # Exports and service aggregation
```

### 🎯 Key Integration Points

- **Frontend Quest Page**: `/src/app/quest/page.tsx`
- **Backend Quest Controllers**: 
  - `/backend/src/quests/quests.controller.ts`
  - `/backend/src/quests/controllers/defi-quest.controller.ts`  
  - `/backend/src/blockchain/gas-delegation.controller.ts`

## Testing Instructions

### Prerequisites

1. **Backend Setup**:
   ```bash
   cd /Users/yhl/Desktop/kaia/backend
   pnpm install
   pnpm run start:dev  # Runs on http://localhost:3000
   ```

2. **Frontend Setup**:
   ```bash
   cd /Users/yhl/Desktop/kaia/fe  
   npm install
   npm run dev         # Runs on http://localhost:3000 (or 3001 if backend is on 3000)
   ```

### Test Scenarios

#### 1. Authentication Test
- ✅ Page should auto-login with mock authentication
- ✅ Check browser localStorage for `authToken` and `authUser`
- ✅ API calls should include `Authorization: Bearer <token>` headers

#### 2. Quest Loading Test
- ✅ Visit `/quest` page
- ✅ Should show loading state initially
- ✅ Should display quests from API (or "no quests available" if empty)
- ✅ Quest tabs (daily/weekly/special/legendary) should filter dynamically

#### 3. DeFi Portfolio Test  
- ✅ Portfolio section should show loading spinner initially
- ✅ Should display portfolio data from `/quests/defi/portfolio` API
- ✅ Portfolio values should be formatted correctly ($0 if no data)

#### 4. Quest Interaction Test
- ✅ Click "시작하기" on available quest → should call `/quests/{id}/start`
- ✅ Click "보상 수령" on completed quest → should call `/quests/{id}/claim`
- ✅ Loading states should be shown during API calls
- ✅ Success/error messages should be displayed

#### 5. DeFi Integration Test
- ✅ Click DeFi portfolio buttons (스테이킹/LP/렌딩) → should open DeFi modal
- ✅ Click "참여하기" in modal → should call `/quests/defi/prepare-transaction`
- ✅ Should show transaction preparation success/error messages
- ✅ Loading spinner should show during transaction preparation

#### 6. Error Handling Test
- 🔧 Stop backend server → should show connection error
- 🔧 Invalid token → should handle authentication errors
- 🔧 Network issues → should display appropriate error messages

### Network Debug

Check browser DevTools Network tab for API calls:

```
Expected API Calls:
- GET /api/v1/quests                     # Get available quests
- GET /api/v1/quests/progress            # Get quest progress  
- GET /api/v1/quests/defi/portfolio      # Get DeFi portfolio
- POST /api/v1/quests/{id}/start         # Start quest
- POST /api/v1/quests/{id}/claim         # Claim reward
- POST /api/v1/quests/defi/prepare-transaction  # Prepare DeFi transaction
```

### Configuration

API base URL is configured in `/src/services/config.ts`:
```typescript
BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'
```

## Known Limitations

1. **Mock Authentication**: Using mock JWT tokens for development
2. **Transaction Signing**: DeFi transactions show prep success but don't execute wallet signing
3. **Database**: Backend needs database setup for persistent quest data
4. **CORS**: Backend configured for `http://localhost:3000` origin

## Next Steps

1. **Real Authentication**: Integrate with wallet providers (MetaMask, WalletConnect)
2. **Transaction Execution**: Complete wallet signing and gas delegation flow
3. **Database Setup**: Configure PostgreSQL/MySQL for quest persistence
4. **Error Recovery**: Add retry mechanisms for failed API calls
5. **Real-time Updates**: WebSocket integration for live quest progress

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for frontend URL
2. **401 Unauthorized**: Check if mock authentication is working
3. **404 Not Found**: Verify API endpoint paths match backend routes
4. **Network Errors**: Confirm both backend and frontend are running

### Debug Tips

1. Check browser console for error messages
2. Verify API calls in Network tab
3. Check backend logs for request processing
4. Ensure JWT token is being sent with requests