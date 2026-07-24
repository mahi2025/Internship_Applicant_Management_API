# Internship Applicant Management API 

Internship Applicant Management API that lets an administrator manage internship applications.

## Architecture

- Feature-based module structure
- Global JWT guard with `@Public()` opt-out
- Global ValidationPipe + HttpExceptionFilter for consistent error shape
  
## Technologies

- NestJS, TypeScript, Prisma and PostgreSQL

## Installation 

```bash
npm install
cp .env.example .env
docker compose up -d postgres 
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```
`

## Migrations & Seeding

\`\`\`bash
npx prisma migrate dev --name <name>  
npx prisma db seed                   
\`\`\`


## Authentication

Default seeded admin:
 `admin@gmail.com` 
/ `AdminPassword`

POST /api/auth/login → returns JWT bearer token

Include as `Authorization: Bearer <token>` on all other requests.

## Testing

\`\`\`bash
npm run test       # unit tests
npm run test:e2e   # integration tests (requires internship_db_test)
\`\`\`

## API Documentation

Swagger UI: http://localhost:3000/docs

## Folder Structure

│src/
│
├── auth/
│   ├── decorators/
│   ├── dto/
│   └── guards/
│   └── strategies/
│   └── auth.*.ts
│
├── applicant/
│   ├── dto/
│   └── applicant.*.ts
│ 
│── dashboard/
│   └── dashboard.*.ts

├──|──common/
│     ├── http-exception.filter.ts
│  ├──config/
│       ├── config.ts
│       ├── validation.schema.ts
│  ├──prisma/
│       ├── prisma.module.ts
│       ├── prisma.service.ts
└── |
    ├── app.module.ts
    └── main.ts


## Business Rules

- Applicant email unique
- Notes ≤ 1000 characters
- Status transitions 
- deleted applicants excluded from all listings and dashboard

## Assumptions

- Email is immutable after applicant creation
- Accepted/Rejected are terminal states (no reverse transitions)
- Internship tracks are a fixed enum of 5 values 

## Known Limitations

- No refresh token / logout blocklist (stateless JWT only, 1h expiry)
- No role-based access beyond a single Admin type
- No rate limiting on login endpoint 