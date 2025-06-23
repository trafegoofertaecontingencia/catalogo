'use client'

import { signIn } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FcGoogle } from 'react-icons/fc'

export default function LoginPage() {
  const handleLogin = () => {
    signIn('google', { callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg border-none bg-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Bem-vindo 👋</CardTitle>
          <p className="text-center text-sm text-zinc-400 mt-2">
            Acesse com sua conta Google para continuar
          </p>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            onClick={handleLogin}
            className="w-full bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            <FcGoogle className="text-xl" />
            Entrar com Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
