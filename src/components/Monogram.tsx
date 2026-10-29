import { useId } from 'react';

interface Props {
  size?: number;
  className?: string;
  /** Decorative by default; pass a label when it is the only identifier. */
  title?: string;
}

// Vector outlines of the "V" and "S" (Great Vibes), so the crest renders identically everywhere
// and never waits for a web font.
const V_PATH =
  'M162.6 74.3Q162.6 79.0 160.8 85.9Q159.0 92.8 156.1 100.9Q153.2 109.0 150.0 117.4Q146.8 125.9 143.8 133.7Q140.9 141.6 139.1 148.0Q137.3 154.4 137.3 158.2Q137.3 164.1 141.2 164.1Q144.9 164.1 150.2 160.7Q155.6 157.2 161.6 151.5Q167.6 145.7 173.4 138.3Q179.2 131.0 184.0 123.0Q188.8 115.1 191.6 107.3Q194.5 99.6 194.5 93.1Q194.5 88.8 193.3 85.3Q192.1 81.8 188.4 81.8Q186.8 81.8 185.9 81.2Q184.9 80.5 184.9 79.9Q184.9 78.6 187.1 78.6Q188.5 78.6 190.8 79.7Q193.1 80.7 195.4 82.9Q197.7 85.1 199.3 88.4Q200.9 91.8 200.9 96.4Q200.9 102.1 197.9 109.6Q194.9 117.1 189.7 125.1Q184.6 133.1 178.1 140.7Q171.6 148.3 164.5 154.4Q157.4 160.6 150.7 164.2Q143.9 167.9 138.2 167.9Q133.4 167.9 131.8 164.9Q130.1 162.0 130.1 157.1Q130.1 149.6 132.7 140.6Q135.2 131.7 139.0 122.1Q142.8 112.5 146.6 102.9Q150.4 93.4 152.9 84.6Q155.4 75.8 155.4 68.3Q155.4 59.9 150.7 56.9Q145.9 53.9 138.2 53.9Q130.6 53.9 122.1 56.8Q113.6 59.7 105.5 64.9Q97.4 70.1 90.8 77.3Q84.3 84.6 80.4 93.4Q76.4 102.3 76.4 112.5Q76.4 118.4 78.5 123.6Q80.5 128.7 85.1 131.9Q89.7 135.0 97.2 135.0Q102.7 135.0 107.9 132.7Q113.0 130.3 117.0 126.3Q121.0 122.3 123.3 117.3Q125.7 112.4 125.7 107.1Q125.7 102.9 123.9 99.8Q122.2 96.6 118.1 96.6Q116.5 96.6 114.8 97.1Q113.0 97.6 112.4 97.6Q111.8 97.6 111.8 96.9Q111.8 96.6 112.0 96.2Q112.3 95.9 112.9 95.5Q114.3 94.7 116.3 94.3Q118.2 93.9 119.7 93.9Q125.2 93.9 128.2 97.7Q131.1 101.6 131.1 107.0Q131.1 113.0 128.0 118.6Q124.9 124.1 119.8 128.6Q114.6 133.1 108.3 135.7Q101.9 138.3 95.2 138.3Q86.9 138.3 81.1 134.2Q75.3 130.1 72.4 123.5Q69.5 116.8 69.5 109.3Q69.5 99.5 73.4 90.6Q77.3 81.7 84.1 74.5Q91.0 67.2 99.6 61.9Q108.3 56.6 117.9 53.6Q127.5 50.7 137.1 50.7Q144.3 50.7 150.0 53.1Q155.8 55.4 159.2 60.6Q162.6 65.7 162.6 74.3Z';
const S_PATH =
  'M155.2 173.4Q143.1 173.4 133.0 169.8Q122.8 166.2 116.6 159.2Q110.4 152.2 109.8 141.9Q109.6 137.7 111.2 132.6Q112.8 127.5 115.7 122.5Q118.6 117.5 122.7 113.5Q126.7 109.4 131.3 107.3Q131.7 107.1 132.5 106.9Q133.3 106.8 133.6 106.8Q134.4 106.8 134.4 107.2Q134.4 107.8 132.5 109.2Q127.3 113.3 124.0 118.6Q120.5 123.9 118.8 130.0Q117.0 136.1 117.0 142.3Q117.0 149.6 120.2 154.9Q123.3 160.1 128.7 163.6Q134.0 167.0 140.8 168.6Q147.6 170.2 155.1 170.2Q163.4 170.2 171.5 168.3Q179.6 166.5 186.3 163.0Q196.6 157.5 202.6 149.5Q208.7 141.4 208.7 133.5Q208.7 129.3 206.9 125.4Q205.1 121.6 201.1 118.5Q198.1 116.1 193.8 114.0Q189.6 111.9 184.8 109.9Q180.0 107.9 175.4 105.9Q170.8 103.8 167.4 101.5Q162.4 98.1 160.1 94.3Q157.8 90.5 157.8 86.6Q157.8 82.0 160.5 77.7Q163.1 73.3 167.8 69.8Q172.4 66.3 178.3 64.3Q183.4 62.6 189.4 61.6Q195.4 60.6 201.2 60.6Q206.1 60.6 210.5 61.2Q214.9 61.9 218.2 63.7Q222.4 65.7 224.7 68.9Q226.9 72.2 226.9 75.8Q226.9 80.8 222.4 84.5Q220.8 85.7 218.8 86.8Q216.8 87.8 214.1 88.6Q213.6 88.7 213.0 88.7Q211.5 88.7 211.5 87.8Q211.5 87.4 212.3 86.8Q213.1 86.2 214.7 86.1Q218.5 85.6 220.4 83.3Q222.3 80.9 222.3 77.8Q222.3 74.6 220.1 71.4Q218.0 68.3 213.5 66.1Q209.0 63.9 202.1 63.9Q198.1 63.9 193.3 64.8Q188.6 65.7 183.0 67.6Q176.2 70.0 171.6 74.6Q167.1 79.2 167.1 84.4Q167.1 87.6 169.3 90.9Q171.5 94.2 176.3 97.1Q180.4 99.6 185.6 102.0Q190.8 104.5 196.1 106.9Q201.5 109.3 205.8 112.0Q212.6 116.2 215.6 121.1Q218.6 125.9 218.6 131.0Q218.6 137.0 215.0 143.0Q211.5 149.0 205.8 154.2Q200.1 159.5 193.3 163.6Q185.3 168.3 175.4 170.9Q165.4 173.4 155.2 173.4Z';

/**
 * V & S royal crest: double antique-gold ring, champagne disc, a gold "V" and deep-maroon "S"
 * truly interlaced (the V passes over the S), and two small hearts. No flowers, no clutter.
 */
export default function Monogram({ size = 220, className = '', title }: Props) {
  const uid = useId().replace(/:/g, '');
  const gold = `gold-${uid}`;
  const disc = `disc-${uid}`;
  const sweep = `sweep-${uid}`;
  const clipDisc = `clipd-${uid}`;
  const clipV = `clipv-${uid}`;

  return (
    <svg
      className={`monogram ${className}`}
      width={size}
      height={size}
      viewBox="0 0 240 240"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6e6ae" />
          <stop offset="0.4" stopColor="#c49b45" />
          <stop offset="0.65" stopColor="#9a7424" />
          <stop offset="1" stopColor="#ecd68f" />
        </linearGradient>
        <radialGradient id={disc} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="1" stopColor="#f0e0bf" />
        </radialGradient>
        <linearGradient id={sweep} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff6d6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={clipDisc}>
          <circle cx="120" cy="120" r="107" />
        </clipPath>
        {/* region where the V is drawn over the S, creating the interlace */}
        <clipPath id={clipV}>
          <rect x="40" y="40" width="85" height="120" />
        </clipPath>
      </defs>

      <circle cx="120" cy="120" r="114" fill={`url(#${gold})`} />
      <circle cx="120" cy="120" r="110" fill="#6b1427" />
      <circle cx="120" cy="120" r="107" fill={`url(#${disc})`} />
      <circle cx="120" cy="120" r="100" fill="none" stroke={`url(#${gold})`} strokeWidth="1" />
      <circle cx="120" cy="120" r="95" fill="none" stroke="#6b1427" strokeWidth="0.6" strokeDasharray="1 4" />

      <g transform="translate(120 121) scale(.8) translate(-147.7 -111)">
        <path
          id={`v-${uid}`}
          d={V_PATH}
          fill={`url(#${gold})`}
          stroke="#6b1427"
          strokeWidth="0.8"
          paintOrder="stroke"
        />
        <path d={S_PATH} fill="#6b1427" stroke="#ecd68f" strokeWidth="1.2" paintOrder="stroke" />
        <g clipPath={`url(#${clipV})`}>
          <use href={`#v-${uid}`} />
        </g>
      </g>

      <path
        transform="translate(0 -18)"
        d="M120 52c-4-6-13-5-13 2 0 6 9 10 13 14 4-4 13-8 13-14 0-7-9-8-13-2z"
        fill={`url(#${gold})`}
        stroke="#6b1427"
        strokeWidth="0.5"
      />
      <path d="M120 196c-3-4.5-10-4-10 1.5 0 4.5 7 8 10 11 3-3 10-6.5 10-11 0-5.5-7-6-10-1.5z" fill="#6b1427" />
      <path d="M24 120l5-5 5 5-5 5zM206 120l5-5 5 5-5 5z" fill={`url(#${gold})`} />

      {/* slow golden light sweep */}
      <g clipPath={`url(#${clipDisc})`}>
        <rect className="monogram-sweep" x="-80" y="0" width="70" height="240" fill={`url(#${sweep})`} />
      </g>
    </svg>
  );
}
