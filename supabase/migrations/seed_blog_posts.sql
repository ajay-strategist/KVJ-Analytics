-- Seed the three starter blog posts into blog_posts so they appear in the Admin
-- Blog manager as real, editable rows (previously they were hardcoded demo/fallback
-- content on the public page and could not be edited).
--
-- Idempotent: ON CONFLICT (slug) DO NOTHING — safe to run more than once, and it
-- will never overwrite posts you've already edited.

insert into public.blog_posts
  (slug, title, description, body_html, cover_url, author_name, author_slug,
   category_title, category_slug, published_at, featured, is_published, tags, featured_flags)
values
  (
    'why-data-driven-organizations-consistently-outperform-their-competition',
    'Why Data-Driven Organizations Consistently Outperform Their Competition',
    'Leaders who make decisions backed by evidence rather than assumptions consistently outperform. Discover how Business Intelligence creates a single source of truth for competitive advantage.',
    '<p>Leaders who make decisions backed by evidence rather than assumptions consistently outperform.</p>',
    '',
    'K. V. Jacob', 'k-v-jacob',
    'Business Intelligence', 'business-intelligence',
    '2026-07-20T08:00:00.000Z', true, true,
    array['business-intelligence','data-driven','decision-making'],
    array['featured','latest']
  ),
  (
    'digital-transformation-building-smarter-businesses-for-the-future',
    'Digital Transformation: Building Smarter Businesses for the Future',
    'Digital Transformation is about improving how organisations operate, collaborate, and create value using data, processes, and technology.',
    '<p>Digital Transformation is a strategic journey that combines people, processes, technology, and data.</p>',
    '',
    'K. V. Jacob', 'k-v-jacob',
    'Digital Transformation', 'digital-transformation',
    '2026-07-15T09:00:00.000Z', false, true,
    array['digital-transformation','cloud','automation','strategy'],
    array['trending','popular']
  ),
  (
    'how-artificial-intelligence-is-revolutionising-business-analytics',
    'How Artificial Intelligence is Revolutionising Business Analytics',
    'AI has evolved from a futuristic concept into a practical business tool, empowering organisations to move from reactive analytics to proactive business planning.',
    '<p>Artificial Intelligence empowers organisations to make smarter decisions faster than ever before.</p>',
    '',
    'K. V. Jacob', 'k-v-jacob',
    'Artificial Intelligence', 'artificial-intelligence',
    '2026-07-10T09:00:00.000Z', false, true,
    array['artificial-intelligence','ai','predictive-analytics','machine-learning'],
    array['latest']
  )
on conflict (slug) do nothing;
