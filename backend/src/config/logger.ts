import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const { combine, timestamp, printf, colorize, align } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: 'info', // Default level
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), align(), logFormat),
  transports: [
    // 🔴 Error log file
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),

    // 🟡 Warning log file
    new winston.transports.File({
      filename: path.join(logDir, 'warn.log'),
      level: 'warn',
    }),

    // 🟢 Combined log file (all levels)
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    }),
  ],
});

// 🖥️ Also log to console in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), logFormat),
    }),
  );
}

export default logger;
