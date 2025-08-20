import '@testing-library/jest-dom';

// Polyfill for TextEncoder in Jest (Node.js)
const util = require('util');

(global as any).TextEncoder = util.TextEncoder;
(global as any).TextDecoder = util.TextDecoder;
