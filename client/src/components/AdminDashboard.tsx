import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, CheckCircle, Clock, DollarSign, Search, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Booking {
  id: string;
  leadBooker: string;
  email: string;
  phone: string;
  package: string;
  guests: number;
  amount: number;
  date: string;
  status: "pending" | "confirmed" | "cancelled";
}

// Mock booking data //todo: remove mock functionality
const mockBookings: Booking[] = [
  {
    id: "TT-001",
    leadBooker: "John Doe",
    email: "john@example.com", 
    phone: "+359 88 123 4567",
    package: "Weekend Package",
    guests: 2,
    amount: 350,
    date: "2025-01-15",
    status: "confirmed"
  },
  {
    id: "TT-002",
    leadBooker: "Jane Smith",
    email: "jane@example.com",
    phone: "+359 88 765 4321", 
    package: "Extended Package",
    guests: 4,
    amount: 940,
    date: "2025-01-16",
    status: "pending"
  },
];

interface AdminDashboardProps {
  isAuthenticated?: boolean;
  onLogin?: (password: string) => void;
}

export default function AdminDashboard({ isAuthenticated = false, onLogin }: AdminDashboardProps) {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // Fetch all bookings for admin dashboard
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['/api/admin/bookings'],
    queryFn: () => fetch('/api/admin/bookings').then(res => res.json()),
    enabled: isLoggedIn
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsLoggedIn(true);
      setError("");
      onLogin?.(password);
    } else {
      setError("Invalid password. Try 'admin123'");
    }
  };

  const filteredBookings = bookings.filter((booking: Booking) =>
    booking.leadBooker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
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
    const headers = ["Booking ID", "Lead Booker", "Contact", "Package", "Guests", "Amount", "Date", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredBookings.map((booking: Booking) => [
        booking.id,
        booking.leadBooker,
        `${booking.email} / ${booking.phone}`,
        booking.package,
        booking.guests,
        `€${booking.amount}`,
        booking.date,
        booking.status
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trakia-trips-bookings.csv";
    a.click();
    window.URL.revokeObjectURL(url);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover-elevate">
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-primary mr-4" />
              <div>
                <p className="text-2xl font-heading font-bold text-primary" data-testid="stat-total-bookings">
                  {stats.totalBookings}
                </p>
                <p className="text-muted-foreground font-body">Total Bookings</p>
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

        {/* Search and Export */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, email, or booking ID..."
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

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">All Bookings ({filteredBookings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground font-body">Loading bookings...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground font-body">No bookings found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}