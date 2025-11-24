// Task status constants
const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Task priority constants
const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// User role constants
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// Theme constants
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Recurring pattern constants
const RECURRING_PATTERNS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
};

// Default category colors
const DEFAULT_CATEGORY_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#eab308', // Yellow
  '#84cc16', // Lime
  '#22c55e', // Green
  '#10b981', // Emerald
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#0ea5e9', // Sky
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#a855f7', // Purple
  '#d946ef', // Fuchsia
  '#ec4899', // Pink
  '#f43f5e'  // Rose
];

// Default category icons
const DEFAULT_CATEGORY_ICONS = [
  'folder',
  'briefcase',
  'heart',
  'book',
  'shopping-cart',
  'home',
  'car',
  'plane',
  'star',
  'bell',
  'camera',
  'music',
  'video',
  'phone',
  'mail',
  'calendar',
  'clock',
  'map',
  'tag',
  'flag'
];

// API response messages
const MESSAGES = {
  SUCCESS: {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    RETRIEVED: 'Resource retrieved successfully'
  },
  ERROR: {
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    VALIDATION_ERROR: 'Validation error',
    SERVER_ERROR: 'Internal server error',
    DUPLICATE: 'Resource already exists'
  }
};

// HTTP status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
};

// Database limits
const DB_LIMITS = {
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_SIZE: 10,
  MAX_TASK_TITLE_LENGTH: 100,
  MAX_TASK_DESCRIPTION_LENGTH: 500,
  MAX_CATEGORY_NAME_LENGTH: 50,
  MAX_USER_NAME_LENGTH: 50,
  MAX_PASSWORD_LENGTH: 128,
  MIN_PASSWORD_LENGTH: 6
};

module.exports = {
  TASK_STATUS,
  TASK_PRIORITY,
  USER_ROLES,
  THEMES,
  RECURRING_PATTERNS,
  DEFAULT_CATEGORY_COLORS,
  DEFAULT_CATEGORY_ICONS,
  MESSAGES,
  HTTP_STATUS,
  DB_LIMITS
};

