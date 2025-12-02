import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import Barcode from "react-barcode";

const API_URL = import.meta.env.VITE_API_URL

interface PaymentStatus {
    id: string
    payment_status: string
    currency: string
    amount_total: number
    customer_email: string
} 

export default function SuccessView() {

    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const [session, setSession] = useState<PaymentStatus | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const sessionId = searchParams.get('session_id')

    useEffect(() => {
        if (sessionId) {
            fetch(`${API_URL}/api/customer/session-status?session_id=${sessionId}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`)
                    }
                    return res.json()
                })
                .then((data) => {
                    if (data.error) {
                        throw new Error(data.error)
                    }
                    setSession(data)
                    setLoading(false)
                })
                .catch((err) => {
                    setError(err.message)
                    setLoading(false)
                })
        } else {
            setError('No session ID provided')
            setLoading(false)
        }
    }, [sessionId])

    if (loading) return <div>Loading payment status...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!session) return <div>No session found</div>;

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Payment Successful!</h1>
      <h3>This is your ticket!</h3>
      <div style={{ marginTop: '20px', marginBottom: '20px', padding: '15px', backgroundColor: '#f0f8ff', color: 'black', borderRadius: '8px' }}>
        <h3>Movie name</h3>
        <p><strong>Theater:</strong> {session.id}</p>
        <p><strong>Date:</strong> {session.payment_status}</p>
        <p><strong>Total:</strong> {(session.amount_total / 100).toFixed(2)} {session.currency?.toUpperCase()}</p>
        <p><strong>Customer Email:</strong> {session.customer_email}</p>
      </div>
      <Barcode value={session.id} height={80} width={0.7} displayValue={false}/>
      <button
        onClick={() => navigate('/')}
        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        Back to Start
      </button>
    </div>
  )
}
