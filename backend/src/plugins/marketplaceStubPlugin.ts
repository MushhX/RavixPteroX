import { Express, Request, Response } from "express";
import { RavixPlugin } from "../services/plugins.js";

export const marketplaceStubPlugin: RavixPlugin = {
  meta: {
    id: "marketplace.stub",
    name: "Marketplace Stub",
    version: "0.1.0",
    description: "Ejemplo de marketplace (stub) con catálogo estático y endpoint de compra no implementado.",
    routes: [
      "GET /api/v1/marketplace/items",
      "GET /api/v1/marketplace/items/:id",
      "POST /api/v1/marketplace/purchase"
    ]
  },
  register: (app: Express) => {
    const items = [
      {
        id: "theme.neon",
        type: "theme",
        name: "Neon Theme",
        priceEur: 9.99,
        revenueShare: { creatorPercent: 95, panelPercent: 5 }
      },
      {
        id: "plugin.tickets",
        type: "plugin",
        name: "Support Tickets",
        priceEur: 14.99,
        revenueShare: { creatorPercent: 95, panelPercent: 5 }
      }
    ];

    app.get("/api/v1/marketplace/items", (_req: Request, res: Response) => {
      res.json({
        items
      });
    });

    app.get("/api/v1/marketplace/items/:id", (req: Request, res: Response) => {
      const item = items.find((x) => x.id === req.params.id);
      if (!item) {
        res.status(404).json({ error: "not_found" });
        return;
      }
      res.json({ item });
    });

    app.post("/api/v1/marketplace/purchase", (_req: Request, res: Response) => {
      res.status(501).json({ error: "marketplace_stub" });
    });
  }
};
