import { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext'; // Import the AuthProvider

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
  );
}

export default MyApp;
