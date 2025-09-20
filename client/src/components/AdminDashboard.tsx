import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, CheckCircle, Clock, DollarSign, Search, Download, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

interface Lead {
  id: string;
  email: string;
  status: string;
  created_at: string;
  booking_id?: string;
}

interface Booking {
  id: string;
  leadBooker: string;
  email: string;
  phone: string;
  package: string;
  guests: number;
  amount: number;
  date: string;
  status: "pending" | "confirmed" | "completed";
}

interface DashboardData {
  leads: Lead[];
  bookings: Booking[];
}

// Fetch leads and bookings from Supabase
const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    // Fetch leads
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('id, email, status, created_at, booking_id')
      .order('created_at', { ascending: false });

    if (leadsError) throw leadsError;

    // Fetch bookings with first guest (lead booker) information
    const { data: bookingsWithGuests, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        id,
        user_email,
        package_name,
        number_of_guests,
        total_amount,
        payment_plan,
        payment_status,
        room_type,
        created_at,
        guests!inner (
          name,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (bookingsError) throw bookingsError;

    // Transform bookings data to match UI format
    const transformedBookings: Booking[] = (bookingsWithGuests || []).map(booking => {
      // Get the first guest as the lead booker
      const leadGuest = booking.guests[0];
      
      return {
        id: booking.id.substring(0, 8), // Show first 8 chars of UUID
        leadBooker: leadGuest?.name || booking.user_email.split('@')[0] || 'N/A',
        email: booking.user_email,
        phone: leadGuest?.phone || 'N/A',
        package: `${booking.package_name} (${booking.room_type})`,
        guests: booking.number_of_guests,
        amount: Math.round(parseFloat(booking.total_amount)), // Amount is already in euros
        date: new Date(booking.created_at).toLocaleDateString(),
        status: booking.payment_status === "paid" ? "confirmed" : booking.payment_status === "pending" ? "pending" : "completed"
      };
    });

    return {
      leads: leadsData || [],
      bookings: transformedBookings
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { leads: [], bookings: [] };
  }
};

interface AdminDashboardProps {
  isAuthenticated?: boolean;
  onLogin?: (password: string) => void;
}

export default function AdminDashboard({ isAuthenticated = false, onLogin }: AdminDashboardProps) {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'leads' | 'bookings'>('bookings');

  // Use React Query to fetch data from Supabase
  const { data: dashboardData, isLoading, refetch } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: fetchDashboardData,
    enabled: isLoggedIn,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const leads = dashboardData?.leads || [];
  const bookings = dashboardData?.bookings || [];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "MO1345") {
      setIsLoggedIn(true);
      setError("");
      onLogin?.(password);
    } else {
      setError("Invalid password");
    }
  };

  const filteredBookings = bookings.filter((booking: Booking) =>
    booking.leadBooker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeads = leads.filter((lead: Lead) =>
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalLeads: leads.length,
    emailOnlyLeads: leads.filter((l: Lead) => l.status === "email_only").length,
    bookingStarted: leads.filter((l: Lead) => l.status === "booking_started").length,
    totalBookings: bookings.length,
    confirmed: bookings.filter((b: Booking) => b.status === "confirmed").length,
    pending: bookings.filter((b: Booking) => b.status === "pending").length,
    totalRevenue: bookings.filter((b: Booking) => b.status === "confirmed").reduce((sum: number, b: Booking) => sum + b.amount, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = ["Booking ID", "Lead Booker", "Contact", "Package", "Guests", "Amount", "Date", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredBookings.map((booking: Booking) => [
        booking.id,
        booking.leadBooker,
        `${booking.email} / ${booking.phone}`,
        booking.package,
        booking.guests,
        booking.amount,
        booking.date,
        booking.status
      ].join(","))
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `trakiatrips_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center font-heading">Admin Dashboard Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  data-testid="input-admin-password"
                />
                {error && <p className="text-destructive text-sm mt-1">{error}</p>}
              </div>
              <Button 
                type="submit" 
                className="w-full hover-elevate"
                data-testid="button-admin-login"
              >
                Access Admin Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-4xl text-primary mb-2">Admin Dashboard</h1>
          <p className="font-body text-muted-foreground">Manage all ski trip bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="hover-elevate">
            <CardContent className="flex items-center p-6">
              <Mail className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <p className="text-2xl font-heading font-bold text-blue-600" data-testid="stat-total-leads">
                  {stats.totalLeads}
                </p>
                <p className="text-muted-foreground font-body">Total Leads</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-primary mr-4" />
              <div>
                <p className="text-2xl font-heading font-bold text-primary" data-testid="stat-email-only">
                  {stats.emailOnlyLeads}
                </p>
                <p className="text-muted-foreground font-body">Email Only</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="flex items-center p-6">
              <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <p className="text-2xl font-heading font-bold text-green-600" data-testid="stat-confirmed">
                  {stats.confirmed}
                </p>
                <p className="text-muted-foreground font-body">Confirmed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="flex items-center p-6">
              <Clock className="h-8 w-8 text-yellow-600 mr-4" />
              <div>
                <p className="text-2xl font-heading font-bold text-yellow-600" data-testid="stat-pending">
                  {stats.pending}
                </p>
                <p className="text-muted-foreground font-body">Pending</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="flex items-center p-6">
              <DollarSign className="h-8 w-8 text-primary mr-4" />
              <div>
                <p className="text-2xl font-heading font-bold text-primary" data-testid="stat-revenue">
                  €{stats.totalRevenue}
                </p>
                <p className="text-muted-foreground font-body">Total Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'bookings' ? 'default' : 'outline'}
            onClick={() => setActiveTab('bookings')}
            className="hover-elevate"
          >
            <Users className="h-4 w-4 mr-2" />
            Bookings ({stats.totalBookings})
          </Button>
          <Button
            variant={activeTab === 'leads' ? 'default' : 'outline'}
            onClick={() => setActiveTab('leads')}
            className="hover-elevate"
          >
            <Mail className="h-4 w-4 mr-2" />
            All Leads ({stats.totalLeads})
          </Button>
        </div>

        {/* Search and Export */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={activeTab === 'bookings' ? "Search bookings by name, email, or ID..." : "Search leads by email or status..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-bookings"
            />
          </div>
          <Button 
            onClick={exportToCSV}
            variant="outline"
            className="hover-elevate"
            data-testid="button-export-csv"
          >
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </Button>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">
              {activeTab === 'bookings' ? `All Bookings (${filteredBookings.length})` : `All Leads (${filteredLeads.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground font-body">Loading {activeTab}...</p>
              </div>
            ) : (activeTab === 'bookings' ? filteredBookings.length === 0 : filteredLeads.length === 0) ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground font-body">No {activeTab} found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {activeTab === 'bookings' ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-heading font-semibold">Booking ID</th>
                        <th className="text-left p-3 font-heading font-semibold">Lead Booker</th>
                        <th className="text-left p-3 font-heading font-semibold">Contact</th>
                        <th className="text-left p-3 font-heading font-semibold">Package</th>
                        <th className="text-left p-3 font-heading font-semibold">Guests</th>
                        <th className="text-left p-3 font-heading font-semibold">Amount</th>
                        <th className="text-left p-3 font-heading font-semibold">Date</th>
                        <th className="text-left p-3 font-heading font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking: Booking) => (
                        <tr 
                          key={booking.id} 
                          className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                          data-testid={`booking-row-${booking.id}`}
                        >
                          <td className="p-3 font-body font-medium">{booking.id}</td>
                          <td className="p-3 font-body">{booking.leadBooker}</td>
                          <td className="p-3 font-body">
                            <div className="text-sm">
                              <div>{booking.email}</div>
                              <div className="text-muted-foreground">{booking.phone}</div>
                            </div>
                          </td>
                          <td className="p-3 font-body">{booking.package}</td>
                          <td className="p-3 font-body">{booking.guests}</td>
                          <td className="p-3 font-body font-semibold">€{booking.amount}</td>
                          <td className="p-3 font-body">{booking.date}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-heading font-semibold">Lead ID</th>
                        <th className="text-left p-3 font-heading font-semibold">Email</th>
                        <th className="text-left p-3 font-heading font-semibold">Status</th>
                        <th className="text-left p-3 font-heading font-semibold">Date Collected</th>
                        <th className="text-left p-3 font-heading font-semibold">Booking ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead: Lead) => (
                        <tr 
                          key={lead.id} 
                          className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                          data-testid={`lead-row-${lead.id}`}
                        >
                          <td className="p-3 font-body font-medium">{lead.id.substring(0, 8)}</td>
                          <td className="p-3 font-body">{lead.email}</td>
                          <td className="p-3">
                            <Badge className={
                              lead.status === 'email_only' ? 'bg-blue-100 text-blue-800' :
                              lead.status === 'booking_started' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }>
                              {lead.status.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="p-3 font-body">{new Date(lead.created_at).toLocaleDateString()}</td>
                          <td className="p-3 font-body">
                            {lead.booking_id ? (
                              <span className="text-sm text-muted-foreground">{lead.booking_id.substring(0, 8)}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}