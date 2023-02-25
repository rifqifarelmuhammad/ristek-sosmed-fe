import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthContextProvider } from '../Authentication/authContext'
import { useRouter } from 'next/router'
import ProtectedRoute from '../components/proctectedRoute';
import { ChakraProvider } from '@chakra-ui/react'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const noAuthProtected = ['/login', '/signup']

  return (
    <AuthContextProvider>
    {noAuthProtected.includes(router.pathname) ? (
      <Component {...pageProps} />
    ) : (
      <ProtectedRoute>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </ProtectedRoute>
    )
    }
    </AuthContextProvider>
  )
}
