const caseStudies = [
  {
    slug: 'titan-3d-store',
    category: '3D E-Commerce',
    title: 'TITAN 3D Store',
    description:
      'Premium 3D product store for the Titan 17 Pro. Scroll-synced Three.js showcase, live build configurator, saved profiles, cart, and a conversion-focused checkout experience built with Next.js.',
    image: '/case-studies/titan.png',
    metrics: [
      { value: 'Premium', label: 'Product Showcase' },
      { value: 'Full', label: 'Build & Checkout' },
    ],
    url: 'https://titan-3d-store.preview.emergentagent.com',
  },
  {
    slug: 'pntcog',
    category: 'Ministry & Community',
    title: 'PNTCOG',
    description:
      'Digital home for Portmore New Testament Church of God. Jubilee 50th anniversary hub with events, giving, prayer requests, media, and team-friendly content updates for members and visitors.',
    image: '/case-studies/pntcog.png',
    metrics: [
      { value: 'Stronger', label: 'Member Reach' },
      { value: 'Streamlined', label: 'Ministry Access' },
    ],
    url: 'https://portmorentcog.org',
  },
  {
    slug: 'bookit-ja',
    category: 'Bookings & Delivery',
    title: 'BookIt JA',
    description:
      'Appointment booking and delivery platform for Jamaican service businesses. Order management, driver dispatch and live status built in.',
    image: '/case-studies/bookit.png',
    metrics: [
      { value: '3.2×', label: 'Order Volume' },
      { value: '185%', label: 'Revenue' },
    ],
    url: 'https://book-it-jamaica.preview.emergentagent.com',
  },
  {
    slug: 'shipping-district',
    category: 'Logistics & Freight',
    title: 'The Shipping District',
    description:
      'Florida to Jamaica courier platform with live package tracking, customer accounts and a full back-office fleet operations dashboard.',
    image: '/case-studies/shipping.png',
    metrics: [
      { value: '340%', label: 'Signups' },
      { value: '$2.4M', label: 'Value' },
    ],
    url: 'https://freight-fleet-ops.preview.emergentagent.com',
  },
  {
    slug: 'dx-technology',
    category: 'Tech Retail',
    title: 'D&X Technology',
    description:
      'Gaming PC store built to sell. Custom build configurator, product gallery, motion-heavy brand experience and order management backend.',
    image: '/case-studies/dx.png',
    metrics: [
      { value: '74%', label: 'Conversion' },
      { value: '520%', label: 'AOV' },
    ],
    url: 'https://dx-builds.preview.emergentagent.com',
  },
  {
    slug: 'jmobile-shop',
    category: 'Mobile Retail',
    title: 'JMobile Shop',
    description:
      'Premium iPhone storefront with trade-in flow, verified inventory management, customer auth and a clean Apple-grade shopping experience.',
    image: '/case-studies/jmobile.png',
    metrics: [
      { value: '210%', label: 'Traffic' },
      { value: '3.8×', label: 'Revenue' },
    ],
    url: 'https://jmobile-shop.preview.emergentagent.com',
  },
  {
    slug: 'dropquick-ja',
    category: 'E-Commerce Education',
    title: 'DropQuick JA',
    description:
      'High-converting course platform teaching clothing dropshipping. Payments, embedded video, social proof and a full urgency system.',
    image: '/case-studies/dropquick.png',
    metrics: [
      { value: '£180K', label: 'Revenue' },
      { value: '290%', label: 'Growth' },
    ],
    url: 'https://dropquick-ja.preview.emergentagent.com',
  },
  {
    slug: 'resellright',
    category: 'Reselling Education',
    title: 'ResellRight',
    description:
      'Supplier-access product page with a live countdown, animated social proof ticker and lifetime purchase flow optimized for conversion.',
    image: '/case-studies/resellright.png',
    metrics: [
      { value: '260%', label: 'Leads' },
      { value: '£420K', label: 'Revenue' },
    ],
    url: 'https://resellright.preview.emergentagent.com',
  },
];

export const CASE_STUDIES = caseStudies;

/** Homepage #case-studies grid — excludes DropQuick JA and ResellRight */
export const HOME_CASE_STUDIES = caseStudies.filter(
  (s) => !['dropquick-ja', 'resellright'].includes(s.slug),
);

export default caseStudies;
