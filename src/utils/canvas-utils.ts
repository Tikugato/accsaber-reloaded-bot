import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ASSETS = existsSync(join(process.cwd(), "src", "assets"))
  ? join(process.cwd(), "src", "assets")
  : join(process.cwd(), "assets");

const FONTS_DIR = join(ASSETS, "fonts");
export const ASSETS_DIR = ASSETS;

export const BG_BASE = "#0a0a0f";
export const BG_ELEVATED = "#1e1e2e";
export const BG_OVERLAY = "#2a2a3a";
export const TEXT_PRIMARY = "#e8e8f0";
export const TEXT_SECONDARY = "#8888a0";
export const TEXT_TERTIARY = "#5a5a72";
export const SUCCESS = "#22c55e";
const ERROR = "#ef4444";

export const CATEGORY_HEX: Record<string, string> = {
  overall: "#a855f7",
  true_acc: "#22c55e",
  standard_acc: "#3b82f6",
  tech_acc: "#ef4444",
  low_mid: "#eab308",
};

export const CATEGORY_LABEL: Record<string, string> = {
  overall: "Overall",
  true_acc: "True Acc",
  standard_acc: "Standard Acc",
  tech_acc: "Tech Acc",
  low_mid: "Low Mid",
};

export const SANS = '"Inter", "Noto Sans JP", "Segoe UI", sans-serif';
export const MONO = '"Cascadia", "Cascadia Code", "Noto Sans JP", "Consolas", monospace';

let fontsRegistered = false;

export function registerFonts(): void {
  if (fontsRegistered) return;
  fontsRegistered = true;
  const register = (file: string, family: string) => {
    const path = join(FONTS_DIR, file);
    if (existsSync(path)) GlobalFonts.registerFromPath(path, family);
  };
  register("Inter.ttf", "Inter");
  register("CascadiaCode-Regular.ttf", "Cascadia");
  register("CascadiaCode-Bold.ttf", "Cascadia");
  register("NotoSansJP.ttf", "Noto Sans JP");
}

export type Ctx = ReturnType<ReturnType<typeof createCanvas>["getContext"]>;

export function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.closePath();
}

export function drawRoundedRect(
  ctx: Ctx, x: number, y: number, w: number, h: number, r: number,
  fill: string, stroke?: string
): void {
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

export async function fetchImage(url: string): Promise<ReturnType<typeof loadImage>> {
  const res = await fetch(url);
  return loadImage(Buffer.from(await res.arrayBuffer()));
}

export function numberFmt(n: number, decimals: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function ageInDays(dateStr: string): number {
  return (Date.now() - new Date(dateStr).getTime()) / 86_400_000;
}

export function relativeTime(dateStr: string): string {
  const days = ageInDays(dateStr);
  if (days < 0.0007) return "just now";
  const mins = Math.floor(days * 1440);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(days * 24);
  if (hrs < 24) return `${hrs}h ago`;
  const d = Math.floor(days);
  if (d < 7) return `${d}d ago`;
  const weeks = Math.floor(d / 7);
  if (d < 30) return `${weeks}w ago`;
  const months = Math.floor(d / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

export function ageColor(dateStr: string): string {
  const days = ageInDays(dateStr);
  if (days < 7) return TEXT_PRIMARY;
  if (days >= 365) return TEXT_TERTIARY;
  const pr = [0xe8, 0xe8, 0xf0];
  const sc = [0x88, 0x88, 0xa0];
  const tr = [0x5a, 0x5a, 0x72];
  let t: number;
  let from: number[];
  let to: number[];
  if (days < 30) {
    t = (days - 7) / 23;
    from = pr;
    to = sc;
  } else {
    t = Math.min((days - 30) / 335, 1);
    from = sc;
    to = tr;
  }
  const r = Math.round(from[0] + (to[0] - from[0]) * t);
  const g = Math.round(from[1] + (to[1] - from[1]) * t);
  const b = Math.round(from[2] + (to[2] - from[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export function trendStr(
  value: number | null | undefined,
  invert = false
): { text: string; color: string } {
  if (value == null || Math.abs(value) < 0.005) return { text: "", color: TEXT_TERTIARY };
  const positive = invert ? value < 0 : value > 0;
  const arrow = positive ? "\u25B2" : "\u25BC";
  const abs = Math.abs(value);
  const formatted = Number.isInteger(abs) ? String(abs) : abs.toFixed(2);
  return {
    text: `${arrow} ${formatted}`,
    color: positive ? SUCCESS : ERROR,
  };
}

export function formatDifficulty(diff: string): string {
  const map: Record<string, string> = {
    EASY: "Easy",
    NORMAL: "Normal",
    HARD: "Hard",
    EXPERT: "Expert",
    EXPERT_PLUS: "Expert+",
  };
  return map[diff] ?? diff;
}


