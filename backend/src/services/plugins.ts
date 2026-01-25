import { Express, Request, Response } from "express";
import { AppConfig } from "./config.js";
import { Db } from "./db.js";
import { builtinPlugins } from "../plugins/index.js";

export type PluginContext = {
  config: AppConfig;
  db: Db;
};

export type PluginMeta = {
  id: string;
  name: string;
  version: string;
  description: string;
  routes: string[];
};

export type RavixPlugin = {
  meta: PluginMeta;
  register: (app: Express, ctx: PluginContext) => void;
};

export function registerPlugins(app: Express, ctx: PluginContext) {
  const plugins: RavixPlugin[] = builtinPlugins;

  for (const p of plugins) {
    p.register(app, ctx);
  }

  app.get("/api/v1/plugins", (_req: Request, res: Response) => {
    res.json({ plugins: plugins.map((p) => p.meta) });
  });
}
