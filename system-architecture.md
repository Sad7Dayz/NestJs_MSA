# NestJS Delivery System Architecture

```mermaid
graph TB
    %% External Access
    Client[Client/Browser<br/>:3000] --> Gateway

    %% Gateway Service
    Gateway[Gateway Service<br/>HTTP: :3000<br/>Container: gateway-1]

    %% Microservices
    User[User Service<br/>HTTP: :3001<br/>TCP: :3001<br/>Container: user-1]
    Product[Product Service<br/>HTTP: :3002<br/>TCP: :3001<br/>Container: product-1]
    Order[Order Service<br/>HTTP: :3003<br/>Container: order-1]
    Payment[Payment Service<br/>HTTP: :3004<br/>TCP: :3001<br/>Container: payment-1]
    Notification[Notification Service<br/>TCP: :3001<br/>Container: notification-1]

    %% Databases
    PostgresUser[(PostgreSQL<br/>User DB<br/>:6001)]
    PostgresProduct[(PostgreSQL<br/>Product DB<br/>:6002)]
    MongoOrder[(MongoDB<br/>Order DB<br/>:6003)]
    PostgresPayment[(PostgreSQL<br/>Payment DB<br/>:6004)]
    MongoNotification[(MongoDB<br/>Notification DB<br/>:6006)]

    %% Gateway connections
    Gateway --> User
    Gateway --> Product
    Gateway --> Order
    Gateway --> Payment

    %% Database connections
    User --> PostgresUser
    Product --> PostgresProduct
    Order --> MongoOrder
    Payment --> PostgresPayment
    Notification --> MongoNotification

    %% Inter-service TCP communications
    Order -.->|TCP :3001| User
    Order -.->|TCP :3001| Product
    Order -.->|TCP :3001| Payment
    Payment -.->|TCP :3001| Notification
    Notification -.->|TCP :3001| Order

    %% Styling
    classDef serviceBox fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef dbBox fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef gatewayBox fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px

    class User,Product,Order,Payment,Notification serviceBox
    class PostgresUser,PostgresProduct,MongoOrder,PostgresPayment,MongoNotification dbBox
    class Gateway gatewayBox
```

## Port Mapping Summary

### External Ports (Host → Container)
- **Gateway**: 3000:3000 (HTTP)
- **User**: 3001:3000 (HTTP)
- **Product**: 3002:3000 (HTTP)
- **Order**: 3003:3000 (HTTP)
- **Payment**: 3004:3000 (HTTP)
- **Notification**: No external HTTP port

### Database Ports (Host → Container)
- **PostgreSQL (User)**: 6001:5432
- **PostgreSQL (Product)**: 6002:5432
- **MongoDB (Order)**: 6003:27017
- **PostgreSQL (Payment)**: 6004:5432
- **MongoDB (Notification)**: 6006:27017

### Internal TCP Communication Ports
- **User Service**: TCP :3001
- **Product Service**: TCP :3001
- **Payment Service**: TCP :3001
- **Notification Service**: TCP :3001

## Service Communication Flow

1. **Client** → **Gateway** (HTTP :3000)
2. **Gateway** → **Microservices** (HTTP :300x)
3. **Microservices** ↔ **Microservices** (TCP :3001)
4. **Microservices** → **Databases** (Internal container network)

## Technology Stack

- **API Gateway**: NestJS HTTP
- **Microservices**: NestJS with TCP transport
- **Databases**: PostgreSQL, MongoDB
- **Containerization**: Docker & Docker Compose
- **Authentication**: JWT (User Service)
- **Validation**: Joi, class-validator
