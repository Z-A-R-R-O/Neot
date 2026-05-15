-- Seed data intentionally stays light for Phase 0.
-- Auth users are created through Supabase Auth; profiles are auto-created by trigger.

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
ON CONFLICT (id) DO NOTHING;

