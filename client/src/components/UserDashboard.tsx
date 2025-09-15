import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, Edit3, Plus, Calendar, MapPin, Users, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

interface Booking {
  id: string;
  packageName: string;
  packagePrice: number;
  dates: string;
  numberOfGuests: number;
  roomType: string;
  addOns: string[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  bookingDate: string;
  flightNumber?: string;
  guests: Guest[];
}

interface UserDashboardProps {
  onClose?: () => void;
}

export default function UserDashboard({ onClose }: UserDashboardProps) {
  const [userEmail, setUserEmail] = useState("");
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    // Load user data from localStorage
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  // Fetch bookings using React Query
  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['/api/bookings', userEmail],
    queryFn: () => fetch(`/api/bookings/${userEmail}`).then(res => res.json()),
    enabled: !!userEmail,
  });

  // Update guest mutation
  const updateGuestMutation = useMutation({
    mutationFn: async ({ guestId, guestData }: { guestId: string, guestData: any }) => {
      return apiRequest(`/api/guests/${guestId}`, {
        method: 'PUT',
        body: guestData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings', userEmail] });
    }
  });

  // Update booking mutation
  const updateBookingMutation = useMutation({
    mutationFn: async ({ bookingId, bookingData }: { bookingId: string, bookingData: any }) => {
      return apiRequest(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        body: bookingData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings', userEmail] });
    }
  });

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest({ ...guest });
    setIsEditDialogOpen(true);
  };

  const handleSaveGuest = () => {
    if (!editingGuest) return;
    
    updateGuestMutation.mutate({
      guestId: editingGuest.id,
      guestData: {
        name: editingGuest.name,
        email: editingGuest.email,
        phone: editingGuest.phone,
        dateOfBirth: editingGuest.dateOfBirth
      }
    });
    
    setIsEditDialogOpen(false);
    setEditingGuest(null);
  };

  const handleUpdateFlightNumber = (bookingId: string, flightNumber: string) => {
    updateBookingMutation.mutate({
      bookingId,
      bookingData: { flightNumber }
    });
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-heading font-bold text-4xl text-foreground mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="font-body text-xl text-muted-foreground mb-8">
            Please sign in to view your bookings and manage your trips.
          </p>
          <Button onClick={onClose} className="hover-elevate">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-3 text-blue-600 font-medium mb-6">
            <User className="h-5 w-5 mr-2" />
            Welcome back!
          </div>
          <h1 className="font-heading font-bold text-4xl text-foreground mb-4">
            Your Dashboard
          </h1>
          <p className="font-body text-xl text-muted-foreground">
            {userEmail}
          </p>
        </div>

        {/* Bookings */}
        <div className="space-y-8">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 pb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="font-heading text-2xl text-foreground mb-2">
                      {booking.packageName}
                    </CardTitle>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {booking.dates}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {booking.numberOfGuests} guests
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {booking.roomType}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={booking.paymentStatus === 'paid' ? 'default' : 'secondary'}
                      className="mb-2"
                    >
                      {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment'}
                    </Badge>
                    <div className="text-2xl font-bold text-foreground">
                      €{booking.totalAmount}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  
                  {/* Booking Details */}
                  <div className="space-y-6">
                    <h3 className="font-heading font-semibold text-xl text-foreground">
                      Booking Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Add-ons</Label>
                        <div className="mt-1 space-y-1">
                          {booking.addOns.map((addOn, index) => (
                            <div key={index} className="text-sm text-foreground">• {addOn}</div>
                          ))}
                          {booking.addOns.length === 0 && (
                            <div className="text-sm text-muted-foreground">No add-ons selected</div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor={`flight-${booking.id}`} className="text-sm font-medium text-muted-foreground">
                          Flight Number (Optional)
                        </Label>
                        <Input
                          id={`flight-${booking.id}`}
                          value={booking.flightNumber || ""}
                          onChange={(e) => handleUpdateFlightNumber(booking.id, e.target.value)}
                          placeholder="e.g., FR1234"
                          className="mt-1"
                          data-testid={`input-flight-${booking.id}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guest Management */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-semibold text-xl text-foreground">
                        Guests ({booking.guests.length})
                      </h3>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="hover-elevate"
                        data-testid={`button-add-guest-${booking.id}`}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Guest
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {booking.guests.map((guest) => (
                        <div 
                          key={guest.id} 
                          className="flex items-center justify-between p-3 bg-accent/30 rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-foreground">{guest.name}</div>
                            <div className="text-sm text-muted-foreground">{guest.email}</div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleEditGuest(guest)}
                            className="hover-elevate"
                            data-testid={`button-edit-guest-${guest.id}`}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {bookings.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <CreditCard className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                  No Bookings Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Ready to book your next epic ski adventure?
                </p>
                <Button onClick={onClose} className="hover-elevate">
                  Browse Packages
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="hover-elevate"
            data-testid="button-back-home"
          >
            Back to Home
          </Button>
        </div>
      </div>

      {/* Edit Guest Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Guest Information</DialogTitle>
          </DialogHeader>
          
          {editingGuest && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={editingGuest.name}
                  onChange={(e) => setEditingGuest(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="Enter full name"
                  data-testid="input-edit-guest-name"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-email">Email Address *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingGuest.email}
                  onChange={(e) => setEditingGuest(prev => prev ? { ...prev, email: e.target.value } : null)}
                  placeholder="guest@email.com"
                  data-testid="input-edit-guest-email"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-phone">Phone Number *</Label>
                <Input
                  id="edit-phone"
                  value={editingGuest.phone}
                  onChange={(e) => setEditingGuest(prev => prev ? { ...prev, phone: e.target.value } : null)}
                  placeholder="+359 88 123 4567"
                  data-testid="input-edit-guest-phone"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-dob">Date of Birth *</Label>
                <Input
                  id="edit-dob"
                  type="date"
                  value={editingGuest.dateOfBirth}
                  onChange={(e) => setEditingGuest(prev => prev ? { ...prev, dateOfBirth: e.target.value } : null)}
                  data-testid="input-edit-guest-dob"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSaveGuest}
                  className="flex-1 hover-elevate"
                  data-testid="button-save-guest"
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1 hover-elevate"
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}