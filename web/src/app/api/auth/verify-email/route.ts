import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const profile = await prisma.profile.findFirst({
    where: { verificationToken: token },
  });

  if (!profile) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      emailVerified: new Date(),
      verificationToken: null,
    },
  });

  return NextResponse.json({ success: true, message: "Email verified successfully" });
}

export async function POST() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = crypto.randomUUID();

  await prisma.profile.update({
    where: { id: user.id },
    data: { verificationToken: token },
  });

  return NextResponse.json({ success: true, token });
}
