import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  let url = "";

  if (q) {
    url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5`;
  } else if (lat && lon) {
    url = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`;
  } else {
    return NextResponse.json({ error: "Parameter tidak valid" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "GreenMarket/1.0" },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Photon error:", err);
    return NextResponse.json({ error: "Gagal fetch" }, { status: 500 });
  }
}