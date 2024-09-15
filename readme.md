# Logged4node

A customizable logging utility for Node.js applications that supports both console and file-based logging with log rotation. This logger helps manage your log files efficiently by rotating files when they reach a specified size.

## Features

- Log messages to both the console and file.
- Supports different log levels: `info`, `debug`, and `error`.
- Automatic log file rotation when files reach a specified size.
- Customizable log directory and log file size.
- Synchronous and asynchronous logging operations.

## Installation

```bash
npm install logged4node
```

# Usage

```javascript
const Logger = require('logged4node');

const logger = new Logger({
  type: 'file',               // Choose 'console' or 'file'
  pathToLog: './logs',         // Directory where logs will be stored
  size: 5 * 1024 * 1024        // Maximum log file size in bytes (default 5MB)
});

// Log messages at different levels
logger.info('This is an info message');
logger.error('This is an error message');
logger.debug('This is a debug message');
```

# Example

```javascript
const Logger = require('logged4node');

// Create a logger instance for file logging
const logger = new Logger({
  type: 'file',
  pathToLog: './logs',          // Log files will be stored here
  size: 2 * 1024 * 1024         // Each log file will be up to 2MB
});

// Log messages
logger.info('Application started');
logger.error('An error occurred');
logger.debug('Debugging info');

// For console logging
const consoleLogger = new Logger({
  type: 'console'
});

consoleLogger.info('This will log to the console');

```
