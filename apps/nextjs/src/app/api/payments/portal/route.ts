import { NextResponse } from "next/server";
import { api } from "~/trpc/server";

export async function GET() {
  const portal = await api.payments.create_portal_session();

  if (!portal.url) {
    return NextResponse.redirect("/");
  }

  return NextResponse.redirect(portal.url);
}
