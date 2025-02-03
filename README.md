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
- 🐳 Docker support for development

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
- Docker & Docker Compose

## Project Structure 

```
product-management/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/product/management/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── exception/
│   │   │   │   ├── mapper/
│   │   │   │   ├── model/
│   │   │   │   ├── repository/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   └── test/
│   │       └── java/com/product/management/
│   │           ├── controller/
│   │           └── service/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/
│   │   │   │   ├── interceptors/
│   │   │   │   └── services/
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   ├── categories/
│   │   │   │   └── products/
│   │   │   └── shared/
│   │   │       ├── components/
│   │   │       └── models/
│   │   ├── assets/
│   │   └── environments/
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## Getting Started

### Development Environment Setup

1. Start the MySQL database using Docker:
```bash
docker-compose up -d mysql
```

2. Configure database connection in `application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/product_management
    username: root
    password: root
```

3. Build and run the backend:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

4. Install frontend dependencies and start development server:
```bash
cd frontend
npm install
npm start
```

### Using Docker Compose (Optional)

To run the entire application stack using Docker:

```bash
docker-compose up -d
```

This will start:
- MySQL database (port 3306)
- Backend API (port 8080)
- Frontend application (port 4200)

## Testing

### Backend Tests

```bash
# Run unit tests
cd backend
mvn test

# Run integration tests
mvn verify
```

### Frontend Tests

```bash
cd frontend
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
cd backend
mvn clean package -P prod
```

### Frontend

```bash
cd frontend
npm run build:prod
```

## Docker Build

Build individual containers:

```bash
# Build backend
docker build -t product-management-api ./backend

# Build frontend
docker build -t product-management-ui ./frontend
```

## API Documentation

API documentation is available at `http://localhost:8080/swagger-ui.html` when running the backend.

## Security

The application implements role-based access control with two roles:
- `ROLE_ADMIN`: Full access to all features
- `ROLE_USER`: Read-only access to products and categories

Authentication is handled via Basic Auth.

## Default Credentials

```
Username: admin
Password: admin123
```