import React from 'react'

interface TicketDetailsProps {
  movie: {
    id: number
    title: string
    genre: string
    duration: number
    age_rating: string
  }
  showtime: string
}

export default function TicketDetails({ movie, showtime }: TicketDetailsProps) {
  return (
    <>
        <h1>{movie.title}</h1>
        <p><strong>Theater: </strong></p>   
        <p><strong>Auditorium: </strong></p>   
        <p><strong>Genre: </strong>{movie.genre}</p>   
        <p><strong>Duration: </strong>{movie.duration}</p>   
        <p><strong>Age rated: </strong>{movie.age_rating}</p>   
        <p><strong>Start time: </strong>{showtime}</p>   
    </>
  )
}
