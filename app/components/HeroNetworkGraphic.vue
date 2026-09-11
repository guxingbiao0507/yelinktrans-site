<template>
  <div class="hero-visual" aria-hidden="true">
    <div class="visual-halo halo-one" />
    <div class="visual-halo halo-two" />
    <div class="hero-visual-label">
      <strong>LANGUAGE × AI</strong>
      <span>CONTENT · DATA · SOLUTION</span>
    </div>
    <svg viewBox="0 0 680 640" role="presentation">
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#75b4ee" stop-opacity=".2" />
          <stop offset=".48" stop-color="#2f75b5" stop-opacity=".9" />
          <stop offset="1" stop-color="#30b7a2" stop-opacity=".42" />
        </linearGradient>
        <radialGradient id="coreGradient">
          <stop offset="0" stop-color="#ffffff" />
          <stop offset=".35" stop-color="#a7d4ff" />
          <stop offset="1" stop-color="#2f75b5" />
        </radialGradient>
        <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g fill="none" stroke="url(#lineGradient)" stroke-linecap="round">
        <path d="M72 324C113 176 230 77 370 76c129-1 233 81 268 199" stroke-width="2" />
        <path d="M79 415c71 116 210 172 340 135 113-32 194-120 216-224" stroke-width="1.8" />
        <path d="M112 222c100 9 170 46 228 107 62 65 137 103 246 92" stroke-width="1.25" />
        <path d="M140 492c22-103 83-185 200-235 91-39 158-89 179-177" stroke-width="1.2" />
        <path d="M205 116c9 91 43 159 135 213 88 51 175 62 269 24" stroke-width="1.1" />
        <path d="M85 330l91-139 132 124 113-180 151 116" stroke-width="1.7" />
        <path d="M112 449l120 76 108-196 132 185 116-108" stroke-width="1.45" />
        <path d="M176 191l64 117 68 7 32 14 132 8 100-86" stroke-width="1.1" />
      </g>

      <g fill="#ffffff" stroke="#2f75b5">
        <circle cx="340" cy="329" r="21" fill="url(#coreGradient)" filter="url(#softGlow)" />
        <circle cx="85" cy="330" r="5" />
        <circle cx="176" cy="191" r="5" />
        <circle cx="308" cy="105" r="5" />
        <circle cx="468" cy="124" r="5" />
        <circle cx="572" cy="251" r="5" />
        <circle cx="588" cy="406" r="5" />
        <circle cx="472" cy="514" r="5" />
        <circle cx="340" cy="557" r="5" />
        <circle cx="232" cy="525" r="5" />
        <circle cx="112" cy="449" r="5" />
        <circle cx="240" cy="308" r="5" />
        <circle cx="472" cy="337" r="5" />
      </g>

      <g class="language-nodes" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="700" text-anchor="middle">
        <g transform="translate(85 330)"><circle r="22" /><text y="5">ZH</text></g>
        <g transform="translate(176 191)"><circle r="22" /><text y="5">EN</text></g>
        <g transform="translate(308 105)"><circle r="22" /><text y="5">JA</text></g>
        <g transform="translate(468 124)"><circle r="22" /><text y="5">KO</text></g>
        <g transform="translate(572 251)"><circle r="22" /><text y="5">DE</text></g>
        <g transform="translate(588 406)"><circle r="22" /><text y="5">FR</text></g>
        <g transform="translate(472 514)"><circle r="22" /><text y="5">ES</text></g>
        <g transform="translate(340 557)"><circle r="22" /><text y="5">PT</text></g>
        <g transform="translate(232 525)"><circle r="22" /><text y="5">AR</text></g>
        <g transform="translate(112 449)"><circle r="22" /><text y="5">RU</text></g>
        <g transform="translate(240 308)"><circle r="22" /><text y="5">TH</text></g>
        <g transform="translate(472 337)"><circle r="22" /><text y="5">ID</text></g>
      </g>

    </svg>
  </div>
</template>
