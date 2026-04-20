export default function StatsBar({ stats }) {
  if (!stats || stats.length === 0) return null

  return (
    <div className="stats-bar">
      <div className="stats-inner">
        {stats.map(stat => (
          <div key={stat.id} className="stat-item">
            <span className="stat-num">
              {stat.prefix}{stat.number_value}{stat.suffix}
            </span>
            <span className="stat-label">
              {stat.is_bold_label ? <strong>{stat.label}</strong> : stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
