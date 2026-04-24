function Sk({ w = '100%', h = 20, r = 8, style = {} }) {
  return (
    <div className="sk-box" style={{ width: w, height: h, borderRadius: r, ...style }} />
  )
}

function SkCard({ h = 280 }) {
  return (
    <div className="sk-card">
      <Sk h={h} r={10} />
      <div style={{ padding: '16px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Sk h={18} w="70%" />
        <Sk h={14} w="50%" />
        <Sk h={14} w="40%" />
      </div>
    </div>
  )
}

export default function PageSkeleton() {
  return (
    <div className="sk-page">

      {/* Hero */}
      <div className="sk-hero">
        <div className="sk-hero-left">
          <Sk h={14} w={140} r={100} />
          <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:8 }}>
            <Sk h={54} w="85%" r={6} />
            <Sk h={54} w="65%" r={6} />
            <Sk h={22} w="50%" r={6} />
          </div>
          <Sk h={16} w="90%" style={{ marginTop:16 }} />
          <Sk h={16} w="75%" />
          <div style={{ display:'flex', gap:12, marginTop:24 }}>
            <Sk h={48} w={140} r={100} />
            <Sk h={48} w={160} r={100} />
          </div>
        </div>
        <div className="sk-hero-right">
          <Sk h="100%" w="100%" r={24} style={{ minHeight:380 }} />
        </div>
      </div>

      {/* Stats bar */}
      <div className="sk-stats">
        {[1,2,3,4].map(i => (
          <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <Sk h={36} w={80} r={6} />
            <Sk h={14} w={100} r={6} />
          </div>
        ))}
      </div>

      {/* Products section */}
      <div className="sk-section">
        <div className="sk-sec-title">
          <Sk h={14} w={100} r={100} style={{ margin:'0 auto' }} />
          <Sk h={36} w={280} r={6} style={{ margin:'12px auto 0' }} />
          <Sk h={16} w={400} r={6} style={{ margin:'12px auto 0' }} />
        </div>
        <div className="sk-grid-3">
          <SkCard h={260} />
          <SkCard h={260} />
          <SkCard h={260} />
        </div>
      </div>

      {/* Singles section */}
      <div className="sk-section" style={{ background:'var(--bg-2)' }}>
        <div className="sk-sec-title">
          <Sk h={14} w={120} r={100} style={{ margin:'0 auto' }} />
          <Sk h={36} w={240} r={6} style={{ margin:'12px auto 0' }} />
        </div>
        <div className="sk-grid-4">
          {[1,2,3,4].map(i => <SkCard key={i} h={200} />)}
        </div>
      </div>

      {/* Reviews section */}
      <div className="sk-section">
        <div className="sk-sec-title">
          <Sk h={14} w={120} r={100} style={{ margin:'0 auto' }} />
          <Sk h={36} w={300} r={6} style={{ margin:'12px auto 0' }} />
        </div>
        <div className="sk-grid-3">
          {[1,2,3].map(i => (
            <div key={i} className="sk-card" style={{ padding:24 }}>
              <div style={{ display:'flex', gap:4, marginBottom:12 }}>
                {[1,2,3,4,5].map(s => <Sk key={s} h={14} w={14} r={4} />)}
              </div>
              <Sk h={14} w="100%" />
              <Sk h={14} w="85%" style={{ marginTop:8 }} />
              <Sk h={14} w="60%" style={{ marginTop:8 }} />
              <div style={{ display:'flex', gap:10, marginTop:20, alignItems:'center' }}>
                <Sk h={38} w={38} r={100} />
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:6 }}>
                  <Sk h={13} w="50%" />
                  <Sk h={11} w="35%" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
