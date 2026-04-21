import { NextResponse } from "next/server";
import { MEMBERS, REFERRALS } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    members: MEMBERS,
    referrals: REFERRALS,
  });
}
