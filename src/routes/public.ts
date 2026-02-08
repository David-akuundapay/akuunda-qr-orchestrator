import { Router, Request, Response } from "express";
import { getPaymentOptions } from "../services/discovery";
import { createMeldSession } from "../services/meld";
import { createYellowCardCollection } from "../services/yellowcard";

const router = Router();

/* ── Health ─────────────────────────────────────────────── */
router.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

/* ── Discovery ──────────────────────────────────────────── */
router.get("/payment-options", async (req: Request, res: Response) => {
  const countryCode = String(req.query.countryCode || "").toUpperCase();
  if (!countryCode) {
    res.status(400).json({ error: "countryCode_required" });
    return;
  }

  const result = await getPaymentOptions(countryCode);
  res.json(result);
});

/* ── On-Ramp ────────────────────────────────────────────── */
router.post("/on-ramp/create", async (req: Request, res: Response) => {
  const { engine } = req.body || {};
  if (!engine) {
    res.status(400).json({ error: "engine_required" });
    return;
  }

  try {
    if (engine === "MELD") {
      const r: any = await createMeldSession(req.body);
      res.json({
        redirectUrl: r.widgetUrl || r.redirectUrl || r.url,
        raw: r,
      });
      return;
    }

    if (engine === "YELLOWCARD") {
      const r: any = await createYellowCardCollection(req.body);
      res.json({
        redirectUrl: r.redirectUrl || r.url,
        raw: r,
      });
      return;
    }

    res.status(400).json({ error: "engine_not_supported" });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: "create_failed", detail: message });
  }
});

export default router;
