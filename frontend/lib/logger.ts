import pino, { Logger } from "pino";
import "pino-pretty";
export const logger: Logger =
  process.env.NODE_ENV === "production"
    ? // JSON in production
      pino({
        level: process.env.LOG_LEVEL || "info",
        transport: {
          targets: [
            {
              target: "pino/file",
              options: { destination: `${process.env.LOG_DIR}/frontend.log` },
              level: process.env.LOG_LEVEL || "info",
            },
            {
              target: "pino-pretty",
              options: {
                colorize: true,
              },
              level: process.env.LOG_LEVEL || "info",
            },
          ],
        },
      })
    : // Pretty print in development
      pino({
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
        level: "trace",
      });
