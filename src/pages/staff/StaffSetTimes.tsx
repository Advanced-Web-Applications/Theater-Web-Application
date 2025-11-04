import React from 'react'

export default function StaffSetTimes() {
  return (
    <div>
        <div>
            <label htmlFor="MovieName">Movie Name:</label>
            <select id="MovieName" name="MovieName">
                <option value="Movie1">Chainsaw man</option>
                <option value="Movie2">Demon Slayer</option>
                <option value="Movie3">Jujutsu Kaisen</option>
            </select>

            <label htmlFor="ShowDate">Show Date:</label>
            <select id="ShowDate" name="ShowDate">
                <option value="Date1">2024-07-01</option>
                <option value="Date2">2024-07-02</option>
                <option value="Date3">2024-07-03</option>
            </select>

            <label htmlFor="ShowTime">Show Time:</label>
            <select id="ShowTime" name="ShowTime">
                <option value="Time1">12:00 PM</option>
                <option value="Time2">3:00 PM</option>
                <option value="Time3">6:00 PM</option>
            </select>
        </div>

    </div>
  )
}
