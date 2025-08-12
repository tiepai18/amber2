import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value) // Update request cookies for the current chain
            response.cookies.set(name, value, options) // Set cookies on the response to send to the browser
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const userRole = session?.user?.app_metadata?.role ?? 'customer'
  const { pathname } = request.nextUrl

  const protectedRoutes = ['/profile', '/orders', '/admin']
  const adminRoutes = ['/admin']
  const authRoutes = ['/login', '/register']

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.includes(pathname)

  if (!session && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }

  if (session && isAdminRoute && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
