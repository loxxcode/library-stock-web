# Library Stock Management System Backend

A scalable Library and Stock Management System backend built with Node.js, Express.js, and MongoDB.

## Features

- **Authentication**: JWT-based authentication with role-based authorization
- **Book Management**: CRUD operations with image upload to Cloudinary
- **Stock Management**: Track inventory changes with detailed logs
- **Borrow System**: Complete borrowing and returning workflow
- **User Management**: Admin and staff roles with proper permissions
- **Search & Filtering**: Advanced search and pagination capabilities
- **File Upload**: Cloudinary integration for book cover images
- **Error Handling**: Centralized error handling with proper HTTP status codes

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **Cloudinary** - Image storage
- **Multer** - File upload handling
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## Installation

1. Clone the repository
2. Navigate to the server directory:
   ```bash
   cd server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

5. Configure your environment variables in `.env`

6. Start MongoDB (local or Atlas)

7. Run the seed script to create the default admin user:
   ```bash
   npm run seed
   ```

8. Start the server:
   ```bash
   npm run dev
   ```
   For production:
   ```bash
   npm start
   ```

## Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/library_stock_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Default Admin User

After running the seed script, you can login with:
- **Email**: admin@library.com
- **Password**: admin123
- **Role**: admin

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Books
- `GET /api/books` - Get all books (with pagination, search, filters)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (admin only, with image upload)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)
- `PATCH /api/books/:id/add-stock` - Add stock (admin only)
- `PATCH /api/books/:id/remove-stock` - Remove stock (admin only)

### Stock Management
- `GET /api/stock/logs` - Get stock logs (with filters)
- `GET /api/stock/summary` - Get stock summary statistics

### Borrow System
- `POST /api/borrow` - Create borrow record (admin only)
- `PATCH /api/borrow/return/:id` - Return book (admin only)
- `GET /api/borrow` - Get all borrow records
- `GET /api/borrow/overdue` - Get overdue books
- `PATCH /api/borrow/update-overdue` - Update overdue status (admin only)

### Users
- `GET /api/users` - Get all users (with search, filters)
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## Project Structure

```
server/
├── config/
│   ├── cloudinary.js     # Cloudinary configuration
│   └── database.js       # MongoDB connection
├── controllers/
│   ├── authController.js # Authentication logic
│   ├── bookController.js # Book management
│   ├── borrowController.js # Borrow system
│   ├── stockController.js # Stock management
│   └── userController.js # User management
├── middleware/
│   ├── auth.js           # JWT authentication & authorization
│   ├── errorHandler.js   # Centralized error handling
│   └── upload.js         # Multer configuration for file uploads
├── models/
│   ├── Book.js           # Book schema
│   ├── Borrow.js         # Borrow record schema
│   ├── StockLog.js       # Stock log schema
│   └── User.js           # User schema
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── books.js          # Book routes
│   ├── borrow.js         # Borrow routes
│   ├── stock.js          # Stock routes
│   └── users.js          # User routes
├── scripts/
│   └── seed.js           # Database seeding script
├── utils/
│   ├── cloudinaryHelper.js # Cloudinary helper functions
│   └── jwt.js            # JWT utilities
├── .env.example          # Environment variables example
├── API_EXAMPLES.md       # API testing examples
├── package.json          # Dependencies and scripts
└── server.js             # Main server file
```

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based authorization (admin/staff)
- Rate limiting
- CORS configuration
- Security headers with Helmet
- Input validation and sanitization

## Business Logic

- Automatic stock quantity management on borrow/return
- Overdue book detection and status updates
- Comprehensive stock change logging
- Image upload and management with Cloudinary
- Duplicate prevention for ISBN and email
- Borrow restrictions based on available quantity

## Testing

See `API_EXAMPLES.md` for detailed API testing examples and Postman collection.

## License

MIT
