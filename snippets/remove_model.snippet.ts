// scripts/remove-model.ts
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Parse command line arguments
const args = process.argv.slice(2);
const modelName = args[0];
const options = {
  force: args.includes('--force') || args.includes('-f'),
  keepDatabase: args.includes('--keep-database') || args.includes('-k')
};

if (!modelName) {
  console.error('Please provide a model name to remove.');
  console.log('Usage: npm run remove-model <ModelName> [options]');
  console.log('Options:');
  console.log('  -f, --force        Force removal without confirmation');
  console.log('  -k, --keep-database Keep database collections (don\'t drop)');
  console.log('\nExample: npm run remove-model Product --force');
  process.exit(1);
}

// Utility functions for case conversion
const toPascalCase = (str: string): string => {
  return str.replace(/(?:^|[-_])([a-z])/g, (_, char) => char.toUpperCase());
};

const toLowerCase = (str: string): string => str.toLowerCase();

const toKebabCase = (str: string): string => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/[_\s]+/g, '-')
            .toLowerCase();
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
const kebabCaseModelName = toKebabCase(modelName);
const modelDir = path.join(__dirname, '../models', toLowerCase(modelName));

// Helper function for user confirmation
const askConfirmation = (question: string): Promise<boolean> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      const normalized = answer.toLowerCase().trim();
      resolve(normalized === 'y' || normalized === 'yes');
    });
  });
};

// Main async function
async function removeModel() {
  // Check if model exists
  if (!fs.existsSync(modelDir)) {
    console.error(`❌ Model "${ModelName}" does not exist.`);
    process.exit(1);
  }

  // Confirmation prompt unless --force is used
  if (!options.force) {
    console.log(`⚠️  You are about to remove the model "${ModelName}".`);
    console.log('This will delete:');
    console.log(`  - Model directory: ${modelDir}`);
    console.log(`  - All associated files (schema, interface, CRUD, permissions, etc.)`);
    console.log(`  - Controller files (if they exist)`);
    console.log(`  - API route files (if they exist)`);
    console.log(`  - Translation keys from translation files`);
    if (!options.keepDatabase) {
      console.log(`  - Database collection for ${ModelName}`);
    }
    console.log('\n❌ This action cannot be undone!');
    
    const confirmed = await askConfirmation('Are you sure you want to continue? (y/N): ');
    
    if (!confirmed) {
      console.log('❌ Model removal cancelled.');
      process.exit(0);
    }
  }

  console.log(`🗑️  Removing model "${ModelName}"...`);

  // Remove model directory and files
  try {
    if (fs.existsSync(modelDir)) {
      fs.rmSync(modelDir, { recursive: true, force: true });
      console.log(`✅ Removed model directory: ${modelDir}`);
    }
  } catch (error) {
    console.error('❌ Error removing model directory:', error);
  }

  // Remove controller directory if it exists
  try {
    const controllerDir = path.join(__dirname, '../controllers', toLowerCase(modelName));
    if (fs.existsSync(controllerDir)) {
      fs.rmSync(controllerDir, { recursive: true, force: true });
      console.log(`✅ Removed controller directory: ${controllerDir}`);
    }
  } catch (error) {
    console.error('❌ Error removing controller directory:', error);
  }

  // Remove API routes directory if it exists
  try {
    const apiDir = path.join(__dirname, '../apis', toLowerCase(modelName));
    if (fs.existsSync(apiDir)) {
      fs.rmSync(apiDir, { recursive: true, force: true });
      console.log(`✅ Removed API directory: ${apiDir}`);
    }
  } catch (error) {
    console.error('❌ Error removing API directory:', error);
  }

  // Remove from models importer
  try {
    const importPath = path.join(__dirname, '../models/models_importer.models.ts');
    
    if (fs.existsSync(importPath)) {
      let importerContent = fs.readFileSync(importPath, 'utf8');
      const importLine = `import './${toLowerCase(modelName)}/${toLowerCase(modelName)}.schema';`;
      
      // Remove the import line
      importerContent = importerContent.replace(importLine, '');
      // Clean up any extra newlines
      importerContent = importerContent.replace(/\n\n+/g, '\n').trim() + '\n';
      
      fs.writeFileSync(importPath, importerContent);
      console.log(`✅ Removed import for "${ModelName}" from models_importer.models.ts`);
    }
  } catch (error) {
    console.error('❌ Error updating models importer:', error);
  }

  // Remove translation keys
  try {
    const translationKeyPath = path.join(__dirname, '../config/i18n/translation_keys.ts');
    const translationKey = `${kebabCaseModelName}-not-found`;
    
    if (fs.existsSync(translationKeyPath)) {
      let content = fs.readFileSync(translationKeyPath, 'utf8');
      
      // Remove the translation key from the interface
      const keyLine = `  '${translationKey}': string;`;
      content = content.replace(keyLine, '');
      // Clean up extra newlines
      content = content.replace(/\n\n+/g, '\n');
      
      fs.writeFileSync(translationKeyPath, content);
      console.log(`✅ Removed translation key "${translationKey}" from translation_keys.ts`);
    }
    
    // Remove from English translations
    const enTranslationPath = path.join(__dirname, '../locales/en/translations.json');
    if (fs.existsSync(enTranslationPath)) {
      let enContent = fs.readFileSync(enTranslationPath, 'utf8');
      const enTranslations = JSON.parse(enContent);
      
      if (enTranslations[translationKey]) {
        delete enTranslations[translationKey];
        fs.writeFileSync(enTranslationPath, JSON.stringify(enTranslations, null, 2) + '\n');
        console.log(`✅ Removed English translation for "${translationKey}"`);
      }
    }
    
    // Remove from Arabic translations
    const arTranslationPath = path.join(__dirname, '../locales/ar/translations.json');
    if (fs.existsSync(arTranslationPath)) {
      let arContent = fs.readFileSync(arTranslationPath, 'utf8');
      const arTranslations = JSON.parse(arContent);
      
      if (arTranslations[translationKey]) {
        delete arTranslations[translationKey];
        fs.writeFileSync(arTranslationPath, JSON.stringify(arTranslations, null, 2) + '\n');
        console.log(`✅ Removed Arabic translation for "${translationKey}"`);
      }
    }
  } catch (error) {
    console.error('❌ Error removing translation keys:', error);
  }

  // Database cleanup warning/instructions
  if (!options.keepDatabase) {
    console.log('\n⚠️  Database Collection Notice:');
    console.log(`The MongoDB collection for "${ModelName}" still exists in your database.`);
    console.log('To remove it manually, run the following commands in your MongoDB shell:');
    console.log(`  use your_database_name`);
    console.log(`  db.${toLowerCase(modelName)}s.drop()`);
    console.log('\nOr connect to your database and drop the collection programmatically.');
  }

  // Summary
  console.log('\n🎉 Model removal completed!');
  console.log(`📁 Removed model: ${ModelName}`);
  console.log('\n📝 What was removed:');
  console.log('✅ Model files (schema, interface, CRUD, permissions)');
  console.log('✅ Controller files (if they existed)');
  console.log('✅ API route files (if they existed)');
  console.log('✅ Import from models_importer.models.ts');
  console.log('✅ Translation keys from translation files');

  if (options.keepDatabase) {
    console.log('ℹ️  Database collection was preserved (--keep-database flag used)');
  } else {
    console.log('⚠️  Database collection still exists (manual removal required)');
  }

  console.log('\n🚀 Model successfully removed!');
}

// Execute the main function
removeModel().catch((error) => {
  console.error('❌ Error during model removal:', error);
  process.exit(1);
});