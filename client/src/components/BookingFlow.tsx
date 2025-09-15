import { useState } from "react";
import { Calendar, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Package {
  id: string;
  name: string;
  price: number;
  dates: string;
  description: string;
  includes: string[];
}

const packages: Package[] = [
  {
    id: "weekend",
    name: "2 Day Deal",
    price: 185,
    dates: "6th–8th of March",
    description: "Perfect for a weekend getaway",
    includes: ["4★ hotel with Breakfast & Dinner", "Bus transport from Stara Zagora", "Club events with Afrobeats & House DJs", "Airport transfers available (not included)", "This does not include flights or ski pass"],
  },
  {
    id: "extended",
    name: "Full Weekend Package", 
    price: 245,
    dates: "6th–9th of March",
    description: "Extended adventure with extra day",
    includes: ["4★ hotel with Breakfast & Dinner", "Bus transport from Stara Zagora", "Club events with Afrobeats & House DJs", "Airport transfers available (not included)", "This does not include flights or ski pass"],
  },
];

const addOns = [
  { id: "quad", name: "Quad Bike Adventure", price: 50 },
  { id: "ski", name: "Ski Gear Rental (per day)", price: 30, isPerDay: true },
  { id: "snowboard", name: "Snowboard Rental (per day)", price: 35, isPerDay: true },
  { id: "club", name: "Evening Club Events", price: 0 },
];

interface Guest {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

interface RoomOption {
  id: string;
  name: string;
  capacity: number;
  description: string;
}

interface AddOnSelection {
  id: string;
  days?: number; // For per-day items like ski/snowboard rentals
}

const roomOptions: RoomOption[] = [
  { id: "double", name: "Double Room", capacity: 2, description: "Two single beds, shared bathroom" },
  { id: "apartment-3", name: "3-Person Apartment", capacity: 3, description: "Private apartment with kitchenette" },
  { id: "apartment-5", name: "5-Person Apartment", capacity: 5, description: "Spacious apartment with full kitchen" },
];

interface BookingFlowProps {
  onClose?: () => void;
}

export default function BookingFlow({ onClose }: BookingFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnSelection[]>([]);
  const [selectedRoomOption, setSelectedRoomOption] = useState<RoomOption | null>(null);
  const [airportTransfer, setAirportTransfer] = useState(false);
  const [flightNumber, setFlightNumber] = useState("");
  const [leadBooker, setLeadBooker] = useState<Guest>({
    name: "", email: "", phone: "", dateOfBirth: ""
  });
  const [guests, setGuests] = useState<Guest[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const basePrice = selectedPackage ? selectedPackage.price * numberOfPeople : 0;
  const addOnPrice = selectedAddOns.reduce((sum, addOnSelection) => {
    const addOn = addOns.find(a => a.id === addOnSelection.id);
    if (!addOn) return sum;
    
    const isPerDay = (addOn as any).isPerDay;
    const days = isPerDay ? (addOnSelection.days || 1) : 1;
    const priceMultiplier = isPerDay ? days : numberOfPeople;
    
    return sum + (addOn.price * priceMultiplier * numberOfPeople);
  }, 0);
  const totalPrice = basePrice + addOnPrice;

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    setStep(2);
  };

  const handlePeopleChange = (change: number) => {
    const newCount = Math.max(1, Math.min(15, numberOfPeople + change));
    setNumberOfPeople(newCount);
    
    // Adjust guests array
    if (newCount > numberOfPeople) {
      const newGuests = [...guests];
      for (let i = guests.length; i < newCount - 1; i++) {
        newGuests.push({ name: "", email: "", phone: "", dateOfBirth: "" });
      }
      setGuests(newGuests);
    } else if (newCount < numberOfPeople) {
      setGuests(guests.slice(0, newCount - 1));
    }
  };

  const handleAddOnToggle = (addOnId: string, days = 1) => {
    setSelectedAddOns(prev => {
      const existingIndex = prev.findIndex(item => item.id === addOnId);
      if (existingIndex >= 0) {
        // Remove if already selected
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        // Add new selection
        return [...prev, { id: addOnId, days }];
      }
    });
  };

  const handleAddOnDaysChange = (addOnId: string, days: number) => {
    setSelectedAddOns(prev => 
      prev.map(item => 
        item.id === addOnId ? { ...item, days } : item
      )
    );
  };

  const canProceedToPayment = termsAccepted && 
    leadBooker.name && leadBooker.email && leadBooker.phone && leadBooker.dateOfBirth &&
    guests.every(guest => guest.name && guest.email && guest.phone && guest.dateOfBirth);

  const handlePayment = async () => {
    const bookingData = {
      package: selectedPackage,
      numberOfPeople,
      addOns: selectedAddOns,
      selectedRoomOption,
      airportTransfer,
      flightNumber,
      totalPrice,
      leadBooker,
      guests
    };

    console.log('Processing payment:', bookingData);

    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingData,
          totalAmount: totalPrice
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const data = await response.json();
      
      // Redirect to Fondy checkout
      window.location.href = data.checkout_url;
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment system temporarily unavailable. Please try again later.');
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-4xl text-foreground mb-4">
              Book Your Ski Adventure
            </h1>
            <p className="font-body text-xl text-muted-foreground">
              Choose your package and let's create unforgettable memories together
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="font-heading font-bold text-2xl text-center mb-8">Choose Your Package</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {packages.map((pkg) => (
                  <Card key={pkg.id} className="relative hover-elevate transition-all duration-300 hover:scale-105 border-2 border-border/50">
                    <CardHeader className="text-center">
                      <Badge className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                        Early Bird Offer
                      </Badge>
                      <Calendar className="h-12 w-12 text-primary mx-auto mb-4 mt-4" />
                      <CardTitle className="font-heading text-xl">{pkg.name}</CardTitle>
                      <p className="font-body text-muted-foreground">{pkg.dates}</p>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="mb-6">
                        <span className="font-heading font-bold text-4xl text-foreground">€{pkg.price}</span>
                        <span className="font-body text-muted-foreground block">per person</span>
                      </div>
                      <p className="font-body text-muted-foreground mb-6">{pkg.description}</p>
                      
                      <ul className="text-left space-y-2 mb-6 font-body text-sm">
                        {pkg.includes.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        onClick={() => handlePackageSelect(pkg)}
                        className="w-full hover-elevate"
                        data-testid={`button-select-${pkg.id}`}
                      >
                        Select Package
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          onClick={() => setStep(1)}
          variant="outline" 
          className="mb-6 hover-elevate"
          data-testid="button-back"
        >
          ← Back to Packages
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Number of People */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-semibold text-lg">Number of People</h3>
                    <p className="font-body text-muted-foreground">Select 1-15 people</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={() => handlePeopleChange(-1)}
                      variant="outline"
                      size="icon"
                      disabled={numberOfPeople <= 1}
                      data-testid="button-decrease-people"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-heading font-bold text-2xl w-8 text-center" data-testid="text-people-count">
                      {numberOfPeople}
                    </span>
                    <Button
                      onClick={() => handlePeopleChange(1)}
                      variant="outline"
                      size="icon"
                      disabled={numberOfPeople >= 15}
                      data-testid="button-increase-people"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lead Booker Information */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Booker Information</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lead-name">Full Name *</Label>
                  <Input
                    id="lead-name"
                    value={leadBooker.name}
                    onChange={(e) => setLeadBooker(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    data-testid="input-lead-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lead-email">Email Address *</Label>
                  <Input
                    id="lead-email"
                    type="email"
                    value={leadBooker.email}
                    onChange={(e) => setLeadBooker(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    data-testid="input-lead-email"
                  />
                </div>
                <div>
                  <Label htmlFor="lead-phone">Phone Number *</Label>
                  <Input
                    id="lead-phone"
                    value={leadBooker.phone}
                    onChange={(e) => setLeadBooker(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+359 88 123 4567"
                    data-testid="input-lead-phone"
                  />
                </div>
                <div>
                  <Label htmlFor="lead-dob">Date of Birth *</Label>
                  <Input
                    id="lead-dob"
                    type="date"
                    value={leadBooker.dateOfBirth}
                    onChange={(e) => setLeadBooker(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    data-testid="input-lead-dob"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Guest Information */}
            {numberOfPeople > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Guest Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {guests.map((guest, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <h4 className="font-heading font-semibold mb-3">Guest {index + 1}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name *</Label>
                          <Input
                            value={guest.name}
                            onChange={(e) => {
                              const newGuests = [...guests];
                              newGuests[index] = { ...guest, name: e.target.value };
                              setGuests(newGuests);
                            }}
                            placeholder="Enter full name"
                            data-testid={`input-guest-${index}-name`}
                          />
                        </div>
                        <div>
                          <Label>Email Address *</Label>
                          <Input
                            type="email"
                            value={guest.email}
                            onChange={(e) => {
                              const newGuests = [...guests];
                              newGuests[index] = { ...guest, email: e.target.value };
                              setGuests(newGuests);
                            }}
                            placeholder="guest@email.com"
                            data-testid={`input-guest-${index}-email`}
                          />
                        </div>
                        <div>
                          <Label>Phone Number *</Label>
                          <Input
                            value={guest.phone}
                            onChange={(e) => {
                              const newGuests = [...guests];
                              newGuests[index] = { ...guest, phone: e.target.value };
                              setGuests(newGuests);
                            }}
                            placeholder="+359 88 123 4567"
                            data-testid={`input-guest-${index}-phone`}
                          />
                        </div>
                        <div>
                          <Label>Date of Birth *</Label>
                          <Input
                            type="date"
                            value={guest.dateOfBirth}
                            onChange={(e) => {
                              const newGuests = [...guests];
                              newGuests[index] = { ...guest, dateOfBirth: e.target.value };
                              setGuests(newGuests);
                            }}
                            data-testid={`input-guest-${index}-dob`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Room Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Room Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {roomOptions.map((room) => (
                  <div key={room.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50">
                    <Checkbox
                      id={room.id}
                      checked={selectedRoomOption?.id === room.id}
                      onCheckedChange={() => setSelectedRoomOption(selectedRoomOption?.id === room.id ? null : room)}
                      data-testid={`checkbox-room-${room.id}`}
                    />
                    <div className="flex-1">
                      <Label htmlFor={room.id} className="cursor-pointer font-semibold">
                        {room.name} (up to {room.capacity} people)
                      </Label>
                      <p className="text-sm text-muted-foreground">{room.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Airport Transfer */}
            <Card>
              <CardHeader>
                <CardTitle>Airport Transfer (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="airport-transfer"
                    checked={airportTransfer}
                    onCheckedChange={(checked) => setAirportTransfer(checked === true)}
                    data-testid="checkbox-airport-transfer"
                  />
                  <Label htmlFor="airport-transfer" className="cursor-pointer">
                    Airport Transfer Service (Price available upon request)
                  </Label>
                </div>
                {airportTransfer && (
                  <div>
                    <Label htmlFor="flight-number">Flight Number (Optional)</Label>
                    <Input
                      id="flight-number"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value)}
                      placeholder="e.g., FR1234 (can be updated later)"
                      data-testid="input-flight-number"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add-On Experiences */}
            <Card>
              <CardHeader>
                <CardTitle>Add-On Experiences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addOns.map((addOn) => {
                  const isSelected = selectedAddOns.find(item => item.id === addOn.id);
                  const isPerDay = (addOn as any).isPerDay;
                  return (
                    <div key={addOn.id} className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={addOn.id}
                          checked={!!isSelected}
                          onCheckedChange={() => handleAddOnToggle(addOn.id)}
                          data-testid={`checkbox-addon-${addOn.id}`}
                        />
                        <Label htmlFor={addOn.id} className="flex-1 cursor-pointer">
                          {addOn.name} {addOn.price > 0 ? `(€${addOn.price}${isPerDay ? '/day' : '/person'})` : '(Free)'}
                        </Label>
                      </div>
                      {isSelected && isPerDay && (
                        <div className="ml-6 flex items-center space-x-3">
                          <Label>Number of days:</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleAddOnDaysChange(addOn.id, Math.max(1, (isSelected.days || 1) - 1))}
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              disabled={(isSelected.days || 1) <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{isSelected.days || 1}</span>
                            <Button
                              onClick={() => handleAddOnDaysChange(addOn.id, (isSelected.days || 1) + 1)}
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="flex items-center space-x-3 pt-4">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                    data-testid="checkbox-terms"
                  />
                  <Label htmlFor="terms" className="cursor-pointer">
                    I agree to the <a href="#" className="text-primary underline">Terms & Conditions</a>
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-center">
                  Total: €{totalPrice}
                  <span className="block text-sm font-body text-muted-foreground">
                    ({numberOfPeople} person{numberOfPeople > 1 ? 's' : ''})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="font-body">Package:</span>
                    <span className="font-heading font-semibold">€{basePrice}</span>
                  </div>
                  {addOnPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="font-body">Add-ons:</span>
                      <span className="font-heading font-semibold">€{addOnPrice}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between font-heading font-bold">
                    <span>Total:</span>
                    <span data-testid="text-total-price">€{totalPrice}</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Payment Options:</h4>
                  <p className="text-sm text-blue-800">• Deposit now</p>
                  <p className="text-sm text-blue-800">• Remainder due 6th January</p>
                </div>
                
                <Button
                  onClick={handlePayment}
                  disabled={!canProceedToPayment}
                  className="w-full hover-elevate"
                  data-testid="button-proceed-payment"
                >
                  Proceed to Payment - €{totalPrice}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}