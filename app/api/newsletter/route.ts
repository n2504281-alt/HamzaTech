import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";
import { newsletterService } from "@/services/newsletterService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate inputs
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid inputs" },
        { status: 400 }
      );
    }

    const { data, error } = await newsletterService.subscribe(parsed.data.email);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
