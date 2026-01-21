'use client'

import { forwardRef } from 'react'

interface AthleteData {
  id: string
  full_name: string
  picture?: string
  gender: 'male' | 'female'
  nationality: string
  mobile_number: string
  date_of_birth: string
  age: number
  education?: string
  social_status?: string
  has_kids: boolean
  no_of_kids?: number
  height: number
  weight: number
  smoker: boolean
  emergency_phone: string
  tshirt_size?: string
  short_size?: string
  goals?: string
  squad: string
  sport: string
  status: 'active' | 'injured' | 'inactive'
  fitness_score?: number
  mental_score?: number
  nutrition_score?: number
  overall_rating?: number
}

interface FitnessRecord {
  id: string
  date: string
  coach: string
  vo2_max: number
  sprint_time: number
  endurance: number
  strength: number
  flexibility: number
  overall: number
  trend: string
  notes: string
}

interface MedicalRecord {
  id: string
  date: string
  doctor: string
  type: string
  blood_pressure: string
  heart_rate: number
  status: string
  notes: string
}

interface NutritionRecord {
  id: string
  date: string
  nutritionist: string
  plan: string
  calories: number
  protein: number
  carbs: number
  fat: number
  hydration: number
  weight: number
  body_fat: number
  notes: string
}

interface MentalRecord {
  id: string
  date: string
  psychologist: string
  commitment: number
  respect: number
  self_confidence: number
  team_work: number
  attitude_training: number
  attitude_game: number
  overall: number
  notes: string
}

interface AthleteProfilePrintProps {
  athlete: AthleteData
  fitnessRecords: FitnessRecord[]
  medicalRecords: MedicalRecord[]
  nutritionRecords: NutritionRecord[]
  mentalRecords: MentalRecord[]
}

const AthleteProfilePrint = forwardRef<HTMLDivElement, AthleteProfilePrintProps>(
  ({ athlete, fitnessRecords, medicalRecords, nutritionRecords, mentalRecords }, ref) => {
    const getStatusLabel = (status: string) => {
      switch (status) {
        case 'active': return 'Active'
        case 'injured': return 'Injured'
        case 'inactive': return 'Inactive'
        default: return status
      }
    }

    const renderStars = (score: number) => {
      return '★'.repeat(score) + '☆'.repeat(10 - score)
    }

    return (
      <div ref={ref} className="print-container" style={{ display: 'none' }}>
        <style>{`
          @media print {
            .print-container {
              display: block !important;
              width: 210mm;
              min-height: 297mm;
              margin: 0;
              padding: 0;
              background: white !important;
              color: black !important;
              font-family: 'Arial', 'Helvetica', sans-serif;
              font-size: 10pt;
              line-height: 1.4;
            }

            @page {
              size: A4;
              margin: 10mm;
            }

            body * {
              visibility: hidden;
            }

            .print-container, .print-container * {
              visibility: visible;
            }

            .print-container {
              position: absolute;
              left: 0;
              top: 0;
            }

            .page-break {
              page-break-before: always;
            }

            .no-break {
              page-break-inside: avoid;
            }
          }

          /* Print styles for the document */
          .print-header {
            background: #000000;
            color: white;
            padding: 20px;
            margin-bottom: 0;
            border-bottom: 4px solid #333333;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .print-header-left {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .club-logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            font-weight: bold;
            color: black;
            border: 2px solid #333;
          }

          .club-info h1 {
            margin: 0;
            font-size: 18pt;
            color: white;
            font-weight: bold;
          }

          .club-info p {
            margin: 2px 0 0 0;
            font-size: 9pt;
            color: #ccc;
          }

          .print-header-right {
            text-align: right;
          }

          .print-header-right h2 {
            margin: 0;
            font-size: 14pt;
            color: white;
          }

          .print-header-right p {
            margin: 2px 0 0 0;
            font-size: 9pt;
            color: #ccc;
          }

          .athlete-main-section {
            display: flex;
            gap: 20px;
            padding: 20px;
            background: #f5f5f5;
            border-bottom: 3px solid #000000;
          }

          .athlete-photo {
            width: 100px;
            height: 120px;
            background: #e0e0e0;
            border: 3px solid #000;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: #333;
          }

          .athlete-basic-info {
            flex: 1;
          }

          .athlete-name {
            font-size: 18pt;
            font-weight: bold;
            color: #000;
            margin: 0 0 5px 0;
            border-bottom: 2px solid #000000;
            padding-bottom: 5px;
          }

          .athlete-meta {
            display: flex;
            gap: 20px;
            margin-top: 10px;
          }

          .meta-item {
            display: flex;
            flex-direction: column;
          }

          .meta-label {
            font-size: 8pt;
            color: #666;
            text-transform: uppercase;
          }

          .meta-value {
            font-size: 11pt;
            font-weight: bold;
            color: #000;
          }

          .status-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 9pt;
            font-weight: bold;
            text-transform: uppercase;
          }

          .status-active {
            background: #22c55e;
            color: white;
          }

          .status-injured {
            background: #ef4444;
            color: white;
          }

          .status-inactive {
            background: #6b7280;
            color: white;
          }

          .section {
            padding: 15px 20px;
            border-bottom: 1px solid #ddd;
          }

          .section-title {
            font-size: 12pt;
            font-weight: bold;
            color: #000;
            margin: 0 0 10px 0;
            padding-bottom: 5px;
            border-bottom: 2px solid #000000;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .section-title-icon {
            width: 24px;
            height: 24px;
            background: #000000;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12pt;
          }

          .info-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
          }

          .info-item {
            background: white;
            padding: 8px 10px;
            border-radius: 4px;
            border-left: 3px solid #000000;
          }

          .info-label {
            font-size: 8pt;
            color: #666;
            margin-bottom: 2px;
          }

          .info-value {
            font-size: 10pt;
            font-weight: 600;
            color: #000;
          }

          .performance-scores {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 8px;
            border: 2px solid #000;
          }

          .score-card {
            background: white;
            padding: 12px;
            border-radius: 6px;
            text-align: center;
            border: 2px solid #000000;
          }

          .score-label {
            font-size: 8pt;
            color: #333;
            margin-bottom: 5px;
            text-transform: uppercase;
            font-weight: bold;
          }

          .score-value {
            font-size: 20pt;
            font-weight: bold;
            color: #000000;
          }

          .score-stars {
            font-size: 8pt;
            color: #000000;
            margin-top: 3px;
            letter-spacing: 1px;
          }

          .records-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
            margin-top: 10px;
          }

          .records-table th {
            background: #000;
            color: white;
            padding: 8px 6px;
            text-align: left;
            font-weight: bold;
            border-bottom: 2px solid #333;
          }

          .records-table td {
            padding: 6px;
            border-bottom: 1px solid #ddd;
            color: #333;
          }

          .records-table tr:nth-child(even) {
            background: #f5f5f5;
          }

          .records-table tr:first-child td {
            background: #e8e8e8;
            font-weight: 600;
          }

          .highlight-value {
            color: #000;
            font-weight: bold;
          }

          .trend-up { color: #22c55e; }
          .trend-down { color: #ef4444; }
          .trend-stable { color: #f59e0b; }

          .print-footer {
            background: #000;
            color: white;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 8pt;
            margin-top: auto;
          }

          .footer-stripes {
            height: 4px;
            background: repeating-linear-gradient(
              90deg,
              #333333,
              #333333 20px,
              #000 20px,
              #000 40px
            );
          }

          .goals-box {
            background: #f0f0f0;
            padding: 12px 15px;
            border-radius: 6px;
            border-left: 4px solid #000000;
            margin-top: 10px;
          }

          .goals-label {
            font-size: 9pt;
            color: #666;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .goals-text {
            font-size: 10pt;
            color: #000;
            font-style: italic;
          }

          .summary-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 15px;
          }

          .summary-stat {
            background: #f8f8f8;
            padding: 10px;
            border-radius: 6px;
            text-align: center;
            border: 1px solid #ddd;
          }

          .summary-stat-value {
            font-size: 16pt;
            font-weight: bold;
            color: #000;
          }

          .summary-stat-label {
            font-size: 8pt;
            color: #666;
            margin-top: 2px;
          }
        `}</style>

        {/* Page 1: Main Profile */}
        <div className="print-page">
          {/* Header with Al-Ittihad branding */}
          <div className="print-header">
            <div className="print-header-left">
              <div className="club-logo">1</div>
              <div className="club-info">
                <h1>AL-ITTIHAD FC</h1>
                <p>نادي الاتحاد السعودي | Est. 1927 | Jeddah, KSA</p>
              </div>
            </div>
            <div className="print-header-right">
              <h2>ATHLETE PROFILE</h2>
              <p>Performance Management System</p>
            </div>
          </div>

          {/* Stripe decoration */}
          <div className="footer-stripes"></div>

          {/* Athlete Main Info */}
          <div className="athlete-main-section">
            <div className="athlete-photo">👤</div>
            <div className="athlete-basic-info">
              <h2 className="athlete-name">{athlete.full_name}</h2>
              <div className="athlete-meta">
                <div className="meta-item">
                  <span className="meta-label">Sport</span>
                  <span className="meta-value">{athlete.sport}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Squad</span>
                  <span className="meta-value">{athlete.squad}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Age</span>
                  <span className="meta-value">{athlete.age} years</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Status</span>
                  <span className={`status-badge status-${athlete.status}`}>
                    {getStatusLabel(athlete.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="section no-break">
            <h3 className="section-title">
              <span className="section-title-icon">📋</span>
              Personal Information
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Date of Birth</div>
                <div className="info-value">{athlete.date_of_birth}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Nationality</div>
                <div className="info-value">{athlete.nationality}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Mobile Number</div>
                <div className="info-value">{athlete.mobile_number}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Emergency Contact</div>
                <div className="info-value">{athlete.emergency_phone}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Height</div>
                <div className="info-value">{athlete.height} cm</div>
              </div>
              <div className="info-item">
                <div className="info-label">Weight</div>
                <div className="info-value">{athlete.weight} kg</div>
              </div>
              <div className="info-item">
                <div className="info-label">Education</div>
                <div className="info-value">{athlete.education || 'N/A'}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Social Status</div>
                <div className="info-value">
                  {athlete.social_status || 'N/A'}
                  {athlete.has_kids && ` (${athlete.no_of_kids} kids)`}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">T-Shirt Size</div>
                <div className="info-value">{athlete.tshirt_size || 'N/A'}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Short Size</div>
                <div className="info-value">{athlete.short_size || 'N/A'}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Smoker</div>
                <div className="info-value">{athlete.smoker ? 'Yes' : 'No'}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Gender</div>
                <div className="info-value">{athlete.gender === 'male' ? 'Male' : 'Female'}</div>
              </div>
            </div>

            {athlete.goals && (
              <div className="goals-box">
                <div className="goals-label">Personal Goals</div>
                <div className="goals-text">"{athlete.goals}"</div>
              </div>
            )}
          </div>

          {/* Performance Overview */}
          <div className="section no-break">
            <h3 className="section-title">
              <span className="section-title-icon">⭐</span>
              Performance Overview
            </h3>
            <div className="performance-scores">
              <div className="score-card">
                <div className="score-label">Fitness Score</div>
                <div className="score-value">{athlete.fitness_score || 0}/10</div>
                <div className="score-stars">{renderStars(athlete.fitness_score || 0)}</div>
              </div>
              <div className="score-card">
                <div className="score-label">Mental Score</div>
                <div className="score-value">{athlete.mental_score || 0}/10</div>
                <div className="score-stars">{renderStars(athlete.mental_score || 0)}</div>
              </div>
              <div className="score-card">
                <div className="score-label">Nutrition Score</div>
                <div className="score-value">{athlete.nutrition_score || 0}/10</div>
                <div className="score-stars">{renderStars(athlete.nutrition_score || 0)}</div>
              </div>
              <div className="score-card">
                <div className="score-label">Overall Rating</div>
                <div className="score-value">{athlete.overall_rating || 0}/10</div>
                <div className="score-stars">{renderStars(athlete.overall_rating || 0)}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="footer-stripes"></div>
          <div className="print-footer">
            <span>Al-Ittihad FC © {new Date().getFullYear()} | Athlete Performance Management</span>
            <span>Generated: {new Date().toLocaleDateString('en-GB')} | Page 1</span>
          </div>
        </div>

        {/* Page 2: Fitness & Medical Records */}
        <div className="page-break"></div>
        <div className="print-page">
          <div className="print-header">
            <div className="print-header-left">
              <div className="club-logo">1</div>
              <div className="club-info">
                <h1>AL-ITTIHAD FC</h1>
                <p>{athlete.full_name} | Fitness & Medical Records</p>
              </div>
            </div>
            <div className="print-header-right">
              <h2>DETAILED RECORDS</h2>
              <p>Performance Management System</p>
            </div>
          </div>
          <div className="footer-stripes"></div>

          {/* Fitness Records */}
          <div className="section no-break">
            <h3 className="section-title">
              <span className="section-title-icon">💪</span>
              Fitness Records
            </h3>

            {fitnessRecords.length > 0 && (
              <>
                <div className="summary-stats">
                  <div className="summary-stat">
                    <div className="summary-stat-value">{fitnessRecords[0].vo2_max}</div>
                    <div className="summary-stat-label">VO2 Max</div>
                  </div>
                  <div className="summary-stat">
                    <div className="summary-stat-value">{fitnessRecords[0].sprint_time}s</div>
                    <div className="summary-stat-label">Sprint Time</div>
                  </div>
                  <div className="summary-stat">
                    <div className="summary-stat-value">{fitnessRecords[0].endurance}/10</div>
                    <div className="summary-stat-label">Endurance</div>
                  </div>
                  <div className="summary-stat">
                    <div className="summary-stat-value">{fitnessRecords[0].strength}/10</div>
                    <div className="summary-stat-label">Strength</div>
                  </div>
                </div>

                <table className="records-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Coach</th>
                      <th>VO2 Max</th>
                      <th>Sprint</th>
                      <th>Endurance</th>
                      <th>Strength</th>
                      <th>Overall</th>
                      <th>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fitnessRecords.map((record) => (
                      <tr key={record.id}>
                        <td>{record.date}</td>
                        <td>{record.coach}</td>
                        <td className="highlight-value">{record.vo2_max}</td>
                        <td className="highlight-value">{record.sprint_time}s</td>
                        <td>{record.endurance}/10</td>
                        <td>{record.strength}/10</td>
                        <td className="highlight-value">{record.overall}/10</td>
                        <td className={`trend-${record.trend}`}>
                          {record.trend === 'up' ? '↑' : record.trend === 'down' ? '↓' : '→'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>

          {/* Medical Records */}
          <div className="section no-break">
            <h3 className="section-title">
              <span className="section-title-icon">🏥</span>
              Medical Records
            </h3>

            {medicalRecords.length > 0 && (
              <>
                <div className="summary-stats">
                  <div className="summary-stat">
                    <div className="summary-stat-value">{medicalRecords[0].blood_pressure}</div>
                    <div className="summary-stat-label">Blood Pressure</div>
                  </div>
                  <div className="summary-stat">
                    <div className="summary-stat-value">{medicalRecords[0].heart_rate}</div>
                    <div className="summary-stat-label">Heart Rate (bpm)</div>
                  </div>
                  <div className="summary-stat">
                    <div className="summary-stat-value">{medicalRecords[0].status}</div>
                    <div className="summary-stat-label">Current Status</div>
                  </div>
                  <div className="summary-stat">
                    <div className="summary-stat-value">{medicalRecords[0].type}</div>
                    <div className="summary-stat-label">Last Checkup</div>
                  </div>
                </div>

                <table className="records-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Doctor</th>
                      <th>Type</th>
                      <th>Blood Pressure</th>
                      <th>Heart Rate</th>
                      <th>Status</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicalRecords.map((record) => (
                      <tr key={record.id}>
                        <td>{record.date}</td>
                        <td>{record.doctor}</td>
                        <td>{record.type}</td>
                        <td className="highlight-value">{record.blood_pressure}</td>
                        <td className="highlight-value">{record.heart_rate}</td>
                        <td>{record.status}</td>
                        <td>{record.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>

          <div className="footer-stripes"></div>
          <div className="print-footer">
            <span>Al-Ittihad FC © {new Date().getFullYear()} | Athlete Performance Management</span>
            <span>Generated: {new Date().toLocaleDateString('en-GB')} | Page 2</span>
          </div>
        </div>

        {/* Page 3: Nutrition & Mental Records */}
        <div className="page-break"></div>
        <div className="print-page">
          <div className="print-header">
            <div className="print-header-left">
              <div className="club-logo">1</div>
              <div className="club-info">
                <h1>AL-ITTIHAD FC</h1>
                <p>{athlete.full_name} | Nutrition & Mental Records</p>
              </div>
            </div>
            <div className="print-header-right">
              <h2>DETAILED RECORDS</h2>
              <p>Performance Management System</p>
            </div>
          </div>
          <div className="footer-stripes"></div>

          {/* Nutrition Records */}
          <div className="section no-break">
            <h3 className="section-title">
              <span className="section-title-icon">🍎</span>
              Nutrition Plans
            </h3>

            {nutritionRecords.length > 0 && (
              <>
                <div className="summary-stats">
                  <div className="summary-stat">
                    <div className="summary-stat-value">{nutritionRecords[0].calories}</div>
                    <div className="summary-stat-label">Daily Calories</div>
                  </div>
                  <div className="summary-stat">
                    <div className="summary-stat-value">{nutritionRecords[0].protein}g</div>
                    <div className="summary-stat-label">Protein</div>
                  </div>
                  <div className="summary-stat">
                    <div className="summary-stat-value">{nutritionRecords[0].body_fat}%</div>
                    <div className="summary-stat-label">Body Fat</div>
                  </div>
                  <div className="summary-stat">
                    <div className="summary-stat-value">{nutritionRecords[0].hydration}L</div>
                    <div className="summary-stat-label">Hydration</div>
                  </div>
                </div>

                <table className="records-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Nutritionist</th>
                      <th>Plan</th>
                      <th>Calories</th>
                      <th>Protein</th>
                      <th>Carbs</th>
                      <th>Fat</th>
                      <th>Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutritionRecords.map((record) => (
                      <tr key={record.id}>
                        <td>{record.date}</td>
                        <td>{record.nutritionist}</td>
                        <td>{record.plan}</td>
                        <td className="highlight-value">{record.calories}</td>
                        <td>{record.protein}g</td>
                        <td>{record.carbs}g</td>
                        <td>{record.fat}g</td>
                        <td className="highlight-value">{record.weight}kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>

          {/* Mental Records */}
          <div className="section no-break">
            <h3 className="section-title">
              <span className="section-title-icon">🧠</span>
              Mental Assessment
            </h3>

            {mentalRecords.length > 0 && (
              <>
                <div className="summary-stats">
                  <div className="summary-stat">
                    <div className="summary-stat-value">{mentalRecords[0].overall}/10</div>
                    <div className="summary-stat-label">Overall Score</div>
                  </div>
                  <div className="summary-stat">
                    <div className="summary-stat-value">{mentalRecords[0].self_confidence}/10</div>
                    <div className="summary-stat-label">Confidence</div>
                  </div>
                  <div className="summary-stat">
                    <div className="summary-stat-value">{mentalRecords[0].team_work}/10</div>
                    <div className="summary-stat-label">Team Work</div>
                  </div>
                  <div className="summary-stat">
                    <div className="summary-stat-value">{mentalRecords[0].commitment}/10</div>
                    <div className="summary-stat-label">Commitment</div>
                  </div>
                </div>

                <table className="records-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Psychologist</th>
                      <th>Commitment</th>
                      <th>Confidence</th>
                      <th>Team Work</th>
                      <th>Training</th>
                      <th>Game</th>
                      <th>Overall</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mentalRecords.map((record) => (
                      <tr key={record.id}>
                        <td>{record.date}</td>
                        <td>{record.psychologist}</td>
                        <td>{record.commitment}/10</td>
                        <td>{record.self_confidence}/10</td>
                        <td>{record.team_work}/10</td>
                        <td>{record.attitude_training}/10</td>
                        <td>{record.attitude_game}/10</td>
                        <td className="highlight-value">{record.overall}/10</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>

          {/* Signature Section */}
          <div className="section" style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '40px' }}>
              <div style={{ textAlign: 'center', width: '200px' }}>
                <div style={{ borderTop: '1px solid #000', paddingTop: '5px', fontSize: '9pt' }}>
                  Coach Signature
                </div>
              </div>
              <div style={{ textAlign: 'center', width: '200px' }}>
                <div style={{ borderTop: '1px solid #000', paddingTop: '5px', fontSize: '9pt' }}>
                  Medical Staff Signature
                </div>
              </div>
              <div style={{ textAlign: 'center', width: '200px' }}>
                <div style={{ borderTop: '1px solid #000', paddingTop: '5px', fontSize: '9pt' }}>
                  Department Head
                </div>
              </div>
            </div>
          </div>

          <div className="footer-stripes"></div>
          <div className="print-footer">
            <span>Al-Ittihad FC © {new Date().getFullYear()} | Athlete Performance Management</span>
            <span>Generated: {new Date().toLocaleDateString('en-GB')} | Page 3</span>
          </div>
        </div>
      </div>
    )
  }
)

AthleteProfilePrint.displayName = 'AthleteProfilePrint'

export default AthleteProfilePrint
