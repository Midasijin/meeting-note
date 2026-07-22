-- ==========================================
-- MEETING INTELLIGENCE SUPABASE SCHEMA SQL
-- ==========================================
-- 이 SQL 스크립트를 Supabase 대시보드의 SQL Editor에 붙여넣어 실행하세요.

-- 1. pgvector 확장 활성화 (유사도 검색 및 RAG용)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. 부서 테이블 생성
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 프로필 테이블 생성 (Supabase Auth와 자동 연동하기 위한 스키마)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name VARCHAR(100),
  department_id UUID REFERENCES departments(id),
  role VARCHAR(50) DEFAULT 'member', -- member, manager, admin
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. 회의록 테이블 생성
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  meeting_date DATE NOT NULL,
  raw_text TEXT NOT NULL,
  refined_content TEXT NOT NULL,
  public_summary TEXT,
  ai_attendees TEXT,
  author_id UUID REFERENCES profiles(id),
  department_id UUID REFERENCES departments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. 액션 아이템 테이블 생성
CREATE TABLE IF NOT EXISTS action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  assignee_name VARCHAR(100),
  due_date DATE,
  status VARCHAR(20) DEFAULT 'todo', -- todo, in_progress, done
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. 회의록 단락 임베딩 테이블 생성 (RAG 용)
CREATE TABLE IF NOT EXISTS meeting_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  content_chunk TEXT NOT NULL,
  embedding VECTOR(1536) NOT NULL, -- Gemini 1.5/2.5 Text Embedding 모델은 1536 또는 768차원 지원
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. 초기 더미 부서 데이터 추가
INSERT INTO departments (name) VALUES 
('개발부'), 
('마케팅부'), 
('인프라부'),
('기획부')
ON CONFLICT (name) DO NOTHING;

-- 8. RLS 보안 정책 설정 (인증된 로그인 사용자 전용)
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON departments;
CREATE POLICY "Enable all for authenticated users" ON departments FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON profiles;
CREATE POLICY "Enable all for authenticated users" ON profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON meetings;
CREATE POLICY "Enable all for authenticated users" ON meetings FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON action_items;
CREATE POLICY "Enable all for authenticated users" ON action_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE meeting_embeddings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON meeting_embeddings;
CREATE POLICY "Enable all for authenticated users" ON meeting_embeddings FOR ALL TO authenticated USING (true) WITH CHECK (true);
