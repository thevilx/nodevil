// scripts/create-model.ts
import fs from 'fs';
import path from 'path';

const modelName = process.argv[2];

if (!modelName) {
  console.error('Please provide a model name. Example: npm run create-model User');
  process.exit(1);
}

// const pascalCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
const lowerCase = (str: string) => str.toLowerCase();
const upperCase = (str: string) => str.toUpperCase();

const ModelName = modelName;
const modelDir = path.join(__dirname, '../models', lowerCase(modelName));

if (fs.existsSync(modelDir)) {
  console.error(`Model "${modelName}" already exists.`);
  process.exit(1);
}

const camelCasedModelName = ModelName.split('_').join('');
const translationKeyModelName = ModelName.split('_').join('-').toLocaleLowerCase();

fs.mkdirSync(modelDir);

// Templates
const schemaTemplate = `
import mongoose, { Schema } from "mongoose";
import { I${camelCasedModelName} } from "./${lowerCase(modelName)}";

const ${camelCasedModelName}Schema: Schema = new Schema<I${camelCasedModelName}>({

}, {
    timestamps: true,
    strict: true
});

const ${camelCasedModelName} = mongoose.model<I${camelCasedModelName}>("${camelCasedModelName}", ${camelCasedModelName}Schema);

export default ${camelCasedModelName};
`;

const interfaceTemplate = `
import { Types } from "mongoose";

export interface I${camelCasedModelName} {
    _id?: Types.ObjectId;
    createdAt?: Date,
    updatedAt?: Date,
}
`;

const crudTemplate = `
import { I${camelCasedModelName} } from "./${lowerCase(modelName)}";
import ${camelCasedModelName} from "./${lowerCase(modelName)}.schema";
import { Crud } from "../crud";

class ${camelCasedModelName}CrudClass extends Crud<I${camelCasedModelName}> {

    constructor() {
        super(${camelCasedModelName}, "${translationKeyModelName}-not-found")
    }

}

export const ${camelCasedModelName}Crud = new ${camelCasedModelName}CrudClass();`;

const permissionTemplate = `
export enum ${upperCase(modelName)}_PERMISSIONS {
    CREATE = "CREATE_${upperCase(modelName)}S",
    FETCH = "FETCH_${upperCase(modelName)}S",
    UPDATE = "UPDATE_${upperCase(modelName)}S",
    DELETE = "DELETE_${upperCase(modelName)}S",
}
`;

// Write files
fs.writeFileSync(path.join(modelDir, `${lowerCase(modelName)}.schema.ts`), schemaTemplate.trim());
fs.writeFileSync(path.join(modelDir, `${lowerCase(modelName)}.d.ts`), interfaceTemplate.trim());
fs.writeFileSync(path.join(modelDir, `${lowerCase(modelName)}.cruds.ts`), crudTemplate.trim());
fs.writeFileSync(
  path.join(modelDir, `${lowerCase(modelName)}.permissions.ts`),
  permissionTemplate.trim()
);

const importLine = `\nimport './${lowerCase(modelName)}/${lowerCase(modelName)}.schema';`;
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

console.log(`✅ Model "${modelName}" created successfully at: ${modelDir}`);
