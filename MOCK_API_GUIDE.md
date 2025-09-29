# Mock API System Guide

This guide explains how the mock API system works in your NexTash store frontend while your backend is still in development.

## What's Been Set Up

### 1. Mock API Service (`src/utils/mockApi.js`)
- **Complete mock backend** that simulates your real API
- **Realistic delays** to mimic network requests
- **Mock data storage** in memory for user sessions
- **All major API endpoints** covered:
  - Authentication (login, signup, logout, password reset)
  - Products (fetch, search)
  - Cart (add, update, remove)
  - Orders (create, fetch, track)
  - Profile management
  - Contact form

### 2. Enhanced API Request Handler (`src/utils/api.js`)
- **Automatic fallback** to mock API when real API fails
- **Graceful error handling** with user-friendly messages
- **Transparent switching** between real and mock APIs

### 3. Error Handler (`src/utils/errorHandler.js`)
- **User-friendly error messages** instead of technical errors
- **Automatic retry** for network-related issues
- **Development mode notifications** when using mock data
- **Context-specific error handling** for different features

### 4. Updated Stores
- **Auth store** now uses mock API with proper token management
- **Orders store** includes API methods for creating and fetching orders
- **Products store** already had mock data, now properly integrated
- **Cart store** already working with localStorage

## How It Works

### Real API Available
```javascript
// If your backend is running, requests go directly to real API
const response = await apiRequest('/api/method/auth.login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
})
```

### Real API Not Available
```javascript
// If backend fails, automatically falls back to mock API
// User sees: "Backend API is not available yet. Using mock data for development."
// App continues working normally with mock responses
```

## Current Mock Data

### Users
- `john@example.com` / any password
- `jane@example.com` / any password

### Orders
- Sample orders with different statuses
- Realistic tracking numbers and dates

### Products
- Complete product catalog from your products store
- All variations and pricing included

## How to Use

### 1. Testing Authentication
```javascript
// In your components, use the auth store normally:
const authStore = useAuthStore()

// This will work whether backend is ready or not
const result = await authStore.login({
  email: 'john@example.com',
  password: 'anypassword'
})
```

### 2. Testing Orders
```javascript
// In your checkout flow:
const orderStore = useOrderStore()

const result = await orderStore.submitOrder({
  items: [...],
  total: 99.99,
  // ... other order data
})
// Order gets created in mock system with realistic response
```

### 3. Testing Error Scenarios
You can test different error scenarios:
- Try invalid email formats
- Use non-existent user emails
- Test network timeouts (mock API simulates these)

## Development Features

### 1. Console Warnings
When mock API is used, you'll see helpful warnings:
```
Real API failed, using mock API: NetworkError
Mock API active: Login successful
```

### 2. Toast Notifications
Users see friendly messages:
- "Backend API is not available yet. Using mock data for development."
- "Running in development mode with mock API responses."

### 3. Realistic Delays
Mock API includes realistic delays:
- Login: 1 second
- Signup: 1.5 seconds
- Order creation: 2 seconds

## When Your Backend is Ready

### Easy Transition
1. **No code changes needed** in your components
2. **Same store methods** will automatically use real API
3. **Error handling** continues to work
4. **Just start your backend server** and everything switches over

### Testing the Switch
```bash
# Start your backend server
npm run backend

# Frontend automatically detects and uses real API
# Mock API becomes fallback only if real API fails
```

## Available Mock API Methods

### Authentication
- `mockApi.auth.login(credentials)`
- `mockApi.auth.signup(userData)`
- `mockApi.auth.logout()`
- `mockApi.auth.checkAuth()`
- `mockApi.auth.forgotPassword(email)`
- `mockApi.auth.resetPassword(token, password)`

### Products
- `mockApi.products.getAll()`
- `mockApi.products.getByName(name)`
- `mockApi.products.search(query)`

### Cart
- `mockApi.cart.get()`
- `mockApi.cart.add(productData)`
- `mockApi.cart.update(itemId, quantity)`
- `mockApi.cart.remove(itemId)`
- `mockApi.cart.clear()`

### Orders
- `mockApi.orders.create(orderData)`
- `mockApi.orders.getAll()`
- `mockApi.orders.getById(orderId)`
- `mockApi.orders.track(trackingNumber)`

### Profile
- `mockApi.profile.get()`
- `mockApi.profile.update(profileData)`

### Contact
- `mockApi.contact.submit(contactData)`

## Error Handling Examples

### Network Errors
```javascript
// User sees: "Check your internet connection and try again"
// Automatic retry attempted
```

### Validation Errors
```javascript
// User sees: "Please enter a valid email address"
// Specific, actionable error message
```

### Business Logic Errors
```javascript
// User sees: "An account with this email already exists"
// Clear explanation of what went wrong
```

## Best Practices

### 1. Always Use Store Methods
```javascript
// ✅ Good - uses store with built-in error handling
const authStore = useAuthStore()
await authStore.login(credentials)

// ❌ Avoid - direct API calls bypass error handling
await apiRequest('/api/auth/login', options)
```

### 2. Handle Loading States
```javascript
// All stores have loading states
const { loading } = authStore
const { loading: ordersLoading } = orderStore
```

### 3. Check Return Values
```javascript
const result = await authStore.login(credentials)
if (result.success) {
  // Handle success
} else {
  // Error already shown to user via toast
  console.log('Login failed:', result.error)
}
```

## Troubleshooting

### Mock API Not Working
1. Check browser console for errors
2. Verify imports in store files
3. Check if error handler is imported correctly

### Real API Not Switching
1. Verify backend is running on correct port
2. Check CORS settings
3. Verify API endpoints match expected format

### Error Messages Not Showing
1. Check if toast system is working
2. Verify error handler is being called
3. Check component imports

## Summary

The mock API system ensures your frontend development never stops, even when the backend isn't ready. It provides:

- ✅ **Seamless development experience**
- ✅ **Realistic API behavior**
- ✅ **Proper error handling**
- ✅ **Easy transition to real API**
- ✅ **No code changes required when backend is ready**

Your frontend is now fully functional and ready for development and testing!
