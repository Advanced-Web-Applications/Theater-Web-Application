

export default function StaffDashboard() {
  return (
    <div>
        <div style={{backgroundColor:"#1B2A40", color:"white", padding:"4px 10px", textAlign:"center"}}>
            <h1>Auditorium</h1>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"10px", padding:"10px"}}>
            <div style={{backgroundColor:"#f0f0f0", padding:"10px", textAlign:"center"}}>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
        </div>
    </div>
  )
}
