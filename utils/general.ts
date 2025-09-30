import Joi from 'joi';
import { CookieOptions } from 'express';
import { AppLanguages, i18n } from '../config/i18n/i18n';
import { BadRequestError } from './errors';

export function getCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 24 * 60 * 60 * 1000, // This sets the cookie to expire after 60 days
    sameSite: 'none',
  };
}

/**
 * This function is for validation Joi schemas and return BadRequestError for the first error occurred
 *
 * @param schema
 * @param data
 * @param res
 */
export function validateJOI(schema: Joi.ObjectSchema<any>, data: any) {
  const validation = schema.validate(data, {
    errors: {
      language: i18n.currentLanguage,
    },
    messages: i18n.getJoiTranslations(),
  });

  if (validation.error) {
    throw new BadRequestError(validation.error.details[0].message);
  }

  return validation.value;
}

/**
 * This is used to change the data containing multilingual to replace with corresponding language from i18n object or givin language
 *
 * @param data
 * @param language
 * @returns
 */
export async function updateFieldsToCorrectLanguage(data: any, language?: string): Promise<any> {
  const currentLanguage = language || i18n.currentLanguage;

  // Helper to determine if a value is a plain object
  const isObject = (obj: any) => obj !== null && typeof obj === 'object' && !Array.isArray(obj);

  // Recursive function to walk through the object
  const traverse = (node: any): any => {
    if (Array.isArray(node)) {
      return node.map(traverse);
    }

    if (isObject(node)) {
      // Check if this is a multi-language field (e.g. { en: ..., ar: ... })
      const keys = Object.keys(node);
      const isLangObject = keys.includes('en');

      if (isLangObject) {
        return node[currentLanguage] || null;
      }

      // Otherwise, recurse into the object
      const result: any = {};
      for (const key in node) {
        result[key] = traverse(node[key]);
      }
      return result;
    }

    return node; // primitives
  };

  return traverse(data);
}

export function extractPaginationFieldsFromQuery(query: any) {
  const queryValidation = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
  });

  const result = validateJOI(queryValidation, { page: query.page, pageSize: query.pageSize });

  return {
    page: result.page,
    pageSize: result.pageSize,
  };
}

/**
 *
 * @param data any mongoose model result
 * @param language string ( must be valid in i18n )
 * @returns
 */
export function applyLocalization(data: any, language?: AppLanguages): any {
  const currentLanguage = language || i18n.currentLanguage;

  // Helper to determine if a value is a plain object
  const isObject = (obj: any) => obj !== null && typeof obj === 'object' && !Array.isArray(obj);

  // Helper to check if object should be excluded from traversal based on its type/structure
  const shouldExcludeFromTraversal = (obj: any) => {
    // Check for MongoDB ObjectId by constructor name
    if (obj.constructor && obj.constructor.name === 'ObjectId') {
      return true;
    }

    // Check for Buffer objects
    if (obj.constructor && obj.constructor.name === 'Buffer') {
      return true;
    }

    // Check for Date objects
    if (obj instanceof Date) {
      return true;
    }

    // Check for BSON ObjectId (serialized form)
    if (obj._bsontype === 'ObjectId') {
      return true;
    }

    // Check for MongoDB ObjectId in JSON format (has $oid property)
    if (obj.$oid && typeof obj.$oid === 'string') {
      return true;
    }

    // Check for Buffer-like structures (serialized Buffer)
    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return true;
    }

    // Check for objects that have ObjectId-like structure (24-char hex string as only property)
    const keys = Object.keys(obj);

    if (
      keys.length === 1 &&
      typeof obj[keys[0]] === 'string' &&
      /^[0-9a-fA-F]{24}$/.test(obj[keys[0]])
    ) {
      return true;
    }

    return false;
  };

  // Recursive function to walk through the object
  const traverse = (node: any): any => {
    if (Array.isArray(node)) {
      return node.map(traverse);
    }

    if (isObject(node)) {
      // Skip traversal for special object types (ObjectIds, Buffers, Dates, etc.)
      if (shouldExcludeFromTraversal(node)) {
        return node;
      }

      // Check if this is a multi-language field (e.g. { en: ..., ar: ... })
      const keys = Object.keys(node);
      const isLangObject =
        keys.includes('en') &&
        keys.length > 1 &&
        keys.every(key => key.length === 2 || key.length === 5); // 2 chars (en) or 5 chars (en-US)

      if (isLangObject) {
        return node[currentLanguage] || null;
      }

      // Otherwise, recurse into the object
      const result: any = {};
      for (const key in node) {
        result[key] = traverse(node[key]);
      }
      return result;
    }

    return node; // primitives
  };

  return traverse(data);
}
