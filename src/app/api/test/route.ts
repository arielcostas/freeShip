import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Prueba de API funcionando" });
}
