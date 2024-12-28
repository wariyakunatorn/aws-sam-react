# Serverless CRUD Application

Full-stack serverless application with React/TypeScript frontend and AWS SAM backend.

## Quick Start

### Prerequisites
- Node.js 18+
- AWS CLI configured
- AWS SAM CLI
- npm/yarn

### Additional Prerequisites
- AWS Account with appropriate IAM permissions
- Understanding of serverless architecture
- Familiarity with AWS services (Lambda, API Gateway, DynamoDB)

### Local Development

1. Backend:
```bash
cd backend
sam build
sam local start-api
```

2. Frontend:
```bash
cd frontend
npm install
npm start
```

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

## Serverless Architecture

### Key Components
- AWS Lambda for serverless compute
- API Gateway for serverless API management
- DynamoDB for serverless database
- S3 for static website hosting
- AWS Cognito for serverless authentication

### Benefits
- Auto-scaling functionality
- Pay-per-use pricing model
- Zero infrastructure management
- High availability built-in
- Automatic failover

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

## Backend (Serverless with AWS SAM)

### Architecture
- Fully serverless infrastructure
- Event-driven Lambda functions
- API Gateway with Lambda proxy integration
- Serverless DynamoDB tables
- Cognito User Pools for authentication

### API Endpoints
- GET /crud - Fetch all items
- POST /crud - Create new item
- PUT /crud/{id} - Update item
- DELETE /crud/{id} - Delete item

## Security
- JWT token authentication
- API Gateway authorization
- Secure CORS configuration

### Environment Configuration
1. Update AWS Amplify configuration
2. Configure API endpoints
3. Set up authentication

## Deployment

### Infrastructure as Code
```bash
cd backend
sam build
sam deploy --guided --capabilities CAPABILITY_IAM
```

### Frontend Deployment to S3
```bash
cd frontend
npm run build
aws s3 sync build/ s3://your-bucket-name
```

## Development Guidelines

### Code Style
- Follow ESLint configuration
- Use Prettier for formatting
- Follow conventional commits

### Branch Strategy
- main: production ready code
- develop: integration branch
- feature/*: new features
- bugfix/*: bug fixes

### PR Process
1. Create feature branch
2. Write tests
3. Update documentation
4. Submit PR with description
5. Address review comments

## Troubleshooting

### Common Issues
1. API Connection Issues
   - Verify AWS credentials
   - Check CORS settings
   - Confirm API endpoint URLs

2. Build Errors
   - Clear node_modules and reinstall
   - Verify Node.js version
   - Check for TypeScript errors

3. Deployment Issues
   - Validate SAM template
   - Check CloudWatch logs
   - Verify IAM permissions

### Support
For issues, please:
1. Check existing GitHub issues
2. Review troubleshooting guide
3. Create detailed bug report
