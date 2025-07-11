/*import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router";
import { router } from './router/router.jsx';
import AuthProvider from './contexts/AuthProvider.jsx';




createRoot(document.getElementById('root')).render(
  <StrictMode>

    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>

  </StrictMode>,
)
/////////////////////////////////

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './router/router.jsx'
import AuthProvider from './contexts/AuthProvider.jsx'

// Stripe Imports
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

// Stripe Publishable Key
const stripePromise = loadStripe(import.meta.env.VITE_paymentKey) // Replace with your real key

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Elements>
  </StrictMode>
)
*/

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './router/router.jsx'
import AuthProvider from './contexts/AuthProvider.jsx'

// Stripe Imports
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

// TanStack Query Imports
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Stripe Publishable Key
const stripePromise = loadStripe(import.meta.env.VITE_paymentKey)

// Create QueryClient instance
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Elements stripe={stripePromise}>

        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>

      </Elements>
    </QueryClientProvider>
  </StrictMode>
)
