import '@testing-library/jest-dom'

// TextEncoder/TextDecoder polyfill for Node.js environment
global.TextEncoder = global.TextEncoder || require('util').TextEncoder
global.TextDecoder = global.TextDecoder || require('util').TextDecoder
