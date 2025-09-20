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
import Navigation from "./Navigation";

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
  const [tempBookings, setTempBookings] = useState<Booking[]>([]);
  const [currentBookingId, setCurrentBookingId] = useState<string>("");
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [isUserEditDialogOpen, setIsUserEditDialogOpen] = useState(false);
  const [editingUserInfo, setEditingUserInfo] = useState(userInfo);

  useEffect(() => {
    // Load user data from localStorage
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
      
      // Update user info from localStorage
      setUserInfo({
        name: localStorage.getItem("userName") || "",
        email: email,
        phone: localStorage.getItem("userPhone") || "",
        address: localStorage.getItem("userAddress") || ""
      });
    }

    // Load temporary booking from localStorage
    const tempBookingData = localStorage.getItem("tempBooking");
    if (tempBookingData) {
      try {
        const tempBooking = JSON.parse(tempBookingData);
        
        // Transform temporary booking to match Booking interface
        const transformedBooking: Booking = {
          id: tempBooking.id,
          packageName: tempBooking.packageName,
          packagePrice: parseInt(tempBooking.packagePrice) || 0,
          dates: tempBooking.dates,
          numberOfGuests: tempBooking.numberOfGuests,
          roomType: tempBooking.roomType,
          addOns: tempBooking.addOns || [],
          totalAmount: tempBooking.actualTotalAmount || tempBooking.totalAmount || 0,
          paymentStatus: tempBooking.paymentStatus || 'paid',
          bookingDate: tempBooking.createdAt,
          flightNumber: tempBooking.flightNumber,
          guests: tempBooking.guests?.map((guest: any, index: number) => ({
            id: `temp-guest-${index}`,
            name: guest.name,
            email: guest.email,
            phone: guest.phone,
            dateOfBirth: guest.dateOfBirth
          })) || []
        };
        
        setTempBookings([transformedBooking]);
        
        // Set current booking ID
          setCurrentBookingId(transformedBooking.id);
          
          // Clean up localStorage after loading
        localStorage.removeItem("tempBooking");
      } catch (error) {
        console.error("Error parsing temporary booking:", error);
      }
    }
  }, []);

  // Fetch bookings using React Query
  const { data: apiBookings = [], isLoading, error } = useQuery({
    queryKey: ['/api/bookings', userEmail],
    queryFn: () => fetch(`/api/bookings/${userEmail}`).then(res => res.json()),
    enabled: !!userEmail,
  });

  // Combine temporary bookings with API bookings
  const bookings = [...tempBookings, ...apiBookings];

  // Update guest mutation
  const updateGuestMutation = useMutation({
    mutationFn: async ({ guestId, guestData }: { guestId: string, guestData: any }) => {
      return apiRequest(`/api/guests/${guestId}`, 'PUT', guestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings', userEmail] });
    }
  });

  // Update booking mutation
  const updateBookingMutation = useMutation({
    mutationFn: async ({ bookingId, bookingData }: { bookingId: string, bookingData: any }) => {
      return apiRequest(`/api/bookings/${bookingId}`, 'PUT', bookingData);
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
  
  // This function is already defined elsewhere in the file, removing duplicate

  const handleAddGuest = (bookingId: string) => {
    setCurrentBookingId(bookingId);
    handleAddNewGuest(bookingId);
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
            Your Profile
          </h1>
          <p className="font-body text-xl text-muted-foreground mb-8">
            Please sign in to view your bookings and manage your trips.
          </p>
          <Button 
            onClick={() => window.location.href = '/'} 
            className="hover-elevate"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }
  
  const handleEditUserInfo = () => {
    setEditingUserInfo({...userInfo});
    setIsUserEditDialogOpen(true);
  };
  
  const handleSaveUserInfo = () => {
    // Ensure we don't save empty values as "Not provided"
    const updatedUserInfo = {
      name: editingUserInfo.name.trim() || "",
      phone: editingUserInfo.phone.trim() || "",
      address: editingUserInfo.address.trim() || ""
    };
    
    setUserInfo({...userInfo, ...updatedUserInfo});
    localStorage.setItem("userName", updatedUserInfo.name);
    localStorage.setItem("userPhone", updatedUserInfo.phone);
    localStorage.setItem("userAddress", updatedUserInfo.address);
    setIsUserEditDialogOpen(false);
  };
  
  const handleAddNewGuest = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    const newGuest: Guest = {
      id: `new-guest-${Date.now()}`,
      name: "",
      email: "",
      phone: "",
      dateOfBirth: ""
    };
    
    setEditingGuest(newGuest);
    setIsEditDialogOpen(true);
    
    // Store the booking ID to know where to add the guest
    localStorage.setItem("addGuestToBookingId", bookingId);
  };
  
  const handleSaveNewGuest = () => {
    if (!editingGuest) return;
    
    const bookingId = localStorage.getItem("addGuestToBookingId");
    if (!bookingId) return;
    
    const updatedBookings = bookings.map(booking => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          guests: [...booking.guests, editingGuest],
          numberOfGuests: booking.numberOfGuests + 1
        };
      }
      return booking;
    });
    
    // Update local state
    setTempBookings(updatedBookings.filter(b => tempBookings.some(tb => tb.id === b.id)));
    
    // If it's an API booking, update via API
    if (!tempBookings.some(b => b.id === bookingId)) {
      updateBookingMutation.mutate({
        bookingId,
        bookingData: {
          guests: updatedBookings.find(b => b.id === bookingId)?.guests,
          numberOfGuests: updatedBookings.find(b => b.id === bookingId)?.numberOfGuests
        }
      });
    }
    
    localStorage.removeItem("addGuestToBookingId");
    setIsEditDialogOpen(false);
    setEditingGuest(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <Navigation />
      <div className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-3 text-blue-600 font-medium mb-6">
            <User className="h-5 w-5 mr-2" />
            Welcome back!
          </div>
          <h1 className="font-heading font-bold text-4xl text-foreground mb-4">
            Your Profile
          </h1>
          <p className="font-body text-xl text-muted-foreground">
            {userEmail}
          </p>
        </div>
        
        {/* User Information Card */}
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
            <div className="flex justify-between items-center">
              <CardTitle className="font-heading text-2xl text-foreground">
                Personal Information
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleEditUserInfo}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-muted-foreground mb-2">Name</h3>
                <p className="text-lg">{userInfo.name || localStorage.getItem("userName") || userInfo.email.split('@')[0]}</p>
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground mb-2">Email</h3>
                <p className="text-lg">{userInfo.email}</p>
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground mb-2">Phone</h3>
                <p className="text-lg">{userInfo.phone || localStorage.getItem("userPhone") || ""}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings */}
        <h2 className="font-heading text-2xl font-semibold mb-6">Your Bookings</h2>
        <div className="space-y-8">
          {bookings.map((booking: Booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 pb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                        Active Package
                      </Badge>
                    </div>
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
                    
                  {/* Booking Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-2">Package</h3>
                      <p className="text-lg font-medium">{booking.packageName}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-2">Dates</h3>
                      <p className="text-lg font-medium">{booking.dates}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-2">Guests</h3>
                      <p className="text-lg font-medium">{booking.numberOfGuests} people</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-2">Room Type</h3>
                      <p className="text-lg font-medium">{booking.roomType || "Standard"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-2">Total Amount</h3>
                      <p className="text-lg font-medium">€{booking.totalAmount}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-2">Payment Status</h3>
                      <Badge className={booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Additional Services */}
                  {booking.addOns && booking.addOns.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium text-muted-foreground mb-2">Additional Services</h3>
                      <div className="flex flex-wrap gap-2">
                        {booking.addOns.map((addon, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50">
                            {addon}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Flight Information */}
                  {booking.flightNumber && (
                    <div className="mb-6">
                      <h3 className="font-medium text-muted-foreground mb-2">Airport Transfer</h3>
                      <p className="text-lg font-medium">Flight: {booking.flightNumber}</p>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Add-ons</Label>
                        <div className="mt-1 space-y-1">
                          {booking.addOns.map((addOn: string, index: number) => (
                            <div key={index} className="text-sm text-foreground">• {addOn}</div>
                          ))}
                          {booking.addOns.length === 0 && (
                            <div className="text-sm text-muted-foreground">No add-ons selected</div>
                          )}
                        </div>
                      </div>
                      
                      {/* Flight Number field removed as requested */}
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
                        onClick={() => handleAddGuest(booking.id)}
                        className="hover-elevate"
                        data-testid={`button-add-guest-${booking.id}`}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Guest
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {booking.guests.map((guest: Guest) => (
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
                <Button onClick={() => { onClose?.(); window.location.href = '/'; }} className="hover-elevate">
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
            onClick={() => window.location.href = '/'}
            className="hover-elevate"
            data-testid="button-back-home"
          >
            Back to Home
          </Button>
        </div>
      </div>
      </div>

      {/* User Edit Dialog */}
      <Dialog open={isUserEditDialogOpen} onOpenChange={setIsUserEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Personal Information</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-user-name">Full Name</Label>
              <Input
                id="edit-user-name"
                value={editingUserInfo.name}
                onChange={(e) => setEditingUserInfo({...editingUserInfo, name: e.target.value})}
                placeholder="Enter your full name"
                data-testid="input-edit-user-name"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-user-email">Email Address</Label>
              <Input
                id="edit-user-email"
                type="email"
                value={editingUserInfo.email}
                disabled
                data-testid="input-edit-user-email"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-user-phone">Phone Number</Label>
              <Input
                id="edit-user-phone"
                value={editingUserInfo.phone}
                onChange={(e) => setEditingUserInfo({...editingUserInfo, phone: e.target.value})}
                placeholder="+359 88 123 4567"
                data-testid="input-edit-user-phone"
              />
            </div>
            

            
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSaveUserInfo}
                className="flex-1 hover-elevate"
                data-testid="button-save-user"
              >
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsUserEditDialogOpen(false)}
                className="flex-1 hover-elevate"
                data-testid="button-cancel-user-edit"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Guest Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingGuest && editingGuest.id.startsWith('new-guest') ? 'Add New Guest' : 'Edit Guest Information'}</DialogTitle>
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
                  onClick={editingGuest.id.startsWith('new-guest') ? handleSaveNewGuest : handleSaveGuest}
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