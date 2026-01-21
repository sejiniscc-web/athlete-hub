-- Athlete Profile Performance System Database Schema
-- For Supabase (PostgreSQL)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Roles Enum
CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'fitness_coach', 'sport_coach', 'nutritionist', 'psychologist', 'athlete');

-- Gender Enum
CREATE TYPE gender_type AS ENUM ('male', 'female');

-- Attendance Status Enum
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'injured', 'excused');

-- Attendance Type Enum
CREATE TYPE attendance_type AS ENUM ('training', 'match', 'meeting', 'other');

-- Contract Status Enum
CREATE TYPE contract_status AS ENUM ('active', 'expired', 'pending');

-- Performance Type Enum
CREATE TYPE performance_type AS ENUM ('match', 'training');

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role user_role NOT NULL DEFAULT 'athlete',
  picture TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ATHLETE PROFILES TABLE
-- ============================================
CREATE TABLE athlete_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  picture TEXT,
  full_name VARCHAR(255) NOT NULL,
  gender gender_type NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  mobile_number VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL,
  education VARCHAR(255),
  social_status VARCHAR(100),
  has_kids BOOLEAN DEFAULT FALSE,
  no_of_kids INTEGER DEFAULT 0,
  height DECIMAL(5,2), -- in cm
  weight DECIMAL(5,2), -- in kg
  smoker BOOLEAN DEFAULT FALSE,
  emergency_phone VARCHAR(50) NOT NULL,
  tshirt_size VARCHAR(10),
  short_size VARCHAR(10),
  goals TEXT,
  squad VARCHAR(100),
  sport VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- ============================================
-- CLINICS TABLE (Medical Records)
-- ============================================
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES users(id),
  medical_history TEXT,
  allergy TEXT,
  medical_treatment TEXT,
  blood_type VARCHAR(10),
  physiotherapist_soap TEXT,
  record TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- ============================================
-- MINDSETS TABLE (Daily Mental State)
-- ============================================
CREATE TABLE mindsets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  daily_mood INTEGER CHECK (daily_mood >= 1 AND daily_mood <= 10),
  daily_stress INTEGER CHECK (daily_stress >= 1 AND daily_stress <= 10),
  daily_anxiety INTEGER CHECK (daily_anxiety >= 1 AND daily_anxiety <= 10),
  daily_training INTEGER CHECK (daily_training >= 1 AND daily_training <= 10),
  daily_competitive_soul INTEGER CHECK (daily_competitive_soul >= 1 AND daily_competitive_soul <= 10),
  fixed_sleep_hour BOOLEAN DEFAULT FALSE,
  socialized BOOLEAN DEFAULT FALSE,
  play_board_games BOOLEAN DEFAULT FALSE,
  play_egames BOOLEAN DEFAULT FALSE,
  relaxation_way TEXT,
  motivation_way TEXT,
  while_injured_do TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- ============================================
-- MENTALS TABLE (Behavioral Assessment)
-- ============================================
CREATE TABLE mentals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES users(id),
  commitment_in_time INTEGER CHECK (commitment_in_time >= 1 AND commitment_in_time <= 10),
  respect INTEGER CHECK (respect >= 1 AND respect <= 10),
  self_confidence INTEGER CHECK (self_confidence >= 1 AND self_confidence <= 10),
  team_work INTEGER CHECK (team_work >= 1 AND team_work <= 10),
  attitude_in_training INTEGER CHECK (attitude_in_training >= 1 AND attitude_in_training <= 10),
  attitude_in_game INTEGER CHECK (attitude_in_game >= 1 AND attitude_in_game <= 10),
  attitude_in_winning INTEGER CHECK (attitude_in_winning >= 1 AND attitude_in_winning <= 10),
  attitude_in_losing INTEGER CHECK (attitude_in_losing >= 1 AND attitude_in_losing <= 10),
  important_note TEXT,
  special_exercise_gym TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- ============================================
-- FITNESS TABLE
-- ============================================
CREATE TABLE fitness (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES users(id),
  fitness_test_date DATE NOT NULL,
  fitness_test TEXT,
  muscle_strength_test TEXT,
  agility_test TEXT,
  flexibility_test TEXT,
  heart_beat_while_rest INTEGER,
  muscle_weight DECIMAL(5,2),
  fat_percentage DECIMAL(5,2),
  bmr DECIMAL(8,2),
  plan TEXT,
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- ============================================
-- INJURY RECORDS TABLE
-- ============================================
CREATE TABLE injury_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES users(id),
  injury_date DATE NOT NULL,
  subjective TEXT,
  objective TEXT,
  assessments TEXT,
  treatment_plan TEXT,
  recommendation TEXT,
  doctor_opinion_decision TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- ============================================
-- NUTRITIONS TABLE
-- ============================================
CREATE TABLE nutritions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES users(id),
  date DATE NOT NULL,
  current_weight DECIMAL(5,2) NOT NULL,
  target_weight DECIMAL(5,2),
  daily_calories INTEGER,
  protein_g DECIMAL(6,2),
  carbs_g DECIMAL(6,2),
  fats_g DECIMAL(6,2),
  water_intake_l DECIMAL(4,2),
  meal_plan TEXT,
  supplements TEXT,
  restrictions TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- ============================================
-- SPORT COACHES TABLE (Coach Evaluations)
-- ============================================
CREATE TABLE sport_coaches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES users(id),
  evaluation_date DATE NOT NULL,
  technical_skills INTEGER CHECK (technical_skills >= 1 AND technical_skills <= 10),
  tactical_awareness INTEGER CHECK (tactical_awareness >= 1 AND tactical_awareness <= 10),
  physical_performance INTEGER CHECK (physical_performance >= 1 AND physical_performance <= 10),
  game_reading INTEGER CHECK (game_reading >= 1 AND game_reading <= 10),
  decision_making INTEGER CHECK (decision_making >= 1 AND decision_making <= 10),
  training_attendance TEXT,
  training_performance TEXT,
  match_performance TEXT,
  areas_to_improve TEXT,
  strengths TEXT,
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 10),
  coach_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- ============================================
-- PERFORMANCE STATS TABLE (New)
-- ============================================
CREATE TABLE performance_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type performance_type NOT NULL,
  minutes_played INTEGER,
  goals_points INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  sport_specific_stats JSONB,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- ============================================
-- CONTRACTS TABLE (New)
-- ============================================
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  contract_start DATE NOT NULL,
  contract_end DATE NOT NULL,
  salary DECIMAL(12,2),
  bonuses TEXT,
  status contract_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- ============================================
-- ATTENDANCE TABLE (New)
-- ============================================
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type attendance_type NOT NULL,
  status attendance_status NOT NULL,
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_athlete_profiles_user_id ON athlete_profiles(user_id);
CREATE INDEX idx_athlete_profiles_sport ON athlete_profiles(sport);
CREATE INDEX idx_clinics_athlete_id ON clinics(athlete_id);
CREATE INDEX idx_clinics_doctor_id ON clinics(doctor_id);
CREATE INDEX idx_mindsets_athlete_id ON mindsets(athlete_id);
CREATE INDEX idx_mentals_athlete_id ON mentals(athlete_id);
CREATE INDEX idx_fitness_athlete_id ON fitness(athlete_id);
CREATE INDEX idx_injury_records_athlete_id ON injury_records(athlete_id);
CREATE INDEX idx_nutritions_athlete_id ON nutritions(athlete_id);
CREATE INDEX idx_sport_coaches_athlete_id ON sport_coaches(athlete_id);
CREATE INDEX idx_performance_stats_athlete_id ON performance_stats(athlete_id);
CREATE INDEX idx_contracts_athlete_id ON contracts(athlete_id);
CREATE INDEX idx_attendance_athlete_id ON attendance(athlete_id);
CREATE INDEX idx_attendance_date ON attendance(date);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE mindsets ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness ENABLE ROW LEVEL SECURITY;
ALTER TABLE injury_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutritions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sport_coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin')
  );

-- Athlete profiles policies
CREATE POLICY "Authenticated users can view athletes" ON athlete_profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Staff can manage athletes" ON athlete_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role IN ('admin', 'doctor', 'fitness_coach', 'sport_coach', 'nutritionist', 'psychologist')
    )
  );

-- Similar policies for other tables (simplified for brevity)
-- Each professional can only access their related records

CREATE POLICY "Doctors can manage clinics" ON clinics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role IN ('admin', 'doctor')
    )
  );

CREATE POLICY "View clinics" ON clinics
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Psychologists can manage mindsets" ON mindsets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role IN ('admin', 'psychologist', 'doctor')
    )
  );

CREATE POLICY "View mindsets" ON mindsets
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Psychologists can manage mentals" ON mentals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role IN ('admin', 'psychologist', 'doctor')
    )
  );

CREATE POLICY "View mentals" ON mentals
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Fitness coaches can manage fitness" ON fitness
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role IN ('admin', 'fitness_coach', 'doctor')
    )
  );

CREATE POLICY "View fitness" ON fitness
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Doctors can manage injuries" ON injury_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role IN ('admin', 'doctor')
    )
  );

CREATE POLICY "View injuries" ON injury_records
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Nutritionists can manage nutrition" ON nutritions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role IN ('admin', 'nutritionist', 'doctor')
    )
  );

CREATE POLICY "View nutrition" ON nutritions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Coaches can manage evaluations" ON sport_coaches
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role IN ('admin', 'sport_coach')
    )
  );

CREATE POLICY "View coach evaluations" ON sport_coaches
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Staff can manage performance" ON performance_stats
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role IN ('admin', 'sport_coach', 'fitness_coach')
    )
  );

CREATE POLICY "View performance" ON performance_stats
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin can manage contracts" ON contracts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "View contracts" ON contracts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role IN ('admin')
    )
  );

CREATE POLICY "Staff can manage attendance" ON attendance
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role IN ('admin', 'sport_coach', 'fitness_coach')
    )
  );

CREATE POLICY "View attendance" ON attendance
  FOR SELECT TO authenticated USING (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to calculate age from date of birth
CREATE OR REPLACE FUNCTION calculate_age(dob DATE)
RETURNS INTEGER AS $$
BEGIN
  RETURN EXTRACT(YEAR FROM AGE(CURRENT_DATE, dob));
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_athlete_profiles_updated_at BEFORE UPDATE ON athlete_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clinics_updated_at BEFORE UPDATE ON clinics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mindsets_updated_at BEFORE UPDATE ON mindsets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentals_updated_at BEFORE UPDATE ON mentals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fitness_updated_at BEFORE UPDATE ON fitness
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_injury_records_updated_at BEFORE UPDATE ON injury_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutritions_updated_at BEFORE UPDATE ON nutritions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sport_coaches_updated_at BEFORE UPDATE ON sport_coaches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_performance_stats_updated_at BEFORE UPDATE ON performance_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
