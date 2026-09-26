import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Sudeshi AI Chat — AI Assistant for Indian Languages';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

const prompts = [
  {
    category: 'Travel',
    text: 'Best places near Chennai',
  },
  {
    category: 'Programming',
    text: 'Explain React server components',
  },
  {
    category: 'Translation',
    text: 'Translate this to Tamil',
  },
  {
    category: 'Learning',
    text: 'Teach me Kubernetes',
  },
];

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#09090b',
        color: '#ffffff',
        padding: '42px 56px',
        fontFamily: 'Arial',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          Sudeshi
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 16,
            color: '#71717a',
          }}
        >
          AI Chat
        </div>
      </div>

      {/* Indian tricolor */}
      <div
        style={{
          display: 'flex',
          width: 72,
          height: 4,
          marginTop: 18,
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 24,
            backgroundColor: '#FF9933',
          }}
        />
        <div
          style={{
            display: 'flex',
            width: 24,
            backgroundColor: '#FFFFFF',
          }}
        />
        <div
          style={{
            display: 'flex',
            width: 24,
            backgroundColor: '#138808',
          }}
        />
      </div>

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 48,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 46,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: -1,
          }}
        >
          How can I help you today?
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 12,
            fontSize: 20,
            color: '#a1a1aa',
          }}
        >
          Ask anything. Get answers in your language.
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 17,
            fontWeight: 600,
            color: '#a1a1aa',
          }}
        >
          Need inspiration?
        </div>
      </div>

      {/* Explicit 2 × 2 grid */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginTop: 18,
        }}
      >
        {/* Row 1 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 12,
          }}
        >
          <PromptCard category={prompts[0].category} text={prompts[0].text} />

          <PromptCard category={prompts[1].category} text={prompts[1].text} />
        </div>

        {/* Row 2 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 12,
          }}
        >
          <PromptCard category={prompts[2].category} text={prompts[2].text} />

          <PromptCard category={prompts[3].category} text={prompts[3].text} />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 'auto',
          fontSize: 15,
          color: '#52525b',
        }}
      >
        Multilingual AI Assistant
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}

function PromptCard({ category, text }: { category: string; text: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: 532,
        height: 78,
        padding: '13px 18px',
        backgroundColor: '#18181b',
        border: '1px solid #27272a',
        borderRadius: 12,
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 14,
          fontWeight: 600,
          color: '#a1a1aa',
        }}
      >
        {category}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 17,
          color: '#f4f4f5',
        }}
      >
        <div
          style={{
            display: 'flex',
          }}
        >
          {text}
        </div>

        <div
          style={{
            display: 'flex',
            marginLeft: 16,
            fontSize: 20,
            color: '#71717a',
          }}
        >
          →
        </div>
      </div>
    </div>
  );
}
