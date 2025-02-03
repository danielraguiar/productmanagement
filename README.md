# Product Management System

A full-stack application for managing products and categories with role-based access control.

## Features

- 🔐 Authentication and Authorization
- 📦 Product Management (CRUD)
- 🗂️ Category Management with hierarchical structure
- 🔍 Advanced Product Filtering
- 📱 Responsive Material Design UI
- 🔄 Real-time form validation
- 📊 Pagination and Sorting

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- MySQL
- JUnit 5 & Mockito
- Maven

### Frontend
- Angular 16
- Angular Material
- RxJS
- TypeScript
- SCSS
- Jasmine & Karma

## Prerequisites

- Java 17+
- Node.js 18+
- npm 9+
- MySQL 8+

## Project Structure 

product-management/
├── backend/
│ ├── src/
│ │ ├── main/
│ │ │ ├── java/
│ │ │ │ └── com/product/management/
│ │ │ │ ├── config/
│ │ │ │ ├── controller/
│ │ │ │ ├── dto/
│ │ │ │ ├── model/
│ │ │ │ ├── repository/
│ │ │ │ └── service/
│ │ │ └── resources/
│ │ └── test/
│ └── pom.xml
└── frontend/
├── src/
│ ├── app/
│ │ ├── core/
│ │ ├── features/
│ │ └── shared/
│ ├── assets/
│ └── environments/
├── package.json
└── angular.json
```

## Getting Started

### Backend Setup

1. Create MySQL database:
```sql
CREATE DATABASE product_management;
```

2. Configure database connection in `application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/product_management
    username: root
    password: root
```

3. Build and run the application:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm start
```

The frontend will start on `http://localhost:4200`

## API Documentation

### Authentication

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Products

```http
# Get products with filters
GET /api/products/filter?name=test&minPrice=10&maxPrice=100&categoryId=1&available=true

# Create product
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Description",
  "price": 99.99,
  "categoryId": 1,
  "available": true
}

# Update product
PUT /api/products/{id}

# Delete product
DELETE /api/products/{id}
```

### Categories

```http
# Get root categories
GET /api/categories/root

# Create category
POST /api/categories
Content-Type: application/json

{
  "name": "Category Name",
  "parentId": 1
}
```

## Security

The application implements role-based access control with two roles:
- `ROLE_ADMIN`: Full access to all features
- `ROLE_USER`: Read-only access to products and categories

Authentication is handled via JWT tokens.

## Testing

### Backend Tests

```bash
# Run unit tests
mvn test

# Run integration tests
mvn verify
```

### Frontend Tests

```bash
# Run unit tests
npm test

# Run e2e tests
npm run e2e

# Generate coverage report
npm run test:coverage
```

## Build for Production

### Backend

```bash
mvn clean package -P prod
```

The JAR file will be generated in `target/` directory.

### Frontend

```bash
npm run build:prod
```

The build artifacts will be stored in the `dist/` directory.