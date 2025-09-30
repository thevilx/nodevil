export type TranslationKeys = {
  'login-successful': string;
  'logout-successfully': string;
  'register-successful': string;
  'user-not-found': string;
  'no-file-received': string;
  role_not_found: string;
  'invalid-file-type-upload-only-image': string;
  'unmatch-password': string;
  'your-account-is-disabled': string;
  'phone-number-taken': string;
  'email-taken': string;
  'user-exists-already': string;
  'cant-login-with-this-role': string;
  'invalid-validation-code': string;
  'verification-code-expired': string;
  'invalid-phone-number-format': string;
  'please-wait-x-minutes-before-requesting-new-verification-code': string;
  'too-many-verification-attempts': string;
  'verification-code-has-been-sent': string;
  'verification-request-not-found': string;
  'test-not-found': string;

  'errors.unexpected': string;
  'errors.unauthorized-access': string;
};

export const JOI_EN_TRANSLATION = {
  // ----------------------------------
  // Any (base) validation messages
  // ----------------------------------
  'any.required': '{#label} is required',
  'any.empty': '{#label} cannot be empty',
  'any.unknown': '{#label} is not allowed',
  'any.invalid': '{#label} contains an invalid value',
  'any.only': '{#label} must be {#valids}',
  'any.default': '{#label} threw an error when running default method',
  'any.failover': '{#label} threw an error when running failover method',

  // ----------------------------------
  // String validation messages
  // ----------------------------------
  'string.base': '{#label} must be a string',
  'string.empty': '{#label} cannot be empty',
  'string.min': '{#label} must be at least {#limit} characters long',
  'string.max': '{#label} must be at most {#limit} characters long',
  'string.length': '{#label} must be exactly {#limit} characters long',
  'string.alphanum': '{#label} must only contain alphanumeric characters',
  'string.token': '{#label} must only contain alphanumeric and underscore characters',
  'string.regex.base': '{#label} with value "{#value}" fails to match the required pattern',
  'string.regex.name': '{#label} with value "{#value}" fails to match the {#name} pattern',
  'string.email': '{#label} must be a valid email',
  'string.uri': '{#label} must be a valid URI',
  'string.uri.customScheme':
    '{#label} must be a valid URI with a scheme matching the {#scheme} pattern',
  'string.guid': '{#label} must be a valid GUID',
  'string.hex': '{#label} must only contain hexadecimal characters',
  'string.base64': '{#label} must be a valid base64 string',
  'string.hostname': '{#label} must be a valid hostname',
  'string.lowercase': '{#label} must only contain lowercase characters',
  'string.uppercase': '{#label} must only contain uppercase characters',
  'string.trim': '{#label} must not have leading or trailing whitespace',
  'string.creditCard': '{#label} must be a valid credit card number',
  'string.ref': '{#label} references an invalid value',
  'string.ip': '{#label} must be a valid IP address with a {#cidr} CIDR',
  'string.ipVersion':
    '{#label} must be a valid IP address of one of the following versions {#version} with a {#cidr} CIDR',

  // ----------------------------------
  // Number validation messages
  // ----------------------------------
  'number.base': '{#label} must be a number',
  'number.empty': '{#label} cannot be empty',
  'number.min': '{#label} must be greater than or equal to {#limit}',
  'number.max': '{#label} must be less than or equal to {#limit}',
  'number.less': '{#label} must be less than {#limit}',
  'number.greater': '{#label} must be greater than {#limit}',
  'number.integer': '{#label} must be an integer',
  'number.positive': '{#label} must be a positive number',
  'number.negative': '{#label} must be a negative number',
  'number.precision': '{#label} must have no more than {#limit} decimal places',
  'number.multiple': '{#label} must be a multiple of {#multiple}',
  'number.port': '{#label} must be a valid port number',
  'number.unsafe': '{#label} must be a safe number',

  // ----------------------------------
  // Date validation messages
  // ----------------------------------
  'date.base': '{#label} must be a valid date',
  'date.empty': '{#label} cannot be empty',
  'date.min': '{#label} must be after {#limit}',
  'date.max': '{#label} must be before {#limit}',
  'date.format': '{#label} must be in {#format} format',
  'date.iso': '{#label} must be a valid ISO 8601 date',
  'date.ref': '{#label} references an invalid date',
  'date.strict': '{#label} contains an invalid date',

  // ----------------------------------
  // Array validation messages
  // ----------------------------------
  'array.base': '{#label} must be an array',
  'array.empty': '{#label} cannot be empty',
  'array.min': '{#label} must contain at least {#limit} items',
  'array.max': '{#label} must contain less than or equal to {#limit} items',
  'array.length': '{#label} must contain {#limit} items',
  'array.unique': '{#label} contains a duplicate value',
  'array.hasKnown':
    '{#label} does not contain at least one required match for type "{#patternLabel}"',
  'array.hasUnknown': '{#label} does not contain at least one required match',
  'array.sparse': '{#label} must not be a sparse array',
  'array.sort': '{#label} must be sorted in {#order} order by {#by}',
  'array.sort.unsupported': '{#label} cannot be sorted by "{#by}"',
  'array.single': '{#label} must contain a single value',

  // ----------------------------------
  // Object validation messages
  // ----------------------------------
  'object.base': '{#label} must be an object',
  'object.empty': '{#label} cannot be empty',
  'object.unknown': '{#label} has unknown key(s)',
  'object.min': '{#label} must have at least {#limit} key(s)',
  'object.max': '{#label} must have at most {#limit} key(s)',
  'object.with': '{#label} missing required peer {#peer}',
  'object.without': '{#label} conflict with forbidden peer {#peer}',
  'object.missing': '{#label} must contain at least one of {#peers}',
  'object.xor': '{#label} contains a conflict between exclusive peers {#peers}',
  'object.or': '{#label} must contain at least one of {#peers}',
  'object.and': '{#label} must contain {#present} and {#missing}',
  'object.nand': '{#label} must not contain both {#main} and {#peers}',
  'object.assert': '{#label} is invalid because {#ref} failed to {#message}',
  'object.rename.multiple':
    '{#label} cannot rename "{#from}" because multiple renames are disabled and another key was already renamed to "{#to}"',
  'object.rename.override':
    '{#label} cannot rename "{#from}" because override is disabled and target "{#to}" exists',
  'object.rename.regex.multiple':
    '{#label} cannot rename "{#from}" because multiple renames are disabled and another key was already renamed to "{#to}"',
  'object.rename.regex.override':
    '{#label} cannot rename "{#from}" because override is disabled and target "{#to}" exists',
  'object.schema': '{#label} must be a Joi schema of type {#type}',

  // ----------------------------------
  // Boolean validation messages
  // ----------------------------------
  'boolean.base': '{#label} must be a boolean',
  'boolean.empty': '{#label} cannot be empty',

  // ----------------------------------
  // Binary validation messages
  // ----------------------------------
  'binary.base': '{#label} must be a buffer or a string',
  'binary.empty': '{#label} cannot be empty',
  'binary.min': '{#label} must be at least {#limit} bytes',
  'binary.max': '{#label} must be at most {#limit} bytes',
  'binary.length': '{#label} must be exactly {#limit} bytes',

  // ----------------------------------
  // Alternatives validation messages
  // ----------------------------------
  'alternatives.base': '{#label} does not match any of the allowed types',
  'alternatives.types': '{#label} must be one of {#types}',
  'alternatives.match': '{#label} does not match any of the allowed types',
  'alternatives.one': '{#label} matches more than one allowed type',
  'alternatives.all': '{#label} does not match all of the required types',

  // ----------------------------------
  // Conditional validation messages
  // ----------------------------------
  'conditional.and': '{#label} failed conditional validation due to {#ref}',
  'conditional.or': '{#label} failed conditional validation due to {#ref}',
  'conditional.if': '{#label} failed conditional validation',
  'conditional.switch': '{#label} failed conditional validation for case {#case}',
  'conditional.then': '{#label} failed "then" validation',
  'conditional.otherwise': '{#label} failed "otherwise" validation',

  // ----------------------------------
  // Reference validation messages
  // ----------------------------------
  'ref.unknown': '{#label} references unknown value {#ref}',
  'ref.base': '{#label} must be a reference',
  'ref.function': '{#label} must be a reference function',
  'ref.invalid': '{#label} contains an invalid reference value',
  'ref.not': '{#label} must not be {#ref}',
  'ref.exist': '{#label} must reference an existing value',
  'ref.self': '{#label} cannot reference itself',
};

export const JOI_AR_TRANSLATION = {
  // ----------------------------------
  // Any (base) validation messages
  // ----------------------------------
  'any.required': '{#label} مطلوب',
  'any.empty': '{#label} لا يمكن أن يكون فارغًا',
  'any.unknown': '{#label} غير مسموح به',
  'any.invalid': '{#label} يحتوي على قيمة غير صالحة',
  'any.only': '{#label} يجب أن يكون {#valids}',
  'any.default': '{#label} حدث خطأ أثناء تشغيل الطريقة الافتراضية',
  'any.failover': '{#label} حدث خطأ أثناء تشغيل طريقة failover',

  // ----------------------------------
  // String validation messages
  // ----------------------------------
  'string.base': '{#label} يجب أن يكون نصًا',
  'string.empty': '{#label} لا يمكن أن يكون فارغًا',
  'string.min': '{#label} يجب أن يكون طوله على الأقل {#limit} أحرف',
  'string.max': '{#label} يجب أن يكون طوله على الأكثر {#limit} أحرف',
  'string.length': '{#label} يجب أن يكون طوله بالضبط {#limit} أحرف',
  'string.alphanum': '{#label} يجب أن يحتوي فقط على أحرف أبجدية رقمية',
  'string.token': '{#label} يجب أن يحتوي فقط على أحرف أبجدية رقمية وشرطة سفلية',
  'string.regex.base': '{#label} بالقيمة "{#value}" لا يتطابق مع النمط المطلوب',
  'string.regex.name': '{#label} بالقيمة "{#value}" لا يتطابق مع النمط {#name}',
  'string.email': '{#label} يجب أن يكون بريدًا إلكترونيًا صالحًا',
  'string.uri': '{#label} يجب أن يكون URI صالحًا',
  'string.uri.customScheme': '{#label} يجب أن يكون URI صالحًا بمخطط يتطابق مع النمط {#scheme}',
  'string.guid': '{#label} يجب أن يكون GUID صالحًا',
  'string.hex': '{#label} يجب أن يحتوي فقط على أحرف ست عشرية',
  'string.base64': '{#label} يجب أن يكون نصًا base64 صالحًا',
  'string.hostname': '{#label} يجب أن يكون اسم مضيف صالحًا',
  'string.lowercase': '{#label} يجب أن يحتوي فقط على أحرف صغيرة',
  'string.uppercase': '{#label} يجب أن يحتوي فقط على أحرف كبيرة',
  'string.trim': '{#label} يجب ألا يحتوي على مسافات بادئة أو زائدة',
  'string.creditCard': '{#label} يجب أن يكون رقم بطاقة ائتمان صالحًا',
  'string.ref': '{#label} يشير إلى قيمة غير صالحة',
  'string.ip': '{#label} يجب أن يكون عنوان IP صالحًا مع CIDR {#cidr}',
  'string.ipVersion':
    '{#label} يجب أن يكون عنوان IP صالحًا بإحدى النسخ التالية {#version} مع CIDR {#cidr}',

  // ----------------------------------
  // Number validation messages
  // ----------------------------------
  'number.base': '{#label} يجب أن يكون رقمًا',
  'number.empty': '{#label} لا يمكن أن يكون فارغًا',
  'number.min': '{#label} يجب أن يكون أكبر من أو يساوي {#limit}',
  'number.max': '{#label} يجب أن يكون أقل من أو يساوي {#limit}',
  'number.less': '{#label} يجب أن يكون أقل من {#limit}',
  'number.greater': '{#label} يجب أن يكون أكبر من {#limit}',
  'number.integer': '{#label} يجب أن يكون عددًا صحيحًا',
  'number.positive': '{#label} يجب أن يكون رقمًا موجبًا',
  'number.negative': '{#label} يجب أن يكون رقمًا سالبًا',
  'number.precision': '{#label} يجب ألا يحتوي على أكثر من {#limit} منازل عشرية',
  'number.multiple': '{#label} يجب أن يكون مضاعفًا لـ {#multiple}',
  'number.port': '{#label} يجب أن يكون رقم منفذ صالحًا',
  'number.unsafe': '{#label} يجب أن يكون رقمًا آمنًا',

  // ----------------------------------
  // Date validation messages
  // ----------------------------------
  'date.base': '{#label} يجب أن يكون تاريخًا صالحًا',
  'date.empty': '{#label} لا يمكن أن يكون فارغًا',
  'date.min': '{#label} يجب أن يكون بعد {#limit}',
  'date.max': '{#label} يجب أن يكون قبل {#limit}',
  'date.format': '{#label} يجب أن يكون بتنسيق {#format}',
  'date.iso': '{#label} يجب أن يكون تاريخ ISO 8601 صالحًا',
  'date.ref': '{#label} يشير إلى تاريخ غير صالح',
  'date.strict': '{#label} يحتوي على تاريخ غير صالح',

  // ----------------------------------
  // Array validation messages
  // ----------------------------------
  'array.base': '{#label} يجب أن يكون مصفوفة',
  'array.empty': '{#label} لا يمكن أن يكون فارغًا',
  'array.min': '{#label} يجب أن يحتوي على الأقل على {#limit} عناصر',
  'array.max': '{#label} يجب أن يحتوي على الأكثر على {#limit} عناصر',
  'array.length': '{#label} يجب أن يحتوي على {#limit} عناصر',
  'array.unique': '{#label} يحتوي على قيمة مكررة',
  'array.hasKnown': '{#label} لا يحتوي على تطابق مطلوب واحد على الأقل للنوع "{#patternLabel}"',
  'array.hasUnknown': '{#label} لا يحتوي على تطابق مطلوب واحد على الأقل',
  'array.sparse': '{#label} يجب ألا يكون مصفوفة متفرقة',
  'array.sort': '{#label} يجب أن يتم فرزها بترتيب {#order} حسب {#by}',
  'array.sort.unsupported': '{#label} لا يمكن فرزه حسب "{#by}"',
  'array.single': '{#label} يجب أن يحتوي على قيمة واحدة',

  // ----------------------------------
  // Object validation messages
  // ----------------------------------
  'object.base': '{#label} يجب أن يكون كائنًا',
  'object.empty': '{#label} لا يمكن أن يكون فارغًا',
  'object.unknown': '{#label} يحتوي على مفاتيح غير معروفة',
  'object.min': '{#label} يجب أن يحتوي على الأقل على {#limit} مفاتيح',
  'object.max': '{#label} يجب أن يحتوي على الأكثر على {#limit} مفاتيح',
  'object.with': '{#label} ينقصه الزميل المطلوب {#peer}',
  'object.without': '{#label} يتعارض مع الزميل الممنوع {#peer}',
  'object.missing': '{#label} يجب أن يحتوي على واحد على الأقل من {#peers}',
  'object.xor': '{#label} يحتوي على تعارض بين أقران حصرية {#peers}',
  'object.or': '{#label} يجب أن يحتوي على واحد على الأقل من {#peers}',
  'object.and': '{#label} يجب أن يحتوي على {#present} و {#missing}',
  'object.nand': '{#label} يجب ألا يحتوي على كل من {#main} و {#peers}',
  'object.assert': '{#label} غير صالح لأن {#ref} فشل في {#message}',
  'object.rename.multiple':
    '{#label} لا يمكن إعادة تسمية "{#from}" لأن عمليات إعادة التسمية المتعددة معطلة وقد تمت إعادة تسمية مفتاح آخر بالفعل إلى "{#to}"',
  'object.rename.override':
    '{#label} لا يمكن إعادة تسمية "{#from}" لأن التجاوز معطل والهدف "{#to}" موجود',
  'object.rename.regex.multiple':
    '{#label} لا يمكن إعادة تسمية "{#from}" لأن عمليات إعادة التسمية المتعددة معطلة وقد تمت إعادة تسمية مفتاح آخر بالفعل إلى "{#to}"',
  'object.rename.regex.override':
    '{#label} لا يمكن إعادة تسمية "{#from}" لأن التجاوز معطل والهدف "{#to}" موجود',
  'object.schema': '{#label} يجب أن يكون مخطط Joi من النوع {#type}',

  // ----------------------------------
  // Boolean validation messages
  // ----------------------------------
  'boolean.base': '{#label} يجب أن يكون قيمة منطقية',
  'boolean.empty': '{#label} لا يمكن أن يكون فارغًا',

  // ----------------------------------
  // Binary validation messages
  // ----------------------------------
  'binary.base': '{#label} يجب أن يكون buffer أو نصًا',
  'binary.empty': '{#label} لا يمكن أن يكون فارغًا',
  'binary.min': '{#label} يجب أن يكون على الأقل {#limit} بايت',
  'binary.max': '{#label} يجب أن يكون على الأكثر {#limit} بايت',
  'binary.length': '{#label} يجب أن يكون بالضبط {#limit} بايت',

  // ----------------------------------
  // Alternatives validation messages
  // ----------------------------------
  'alternatives.base': '{#label} لا يتطابق مع أي من الأنواع المسموح بها',
  'alternatives.types': '{#label} يجب أن يكون واحدًا من {#types}',
  'alternatives.match': '{#label} لا يتطابق مع أي من الأنواع المسموح بها',
  'alternatives.one': '{#label} يتطابق مع أكثر من نوع مسموح به',
  'alternatives.all': '{#label} لا يتطابق مع كل الأنواع المطلوبة',

  // ----------------------------------
  // Conditional validation messages
  // ----------------------------------
  'conditional.and': '{#label} فشل في التحقق الشرطي بسبب {#ref}',
  'conditional.or': '{#label} فشل في التحقق الشرطي بسبب {#ref}',
  'conditional.if': '{#label} فشل في التحقق الشرطي',
  'conditional.switch': '{#label} فشل في التحقق الشرطي للحالة {#case}',
  'conditional.then': '{#label} فشل في التحقق "then"',
  'conditional.otherwise': '{#label} فشل في التحقق "otherwise"',

  // ----------------------------------
  // Reference validation messages
  // ----------------------------------
  'ref.unknown': '{#label} يشير إلى قيمة غير معروفة {#ref}',
  'ref.base': '{#label} يجب أن يكون مرجعًا',
  'ref.function': '{#label} يجب أن يكون دالة مرجعية',
  'ref.invalid': '{#label} يحتوي على قيمة مرجعية غير صالحة',
  'ref.not': '{#label} يجب ألا يكون {#ref}',
  'ref.exist': '{#label} يجب أن يشير إلى قيمة موجودة',
  'ref.self': '{#label} لا يمكن أن يشير إلى نفسه',
};
