// ─── CHARACTER SYSTEM ────────────────────────────────────────────────────────
// SVG-based animated characters with mood-driven expressions and accessories.

const CHARACTER_TYPES = {
  anxious:    { skin: '#F5C9A0', hair: '#3D2817', bodyColor: '#6B7AA8', accent: '#E2845E' },
  angry:      { skin: '#F5B591', hair: '#1F1611', bodyColor: '#9C3F36', accent: '#D4423A' },
  happy:      { skin: '#F2D2AC', hair: '#704020', bodyColor: '#6AAF2E', accent: '#F5A623' },
  excited:    { skin: '#EBC9A1', hair: '#A45A2E', bodyColor: '#F5A623', accent: '#1C2280' },
  corporate:  { skin: '#F5C9A0', hair: '#2A2A2A', bodyColor: '#1C2280', accent: '#C5CAFE' },
  formal:     { skin: '#E8C29B', hair: '#9C9DAB', bodyColor: '#2A2D54', accent: '#B5A66A' },
  influencer: { skin: '#F8D4AE', hair: '#D4A574', bodyColor: '#E91E63', accent: '#FFB300' },
  party:      { skin: '#F2C5A0', hair: '#704020', bodyColor: '#9C27B0', accent: '#FFEB3B' },
  oblivious:  { skin: '#F5D2B0', hair: '#5C3A1F', bodyColor: '#8E9AB5', accent: '#A88E70' },
  silent:     { skin: '#EBC8A4', hair: '#3A3A3A', bodyColor: '#607D8B', accent: '#90A4AE' },
  // New types
  diplomat:   { skin: '#E8C29B', hair: '#1A1A1A', bodyColor: '#1A1A2E', accent: '#FFD700' },
  posh:       { skin: '#F8D4AE', hair: '#C7986E', bodyColor: '#5C7A2E', accent: '#8B0000' },
  techie:     { skin: '#F5C9A0', hair: '#2A2A2A', bodyColor: '#222222', accent: '#00FF88' },
  cleaner:    { skin: '#EBC9A1', hair: '#3A2818', bodyColor: '#9CC4E4', accent: '#F5A623' },
  gangster:   { skin: '#F2C5A0', hair: '#1F1611', bodyColor: '#1A1A1A', accent: '#FFD700' },
  royalty:    { skin: '#F8D4AE', hair: '#9C9DAB', bodyColor: '#8B0000', accent: '#FFD700' },
  german:     { skin: '#F2D2AC', hair: '#D4A574', bodyColor: '#5C7A2E', accent: '#1C2280' },
};

const MOOD_TO_TYPE = {
  '😟':'anxious', '😐':'anxious', '😕':'anxious', '😬':'anxious', '😓':'anxious', '😞':'anxious',
  '😡':'angry', '😤':'angry', '🚬':'angry', '🌿':'angry',
  '😄':'happy', '😊':'happy', '🥰':'happy', '🦚':'happy', '✨':'happy',
  '🎉':'party', '🍽️':'party', '🎵':'party',
  '💼':'corporate', '💻':'techie', '🧐':'corporate', '🤷':'silent', '🕶️':'corporate',
  '👑':'royalty', '🎩':'formal', '🎨':'formal', '💎':'formal', '🏁':'formal',
  '📸':'influencer', '🎬':'influencer', '🎥':'influencer', '🌊':'influencer', '🎭':'influencer',
  '😶':'oblivious', '😅':'german', '🐎':'posh', '🐕':'posh',
  '🛡️':'diplomat', '🌐':'cleaner', '📦':'anxious', '😈':'gangster',
  '💳':'anxious', '💥':'diplomat', '🚨':'diplomat', '🍷':'formal',
  '😱':'angry', '😵':'angry', '👶':'oblivious',
  '🤨':'formal', '💍':'formal',
  // v6 NEW MOOD EMOJIS — extreme emotional states
  '🤬':'angry', '😭':'anxious', '😩':'anxious', '🥴':'party',
  '🤢':'anxious', '😨':'anxious', '😏':'formal', '🥶':'anxious',
  '😴':'silent', '🐀':'anxious', '🛏️':'anxious', '🔑':'anxious',
};

// Map free-text mood strings (e.g. "sleepless 😩", "FURIOUS 🤬") to extreme states
const MOOD_TO_STATE = {
  // RAGE
  'rag': 'rage', 'fur': 'rage', 'fury': 'rage', 'angr': 'rage', '🤬': 'rage',
  // CRYING / WEEPING  
  'devastat': 'weeping', 'weep': 'weeping', 'sob': 'weeping', '😭': 'weeping',
  'cry': 'crying', 'tear': 'crying',
  // SLEEPLESS
  'sleeple': 'sleepless', '😩': 'sleepless', '😴': 'sleepless',
  // DRUNK
  'drunk': 'drunk', 'wast': 'drunk', '🥴': 'drunk',
  // DISGUSTED
  'disgust': 'disgusted', '🤢': 'disgusted',
  // TERRIFIED / FREEZING
  'terrif': 'terrified', '😨': 'terrified', 'freez': 'freezing', '🥶': 'freezing',
  // SHOCKED
  'shock': 'shocked', '😱': 'shocked', 'bewilder': 'shocked',
  // EMBARRASSED
  'embarrass': 'embarrassed',
  // SMUG
  'smug': 'smug', '😏': 'smug',
};
function getStateFromMood(moodStr){
  if (!moodStr) return 'neutral';
  const lc = moodStr.toLowerCase();
  for (const k of Object.keys(MOOD_TO_STATE)){
    if (lc.includes(k)) return MOOD_TO_STATE[k];
  }
  // Fallback to legacy state mapping
  if (lc.includes('happy') || lc.includes('cheer') || lc.includes('thrilled')) return 'happy';
  if (lc.includes('sad')) return 'sad';
  if (lc.includes('complaining')) return 'complaining';
  return 'neutral';
}

function getCharType(emoji){ return MOOD_TO_TYPE[emoji] || 'anxious'; }

function renderCharacter(emoji, state = 'neutral', size = 160){
  const type = getCharType(emoji);
  const c = CHARACTER_TYPES[type];

  // Skin tinting overlay for extreme states (red rage, green sick, blue cold)
  let skinTint = c.skin;
  if (state === 'rage') skinTint = '#E85A4F';
  else if (state === 'disgusted') skinTint = '#A8C97F';
  else if (state === 'terrified' || state === 'freezing') skinTint = '#C5DCEA';
  else if (state === 'drunk') skinTint = '#F8B4A8';
  else if (state === 'embarrassed') skinTint = '#F2A0A0';

  // Mouth shapes — much expanded
  const mouths = {
    neutral:    `<path d="M 70 105 Q 80 108 90 105" fill="none" stroke="#3D2817" stroke-width="2.5" stroke-linecap="round"/>`,
    happy:      `<path d="M 65 100 Q 80 115 95 100" fill="#3D2817" stroke="#3D2817" stroke-width="2"/>`,
    angry:      `<path d="M 65 110 Q 80 100 95 110" fill="none" stroke="#3D2817" stroke-width="3" stroke-linecap="round"/>`,
    shocked:    `<ellipse cx="80" cy="106" rx="6" ry="9" fill="#3D2817"/>`,
    sad:        `<path d="M 65 110 Q 80 100 95 110" fill="none" stroke="#3D2817" stroke-width="2.5" stroke-linecap="round"/>`,
    complaining:`<ellipse class="char-mouth-talk" cx="80" cy="108" rx="8" ry="6" fill="#3D2817"/>`,
    // NEW STATES
    sleepless:  `<path d="M 70 108 Q 80 106 90 108" fill="none" stroke="#3D2817" stroke-width="2" stroke-linecap="round"/>`,
    crying:     `<path class="crying-mouth" d="M 62 105 Q 80 122 98 105 Q 92 110 80 110 Q 68 110 62 105 Z" fill="#5C3026"/>
                 <path d="M 70 110 Q 80 116 90 110" fill="none" stroke="#fff" stroke-width="0.8" opacity="0.6"/>`,
    weeping:    `<path d="M 58 102 Q 80 130 102 102 Q 95 115 80 115 Q 65 115 58 102 Z" fill="#3D2817"/>
                 <path d="M 65 113 L 95 113" stroke="#fff" stroke-width="1" opacity="0.5"/>`,
    rage:       `<path d="M 58 112 L 102 112 L 95 105 L 88 110 L 80 102 L 72 110 L 65 105 Z" fill="#3D2817" stroke="#1a1a1a" stroke-width="1"/>`,
    disgusted:  `<path d="M 65 108 Q 75 115 80 110 Q 85 105 95 110" fill="none" stroke="#3D2817" stroke-width="2.5" stroke-linecap="round"/>
                 <ellipse cx="100" cy="108" rx="3" ry="4" fill="#A8C97F" opacity="0.8"/>`,
    terrified:  `<ellipse cx="80" cy="108" rx="9" ry="11" fill="#3D2817"/>
                 <rect x="76" y="105" width="2" height="6" fill="#fff" opacity="0.4"/>`,
    drunk:      `<path d="M 60 108 Q 70 115 80 108 Q 90 102 100 110" fill="none" stroke="#3D2817" stroke-width="2.5" stroke-linecap="round"/>`,
    embarrassed:`<path d="M 70 108 L 90 108" fill="none" stroke="#3D2817" stroke-width="2" stroke-linecap="round"/>`,
    smug:       `<path d="M 68 108 Q 80 100 92 108" fill="none" stroke="#3D2817" stroke-width="2.5" stroke-linecap="round"/>`,
  };

  const brows = {
    neutral:    `<rect x="58" y="74" width="14" height="3" rx="1.5" fill="#3D2817"/><rect x="88" y="74" width="14" height="3" rx="1.5" fill="#3D2817"/>`,
    happy:      `<path d="M 58 78 Q 65 72 72 78" fill="none" stroke="#3D2817" stroke-width="3" stroke-linecap="round"/><path d="M 88 78 Q 95 72 102 78" fill="none" stroke="#3D2817" stroke-width="3" stroke-linecap="round"/>`,
    angry:      `<path d="M 56 76 L 74 80" stroke="#3D2817" stroke-width="4" stroke-linecap="round"/><path d="M 86 80 L 104 76" stroke="#3D2817" stroke-width="4" stroke-linecap="round"/>`,
    shocked:    `<rect x="56" y="68" width="14" height="3" rx="1.5" fill="#3D2817"/><rect x="90" y="68" width="14" height="3" rx="1.5" fill="#3D2817"/>`,
    sad:        `<path d="M 58 72 Q 65 78 72 76" fill="none" stroke="#3D2817" stroke-width="3" stroke-linecap="round"/><path d="M 88 76 Q 95 78 102 72" fill="none" stroke="#3D2817" stroke-width="3" stroke-linecap="round"/>`,
    complaining:`<path d="M 56 76 L 74 80" stroke="#3D2817" stroke-width="4" stroke-linecap="round"/><path d="M 86 80 L 104 76" stroke="#3D2817" stroke-width="4" stroke-linecap="round"/>`,
    sleepless:  `<path d="M 56 75 Q 65 78 74 76" fill="none" stroke="#3D2817" stroke-width="2.5" stroke-linecap="round"/><path d="M 86 76 Q 95 78 104 75" fill="none" stroke="#3D2817" stroke-width="2.5" stroke-linecap="round"/>`,
    crying:     `<path d="M 56 78 Q 65 72 74 78" fill="none" stroke="#3D2817" stroke-width="3.5" stroke-linecap="round"/><path d="M 86 78 Q 95 72 104 78" fill="none" stroke="#3D2817" stroke-width="3.5" stroke-linecap="round"/>`,
    weeping:    `<path d="M 56 80 Q 65 70 74 80" fill="none" stroke="#3D2817" stroke-width="4" stroke-linecap="round"/><path d="M 86 80 Q 95 70 104 80" fill="none" stroke="#3D2817" stroke-width="4" stroke-linecap="round"/>`,
    rage:       `<path d="M 52 78 L 76 84" stroke="#1a1a1a" stroke-width="5" stroke-linecap="round"/><path d="M 84 84 L 108 78" stroke="#1a1a1a" stroke-width="5" stroke-linecap="round"/>`,
    disgusted:  `<path d="M 58 78 Q 65 74 72 78" fill="none" stroke="#3D2817" stroke-width="3"/><path d="M 88 78 Q 95 74 102 78" fill="none" stroke="#3D2817" stroke-width="3"/>`,
    terrified:  `<path d="M 56 70 Q 65 64 74 70" fill="none" stroke="#3D2817" stroke-width="3.5"/><path d="M 86 70 Q 95 64 104 70" fill="none" stroke="#3D2817" stroke-width="3.5"/>`,
    drunk:      `<path d="M 58 76 Q 65 80 72 74" fill="none" stroke="#3D2817" stroke-width="2.5"/><path d="M 88 74 Q 95 80 102 76" fill="none" stroke="#3D2817" stroke-width="2.5"/>`,
    embarrassed:`<path d="M 56 76 Q 65 73 74 76" fill="none" stroke="#3D2817" stroke-width="2.5"/><path d="M 86 76 Q 95 73 104 76" fill="none" stroke="#3D2817" stroke-width="2.5"/>`,
    smug:       `<path d="M 58 75 Q 65 70 74 78" fill="none" stroke="#3D2817" stroke-width="3"/><path d="M 86 78 Q 95 70 102 75" fill="none" stroke="#3D2817" stroke-width="3"/>`,
  };

  // CHEEK SYSTEM — different cheeks for different states
  let cheeks = '';
  if (state === 'angry' || state === 'complaining' || state === 'shocked') {
    cheeks = `<circle cx="55" cy="98" r="6" fill="#E2845E" opacity="0.5"/><circle cx="105" cy="98" r="6" fill="#E2845E" opacity="0.5"/>`;
  } else if (state === 'rage') {
    cheeks = `<circle cx="52" cy="100" r="9" fill="#C03020" opacity="0.7"/><circle cx="108" cy="100" r="9" fill="#C03020" opacity="0.7"/>`;
  } else if (state === 'embarrassed' || state === 'drunk') {
    cheeks = `<circle cx="55" cy="100" r="10" fill="#F08080" opacity="0.7"/><circle cx="105" cy="100" r="10" fill="#F08080" opacity="0.7"/>`;
  } else if (state === 'crying' || state === 'weeping') {
    cheeks = `<circle cx="55" cy="100" r="7" fill="#E08080" opacity="0.45"/><circle cx="105" cy="100" r="7" fill="#E08080" opacity="0.45"/>`;
  } else if (state === 'disgusted') {
    cheeks = `<circle cx="55" cy="100" r="6" fill="#7AAA50" opacity="0.4"/><circle cx="105" cy="100" r="6" fill="#7AAA50" opacity="0.4"/>`;
  } else if (state === 'terrified') {
    cheeks = `<circle cx="55" cy="100" r="5" fill="#9CB3D8" opacity="0.5"/><circle cx="105" cy="100" r="5" fill="#9CB3D8" opacity="0.5"/>`;
  }

  // TEARS — scaled by state
  let tears = '';
  if (state === 'sad') {
    tears = `<ellipse cx="62" cy="98" rx="2" ry="4" fill="#5BC0EB" opacity="0.7"><animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite"/></ellipse>`;
  } else if (state === 'crying') {
    tears = `<g class="big-tears">
        <ellipse cx="62" cy="100" rx="3.5" ry="6" fill="#5BC0EB" opacity="0.85"><animate attributeName="cy" values="100;130;100" dur="1.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="1.4s" repeatCount="indefinite"/></ellipse>
        <ellipse cx="98" cy="100" rx="3.5" ry="6" fill="#5BC0EB" opacity="0.85"><animate attributeName="cy" values="100;130;100" dur="1.4s" begin="0.3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="1.4s" begin="0.3s" repeatCount="indefinite"/></ellipse>
      </g>`;
  } else if (state === 'weeping') {
    tears = `<g class="weeping-tears">
        <ellipse cx="60" cy="100" rx="5" ry="8" fill="#3FA8E0" opacity="0.9"><animate attributeName="cy" values="100;145;100" dur="1.1s" repeatCount="indefinite"/></ellipse>
        <ellipse cx="100" cy="100" rx="5" ry="8" fill="#3FA8E0" opacity="0.9"><animate attributeName="cy" values="100;145;100" dur="1.1s" begin="0.2s" repeatCount="indefinite"/></ellipse>
        <ellipse cx="58" cy="118" rx="3" ry="5" fill="#5BC0EB" opacity="0.7"><animate attributeName="cy" values="118;160;118" dur="1.4s" begin="0.4s" repeatCount="indefinite"/></ellipse>
        <ellipse cx="102" cy="118" rx="3" ry="5" fill="#5BC0EB" opacity="0.7"><animate attributeName="cy" values="118;160;118" dur="1.4s" begin="0.6s" repeatCount="indefinite"/></ellipse>
        <path d="M 50 105 Q 45 130 50 150" fill="none" stroke="#5BC0EB" stroke-width="2" opacity="0.6"/>
        <path d="M 110 105 Q 115 130 110 150" fill="none" stroke="#5BC0EB" stroke-width="2" opacity="0.6"/>
      </g>`;
  }

  // STEAM / RAGE PUFFS
  let steam = '';
  if (state === 'angry' || state === 'complaining') {
    steam = `<g class="char-steam">
         <circle cx="40" cy="50" r="4" fill="#fff" opacity="0.8"/>
         <circle cx="120" cy="48" r="5" fill="#fff" opacity="0.7"/>
         <circle cx="35" cy="38" r="3" fill="#fff" opacity="0.6"/>
       </g>`;
  } else if (state === 'rage') {
    steam = `<g class="rage-steam">
       <ellipse cx="32" cy="92" rx="6" ry="4" fill="#FF6B5A" opacity="0.6"><animate attributeName="cx" values="32;18;32" dur="0.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0;0.6" dur="0.8s" repeatCount="indefinite"/></ellipse>
       <ellipse cx="128" cy="92" rx="6" ry="4" fill="#FF6B5A" opacity="0.6"><animate attributeName="cx" values="128;142;128" dur="0.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0;0.6" dur="0.8s" repeatCount="indefinite"/></ellipse>
       <ellipse cx="20" cy="80" rx="4" ry="3" fill="#FFB0A0" opacity="0.7"><animate attributeName="cy" values="80;55;80" dur="1.2s" repeatCount="indefinite"/></ellipse>
       <ellipse cx="140" cy="80" rx="4" ry="3" fill="#FFB0A0" opacity="0.7"><animate attributeName="cy" values="80;55;80" dur="1.2s" begin="0.3s" repeatCount="indefinite"/></ellipse>
       <path class="rage-vein" d="M 78 56 Q 75 50 80 45 Q 85 50 82 56" fill="none" stroke="#A03020" stroke-width="2" opacity="0.7"/>
     </g>`;
  } else if (state === 'disgusted') {
    steam = `<g class="disgust-aura">
       <ellipse cx="80" cy="135" rx="8" ry="3" fill="#7AAA50" opacity="0.5"><animate attributeName="ry" values="3;6;3" dur="1.5s" repeatCount="indefinite"/></ellipse>
     </g>`;
  } else if (state === 'drunk') {
    steam = `<g class="drunk-bubbles">
       <circle cx="30" cy="40" r="3" fill="#FFB6C1" opacity="0.6"><animate attributeName="cy" values="40;20;40" dur="2s" repeatCount="indefinite"/></circle>
       <circle cx="130" cy="35" r="2.5" fill="#FFB6C1" opacity="0.5"><animate attributeName="cy" values="35;15;35" dur="2.3s" repeatCount="indefinite"/></circle>
     </g>`;
  }

  // EYE SYSTEM — different eyes per emotional state
  let eyes = '';
  if (state === 'sleepless') {
    // Heavy red bags + bloodshot, drooping lids, deep dark circles
    eyes = `
      <ellipse cx="65" cy="100" rx="10" ry="4" fill="#5C2820" opacity="0.5"/>
      <ellipse cx="95" cy="100" rx="10" ry="4" fill="#5C2820" opacity="0.5"/>
      <ellipse cx="65" cy="92" rx="6" ry="5" fill="#FFE0E0"/>
      <ellipse cx="95" cy="92" rx="6" ry="5" fill="#FFE0E0"/>
      <ellipse cx="65" cy="92" rx="3.5" ry="3.5" fill="#3D2817"/>
      <ellipse cx="95" cy="92" rx="3.5" ry="3.5" fill="#3D2817"/>
      <line x1="60" y1="89" x2="70" y2="91" stroke="#C03020" stroke-width="0.6" opacity="0.7"/>
      <line x1="60" y1="93" x2="70" y2="95" stroke="#C03020" stroke-width="0.6" opacity="0.7"/>
      <line x1="90" y1="89" x2="100" y2="91" stroke="#C03020" stroke-width="0.6" opacity="0.7"/>
      <line x1="90" y1="93" x2="100" y2="95" stroke="#C03020" stroke-width="0.6" opacity="0.7"/>
      <path d="M 58 87 Q 65 84 72 88" fill="none" stroke="#3D2817" stroke-width="2"/>
      <path d="M 88 88 Q 95 84 102 87" fill="none" stroke="#3D2817" stroke-width="2"/>`;
  } else if (state === 'rage') {
    // Bulging red eyes with intense small pupils
    eyes = `
      <ellipse cx="65" cy="92" rx="9" ry="9" fill="#FFE5E5"/>
      <ellipse cx="95" cy="92" rx="9" ry="9" fill="#FFE5E5"/>
      <ellipse cx="65" cy="92" rx="3" ry="3.5" fill="#1a1a1a"/>
      <ellipse cx="95" cy="92" rx="3" ry="3.5" fill="#1a1a1a"/>
      <line x1="56" y1="88" x2="74" y2="93" stroke="#C03020" stroke-width="0.8" opacity="0.8"/>
      <line x1="58" y1="95" x2="72" y2="91" stroke="#C03020" stroke-width="0.8" opacity="0.8"/>
      <line x1="86" y1="93" x2="104" y2="88" stroke="#C03020" stroke-width="0.8" opacity="0.8"/>
      <line x1="88" y1="91" x2="102" y2="95" stroke="#C03020" stroke-width="0.8" opacity="0.8"/>`;
  } else if (state === 'crying') {
    // Squeezed shut, downturned, with tears already starting
    eyes = `
      <path d="M 56 92 Q 65 95 74 92" fill="none" stroke="#3D2817" stroke-width="3" stroke-linecap="round"/>
      <path d="M 86 92 Q 95 95 104 92" fill="none" stroke="#3D2817" stroke-width="3" stroke-linecap="round"/>
      <path d="M 58 95 L 56 100" stroke="#3D2817" stroke-width="1.5" opacity="0.6"/>
      <path d="M 102 95 L 104 100" stroke="#3D2817" stroke-width="1.5" opacity="0.6"/>`;
  } else if (state === 'weeping') {
    // Fully shut tight, scrunched
    eyes = `
      <path d="M 54 90 Q 65 99 76 90" fill="none" stroke="#3D2817" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 84 90 Q 95 99 106 90" fill="none" stroke="#3D2817" stroke-width="3.5" stroke-linecap="round"/>`;
  } else if (state === 'terrified') {
    // Huge wide white eyes, tiny pupils, sweat drops
    eyes = `
      <ellipse cx="65" cy="92" rx="11" ry="13" fill="#fff" stroke="#3D2817" stroke-width="0.8"/>
      <ellipse cx="95" cy="92" rx="11" ry="13" fill="#fff" stroke="#3D2817" stroke-width="0.8"/>
      <ellipse cx="65" cy="93" rx="2.5" ry="3" fill="#1a1a1a"/>
      <ellipse cx="95" cy="93" rx="2.5" ry="3" fill="#1a1a1a"/>
      <ellipse cx="50" cy="80" rx="2" ry="3.5" fill="#9ED4F5" opacity="0.85"><animate attributeName="cy" values="80;120;80" dur="2.5s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="115" cy="78" rx="2" ry="3.5" fill="#9ED4F5" opacity="0.85"><animate attributeName="cy" values="78;120;78" dur="2.5s" begin="0.6s" repeatCount="indefinite"/></ellipse>`;
  } else if (state === 'drunk') {
    // X eyes, swirling
    eyes = `
      <line x1="58" y1="86" x2="72" y2="98" stroke="#3D2817" stroke-width="3" stroke-linecap="round"/>
      <line x1="72" y1="86" x2="58" y2="98" stroke="#3D2817" stroke-width="3" stroke-linecap="round"/>
      <line x1="88" y1="86" x2="102" y2="98" stroke="#3D2817" stroke-width="3" stroke-linecap="round"/>
      <line x1="102" y1="86" x2="88" y2="98" stroke="#3D2817" stroke-width="3" stroke-linecap="round"/>`;
  } else if (state === 'shocked') {
    // Wide circular eyes, pinpoint pupils
    eyes = `
      <ellipse cx="65" cy="92" rx="9" ry="11" fill="#fff" stroke="#3D2817" stroke-width="0.8"/>
      <ellipse cx="95" cy="92" rx="9" ry="11" fill="#fff" stroke="#3D2817" stroke-width="0.8"/>
      <ellipse cx="65" cy="92" rx="2" ry="2.5" fill="#1a1a1a"/>
      <ellipse cx="95" cy="92" rx="2" ry="2.5" fill="#1a1a1a"/>`;
  } else if (state === 'disgusted') {
    // Squinted, side-eye
    eyes = `
      <ellipse cx="68" cy="92" rx="5" ry="3" fill="#3D2817"/>
      <ellipse cx="98" cy="92" rx="5" ry="3" fill="#3D2817"/>
      <circle cx="69" cy="91" r="1" fill="#fff"/>
      <circle cx="99" cy="91" r="1" fill="#fff"/>`;
  } else if (state === 'embarrassed') {
    // Looking down/away
    eyes = `
      <ellipse cx="65" cy="93" rx="4" ry="4" fill="#3D2817"/>
      <ellipse cx="95" cy="93" rx="4" ry="4" fill="#3D2817"/>
      <circle cx="64" cy="94" r="1" fill="#fff"/>
      <circle cx="94" cy="94" r="1" fill="#fff"/>`;
  } else if (state === 'smug') {
    eyes = `
      <path d="M 58 92 Q 65 88 72 94" fill="none" stroke="#3D2817" stroke-width="3" stroke-linecap="round"/>
      <path d="M 88 94 Q 95 88 102 92" fill="none" stroke="#3D2817" stroke-width="3" stroke-linecap="round"/>`;
  } else {
    // Default eyes
    eyes = `
      <ellipse class="char-eye" cx="65" cy="92" rx="4" ry="5" fill="#3D2817"/>
      <ellipse class="char-eye" cx="95" cy="92" rx="4" ry="5" fill="#3D2817"/>
      <circle cx="66" cy="91" r="1.2" fill="#fff"/>
      <circle cx="96" cy="91" r="1.2" fill="#fff"/>`;
  }

  // Hair styles
  let hair = '';
  if (type === 'formal' || type === 'royalty') {
    hair = `<path d="M 40 65 Q 80 25 120 65 L 120 75 Q 80 50 40 75 Z" fill="${c.hair}"/>`;
  } else if (type === 'influencer') {
    hair = `<path d="M 38 68 Q 35 35 80 28 Q 125 35 122 68 Q 122 80 110 75 Q 80 55 50 75 Q 38 80 38 68 Z" fill="${c.hair}"/>
            <circle cx="38" cy="80" r="14" fill="${c.hair}"/><circle cx="122" cy="80" r="14" fill="${c.hair}"/>`;
  } else if (type === 'corporate' || type === 'diplomat') {
    hair = `<path d="M 42 70 Q 50 32 80 30 Q 110 32 118 70 Q 110 55 80 52 Q 50 55 42 70 Z" fill="${c.hair}"/>`;
  } else if (type === 'angry' || type === 'party' || type === 'gangster') {
    hair = `<path d="M 40 70 Q 45 28 80 32 Q 115 28 120 70 Q 115 60 80 55 Q 45 60 40 70 Z" fill="${c.hair}"/>
            <path d="M 65 35 L 70 22 L 75 35 Z M 85 35 L 90 22 L 95 35 Z" fill="${c.hair}"/>`;
  } else if (type === 'posh') {
    hair = `<path d="M 42 65 Q 50 30 80 32 Q 112 32 118 70 Q 110 60 80 60 Q 50 60 42 65 Z" fill="${c.hair}"/>
            <path d="M 38 65 Q 35 78 42 82 L 48 70 Z" fill="${c.hair}"/>`;
  } else {
    hair = `<path d="M 42 72 Q 48 38 80 38 Q 112 38 118 72 Q 105 60 80 60 Q 55 60 42 72 Z" fill="${c.hair}"/>`;
  }

  // Body / shirt
  const body = `<path d="M 30 200 Q 30 145 80 145 Q 130 145 130 200 L 130 220 L 30 220 Z" fill="${c.bodyColor}"/>
                <path d="M 65 145 Q 80 160 95 145" fill="${c.skin}"/>`;

  // Type-specific accessories
  let collar = '';
  let crown = '';
  let glasses = '';
  if (type === 'corporate' || type === 'formal' || type === 'diplomat') {
    collar = `<path d="M 70 145 L 80 165 L 90 145 L 88 175 L 72 175 Z" fill="#fff"/>
              <path d="M 76 165 L 80 172 L 84 165 L 82 178 L 78 178 Z" fill="${c.accent}"/>`;
  } else if (type === 'royalty') {
    crown = `<polygon points="50,30 60,18 70,28 80,15 90,28 100,18 110,30 110,40 50,40" fill="#FFD700" stroke="#B8860B" stroke-width="1.5"/>
             <circle cx="60" cy="25" r="2" fill="#E91E63"/>
             <circle cx="80" cy="22" r="2.5" fill="#1C2280"/>
             <circle cx="100" cy="25" r="2" fill="#E91E63"/>`;
  } else if (type === 'influencer') {
    collar = `<circle cx="80" cy="155" r="4" fill="${c.accent}"/><circle cx="80" cy="168" r="3" fill="${c.accent}"/>`;
  } else if (type === 'techie') {
    glasses = `<rect x="55" y="86" width="20" height="14" fill="none" stroke="#1a1a2e" stroke-width="2" rx="2"/>
               <rect x="85" y="86" width="20" height="14" fill="none" stroke="#1a1a2e" stroke-width="2" rx="2"/>
               <line x1="75" y1="93" x2="85" y2="93" stroke="#1a1a2e" stroke-width="2"/>`;
  } else if (type === 'cleaner') {
    collar = `<rect x="68" y="145" width="24" height="6" fill="#fff" stroke="${c.accent}" stroke-width="0.8"/>
              <rect x="72" y="148" width="16" height="2" fill="${c.accent}"/>`;
  } else if (type === 'gangster') {
    glasses = `<rect x="52" y="84" width="22" height="12" fill="#1a1a2e" rx="3"/>
               <rect x="86" y="84" width="22" height="12" fill="#1a1a2e" rx="3"/>
               <line x1="74" y1="90" x2="86" y2="90" stroke="#1a1a2e" stroke-width="2"/>`;
    collar = `<polygon points="60,145 80,200 100,145" fill="#FFD700" opacity="0.7"/>`;
  }

  return `<svg viewBox="0 0 160 220" width="${size}" height="${size * 220/160}" xmlns="http://www.w3.org/2000/svg" class="char-svg char-state-${state}">
    ${steam}
    ${body}
    ${collar}
    <rect x="68" y="135" width="24" height="18" fill="${skinTint}"/>
    <ellipse cx="80" cy="95" rx="42" ry="50" fill="${skinTint}"/>
    <ellipse cx="40" cy="98" rx="6" ry="10" fill="${skinTint}"/>
    <ellipse cx="120" cy="98" rx="6" ry="10" fill="${skinTint}"/>
    ${hair}
    ${crown}
    ${eyes}
    ${brows[state] || brows.neutral}
    ${cheeks}
    ${mouths[state] || mouths.neutral}
    ${tears}
    ${glasses}
  </svg>`;
}

// ─── PROP / SCENE ACCESSORIES ────────────────────────────────────────────────
// Renders a contextual prop next to the character based on the scenario emoji.
// Returns SVG markup positioned relative to a 200x200 box.
function renderScenarioProp(emoji, size = 80) {
  switch (emoji) {
    // HORSE — for Edmund / horse scenarios
    case '🐎':
      return `<svg viewBox="0 0 200 160" width="${size * 1.25}" height="${size}" xmlns="http://www.w3.org/2000/svg" class="prop-svg">
        <ellipse cx="100" cy="145" rx="80" ry="6" fill="#1a1a2e" opacity="0.2"/>
        <!-- Body -->
        <ellipse cx="100" cy="100" rx="55" ry="28" fill="#704020"/>
        <!-- Legs -->
        <rect x="60" y="110" width="8" height="35" fill="#3D2817"/>
        <rect x="80" y="110" width="8" height="35" fill="#3D2817"/>
        <rect x="115" y="110" width="8" height="35" fill="#3D2817"/>
        <rect x="135" y="110" width="8" height="35" fill="#3D2817"/>
        <!-- Hooves -->
        <rect x="58" y="142" width="12" height="4" fill="#1a1a2e"/>
        <rect x="78" y="142" width="12" height="4" fill="#1a1a2e"/>
        <rect x="113" y="142" width="12" height="4" fill="#1a1a2e"/>
        <rect x="133" y="142" width="12" height="4" fill="#1a1a2e"/>
        <!-- Head -->
        <ellipse cx="160" cy="80" rx="22" ry="18" fill="#704020"/>
        <ellipse cx="170" cy="85" rx="14" ry="9" fill="#8C5530"/>
        <!-- Mane -->
        <path d="M 145 65 Q 140 50 150 55 Q 155 45 160 55 Q 165 45 170 60 Q 175 50 180 65 L 175 85 L 145 80 Z" fill="#3D2817"/>
        <!-- Eye -->
        <circle cx="165" cy="76" r="2" fill="#1a1a2e"/>
        <!-- Nostril -->
        <ellipse cx="178" cy="88" rx="2" ry="1.5" fill="#1a1a2e"/>
        <!-- Ears -->
        <polygon points="155,60 158,50 162,62" fill="#704020"/>
        <polygon points="167,58 170,48 174,60" fill="#704020"/>
        <!-- Tail -->
        <path d="M 45 100 Q 30 95 25 110 Q 32 115 45 108" fill="#3D2817" class="horse-tail"/>
        <!-- Saddle -->
        <ellipse cx="100" cy="78" rx="22" ry="6" fill="#8B4513"/>
        <rect x="78" y="76" width="44" height="4" fill="#A0522D"/>
      </svg>`;

    // HUGE DOG — for Yorkshire/great dane scenarios
    case '🐕':
      return `<svg viewBox="0 0 200 160" width="${size * 1.25}" height="${size}" xmlns="http://www.w3.org/2000/svg" class="prop-svg">
        <ellipse cx="100" cy="145" rx="70" ry="5" fill="#1a1a2e" opacity="0.2"/>
        <!-- Body -->
        <ellipse cx="100" cy="105" rx="50" ry="22" fill="#A88060"/>
        <!-- Legs -->
        <rect x="65" y="118" width="10" height="28" fill="#704020"/>
        <rect x="82" y="118" width="10" height="28" fill="#704020"/>
        <rect x="108" y="118" width="10" height="28" fill="#704020"/>
        <rect x="125" y="118" width="10" height="28" fill="#704020"/>
        <!-- Head (big) -->
        <ellipse cx="155" cy="85" rx="30" ry="26" fill="#A88060"/>
        <!-- Snout -->
        <ellipse cx="172" cy="95" rx="14" ry="11" fill="#C9A887"/>
        <!-- Ears (floppy) -->
        <ellipse cx="138" cy="65" rx="9" ry="16" fill="#704020" transform="rotate(-25 138 65)"/>
        <ellipse cx="172" cy="63" rx="9" ry="16" fill="#704020" transform="rotate(25 172 63)"/>
        <!-- Eyes -->
        <circle cx="148" cy="82" r="3" fill="#1a1a2e"/>
        <circle cx="167" cy="82" r="3" fill="#1a1a2e"/>
        <circle cx="148.5" cy="81" r="0.8" fill="#fff"/>
        <circle cx="167.5" cy="81" r="0.8" fill="#fff"/>
        <!-- Nose -->
        <ellipse cx="180" cy="92" rx="4" ry="3" fill="#1a1a2e"/>
        <!-- Tongue (panting) -->
        <ellipse cx="178" cy="103" rx="6" ry="4" fill="#FF4F6E" class="dog-tongue"/>
        <!-- Tail -->
        <path d="M 50 95 Q 25 80 20 95 Q 28 110 50 105" fill="#A88060" class="dog-tail"/>
        <!-- Collar -->
        <rect x="138" y="105" width="34" height="6" fill="#E91E63"/>
        <circle cx="155" cy="108" r="3" fill="#FFD700"/>
      </svg>`;

    // PARTY / GANG — flashing rave lights with multiple silhouettes
    case '🎵':
      return `<svg viewBox="0 0 200 160" width="${size * 1.25}" height="${size}" xmlns="http://www.w3.org/2000/svg" class="prop-svg party-prop">
        <rect x="0" y="0" width="200" height="160" fill="#1a1a2e"/>
        <circle cx="40" cy="40" r="20" fill="#E91E63" opacity="0.6" class="party-light party-light-1"/>
        <circle cx="160" cy="50" r="22" fill="#00E5FF" opacity="0.6" class="party-light party-light-2"/>
        <circle cx="100" cy="30" r="18" fill="#FFEB3B" opacity="0.6" class="party-light party-light-3"/>
        <!-- DJ silhouette -->
        <rect x="80" y="80" width="40" height="20" fill="#000"/>
        <ellipse cx="100" cy="75" rx="8" ry="10" fill="#000"/>
        <!-- Crowd silhouettes -->
        <circle cx="30" cy="120" r="11" fill="#000"/>
        <rect x="22" y="125" width="18" height="35" fill="#000"/>
        <circle cx="60" cy="115" r="11" fill="#000"/>
        <rect x="52" y="120" width="18" height="40" fill="#000"/>
        <circle cx="140" cy="118" r="11" fill="#000"/>
        <rect x="132" y="123" width="18" height="37" fill="#000"/>
        <circle cx="170" cy="115" r="11" fill="#000"/>
        <rect x="162" y="120" width="18" height="40" fill="#000"/>
        <!-- Hands up -->
        <line x1="32" y1="120" x2="28" y2="100" stroke="#000" stroke-width="3" class="party-hand"/>
        <line x1="62" y1="115" x2="68" y2="92" stroke="#000" stroke-width="3" class="party-hand"/>
        <line x1="142" y1="118" x2="138" y2="98" stroke="#000" stroke-width="3" class="party-hand"/>
        <line x1="172" y1="115" x2="178" y2="95" stroke="#000" stroke-width="3" class="party-hand"/>
        <!-- Music notes -->
        <text x="48" y="78" font-size="22" fill="#FFEB3B" class="music-note">♪</text>
        <text x="125" y="60" font-size="20" fill="#E91E63" class="music-note">♫</text>
        <text x="155" y="80" font-size="18" fill="#00E5FF" class="music-note">♪</text>
      </svg>`;

    // CARD DECLINED
    case '💳':
      return `<svg viewBox="0 0 200 160" width="${size * 1.25}" height="${size}" xmlns="http://www.w3.org/2000/svg" class="prop-svg card-declined">
        <rect x="40" y="50" width="120" height="76" rx="10" fill="#1C2280"/>
        <rect x="40" y="65" width="120" height="14" fill="#1a1a2e"/>
        <text x="55" y="105" font-size="14" font-family="monospace" fill="#FFD700">**** **** 1337</text>
        <text x="55" y="120" font-size="9" fill="#fff" opacity="0.7">VISA DEBIT</text>
        <!-- Big red X -->
        <circle cx="100" cy="80" r="32" fill="#E24B4A" class="declined-x" opacity="0"/>
        <line x1="82" y1="62" x2="118" y2="98" stroke="#fff" stroke-width="6" class="declined-x" opacity="0"/>
        <line x1="118" y1="62" x2="82" y2="98" stroke="#fff" stroke-width="6" class="declined-x" opacity="0"/>
        <text x="100" y="148" font-size="11" font-weight="800" text-anchor="middle" fill="#E24B4A" class="declined-text">DECLINED</text>
      </svg>`;

    // STAINED SHEETS
    case '😱':
      return `<svg viewBox="0 0 200 160" width="${size * 1.25}" height="${size}" xmlns="http://www.w3.org/2000/svg" class="prop-svg">
        <!-- Bed -->
        <rect x="20" y="60" width="160" height="60" fill="#fff" stroke="#704020" stroke-width="2" rx="4"/>
        <rect x="20" y="60" width="160" height="20" fill="#FFE4B0"/>
        <rect x="30" y="65" width="40" height="14" fill="#fff" stroke="#bbb" rx="2"/>
        <rect x="80" y="65" width="40" height="14" fill="#fff" stroke="#bbb" rx="2"/>
        <rect x="130" y="65" width="40" height="14" fill="#fff" stroke="#bbb" rx="2"/>
        <!-- Stain (animated growing) -->
        <ellipse cx="100" cy="100" rx="22" ry="14" fill="#8B0000" class="stain-1" opacity="0.85"/>
        <ellipse cx="115" cy="105" rx="9" ry="6" fill="#A52020" class="stain-2"/>
        <ellipse cx="85" cy="98" rx="6" ry="4" fill="#B53030" class="stain-3"/>
        <!-- "Eww" indicators -->
        <text x="50" y="40" font-size="20" fill="#E24B4A" class="ew-text">😱</text>
        <text x="160" y="50" font-size="18" fill="#E24B4A" class="ew-text">!!!</text>
      </svg>`;

    // WIG IN BIN
    case '😵':
      return `<svg viewBox="0 0 200 160" width="${size * 1.25}" height="${size}" xmlns="http://www.w3.org/2000/svg" class="prop-svg">
        <!-- Bin -->
        <path d="M 60 70 L 70 145 L 130 145 L 140 70 Z" fill="#3a3a3a" stroke="#1a1a2e" stroke-width="2"/>
        <rect x="55" y="65" width="90" height="10" fill="#222" rx="2"/>
        <!-- Wig flying out -->
        <g class="wig-fly">
          <path d="M 100 30 Q 70 35 65 60 Q 70 55 80 56 Q 75 65 80 70 Q 90 60 100 58 Q 110 60 120 70 Q 125 65 120 56 Q 130 55 135 60 Q 130 35 100 30 Z" fill="#704020"/>
          <path d="M 75 40 Q 80 35 85 42 M 90 35 Q 95 32 100 38 M 110 38 Q 115 35 120 42" stroke="#3D2817" stroke-width="1" fill="none"/>
        </g>
        <!-- Speed lines -->
        <line x1="40" y1="20" x2="55" y2="35" stroke="#999" stroke-width="2" opacity="0.5"/>
        <line x1="160" y1="25" x2="145" y2="40" stroke="#999" stroke-width="2" opacity="0.5"/>
      </svg>`;

    // FORGOTTEN BOX
    case '📦':
      return `<svg viewBox="0 0 200 160" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" class="prop-svg">
        <ellipse cx="100" cy="140" rx="50" ry="6" fill="#1a1a2e" opacity="0.2"/>
        <!-- Box -->
        <rect x="55" y="55" width="90" height="80" fill="#A0522D" stroke="#704020" stroke-width="2"/>
        <rect x="55" y="55" width="90" height="20" fill="#8B4513"/>
        <line x1="55" y1="75" x2="145" y2="75" stroke="#704020" stroke-width="1.5"/>
        <line x1="100" y1="55" x2="100" y2="135" stroke="#704020" stroke-width="0.8" opacity="0.5"/>
        <!-- Question mark above -->
        <text x="100" y="40" font-size="32" font-weight="800" text-anchor="middle" fill="#F5A623" class="question-mark">?</text>
      </svg>`;

    // KETTLE TEA DISASTER
    case '😅':
      return `<svg viewBox="0 0 200 160" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" class="prop-svg">
        <!-- Kettle -->
        <ellipse cx="100" cy="135" rx="35" ry="6" fill="#1a1a2e" opacity="0.3"/>
        <path d="M 75 90 Q 65 95 65 130 L 135 130 Q 135 95 125 90 Z" fill="#888" stroke="#444" stroke-width="2"/>
        <ellipse cx="100" cy="90" rx="25" ry="4" fill="#666"/>
        <rect x="70" y="65" width="60" height="20" fill="#aaa" stroke="#666" stroke-width="1"/>
        <rect x="92" y="55" width="16" height="14" fill="#666"/>
        <!-- Spout -->
        <path d="M 65 100 L 50 95 L 50 105 Z" fill="#888" stroke="#444"/>
        <!-- Brown sludge inside -->
        <ellipse cx="100" cy="92" rx="22" ry="3" fill="#3D2817"/>
        <ellipse cx="95" cy="95" rx="3" ry="2" fill="#2A1A0E"/>
        <ellipse cx="106" cy="93" rx="2" ry="1.5" fill="#2A1A0E"/>
        <!-- Steam -->
        <circle cx="85" cy="50" r="4" fill="#fff" opacity="0.7" class="kettle-steam"/>
        <circle cx="100" cy="40" r="5" fill="#fff" opacity="0.6" class="kettle-steam"/>
        <circle cx="115" cy="50" r="4" fill="#fff" opacity="0.7" class="kettle-steam"/>
        <!-- Tea bags floating out -->
        <rect x="95" y="86" width="4" height="6" fill="#704020" transform="rotate(15 97 89)"/>
      </svg>`;

    // HORROR STAIN VARIANT
    case '🧐':
      return ''; // No prop, character alone is fine

    default:
      return '';
  }
}

// ─── HOST CHARACTER (player avatar) ─────────────────────────────────────────
function renderHost(rating, size = 100){
  const isLegend = rating.score >= 8000;
  const isElite = rating.score >= 4000;
  const skin = '#F5C9A0';
  const accent = isLegend ? '#FFD700' : isElite ? '#1C2280' : '#6AAF2E';
  return `<svg viewBox="0 0 160 220" width="${size}" height="${size * 220/160}" xmlns="http://www.w3.org/2000/svg" class="char-svg">
    <path d="M 30 200 Q 30 145 80 145 Q 130 145 130 200 L 130 220 L 30 220 Z" fill="#1C2280"/>
    <circle cx="80" cy="180" r="10" fill="${accent}"/>
    <text x="80" y="184" font-size="11" font-weight="800" text-anchor="middle" fill="#fff">P</text>
    <rect x="68" y="135" width="24" height="18" fill="${skin}"/>
    <ellipse cx="80" cy="95" rx="42" ry="50" fill="${skin}"/>
    <ellipse cx="40" cy="98" rx="6" ry="10" fill="${skin}"/>
    <ellipse cx="120" cy="98" rx="6" ry="10" fill="${skin}"/>
    <path d="M 42 72 Q 48 38 80 38 Q 112 38 118 72 Q 105 60 80 60 Q 55 60 42 72 Z" fill="#704020"/>
    <ellipse class="char-eye" cx="65" cy="92" rx="4" ry="5" fill="#3D2817"/>
    <ellipse class="char-eye" cx="95" cy="92" rx="4" ry="5" fill="#3D2817"/>
    <circle cx="66" cy="91" r="1.2" fill="#fff"/>
    <circle cx="96" cy="91" r="1.2" fill="#fff"/>
    <path d="M 58 78 Q 65 72 72 78" fill="none" stroke="#3D2817" stroke-width="3" stroke-linecap="round"/>
    <path d="M 88 78 Q 95 72 102 78" fill="none" stroke="#3D2817" stroke-width="3" stroke-linecap="round"/>
    <path d="M 65 100 Q 80 115 95 100" fill="#3D2817" stroke="#3D2817" stroke-width="2"/>
    ${isLegend ? '<polygon points="80,32 75,42 65,42 73,50 70,60 80,55 90,60 87,50 95,42 85,42" fill="#FFD700" stroke="#B8860B" stroke-width="1"/>' : ''}
  </svg>`;
}
