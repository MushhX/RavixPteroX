import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { registerAuthRoutes } from "./routes/auth.js";
import { registerAdminRoutes } from "./routes/admin.js";
import { registerHealthRoutes } from "./routes/health.js";
import { registerPteroRoutes } from "./routes/ptero.js";
import { loadConfig } from "./services/config.js";
import { initDb } from "./services/db.js";
import { registerPlugins } from "./services/plugins.js";

dotenv.config();

const config = loadConfig(process.env);
const db = initDb(config);

const app = express();

app.set("trust proxy", 1);

app.use(
  pinoHttp({
    redact: {
      paths: [
        "req.headers.authorization",
        "req.headers.cookie",
        "req.body.password",
        "req.body.refreshToken"
      ],
      remove: true
    }
  })
);

app.use(
  cors({
    origin: config.frontendOrigin,
    credentials: true
  })
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: "draft-7",
    legacyHeaders: false
  })
);

registerHealthRoutes(app, { config });
registerAuthRoutes(app, { config, db });
registerAdminRoutes(app, { config, db });
registerPteroRoutes(app, { config, db });
registerPlugins(app, { config, db });

app.listen(config.port, () => {
  console.log(`RavixPteroX backend listening on :${config.port}`);
});
