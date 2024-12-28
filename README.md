# Dynamic CRUD Application

A full-stack application built with React frontend and AWS SAM backend for managing dynamic data entries.

## Project Structure

```
/
├── frontend/ # React application with NextUI
│ ├── src/
│ │ ├── components/
│ │ └── App.tsx
│ ├── package.json
│ └── README.md
└── backend/ # AWS SAM application
├── template.yaml
└── src/
└── handlers/ # Lambda functions
```

## Frontend

### Technologies Used
- React with TypeScript
- NextUI components
- AWS Amplify for API integration
- React Router for navigation
- Tailwind CSS for styling

### Features
- Dynamic field creation and management
- Real-time CRUD operations
- Responsive design
- Error handling and loading states
- JWT token authentication

## Backend (AWS SAM)

### Architecture
- API Gateway for REST endpoints
- Lambda functions for CRUD operations
- DynamoDB for data storage
- Cognito for authentication

### API Endpoints
- GET /crud - Fetch all items
- POST /crud - Create new item
- PUT /crud/{id} - Update item
- DELETE /crud/{id} - Delete item

## Setup Instructions

### Frontend Setup
```
cd frontend
npm install
npm start
```

### Backend Deployment
```
cd backend
sam build
sam deploy --guided
```


### Environment Configuration
1. Update AWS Amplify configuration
2. Configure API endpoints
3. Set up authentication

## Security
- JWT token authentication
- API Gateway authorization
- Secure CORS configuration