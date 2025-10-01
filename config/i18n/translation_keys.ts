export type TranslationKeys = {
  'login-successful': string;
  'logout-successfully': string;
  'register-successful': string;
  'user-not-found': string;
  'no-file-received': string;
  'role_not_found': string;
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
  'product-created-successfully': string;
  'product-updated-successfully': string;
  'product-deleted-successfully': string;
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

export const JOI_FA_TRANSLATION = {
  // ----------------------------------
  // Any (base) validation messages
  // ----------------------------------
  'any.required': '{#label} الزامی است',
  'any.empty': '{#label} نمی‌تواند خالی باشد',
  'any.unknown': '{#label} مجاز نیست',
  'any.invalid': '{#label} حاوی مقدار نامعتبر است',
  'any.only': '{#label} باید {#valids} باشد',
  'any.default': '{#label} خطا در اجرای متد پیش‌فرض رخ داد',
  'any.failover': '{#label} خطا در اجرای متد failover رخ داد',
  // ----------------------------------
  // String validation messages
  // ----------------------------------
  'string.base': '{#label} باید یک متن باشد',
  'string.empty': '{#label} نمی‌تواند خالی باشد',
  'string.min': '{#label} باید حداقل {#limit} کاراکتر باشد',
  'string.max': '{#label} باید حداکثر {#limit} کاراکتر باشد',
  'string.length': '{#label} باید دقیقاً {#limit} کاراکتر باشد',
  'string.alphanum': '{#label} فقط باید شامل حروف الفبا و اعداد باشد',
  'string.token': '{#label} فقط باید شامل حروف الفبا، اعداد و خط زیر باشد',
  'string.regex.base': '{#label} با مقدار "{#value}" با الگوی مورد نیاز مطابقت ندارد',
  'string.regex.name': '{#label} با مقدار "{#value}" با الگوی {#name} مطابقت ندارد',
  'string.email': '{#label} باید یک ایمیل معتبر باشد',
  'string.uri': '{#label} باید یک URI معتبر باشد',
  'string.uri.customScheme': '{#label} باید یک URI معتبر با طرح مطابق با الگوی {#scheme} باشد',
  'string.guid': '{#label} باید یک GUID معتبر باشد',
  'string.hex': '{#label} فقط باید شامل کاراکترهای هگزادسیمال باشد',
  'string.base64': '{#label} باید یک متن base64 معتبر باشد',
  'string.hostname': '{#label} باید یک نام میزبان معتبر باشد',
  'string.lowercase': '{#label} فقط باید شامل حروف کوچک باشد',
  'string.uppercase': '{#label} فقط باید شامل حروف بزرگ باشد',
  'string.trim': '{#label} نباید دارای فضای خالی ابتدا یا انتها باشد',
  'string.creditCard': '{#label} باید یک شماره کارت اعتباری معتبر باشد',
  'string.ref': '{#label} به یک مقدار نامعتبر اشاره می‌کند',
  'string.ip': '{#label} باید یک آدرس IP معتبر با CIDR {#cidr} باشد',
  'string.ipVersion':
    '{#label} باید یک آدرس IP معتبر با یکی از نسخه‌های {#version} با CIDR {#cidr} باشد',
  // ----------------------------------
  // Number validation messages
  // ----------------------------------
  'number.base': '{#label} باید یک عدد باشد',
  'number.empty': '{#label} نمی‌تواند خالی باشد',
  'number.min': '{#label} باید بزرگتر یا مساوی {#limit} باشد',
  'number.max': '{#label} باید کوچکتر یا مساوی {#limit} باشد',
  'number.less': '{#label} باید کوچکتر از {#limit} باشد',
  'number.greater': '{#label} باید بزرگتر از {#limit} باشد',
  'number.integer': '{#label} باید یک عدد صحیح باشد',
  'number.positive': '{#label} باید یک عدد مثبت باشد',
  'number.negative': '{#label} باید یک عدد منفی باشد',
  'number.precision': '{#label} نباید بیش از {#limit} رقم اعشار داشته باشد',
  'number.multiple': '{#label} باید مضربی از {#multiple} باشد',
  'number.port': '{#label} باید یک شماره پورت معتبر باشد',
  'number.unsafe': '{#label} باید یک عدد امن باشد',
  // ----------------------------------
  // Date validation messages
  // ----------------------------------
  'date.base': '{#label} باید یک تاریخ معتبر باشد',
  'date.empty': '{#label} نمی‌تواند خالی باشد',
  'date.min': '{#label} باید بعد از {#limit} باشد',
  'date.max': '{#label} باید قبل از {#limit} باشد',
  'date.format': '{#label} باید با فرمت {#format} باشد',
  'date.iso': '{#label} باید یک تاریخ ISO 8601 معتبر باشد',
  'date.ref': '{#label} به یک تاریخ نامعتبر اشاره می‌کند',
  'date.strict': '{#label} حاوی تاریخ نامعتبر است',
  // ----------------------------------
  // Array validation messages
  // ----------------------------------
  'array.base': '{#label} باید یک آرایه باشد',
  'array.empty': '{#label} نمی‌تواند خالی باشد',
  'array.min': '{#label} باید حداقل {#limit} آیتم داشته باشد',
  'array.max': '{#label} باید حداکثر {#limit} آیتم داشته باشد',
  'array.length': '{#label} باید {#limit} آیتم داشته باشد',
  'array.unique': '{#label} حاوی مقدار تکراری است',
  'array.hasKnown': '{#label} حداقل یک تطابق مورد نیاز برای نوع "{#patternLabel}" ندارد',
  'array.hasUnknown': '{#label} حداقل یک تطابق مورد نیاز ندارد',
  'array.sparse': '{#label} نباید یک آرایه پراکنده باشد',
  'array.sort': '{#label} باید به ترتیب {#order} بر اساس {#by} مرتب شود',
  'array.sort.unsupported': '{#label} نمی‌تواند بر اساس "{#by}" مرتب شود',
  'array.single': '{#label} باید یک مقدار واحد داشته باشد',
  // ----------------------------------
  // Object validation messages
  // ----------------------------------
  'object.base': '{#label} باید یک شیء باشد',
  'object.empty': '{#label} نمی‌تواند خالی باشد',
  'object.unknown': '{#label} حاوی کلیدهای ناشناخته است',
  'object.min': '{#label} باید حداقل {#limit} کلید داشته باشد',
  'object.max': '{#label} باید حداکثر {#limit} کلید داشته باشد',
  'object.with': '{#label} فاقد همتای مورد نیاز {#peer} است',
  'object.without': '{#label} با همتای ممنوع {#peer} در تضاد است',
  'object.missing': '{#label} باید حداقل یکی از {#peers} را داشته باشد',
  'object.xor': '{#label} حاوی تضاد بین همتاهای انحصاری {#peers} است',
  'object.or': '{#label} باید حداقل یکی از {#peers} را داشته باشد',
  'object.and': '{#label} باید هم {#present} و هم {#missing} را داشته باشد',
  'object.nand': '{#label} نباید هم {#main} و هم {#peers} را داشته باشد',
  'object.assert': '{#label} نامعتبر است زیرا {#ref} در {#message} شکست خورد',
  'object.rename.multiple':
    '{#label} نمی‌تواند "{#from}" را تغییر نام دهد زیرا تغییر نام چندگانه غیرفعال است و کلید دیگری قبلاً به "{#to}" تغییر نام داده شده است',
  'object.rename.override':
    '{#label} نمی‌تواند "{#from}" را تغییر نام دهد زیرا بازنویسی غیرفعال است و مقصد "{#to}" وجود دارد',
  'object.rename.regex.multiple':
    '{#label} نمی‌تواند "{#from}" را تغییر نام دهد زیرا تغییر نام چندگانه غیرفعال است و کلید دیگری قبلاً به "{#to}" تغییر نام داده شده است',
  'object.rename.regex.override':
    '{#label} نمی‌تواند "{#from}" را تغییر نام دهد زیرا بازنویسی غیرفعال است و مقصد "{#to}" وجود دارد',
  'object.schema': '{#label} باید یک اسکیمای Joi از نوع {#type} باشد',
  // ----------------------------------
  // Boolean validation messages
  // ----------------------------------
  'boolean.base': '{#label} باید یک مقدار بولین باشد',
  'boolean.empty': '{#label} نمی‌تواند خالی باشد',
  // ----------------------------------
  // Binary validation messages
  // ----------------------------------
  'binary.base': '{#label} باید یک بافر یا متن باشد',
  'binary.empty': '{#label} نمی‌تواند خالی باشد',
  'binary.min': '{#label} باید حداقل {#limit} بایت باشد',
  'binary.max': '{#label} باید حداکثر {#limit} بایت باشد',
  'binary.length': '{#label} باید دقیقاً {#limit} بایت باشد',
  // ----------------------------------
  // Alternatives validation messages
  // ----------------------------------
  'alternatives.base': '{#label} با هیچ یک از انواع مجاز مطابقت ندارد',
  'alternatives.types': '{#label} باید یکی از {#types} باشد',
  'alternatives.match': '{#label} با هیچ یک از انواع مجاز مطابقت ندارد',
  'alternatives.one': '{#label} با بیش از یک نوع مجاز مطابقت دارد',
  'alternatives.all': '{#label} با تمام انواع مورد نیاز مطابقت ندارد',
  // ----------------------------------
  // Conditional validation messages
  // ----------------------------------
  'conditional.and': '{#label} در اعتبارسنجی شرطی به دلیل {#ref} شکست خورد',
  'conditional.or': '{#label} در اعتبارسنجی شرطی به دلیل {#ref} شکست خورد',
  'conditional.if': '{#label} در اعتبارسنجی شرطی شکست خورد',
  'conditional.switch': '{#label} در اعتبارسنجی شرطی برای حالت {#case} شکست خورد',
  'conditional.then': '{#label} در اعتبارسنجی "then" شکست خورد',
  'conditional.otherwise': '{#label} در اعتبارسنجی "otherwise" شکست خورد',
  // ----------------------------------
  // Reference validation messages
  // ----------------------------------
  'ref.unknown': '{#label} به مقدار ناشناخته {#ref} اشاره می‌کند',
  'ref.base': '{#label} باید یک مرجع باشد',
  'ref.function': '{#label} باید یک تابع مرجع باشد',
  'ref.invalid': '{#label} حاوی مقدار مرجع نامعتبر است',
  'ref.not': '{#label} نباید {#ref} باشد',
  'ref.exist': '{#label} باید به یک مقدار موجود اشاره کند',
  'ref.self': '{#label} نمی‌تواند به خودش اشاره کند',
};