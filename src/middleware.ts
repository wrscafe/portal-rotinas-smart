import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  // Cria um cliente Supabase que funciona no middleware (lado servidor)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Verifica se existe um usuário logado
  const { data: { user } } = await supabase.auth.getUser()

  // Rotas que podem ser acessadas sem estar logado
  const rotasPublicas = ['/login', '/esqueci-senha', '/redefinir-senha']
  const isRotaPublica = rotasPublicas.some((rota) =>
    request.nextUrl.pathname.startsWith(rota)
  )

  const isLoginPage = request.nextUrl.pathname.startsWith('/login')

  // Se NÃO está logado e tenta acessar qualquer página que não seja pública
  if (!user && !isRotaPublica) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se JÁ está logado e tenta acessar /login, manda pro dashboard (raiz)
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

// Define em quais rotas o middleware vai rodar
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
