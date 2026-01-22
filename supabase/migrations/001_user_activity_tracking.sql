-- ============================================
-- USER ACTIVITY TRACKING SYSTEM
-- Migration: 001_user_activity_tracking.sql
-- ============================================

-- Activity Action Types
CREATE TYPE activity_action AS ENUM (
  'login',
  'logout',
  'page_view',
  'record_create',
  'record_update',
  'record_delete',
  'record_view',
  'search',
  'export',
  'print',
  'settings_change',
  'user_switch'
);

-- ============================================
-- USER ACTIVITY LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action activity_action NOT NULL,
  page VARCHAR(100),
  module VARCHAR(50), -- athletes, fitness, medical, nutrition, mental, mindset, injuries, coaches, settings
  target_id UUID, -- ID of the record being affected (athlete_id, record_id, etc.)
  target_type VARCHAR(50), -- Type of target (athlete, fitness_record, etc.)
  details JSONB, -- Additional details about the action
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER, -- Calculated when session ends
  pages_visited INTEGER DEFAULT 0,
  actions_count INTEGER DEFAULT 0,
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER STATS TABLE (Aggregated stats for performance)
-- ============================================
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_logins INTEGER DEFAULT 0,
  total_actions INTEGER DEFAULT 0,
  total_pages_visited INTEGER DEFAULT 0,
  total_records_created INTEGER DEFAULT 0,
  total_records_updated INTEGER DEFAULT 0,
  total_records_deleted INTEGER DEFAULT 0,
  total_session_minutes INTEGER DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  login_streak INTEGER DEFAULT 0,
  last_login_date DATE,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PAGE VISITS TABLE (For page analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS page_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  page VARCHAR(100) NOT NULL,
  visit_count INTEGER DEFAULT 1,
  last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, page, date)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON user_activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_action ON user_activity_logs(action);
CREATE INDEX idx_activity_logs_page ON user_activity_logs(page);
CREATE INDEX idx_activity_logs_module ON user_activity_logs(module);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_user_sessions_start ON user_sessions(session_start DESC);

CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX idx_user_stats_last_activity ON user_stats(last_activity_at DESC);

CREATE INDEX idx_page_visits_user_id ON page_visits(user_id);
CREATE INDEX idx_page_visits_page ON page_visits(page);
CREATE INDEX idx_page_visits_date ON page_visits(date DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id UUID,
  p_action activity_action,
  p_page VARCHAR(100) DEFAULT NULL,
  p_module VARCHAR(50) DEFAULT NULL,
  p_target_id UUID DEFAULT NULL,
  p_target_type VARCHAR(50) DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  -- Insert activity log
  INSERT INTO user_activity_logs (
    user_id, action, page, module, target_id, target_type, details, ip_address, user_agent
  ) VALUES (
    p_user_id, p_action, p_page, p_module, p_target_id, p_target_type, p_details, p_ip_address, p_user_agent
  ) RETURNING id INTO v_log_id;

  -- Update user stats
  INSERT INTO user_stats (user_id, total_actions, last_activity_at)
  VALUES (p_user_id, 1, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    total_actions = user_stats.total_actions + 1,
    last_activity_at = NOW(),
    total_records_created = CASE WHEN p_action = 'record_create' THEN user_stats.total_records_created + 1 ELSE user_stats.total_records_created END,
    total_records_updated = CASE WHEN p_action = 'record_update' THEN user_stats.total_records_updated + 1 ELSE user_stats.total_records_updated END,
    total_records_deleted = CASE WHEN p_action = 'record_delete' THEN user_stats.total_records_deleted + 1 ELSE user_stats.total_records_deleted END,
    total_pages_visited = CASE WHEN p_action = 'page_view' THEN user_stats.total_pages_visited + 1 ELSE user_stats.total_pages_visited END,
    updated_at = NOW();

  -- Update page visits if it's a page view
  IF p_action = 'page_view' AND p_page IS NOT NULL THEN
    INSERT INTO page_visits (user_id, page, visit_count, last_visit_at, date)
    VALUES (p_user_id, p_page, 1, NOW(), CURRENT_DATE)
    ON CONFLICT (user_id, page, date) DO UPDATE SET
      visit_count = page_visits.visit_count + 1,
      last_visit_at = NOW();
  END IF;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- Function to start a new session
CREATE OR REPLACE FUNCTION start_user_session(
  p_user_id UUID,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_session_id UUID;
  v_last_login DATE;
  v_current_streak INTEGER;
BEGIN
  -- End any active sessions for this user
  UPDATE user_sessions
  SET is_active = FALSE,
      session_end = NOW(),
      duration_minutes = EXTRACT(EPOCH FROM (NOW() - session_start)) / 60
  WHERE user_id = p_user_id AND is_active = TRUE;

  -- Create new session
  INSERT INTO user_sessions (user_id, ip_address, user_agent)
  VALUES (p_user_id, p_ip_address, p_user_agent)
  RETURNING id INTO v_session_id;

  -- Get last login date and current streak
  SELECT last_login_date, login_streak INTO v_last_login, v_current_streak
  FROM user_stats WHERE user_id = p_user_id;

  -- Update user stats with login
  INSERT INTO user_stats (user_id, total_logins, last_login_date, login_streak, last_activity_at)
  VALUES (p_user_id, 1, CURRENT_DATE, 1, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    total_logins = user_stats.total_logins + 1,
    login_streak = CASE
      WHEN user_stats.last_login_date = CURRENT_DATE - INTERVAL '1 day' THEN user_stats.login_streak + 1
      WHEN user_stats.last_login_date = CURRENT_DATE THEN user_stats.login_streak
      ELSE 1
    END,
    last_login_date = CURRENT_DATE,
    last_activity_at = NOW(),
    updated_at = NOW();

  -- Log the login activity
  PERFORM log_user_activity(p_user_id, 'login', NULL, NULL, NULL, NULL, NULL, p_ip_address, p_user_agent);

  RETURN v_session_id;
END;
$$ LANGUAGE plpgsql;

-- Function to end a session
CREATE OR REPLACE FUNCTION end_user_session(p_session_id UUID)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_duration INTEGER;
BEGIN
  -- Get user_id and calculate duration
  UPDATE user_sessions
  SET is_active = FALSE,
      session_end = NOW(),
      duration_minutes = EXTRACT(EPOCH FROM (NOW() - session_start)) / 60
  WHERE id = p_session_id AND is_active = TRUE
  RETURNING user_id, duration_minutes INTO v_user_id, v_duration;

  -- Update user stats with session duration
  IF v_user_id IS NOT NULL THEN
    UPDATE user_stats
    SET total_session_minutes = total_session_minutes + COALESCE(v_duration, 0),
        avg_session_duration = (total_session_minutes + COALESCE(v_duration, 0)) / GREATEST(total_logins, 1),
        updated_at = NOW()
    WHERE user_id = v_user_id;

    -- Log logout
    PERFORM log_user_activity(v_user_id, 'logout', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update session activity
CREATE OR REPLACE FUNCTION update_session_activity(p_session_id UUID, p_page VARCHAR(100) DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
  UPDATE user_sessions
  SET pages_visited = pages_visited + CASE WHEN p_page IS NOT NULL THEN 1 ELSE 0 END,
      actions_count = actions_count + 1
  WHERE id = p_session_id AND is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to get user activity summary
CREATE OR REPLACE FUNCTION get_user_activity_summary(
  p_user_id UUID,
  p_days INTEGER DEFAULT 7
)
RETURNS TABLE (
  total_actions BIGINT,
  total_page_views BIGINT,
  total_records_created BIGINT,
  total_records_updated BIGINT,
  most_visited_page VARCHAR(100),
  most_active_hour INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) AS total_actions,
    COUNT(*) FILTER (WHERE action = 'page_view') AS total_page_views,
    COUNT(*) FILTER (WHERE action = 'record_create') AS total_records_created,
    COUNT(*) FILTER (WHERE action = 'record_update') AS total_records_updated,
    (SELECT page FROM user_activity_logs WHERE user_id = p_user_id AND created_at >= NOW() - (p_days || ' days')::INTERVAL GROUP BY page ORDER BY COUNT(*) DESC LIMIT 1) AS most_visited_page,
    (SELECT EXTRACT(HOUR FROM created_at)::INTEGER FROM user_activity_logs WHERE user_id = p_user_id AND created_at >= NOW() - (p_days || ' days')::INTERVAL GROUP BY EXTRACT(HOUR FROM created_at) ORDER BY COUNT(*) DESC LIMIT 1) AS most_active_hour
  FROM user_activity_logs
  WHERE user_id = p_user_id AND created_at >= NOW() - (p_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;

-- Only admins can view all activity logs
CREATE POLICY "Admins can view all activity logs" ON user_activity_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'super_admin', 'system_admin'))
  );

-- Users can view their own activity
CREATE POLICY "Users can view own activity" ON user_activity_logs
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Allow inserts for authenticated users (their own activity)
CREATE POLICY "Users can log their activity" ON user_activity_logs
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Sessions policies
CREATE POLICY "Admins can view all sessions" ON user_sessions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'super_admin', 'system_admin'))
  );

CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can manage own sessions" ON user_sessions
  FOR ALL USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Stats policies
CREATE POLICY "Admins can view all stats" ON user_stats
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'super_admin', 'system_admin'))
  );

CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can manage own stats" ON user_stats
  FOR ALL USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Page visits policies
CREATE POLICY "Admins can view all page visits" ON page_visits
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'super_admin', 'system_admin'))
  );

CREATE POLICY "Users can view own page visits" ON page_visits
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can manage own page visits" ON page_visits
  FOR ALL USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at on user_stats
CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment a specific field in user_stats
CREATE OR REPLACE FUNCTION increment_user_stat(p_user_id UUID, p_field TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('
    UPDATE user_stats
    SET %I = COALESCE(%I, 0) + 1, updated_at = NOW()
    WHERE user_id = $1
  ', p_field, p_field)
  USING p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- View for aggregated page statistics
CREATE OR REPLACE VIEW page_statistics AS
SELECT
  page,
  COUNT(*) as total_visits,
  COUNT(DISTINCT user_id) as unique_visitors,
  DATE_TRUNC('day', created_at) as visit_date
FROM user_activity_logs
WHERE action = 'page_view' AND page IS NOT NULL
GROUP BY page, DATE_TRUNC('day', created_at)
ORDER BY visit_date DESC, total_visits DESC;

-- View for user performance scores
CREATE OR REPLACE VIEW user_performance AS
SELECT
  u.id,
  u.full_name,
  u.email,
  u.role,
  COALESCE(us.total_logins, 0) as total_logins,
  COALESCE(us.total_actions, 0) as total_actions,
  COALESCE(us.total_pages_visited, 0) as pages_visited,
  COALESCE(us.total_records_created, 0) as records_created,
  COALESCE(us.total_records_updated, 0) as records_edited,
  COALESCE(us.login_streak, 0) as login_streak,
  COALESCE(us.avg_session_duration, 0) as avg_session_duration,
  us.last_activity_at,
  -- Calculate performance score (0-100)
  LEAST(100, GREATEST(0,
    (COALESCE(us.login_streak, 0) * 2) +
    (LEAST(COALESCE(us.total_actions, 0), 100) * 0.3) +
    (LEAST(COALESCE(us.total_records_created, 0) + COALESCE(us.total_records_updated, 0), 50) * 0.5) +
    (CASE WHEN us.last_activity_at >= NOW() - INTERVAL '1 day' THEN 20
          WHEN us.last_activity_at >= NOW() - INTERVAL '3 days' THEN 10
          ELSE 0 END)
  ))::INTEGER as performance_score,
  -- Calculate trend
  CASE
    WHEN us.last_activity_at >= NOW() - INTERVAL '1 day' AND us.login_streak > 3 THEN 'up'
    WHEN us.last_activity_at < NOW() - INTERVAL '7 days' OR us.login_streak = 0 THEN 'down'
    ELSE 'stable'
  END as trend
FROM users u
LEFT JOIN user_stats us ON u.id = us.user_id
WHERE u.is_active = TRUE;
