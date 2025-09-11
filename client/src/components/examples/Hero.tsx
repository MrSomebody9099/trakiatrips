import Hero from '../Hero';

export default function HeroExample() {
  return (
    <Hero onBookingClick={() => console.log('Booking clicked')} />
  );
}