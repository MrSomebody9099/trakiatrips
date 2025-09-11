import BookingFlow from '../BookingFlow';

export default function BookingFlowExample() {
  return <BookingFlow onClose={() => console.log('Booking closed')} />;
}