import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables are missing! Skipping session update in middleware.");
    return response;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // refreshing the auth token
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protected routes — redirect unauthenticated users to /login
    const protectedPaths = ["/profile", "/admin"];
    const isProtectedRoute = protectedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    if (isProtectedRoute && !user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Admin-only protection
    if (user && request.nextUrl.pathname.startsWith("/admin")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        const homeUrl = request.nextUrl.clone();
        homeUrl.pathname = "/";
        return NextResponse.redirect(homeUrl);
      }
    }

    // Auth pages — redirect authenticated users away from login/signup
    const authPaths = ["/login", "/signup"];
    const isAuthRoute = authPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    if (isAuthRoute && user) {
      const profileUrl = request.nextUrl.clone();
      profileUrl.pathname = "/profile";
      return NextResponse.redirect(profileUrl);
    }
  } catch (error) {
    console.error("Supabase middleware updateSession error:", error);
  }

  return response;
}
