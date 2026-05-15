-- Phase 0 core schema for NEOT.
-- Down:
--   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
--   DROP FUNCTION IF EXISTS public.handle_new_user();
--   DROP FUNCTION IF EXISTS public.touch_updated_at();
--   DROP TABLE IF EXISTS public.profiles;
--   DELETE FROM storage.buckets WHERE id IN ('avatars', 'thumbnails', 'videos', 'uploads');

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'parent', 'admin')) DEFAULT 'student',
  age_group TEXT CHECK (age_group IN ('child', 'teen', 'adult')),
  parent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_parent_id ON public.profiles(parent_id);

DROP TRIGGER IF EXISTS profiles_touch_updated_at ON public.profiles;
CREATE TRIGGER profiles_touch_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are readable by owner" ON public.profiles;
CREATE POLICY "Profiles are readable by owner"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Parents can read child profiles" ON public.profiles;
CREATE POLICY "Parents can read child profiles"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = parent_id);

DROP POLICY IF EXISTS "Profiles are editable by owner" ON public.profiles;
CREATE POLICY "Profiles are editable by owner"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Profiles are insertable by owner" ON public.profiles;
CREATE POLICY "Profiles are insertable by owner"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;
CREATE POLICY "Admins can manage profiles"
  ON public.profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles admin_profile
      WHERE admin_profile.id = auth.uid()
        AND admin_profile.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles admin_profile
      WHERE admin_profile.id = auth.uid()
        AND admin_profile.role = 'admin'
    )
  );

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('thumbnails', 'thumbnails', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp']),
  ('videos', 'videos', false, 52428800, ARRAY['video/mp4', 'video/webm', 'video/quicktime']),
  ('uploads', 'uploads', false, 52428800, ARRAY[
    'image/png',
    'image/jpeg',
    'image/webp',
    'video/mp4',
    'video/webm',
    'audio/mpeg',
    'audio/wav',
    'application/pdf'
  ])
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public avatars are readable" ON storage.objects;
CREATE POLICY "Public avatars are readable"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Public thumbnails are readable" ON storage.objects;
CREATE POLICY "Public thumbnails are readable"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'thumbnails');

DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
CREATE POLICY "Users can upload their own avatars"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update their own uploads" ON storage.objects;
CREATE POLICY "Users can update their own uploads"
  ON storage.objects
  FOR UPDATE
  USING (auth.uid()::TEXT = (storage.foldername(name))[1])
  WITH CHECK (auth.uid()::TEXT = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can read their own private uploads" ON storage.objects;
CREATE POLICY "Users can read their own private uploads"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id IN ('videos', 'uploads')
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

