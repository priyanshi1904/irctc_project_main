# Train Booking API

A RESTful API built with NestJS for managing train bookings and reservations. The application provides user authentication, train management, and seat booking functionalities.

## Features

- User authentication with JWT
- Train management (add trains, check availability)
- Seat booking with race condition handling
- Role-based access control (Admin/User)
- Secure email encryption
- PostgreSQL database with Prisma ORM

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- pnpm

## Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

### Test Coverage

```bash
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------|---------|----------|---------|---------|--------------------
All files               |   41.01 |    33.33 |   42.85 |   41.17 |
 src                    |   34.21 |        0 |      75 |   28.12 |
  app.controller.ts     |     100 |      100 |     100 |     100 |
  app.module.ts         |       0 |      100 |     100 |       0 | 1-25
  app.service.ts        |     100 |      100 |     100 |     100 |
  main.ts               |       0 |        0 |       0 |       0 | 1-23
 src/auth               |       0 |      100 |       0 |       0 |
  get-user.decorator.ts |       0 |      100 |       0 |       0 | 1-6
  jwt.strategy.ts       |       0 |      100 |       0 |       0 | 1-15
 src/booking            |    37.5 |       50 |   44.44 |   38.23 |
  booking.controller.ts |       0 |      100 |       0 |       0 | 1-28
  booking.module.ts     |       0 |      100 |     100 |       0 | 1-11
  booking.service.ts    |   71.42 |       50 |   66.66 |   68.42 | 23,54-73
 src/prisma             |   31.25 |      100 |       0 |      25 |
  prisma.module.ts      |       0 |      100 |     100 |       0 | 1-9
  prisma.service.ts     |   45.45 |      100 |       0 |   33.33 | 15-25
 src/train              |      25 |       25 |    37.5 |   23.33 |
  train.controller.ts   |       0 |        0 |       0 |       0 | 1-56
  train.module.ts       |       0 |      100 |     100 |       0 | 1-9
  train.service.ts      |   64.28 |       50 |      60 |   58.33 | 30-46
 src/user               |   62.66 |       50 |   55.55 |   65.21 |
  user.controller.ts    |       0 |      100 |       0 |       0 | 1-14
  user.module.ts        |       0 |      100 |     100 |       0 | 1-10
  user.service.ts       |   81.03 |       50 |   83.33 |   80.35 | 64,106-109,127-133
------------------------|---------|----------|---------|---------|--------------------
```
