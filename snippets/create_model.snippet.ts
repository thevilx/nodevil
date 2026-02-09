// scripts/create-model.ts
import fs from 'fs';
import path from 'path';

// Parse command line arguments
const args = process.argv.slice(2);
const modelName = args[0];
const options = {
  withController: args.includes('--controller') || args.includes('-c'),
  withApi: args.includes('--api') || args.includes('-a'),
  skipPermissions: args.includes('--no-permissions'),
  force: args.includes('--force') || args.includes('-f')
};

if (!modelName) {
  console.error('Please provide a model name.');
  console.log('Usage: npm run create-model <ModelName> [options]');
  console.log('Options:');
  console.log('  -c, --controller    Generate controller file');
  console.log('  -a, --api          Generate API routes file');
  console.log('  --no-permissions   Skip permissions generation');
  console.log('  -f, --force        Overwrite existing files');
  console.log('\nExample: npm run create-model Product --controller --api');
  process.exit(1);
}

// Utility functions for case conversion
const toPascalCase = (str: string): string => {
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (_, char) => char.toUpperCase());
};

const toCamelCase = (str: string): string => {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

const toKebabCase = (str: string): string => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
};

const toSnakeCase = (str: string): string => {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase();
};

const toUpperCase = (str: string): string => str.toUpperCase();
const toLowerCase = (str: string): string => str.toLowerCase();

// Automatic pluralization logic
const pluralize = (word: string): string => {
  const singular = word.toLowerCase();

  // Irregular plurals
  const irregulars: Record<string, string> = {
    'person': 'people',
    'man': 'men',
    'woman': 'women',
    'child': 'children',
    'tooth': 'teeth',
    'foot': 'feet',
    'mouse': 'mice',
    'goose': 'geese'
  };

  if (irregulars[singular]) {
    return irregulars[singular].toUpperCase();
  }

  // Words ending in s, ss, sh, ch, x, z
  if (/(s|ss|sh|ch|x|z)$/i.test(singular)) {
    return (singular + 'es').toUpperCase();
  }

  // Words ending in consonant + y
  if (/[bcdfghjklmnpqrstvwxz]y$/i.test(singular)) {
    return (singular.slice(0, -1) + 'ies').toUpperCase();
  }

  // Words ending in f or fe
  if (/f$/i.test(singular)) {
    return (singular.slice(0, -1) + 'ves').toUpperCase();
  }
  if (/fe$/i.test(singular)) {
    return (singular.slice(0, -2) + 'ves').toUpperCase();
  }

  // Words ending in consonant + o
  if (/[bcdfghjklmnpqrstvwxz]o$/i.test(singular)) {
    return (singular + 'es').toUpperCase();
  }

  // Default: add s
  return (singular + 's').toUpperCase();
};

// Validate model name format
const validateModelName = (name: string): void => {
  if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(name)) {
    console.error('❌ Model name must start with a letter and contain only letters, numbers, and underscores.');
    process.exit(1);
  }

  if (name.length < 2) {
    console.error('❌ Model name must be at least 2 characters long.');
    process.exit(1);
  }

  if (name.length > 50) {
    console.error('❌ Model name must be less than 50 characters long.');
    process.exit(1);
  }
};

// Validate and normalize model name
validateModelName(modelName);

const ModelName = toPascalCase(modelName);
const camelCasedModelName = toCamelCase(modelName);
const kebabCaseModelName = toKebabCase(modelName);
const snakeCaseModelName = toSnakeCase(modelName);
const upperCaseModelName = toSnakeCase(modelName).toUpperCase();
const pluralUpperCase = pluralize(snakeCaseModelName);


const modelDir = path.join(__dirname, '../src/models', toLowerCase(modelName));

if (fs.existsSync(modelDir) && !options.force) {
  console.error(`❌ Model "${ModelName}" already exists. Use --force to overwrite.`);
  process.exit(1);
}

if (options.force && fs.existsSync(modelDir)) {
  console.log(`⚠️  Overwriting existing model "${ModelName}"...`);
}

// Create model directory
if (!fs.existsSync(modelDir)) {
  fs.mkdirSync(modelDir, { recursive: true });
}

console.log(`📁 Creating model files for "${ModelName}"...`);

// Templates
const schemaTemplate = `
import mongoose, { Schema } from "mongoose";
import { I${ModelName} } from "./${toLowerCase(modelName)}";

const ${ModelName}Schema: Schema = new Schema<I${ModelName}>({
    // Define your schema fields here
    // Example:
    // name: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },
    // description: {
    //     type: String,
    //     trim: true
    // },
    // isActive: {
    //     type: Boolean,
    //     default: true
    // }
}, {
    timestamps: true,
    strict: true
});

// Add indexes if needed
// ${ModelName}Schema.index({ name: 1 });
// ${ModelName}Schema.index({ createdAt: -1 });

const ${ModelName} = mongoose.model<I${ModelName}>("${ModelName}", ${ModelName}Schema);

export default ${ModelName};
`;

const interfaceTemplate = `
import { Types } from "mongoose";

export interface I${ModelName} {
    _id?: Types.ObjectId;
    // Define your interface properties here
    // Example:
    // name: string;
    // description?: string;
    // isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
`;

const crudTemplate = `
import { I${ModelName} } from "./${toLowerCase(modelName)}";
import ${ModelName} from "./${toLowerCase(modelName)}.schema";
import { Crud } from "../crud";

class ${ModelName}CrudClass extends Crud<I${ModelName}> {

    constructor() {
        super(${ModelName}, "${kebabCaseModelName}-not-found")
    }

}

export const ${ModelName}Crud = new ${ModelName}CrudClass();`;

const permissionTemplate = `
export enum ${upperCaseModelName}_PERMISSIONS {
    CREATE = "CREATE_${pluralUpperCase}",
    FETCH = "FETCH_${pluralUpperCase}",
    UPDATE = "UPDATE_${pluralUpperCase}",
    DELETE = "DELETE_${pluralUpperCase}",
}
`;

const controllerTemplate = `
import { NextFunction, Request, Response } from "express";
import { ${ModelName}Crud } from "../../models/${toLowerCase(modelName)}/${toLowerCase(modelName)}.cruds";
import { I${ModelName} } from "../../models/${toLowerCase(modelName)}/${toLowerCase(modelName)}";
import { i18n } from "../../config/i18n/i18n";
import { extractPaginationFieldsFromQuery } from "../../utils/general";

export class ${ModelName}Controller {

    static async create${ModelName}(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const ${camelCasedModelName}Data: Partial<I${ModelName}> = req.body;

            const new${ModelName} = await ${ModelName}Crud.create(${camelCasedModelName}Data);

            res.status(201).json({
                success: true,
                message: i18n.t('${kebabCaseModelName}-created-successfully'),
                data: new${ModelName}
            });
        } catch (error) {
            next(error)
        }
    }

    static async get${ModelName}ById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            const ${camelCasedModelName} = await ${ModelName}Crud.findById(id);

            res.status(200).json({
                success: true,
                data: ${camelCasedModelName}
            });
        } catch (error) {
            next(error)
        }
    }

    static async getAll${ModelName}s(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { page, pageSize } = extractPaginationFieldsFromQuery(req.query);

            const data = await ${ModelName}Crud.paginate({
                page,
                pageSize
            })

            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            next(error)

        }
    }

    static async update${ModelName}(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const updateData: Partial<I${ModelName}> = req.body;

            const updated${ModelName} = await ${ModelName}Crud.updateById(id, updateData);

            res.status(200).json({
                success: true,
                message: i18n.t('${kebabCaseModelName}-updated-successfully'),
                data: updated${ModelName}
            });
        } catch (error) {
            next(error)

        }
    }

    static async delete${ModelName}(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            await ${ModelName}Crud.deleteById(id);

            res.status(200).json({
                success: true,
                message: i18n.t('${kebabCaseModelName}-deleted-successfully')
            });
        } catch (error) {
            next(error)
        }
    }
}
`;

const apiTemplate = `
import { Router } from "express";
import { ${ModelName}Controller } from "../../controllers/${toLowerCase(modelName)}/${toLowerCase(modelName)}.controllers";
import authMiddleware from "../../middlewares/auth.middleware";
import { ${upperCaseModelName}_PERMISSIONS } from "../../models/${toLowerCase(modelName)}/${toLowerCase(modelName)}.permissions";

const ${camelCasedModelName}Router = Router();

// Create ${toLowerCase(modelName)}
${camelCasedModelName}Router.post(
    "/",
    authMiddleware([${upperCaseModelName}_PERMISSIONS.CREATE]),
    ${ModelName}Controller.create${ModelName}
);

// Get all ${toLowerCase(modelName)}s
${camelCasedModelName}Router.get(
    "/",
    authMiddleware([${upperCaseModelName}_PERMISSIONS.FETCH]),
    ${ModelName}Controller.getAll${ModelName}s
);

// Get ${toLowerCase(modelName)} by ID
${camelCasedModelName}Router.get(
    "/:id",
    authMiddleware([${upperCaseModelName}_PERMISSIONS.FETCH]),
    ${ModelName}Controller.get${ModelName}ById
);

// Update ${toLowerCase(modelName)}
${camelCasedModelName}Router.put(
    "/:id",
    authMiddleware([${upperCaseModelName}_PERMISSIONS.UPDATE]),
    ${ModelName}Controller.update${ModelName}
);

// Delete ${toLowerCase(modelName)}
${camelCasedModelName}Router.delete(
    "/:id",
    authMiddleware([${upperCaseModelName}_PERMISSIONS.DELETE]),
    ${ModelName}Controller.delete${ModelName}
);

export { ${camelCasedModelName}Router };
`;

// Write model files
try {
  fs.writeFileSync(path.join(modelDir, `${toLowerCase(modelName)}.schema.ts`), schemaTemplate.trim());
  console.log(`✅ Created schema file`);

  fs.writeFileSync(path.join(modelDir, `${toLowerCase(modelName)}.d.ts`), interfaceTemplate.trim());
  console.log(`✅ Created interface file`);

  fs.writeFileSync(path.join(modelDir, `${toLowerCase(modelName)}.cruds.ts`), crudTemplate.trim());
  console.log(`✅ Created CRUD file`);

  fs.writeFileSync(path.join(modelDir, `${toLowerCase(modelName)}.enums.ts`), `// Add your ${ModelName} enums here\n`);
  console.log(`✅ Created enums file`);

  if (!options.skipPermissions) {
    fs.writeFileSync(
      path.join(modelDir, `${toLowerCase(modelName)}.permissions.ts`),
      permissionTemplate.trim()
    );
    console.log(`✅ Created permissions file`);
  }

  // Create controller if requested
  if (options.withController) {
    const controllerDir = path.join(__dirname, '../controllers', toLowerCase(modelName));
    if (!fs.existsSync(controllerDir)) {
      fs.mkdirSync(controllerDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(controllerDir, `${toLowerCase(modelName)}.controllers.ts`),
      controllerTemplate.trim()
    );
    console.log(`✅ Created controller file`);
  }

  // Create API routes if requested
  if (options.withApi) {
    const apiDir = path.join(__dirname, '../apis', toLowerCase(modelName));
    if (!fs.existsSync(apiDir)) {
      fs.mkdirSync(apiDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(apiDir, `${toLowerCase(modelName)}.apis.ts`),
      apiTemplate.trim()
    );
    console.log(`✅ Created API routes file`);
  }
} catch (error) {
  console.error('❌ Error writing files:', error);
  process.exit(1);
}

// Update models importer
try {
  const importLine = `\nimport './${toLowerCase(modelName)}/${toLowerCase(modelName)}.schema';`;
  const importPath = path.join(__dirname, '../models/models_importer.models.ts');

  let importerContent = '';

  if (fs.existsSync(importPath)) {
    importerContent = fs.readFileSync(importPath, 'utf8');
  }

  // Check if already exists to avoid duplicates
  if (!importerContent.includes(importLine.trim())) {
    importerContent += importLine;

    fs.writeFileSync(importPath, importerContent.trimEnd() + '\n');
    console.log(`✅ Added import for "${ModelName}" in models_importer.models.ts`);
  } else {
    console.log(`ℹ️  Import for "${ModelName}" already exists in models_importer.models.ts`);
  }
} catch (error) {
  console.error('❌ Error updating models importer:', error);
}

// Update translation keys
try {
  const translationKeys = [
    `${kebabCaseModelName}-not-found`,
    `${kebabCaseModelName}-created-successfully`,
    `${kebabCaseModelName}-updated-successfully`,
    `${kebabCaseModelName}-deleted-successfully`
  ];

  // Add to translation_keys.ts
  const translationKeyPath = path.join(__dirname, '../config/i18n/translation_keys.ts');
  if (fs.existsSync(translationKeyPath)) {
    let content = fs.readFileSync(translationKeyPath, 'utf8');
    let keysAdded = 0;

    translationKeys.forEach(key => {
      // Check if key already exists
      if (!content.includes(`'${key}': string;`)) {
        // Find the position to insert (before the errors section)
        const insertPos = content.indexOf("  'errors.unexpected': string;");
        if (insertPos !== -1) {
          const beforeErrors = content.substring(0, insertPos);
          const afterErrors = content.substring(insertPos);
          content = beforeErrors + `  '${key}': string;\n` + afterErrors;
          keysAdded++;
        }
      }
    });

    if (keysAdded > 0) {
      fs.writeFileSync(translationKeyPath, content);
      console.log(`✅ Added ${keysAdded} translation keys to translation_keys.ts`);
    } else {
      console.log(`ℹ️  All translation keys already exist in translation_keys.ts`);
    }
  }

} catch (error) {
  console.error('❌ Error adding translation keys:', error);
}

// Summary
console.log('\n🎉 Model generation completed!');
console.log(`📁 Model directory: ${modelDir}`);
console.log('\n📝 Next steps:');
console.log('1. Define your schema fields in the .schema.ts file');
console.log('2. Update the interface in the .d.ts file');
if (options.withController) {
  console.log('3. Customize the controller methods as needed');
}
if (options.withApi) {
  console.log('4. Add the API routes to your main router');
}
if (!options.skipPermissions) {
  console.log('5. Add the permissions to your role configuration');
}
console.log('\n🚀 Happy coding!');