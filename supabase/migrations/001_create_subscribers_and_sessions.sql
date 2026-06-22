-- =============================================
-- Migration: Create subscribers and sessions tables
-- For managing academy subscribers and their session schedules
-- =============================================

-- ===================
-- Table: subscribers
-- ===================
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Student info
  student_name TEXT NOT NULL,
  student_email TEXT,
  student_phone TEXT NOT NULL,
  parent_phone TEXT,
  child_age TEXT,
  grade TEXT,
  curriculum TEXT,
  subject TEXT,
  course_type TEXT,
  
  -- Package info
  package_sessions INTEGER NOT NULL DEFAULT 8,
  package_price DECIMAL(10,2) DEFAULT 1000.00,
  session_days INTEGER[] NOT NULL DEFAULT '{}',
  preferred_time TEXT DEFAULT '16:00',
  session_duration INTEGER NOT NULL DEFAULT 60, -- minutes
  
  -- Subscription status
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  paused_at TIMESTAMPTZ,
  resumed_at TIMESTAMPTZ,
  
  -- Source
  source TEXT DEFAULT 'manual'
    CHECK (source IN ('manual', 'free_trial')),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================
-- Table: sessions
-- ===================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  
  session_number INTEGER NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT DEFAULT '16:00',
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  
  -- Session status
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'completed', 'postponed', 'carried_forward')),
  
  -- Postponement data
  original_date DATE,
  postponed_to DATE,
  postpone_reason TEXT,
  
  -- Carry forward data
  carried_from_session INTEGER,
  
  -- Google Calendar
  google_event_id TEXT,
  meet_link TEXT,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================
-- Indexes
-- ===================
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_source ON subscribers(source);
CREATE INDEX IF NOT EXISTS idx_sessions_subscriber_id ON sessions(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled_date ON sessions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);

-- ===================
-- RLS Policies
-- ===================
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access (admin dashboard)
CREATE POLICY "Authenticated users can manage subscribers"
  ON subscribers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage sessions"
  ON sessions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant access to authenticated role
GRANT ALL ON subscribers TO authenticated;
GRANT ALL ON sessions TO authenticated;

-- ===================
-- Updated_at trigger
-- ===================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
