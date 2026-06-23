import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const GOOGLE_REVIEW_COUNT = 7;

function GoogleLogo({ size = 24, className = '', title = 'Google', decorative = false }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative ? 'true' : undefined}
      aria-label={decorative ? undefined : title}
      xmlns="http://www.w3.org/2000/svg"
    >
      {!decorative && <title>{title}</title>}
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.56 2.93-2.25 5.41-4.79 7.07l7.73 6.01c4.51-4.16 7.09-10.29 7.09-17.55z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6.01c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

const REVIEWS = [
  {
    name: 'Tamara Corke Watson',
    business: 'Media Team Leader, PNTCOG',
    avatar: '/reviews/tamara-corke-watson.png',
    timeAgo: '1 week ago',
    quote:
      'Zach did excellent work on our church website. The build is professional and thoughtful, and our media team loves how it turned out. Leadership is ready to announce it, and we are proud to share portmorentcog.org with our congregation.',
    rating: 5,
  },
  {
    name: 'Marcus B.',
    business: 'Owner, Island Auto Spa',
    initials: 'MB',
    timeAgo: '3 months ago',
    quote:
      'We run a busy detailing shop in Kingston and bookings were pure chaos on WhatsApp. The weROI team built our scheduling and delivery flow on BookIt JA, and customers can pick a slot without calling. No-shows dropped and the team finally has one dashboard to run the day.',
    rating: 5,
  },
  {
    name: 'Simone W.',
    business: 'Store Manager, JMobile Shop',
    initials: 'SW',
    timeAgo: '6 weeks ago',
    quote:
      'We sell premium iPhones and trade-ins, so the site had to feel trustworthy from the first scroll. They nailed the trade-in flow and inventory side. Customers know exactly what they are getting, and our team is not double-selling devices anymore.',
    rating: 5,
  },
  {
    name: 'David M.',
    business: 'Operations Lead, The Shipping District',
    initials: 'DM',
    timeAgo: '8 weeks ago',
    quote:
      'Florida to Jamaica shipping is stressful for customers if they cannot see where their package is. weROI built live tracking and account tools our dispatch team actually uses every day. We used to field calls all day asking where is my barrel. That noise is way down now.',
    rating: 5,
  },
  {
    name: 'Kevin D.',
    business: 'Founder, D&X Technology',
    initials: 'KD',
    timeAgo: '4 months ago',
    quote:
      'We needed a gaming PC store that could sell custom builds, not just look pretty. The configurator, product gallery, and backend order flow they delivered feel like a real retailer. Conversion jumped once customers could build and price online.',
    rating: 5,
  },
  {
    name: 'Andre F.',
    business: 'Founder, TITAN 3D Store',
    initials: 'AF',
    timeAgo: '12 weeks ago',
    quote:
      'The 3D showcase and live build configurator set us apart from every other tech listing out there. The team understood premium product storytelling. Checkout feels smooth and saved profiles make repeat buyers easy.',
    rating: 5,
  },
  {
    name: 'Nicole R.',
    business: 'Restaurant Owner, Mandeville',
    initials: 'NR',
    timeAgo: '5 months ago',
    quote:
      'We had a solid lunch crowd but nothing reliable for dinner reservations or takeaway orders online. They set up a simple system our staff could learn in an afternoon. Weekend bookings are up and we are not losing tables to no-shows.',
    rating: 5,
  },
];

function StarRating({ count = 5 }) {
  return (
    <div className="reviews-carousel__stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} fill="currentColor" aria-hidden="true" />
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <article className="reviews-carousel__card">
      <GoogleLogo
        size={20}
        className="reviews-carousel__card-google"
        decorative
      />
      <StarRating count={review.rating} />
      <blockquote className="reviews-carousel__quote">&ldquo;{review.quote}&rdquo;</blockquote>
      <footer className="reviews-carousel__author">
        <span
          className={`reviews-carousel__avatar${review.avatar ? ' reviews-carousel__avatar--photo' : ''}`}
          aria-hidden="true"
        >
          {review.avatar ? (
            <img
              src={review.avatar}
              alt=""
              className="reviews-carousel__avatar-img"
              loading="lazy"
              decoding="async"
            />
          ) : (
            review.initials
          )}
        </span>
        <span className="reviews-carousel__meta">
          <span className="reviews-carousel__name-row">
            <span className="reviews-carousel__name">{review.name}</span>
            <span className="reviews-carousel__time-sep" aria-hidden="true">
              {' · '}
            </span>
            <span className="reviews-carousel__time" aria-label={`Posted ${review.timeAgo}`}>
              {review.timeAgo}
            </span>
          </span>
          <span className="reviews-carousel__biz">{review.business}</span>
        </span>
      </footer>
    </article>
  );
}

export default function ReviewsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback((api) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return undefined;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="reviews-carousel section-glow section-glow--center" id="reviews" data-testid="reviews-carousel">
      <div className="container">
        <div className="reviews-carousel__head">
          <span className="eyebrow">Google reviews</span>
          <div className="reviews-carousel__head-row">
            <div className="reviews-carousel__head-copy">
              <h2 className="heading reviews-carousel__title">
                Rated <span className="reviews-carousel__accent">5 Stars</span> on{' '}
                <span className="reviews-carousel__google-word">
                  <GoogleLogo size={28} className="reviews-carousel__title-logo" />
                  Google
                </span>
              </h2>
              <ScrollReveal
                as="p"
                className="body reviews-carousel__intro"
                enableBlur
                blurStrength={3}
                textClassName="body"
              >
                Real operators. Real systems. Results you can measure.
              </ScrollReveal>
            </div>
            <div className="reviews-carousel__rating-badge" aria-label="5.0 out of 5 stars on Google">
              <GoogleLogo size={36} className="reviews-carousel__badge-logo" />
              <div className="reviews-carousel__rating-meta">
                <div className="reviews-carousel__rating-score">
                  <span className="reviews-carousel__rating-value">5.0</span>
                  <StarRating count={5} />
                </div>
                <span className="reviews-carousel__rating-count">
                  {GOOGLE_REVIEW_COUNT} reviews on Google
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="reviews-carousel__controls">
          <button
            type="button"
            className="reviews-carousel__nav"
            onClick={scrollPrev}
            aria-label="Previous reviews"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="reviews-carousel__nav"
            onClick={scrollNext}
            aria-label="Next reviews"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="reviews-carousel__viewport" ref={emblaRef}>
          <div className="reviews-carousel__track">
            {REVIEWS.map((review) => (
              <div key={review.name} className="reviews-carousel__slide">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        <div className="reviews-carousel__dots" role="tablist" aria-label="Review pagination">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === selectedIndex}
              aria-label={`Go to review ${index + 1}`}
              className={`reviews-carousel__dot${index === selectedIndex ? ' is-active' : ''}`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
