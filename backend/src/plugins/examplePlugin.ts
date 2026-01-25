import { Express, Request, Response } from "express";
import { z } from "zod";
import { RavixPlugin } from "../services/plugins.js";

const EchoSchema = z.object({
  text: z.string().min(1).max(500)
});

export const examplePlugin: RavixPlugin = {
  meta: {
    id: "example.hello",
    name: "Example Plugin",
    version: "0.1.0",
    description: "Plugin de ejemplo para demostrar metadata, validación (zod) y registro de rutas.",
    routes: ["GET /api/v1/plugins/example/hello", "POST /api/v1/plugins/example/echo"]
  },
  register: (app: Express, ctx) => {
    app.get("/api/v1/plugins/example/hello", (_req: Request, res: Response) => {
      res.json({ message: "hello from plugin" });
    });

    app.post("/api/v1/plugins/example/echo", (req: Request, res: Response) => {
      const parsed = EchoSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "invalid_body" });
        return;
      }

      res.json({
        echo: parsed.data.text,
        nodeEnv: ctx.config.nodeEnv
      });
    });
  }
};
