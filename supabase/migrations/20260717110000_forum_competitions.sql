-- Real community competitions replacing static mock banners.

CREATE TABLE IF NOT EXISTS public.competitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  prize text NOT NULL,
  rules jsonb NOT NULL DEFAULT '[]'::jsonb,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'judging', 'completed', 'cancelled')),
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  winner_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);

CREATE TABLE IF NOT EXISTS public.competition_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  forum_post_id uuid REFERENCES public.forum_posts(id) ON DELETE SET NULL,
  score integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'entered'
    CHECK (status IN ('entered', 'approved', 'rejected', 'winner')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (competition_id, user_id)
);

ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active competitions are public"
  ON public.competitions FOR SELECT
  USING (status IN ('active', 'judging', 'completed'));
CREATE POLICY "Admins manage competitions"
  ON public.competitions FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
CREATE POLICY "Competition entries are public"
  ON public.competition_entries FOR SELECT
  USING (status IN ('approved', 'winner') OR user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users enter active competitions"
  ON public.competition_entries FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.competitions competition
      WHERE competition.id = competition_id
        AND competition.status = 'active'
        AND now() BETWEEN competition.starts_at AND competition.ends_at
    )
  );
CREATE POLICY "Admins moderate competition entries"
  ON public.competition_entries FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS update_competitions_updated_at ON public.competitions;
CREATE TRIGGER update_competitions_updated_at
  BEFORE UPDATE ON public.competitions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.competitions (
  title, description, prize, rules, starts_at, ends_at, status
)
SELECT
  'أفضل تحول قبل وبعد',
  'شارك عملاً حقيقياً من معرضك أو منشوراً يوضح التحول مع احترام خصوصية العميل.',
  '150 نقطة ولاء + ظهور مميز',
  '["صورة أصلية","موافقة صاحب الصورة","لا تعديلات مضللة"]'::jsonb,
  now(),
  now() + interval '30 days',
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM public.competitions WHERE status = 'active'
);
