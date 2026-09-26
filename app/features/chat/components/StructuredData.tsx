export function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Sudeshi AI Chat',
    url: 'https://sudeshi-ai-chat.vercel.app/',
    applicationCategory: 'AIApplication',
    operatingSystem: 'Web',
    description:
      'A multilingual AI chat assistant for natural conversations across Indian languages.',
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
