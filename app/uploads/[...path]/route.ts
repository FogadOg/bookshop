import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const filename = segments.join("/");

  // Prevent path traversal
  if (filename.includes("..")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filepath = path.join(process.cwd(), "public", "uploads", filename);

  try {
    const file = await readFile(filepath);
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    const mime: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
      avif: "image/avif",
    };
    return new NextResponse(file, {
      headers: {
        "Content-Type": mime[ext] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
