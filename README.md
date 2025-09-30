

<div style="text-align:center;">

<img src="https://github.com/user-attachments/assets/1826b6dd-298e-489c-b1f3-b2dc77f964ca" width="500" alt="Logo">
</div>

# Nodevil - Beta
``` -- No evil deadline shall reach you -- ```

A robust Node.js backend framework built with TypeScript and Express.js. Features automated CRUD operations with a base class system, JWT authentication with role-based permissions, multi-language support with automatic localization, file storage (local/S3), comprehensive security middlewares, and auto-generated API documentation.

its currently underdevelopment and could face some bugs, any contribution is welcome.

## Installation

### Manual Setup
```bash
git clone <repository-url>
cd nodevil
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Docker Setup
```bash
git clone <repository-url>
cd nodevil
cp .env.example .env
# Edit .env with your configuration
npm run docker:up
```

Your server will be running at `http://localhost:8000` with API docs at `/api-docs`

## Model Generator

Create new models instantly with the built-in generator:

```bash
npm run create-model User
```

This command generates a complete model structure:

```
models/user/
├── user.d.ts           # TypeScript interfaces
├── user.schema.ts      # Mongoose schema
├── user.cruds.ts       # CRUD operations class
├── user.enums.ts       # Enums and constants
└── user.permissions.ts # Permission definitions
```

### Generated CRUD Usage
```typescript
import { UserCrud } from './models/user/user.cruds';

// Create
const user = await UserCrud.create({ name: 'John', email: 'john@example.com' });

// find by id ( will throw NotFoundError if document is not found )
const user = await UserCrud.findById("document-id");

// try find by id ( wont throw NotFoundError , will return null if not found )
const user = await UserCrud.tryFindById("document-id")

// Read with pagination
const users = await UserCrud.paginate({
  page: 1,
  pageSize: 10,
  filter: { active: true },
  populate: ['role'],
  returnAsTranslated: true // Auto-translate multi-language fields it reads from the current language in i18n file
});

// Update
const updated = await UserCrud.updateById(id, { name: 'Jane' });

// Delete
await UserCrud.deleteById(id);


```
Please read the `models/crud.ts` for full functions and their descriptions

## Key Features

### Authentication & Authorization
- **Google & Apple OAuth**: Built-in support for Google and Apple authentication out of the box
- **JWT-based authentication** with role-based permissions
- **Permission-based route protection**

```typescript
// Protect routes with permissions
router.get('/users', authMiddleware([USER_PERMISSION.FETCH_USERS]), getUsersController);
```

### Multi-Language Support
```typescript
// Automatic translation based on request headers ( i18n config )
const localizedData = await UserCrud.findById(id, { returnAsTranslated: true });
```

### File Storage
```typescript
// Works with both local and S3 storage
const storage = StorageManager.getInstance();
const result = await storage.getDriver().uploadFile(file, 'uploads/');
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run create-model <MODEL_NAME>` - Generate new model
- `npm run docker:up` - Start with Docker

## Environment Variables

Create `.env` from `.env.example` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | JWT signing secret (min 32 chars) |
| `PORT` | No | Server port (default: 8000) |
| `STORAGE_DRIVER` | No | 'local' or 's3' (default: local) |

## Project Structure

```
├── apis/              # Route definitions
├── controllers/       # Request handlers  
├── models/           # Generated models with CRUD
├── middlewares/      # Auth, validation, etc.
├── services/         # Business logic
├── config/           # App configuration
└── locales/          # Translation files
```

## License

ISC License