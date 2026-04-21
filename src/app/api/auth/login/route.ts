import { NextRequest, NextResponse } from "next/server";

const CREDENTIALS: Record<
  string,
  { password: string; role: "SUPER_ADMIN" | "MODERATOR"; name: string }
> = {
  "admin@romeoandjuliet.app": {
    password: "admin123",
    role: "SUPER_ADMIN",
    name: "Admin",
  },
  "mod@romeoandjuliet.app": {
    password: "admin123",
    role: "MODERATOR",
    name: "Moderator",
  },
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const user = CREDENTIALS[email];
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      name: user.name,
      role: user.role,
      email,
    },
  });
}
