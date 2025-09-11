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
    name: "Weekend Package",
    price: 175,
    dates: "Fri 6th - Sun 8th March",
    description: "Perfect for a weekend getaway",
    includes: ["4★ hotel with Breakfast & Dinner", "Bus transport from Stara Zagora", "Club events with Afrobeats & House DJs", "Does NOT include flights or ski pass"],
  },
  {
    id: "extended",
    name: "Extended Package", 
    price: 235,
    dates: "Fri 6th - Mon 9th March",
    description: "Extended adventure with extra day",
    includes: ["4★ hotel with Breakfast & Dinner", "Bus transport from Stara Zagora", "Club events with Afrobeats & House DJs", "Does NOT include flights or ski pass"],
  },
];

const addOns = [
  { id: "quad", name: "Quad Bike Adventure", price: 50 },
  { id: "ski", name: "Ski Gear Rental", price: 30 },
  { id: "club", name: "Evening Club Events", price: 40 },
];

interface Guest {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

interface BookingFlowProps {
  onClose?: () => void;
}

export default function BookingFlow({ onClose }: BookingFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [leadBooker, setLeadBooker] = useState<Guest>({
    name: "", email: "", phone: "", dateOfBirth: ""
  });
  const [guests, setGuests] = useState<Guest[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const basePrice = selectedPackage ? selectedPackage.price * numberOfPeople : 0;
  const addOnPrice = selectedAddOns.reduce((sum, addOnId) => {
    const addOn = addOns.find(a => a.id === addOnId);
    return sum + (addOn ? addOn.price * numberOfPeople : 0);
  }, 0);
  const totalPrice = basePrice + addOnPrice;

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    setStep(2);
  };

  const handlePeopleChange = (change: number) => {
    const newCount = Math.max(1, Math.min(8, numberOfPeople + change));
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

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const canProceedToPayment = termsAccepted && 
    leadBooker.name && leadBooker.email && leadBooker.phone && leadBooker.dateOfBirth &&
    guests.every(guest => guest.name && guest.email && guest.phone && guest.dateOfBirth);

  const handlePayment = () => {
    console.log('Processing payment:', {
      package: selectedPackage,
      numberOfPeople,
      addOns: selectedAddOns,
      totalPrice,
      leadBooker,
      guests
    });
    alert(`Payment processing for €${totalPrice}! (Demo mode)`);
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
                    <p className="font-body text-muted-foreground">Select 1-8 people</p>
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
                      disabled={numberOfPeople >= 8}
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

            {/* Add-On Experiences */}
            <Card>
              <CardHeader>
                <CardTitle>Add-On Experiences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addOns.map((addOn) => (
                  <div key={addOn.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={addOn.id}
                      checked={selectedAddOns.includes(addOn.id)}
                      onCheckedChange={() => handleAddOnToggle(addOn.id)}
                      data-testid={`checkbox-addon-${addOn.id}`}
                    />
                    <Label htmlFor={addOn.id} className="flex-1 cursor-pointer">
                      {addOn.name} (+€{addOn.price}/person)
                    </Label>
                  </div>
                ))}

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