function ThreatMeter({ threatLevel }) {
    const getThreatStatus = () => {
        switch (threatLevel) {
            case 0:
                return { label: 'SECURE', color: '#22c55e' };
            case 1:
                return { label: 'LOW THREAT', color: '#eab308' };
            case 2:
                return { label: 'HIGH THREAT', color: '#f97316' };
            case 3:
                return { label: 'CRITICAL', color: '#ef4444' };
            default:
                return { label: 'SECURE', color: '#22c55e' };
        }
    };

    const threatStatus = getThreatStatus();
    const percentage = (threatLevel / 3) * 100;

    return (
        <div className="threat-meter-container">
            <div className="threat-meter-label">
                <span className="threat-icon">🛡️</span>
                <span
                    className="threat-status fw-bold"
                    style={{ color: threatStatus.color }}
                >
                    {threatStatus.label}
                </span>
            </div>
            <div className="threat-meter-bar">
                <div
                    className={`threat-meter-fill d-flex align-items-center justify-content-center threat-level-${threatLevel}`}
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: threatStatus.color
                    }}
                >
                    {threatLevel > 0 && (
                        <span className="threat-meter-text fw-bold">
                            {threatLevel}/3
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ThreatMeter;