# TaskNest Backend API

A comprehensive task management system built with Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, JWT protection)
- Task management (CRUD operations)
- Category management
- Contact management
- Email notifications for task due dates
- User profile management
- RESTful API design

## Email Notifications

This system now includes email notifications for tasks due today. The feature works as follows:

1. A daily scheduler checks for tasks due that day
2. Email notifications are sent to users with due tasks
3. Users can disable email notifications in their profile settings
4. A test email endpoint is available for verifying email configuration

For setup instructions, see [TASK_EMAIL_NOTIFICATIONS.md](../TASK_EMAIL_NOTIFICATIONS.md)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/test-email` - Send test email notification

### Tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get all tasks (with filtering/pagination)
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/stats` - Get task statistics

### Categories
- `POST /api/categories` - Create a new category
- `GET /api/categories` - Get all categories
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Contacts
- `POST /api/contacts` - Create a new contact
- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/:id` - Get a specific contact
- `PUT /api/contacts/:id` - Update a contact
- `DELETE /api/contacts/:id` - Delete a contact

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Email Configuration
EMAIL_HOST=your-smtp-host.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-app-password
EMAIL_FROM="TaskNest" <no-reply@tasknest.com>
```

## Installation

1. Clone the repository
2. Navigate to the backend directory: `cd backend`
3. Install dependencies: `npm install`
4. Create a `.env` file with your configuration
5. Start the development server: `npm run dev`

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run dev:db` - Start the development MongoDB instance
- `npm run dev:all` - Start both the development server and MongoDB
- `npm test` - Run tests
- `npm run test:email` - Test email functionality
- `npm run check:tasks` - Manually check for due tasks

## License

MIT