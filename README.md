

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

### Advanced Options

The model generator supports several options for enhanced development workflow:

```bash
# Generate model with controller and API routes
npm run create-model Product --controller --api

# Generate without permissions
npm run create-model Product --no-permissions

# Force overwrite existing model
npm run create-model Product --force
```

**Available Options:**
- `-c, --controller` - Generate controller file with CRUD methods
- `-a, --api` - Generate API routes file with authentication
- `--no-permissions` - Skip permissions generation
- `-f, --force` - Overwrite existing files

This command generates a complete model structure:

```
models/user/
├── user.d.ts           # TypeScript interfaces
├── user.schema.ts      # Mongoose schema
├── user.cruds.ts       # CRUD operations class
├── user.enums.ts       # Enums and constants
└── user.permissions.ts # Permission definitions
```

Additional files when using options:
```
controllers/user/
└── user.controllers.ts # Controller methods (with --controller)

apis/user/
└── user.apis.ts        # API routes (with --api)
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

## Model Removal

Remove existing models and clean up all associated files:

```bash
npm run remove-model User
```

### Removal Options

```bash
# Force removal without confirmation
npm run remove-model Product --force

# Keep database collection (don't drop from MongoDB)
npm run remove-model Product --keep-database
```

**Available Options:**
- `-f, --force` - Force removal without confirmation
- `-k, --keep-database` - Keep database collections (don't drop)

**What gets removed:**
- Model directory and all files (schema, interface, CRUD, permissions)
- Controller files (if they exist)
- API route files (if they exist)
- Import statements from models_importer.models.ts
- Translation keys from translation files
- Database collection instructions (manual removal required)

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

Nodevil provides comprehensive multi-language support with automatic translation capabilities based on request headers, query parameters, or cookies.

#### Configuration

The framework currently supports **English (en)** and **Farsi (fa)** languages with Farsi as the default base language. Configure languages in your environment:

```bash
# .env
BASE_LANGUAGE=fa  # Default: fa (Farsi)
```

Supported languages are defined in `config/app/app_config.ts`:
```typescript
SUPPORTED_LANGUAGES: [AppLanguage.FARSI, AppLanguage.ENGLISH]
BASE_LANGUAGE: AppLanguage.FARSI
```

#### Language Detection

The system automatically detects language preference from multiple sources (in priority order):
1. **Query Parameter**: `?lang=en` or `?locale=en`
2. **Accept-Language Header**: Standard HTTP header
3. **i18next Cookie**: Persistent language preference
4. **Default**: Falls back to base language (Farsi)

#### Translation Files

Translation keys are stored in JSON files under `/locales/`:
```
locales/
├── en/
│   └── translations.json
└── fa/
    └── translations.json
```

Example translation file structure:
```json
{
  "login-successful": "Login successful",
  "user-not-found": "User not found",
  "errors": {
    "unexpected": "An unexpected error occurred"
  }
}
```

#### Multi-Language Database Fields

For database models that need multi-language content, use the `multiLanguageSchema`:

```typescript
import { multiLanguageSchema, MultiLanguageContent } from '../multi_language.schema';

const productSchema = new Schema({
  name: multiLanguageSchema,  // { en: string, fa: string }
  description: multiLanguageSchema,
  price: Number
});

// Interface
interface IProduct {
  name: MultiLanguageContent;
  description: MultiLanguageContent;
  price: number;
}
```

#### CRUD Operations with Translation

**Automatic Translation**: Use `returnAsTranslated: true` to automatically return content in the current request language:

```typescript
// Returns data in the current request language (en/fa)
const user = await UserCrud.findById(id, { returnAsTranslated: true });

// Pagination with translation
const products = await ProductCrud.paginate({
  page: 1,
  pageSize: 10,
  returnAsTranslated: true  // Auto-translates multi-language fields
});

// Search with translation
const results = await ProductCrud.find(
  { price: { $gte: 100 } },
  { returnAsTranslated: true }
);
```

**Manual Language Selection**: Override request language for specific operations:

```typescript
// Force specific language regardless of request headers
i18n.setLanguage('en');
const englishData = await ProductCrud.findById(id, { returnAsTranslated: true });

i18n.setLanguage('fa');
const farsiData = await ProductCrud.findById(id, { returnAsTranslated: true });
```

#### Output Examples

**Without Translation** (`returnAsTranslated: false`):
```json
{
  "name": {
    "en": "Product Name",
    "fa": "نام محصول"
  },
  "description": {
    "en": "Product description",
    "fa": "توضیحات محصول"
  }
}
```

**With Translation** (`returnAsTranslated: true` + `Accept-Language: en`):
```json
{
  "name": "Product Name",
  "description": "Product description"
}
```

**With Translation** (`returnAsTranslated: true` + `Accept-Language: fa`):
```json
{
  "name": "نام محصول",
  "description": "توضیحات محصول"
}
```

#### Using Translations in Code

```typescript
import { i18n } from './config/i18n/i18n';

// Type-safe translations with interpolation
const message = i18n.t('please-wait-x-minutes-before-requesting-new-verification-code', {
  minutes: 5
});

// Error messages are automatically translated
throw new ValidationError(i18n.t('user-not-found'));
```

#### Adding New Languages

1. **Create translation file**: Add new JSON file in `/locales/{language_code}/translations.json`
2. **Update schema**: Add language code to `multiLanguageSchema` in `models/multi_language.schema.ts`
3. **Update config**: Add language to `SUPPORTED_LANGUAGES` in `app_config.ts`
4. **Update interface**: Add language property to `MultiLanguageContent` interface

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
- `npm run remove-model <MODEL_NAME>` - Remove existing model
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
