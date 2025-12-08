import { useMemo, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function Checkout() {

    const { state } = useLocation()
    const adultTicket = state?.adultTicket
    const childTicket = state?.childTicket
    const showtime_id = state?.showtime_id
    const email = state?.email
    const activeSeats = state?.activeSeats

    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const promise = useMemo(() => {
        console.log({
              showtime_id,
              adult_ticket: adultTicket,
              child_ticket: childTicket,
              email,
              seat_numbers: activeSeats,
              status: 'reserved',
            });

        return fetch(`${BACKEND_URL}/api/customer/create-checkout-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                showtime_id: showtime_id,
                adult_ticket: adultTicket,
                child_ticket: childTicket,
                email: email,
                seat_numbers: activeSeats,
                status: 'reserved',
            })
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`)
                }
                return res.json()
            })
            .then((data) => {
                console.log('/create-checkout-session response', data)
                if (data.error) {
                    throw new Error(data.error)
                }
                return data.client_secret
            })
            .catch((err) => {
                console.error('Error creating checkout session:', err)
                throw err
            })
    }, [showtime_id, adultTicket, childTicket, email, activeSeats])

    useEffect(() => {
    promise.then(secret => setClientSecret(secret));
  }, [promise]);


  if (!clientSecret) return <p>Loading checkout…</p>;

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{clientSecret}}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}
