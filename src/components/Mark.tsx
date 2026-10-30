interface MarkProps {
  size?: number;
}

// The logo: an inverted question mark, the Spanish opening sign of "¿Qué te debo?", whose dot is
// the table everyone sits around. The body is the real ¿ of Bricolage Grotesque 800 (SIL OFL),
// drawn as a path so it does not depend on the font loading.
const Mark = ({ size = 32 }: MarkProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true" className="flex-none">
    <circle cx="66.43" cy="20.19" r="15" fill="var(--accent-deep)" />
    <circle cx="66.43" cy="20.19" r="9.6" fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="3.2" />
    <path
      d="M78.18 40.8Q79.12 48.79 77.79 54.12Q76.46 59.45 73.87 62.98Q71.29 66.51 68.07 68.86Q64.86 71.21 61.96 73.17Q59.06 75.13 57.18 77.32Q55.3 79.52 55.3 82.96Q55.3 87.04 58.12 89.08Q60.94 91.11 65.33 91.11Q68.78 91.11 72.85 90.02Q76.93 88.92 80.93 87.04Q84.92 85.16 88.06 82.96L89.16 106.79Q85.24 109.3 80.93 110.87Q76.62 112.43 71.99 113.22Q67.37 114 62.35 114Q56.71 114 51.14 112.75Q45.58 111.49 40.96 108.51Q36.33 105.54 33.59 100.28Q30.84 95.03 30.84 86.88Q30.84 79.67 32.88 74.89Q34.92 70.11 38.21 66.9Q41.5 63.68 45.03 61.18Q48.56 58.67 51.61 56Q54.67 53.34 56.39 49.73Q58.12 46.13 57.65 40.8Z"
      fill="var(--ink)"
    />
  </svg>
);

export default Mark;
