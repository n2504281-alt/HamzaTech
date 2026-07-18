import { NextResponse } from "next/server";
import { productService } from "@/services/productService";

export async function GET() {
  try {
    const { data, error } = await productService.getProducts();

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
