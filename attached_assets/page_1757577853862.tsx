"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Download, Search, Users, CheckCircle, Clock, DollarSign } from "lucide-react"

interface Booking {
  id: string
  created_at: string
  lead_booker_name: string
  lead_booker_email: string
  lead_booker_phone?: string
  package_type: string
  total_amount: number
  payment_status: string
  guests: any[]
}

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check (in production, use proper authentication)
    if (password === "admin123") {
      setIsAuthenticated(true)
      fetchBookings()
    } else {
      alert("Invalid password")
    }
  }

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setBookings(data || [])
      setFilteredBookings(data || [])
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = bookings

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.lead_booker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.lead_booker_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.payment_status === statusFilter)
    }

    setFilteredBookings(filtered)
  }, [bookings, searchTerm, statusFilter])

  const exportToCSV = () => {
    const headers = ["Date", "Name", "Email", "Phone", "Package", "Guests", "Total", "Status"]
    const csvContent = [
      headers.join(","),
      ...filteredBookings.map((booking) =>
        [
          new Date(booking.created_at).toLocaleDateString(),
          booking.lead_booker_name,
          booking.lead_booker_email,
          booking.lead_booker_phone || "",
          booking.package_type,
          booking.guests.length + 1,
          booking.total_amount,
          booking.payment_status,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "trakia-trips-bookings.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const totalBookings = filteredBookings.length
  const confirmedBookings = filteredBookings.filter((b) => b.payment_status === "completed").length
  const pendingBookings = filteredBookings.filter((b) => b.payment_status === "pending").length
  const totalRevenue = filteredBookings
    .filter((b) => b.payment_status === "completed")
    .reduce((sum, b) => sum + b.total_amount, 0)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-3xl p-8 w-full max-w-md">
          <h1 className="font-display font-bold text-2xl text-slate-800 mb-6 text-center">Admin Dashboard</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 glass rounded-xl border-0 focus:ring-2 focus:ring-blue-500 text-slate-800"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full glass-button-colorful px-6 py-3 rounded-2xl text-white font-semibold hover:text-white"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="font-display font-bold text-4xl md:text-5xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 text-lg">Manage all ski trip bookings</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="glass rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{totalBookings}</div>
            <div className="text-slate-600 font-medium">Total Bookings</div>
          </div>

          <div className="glass rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{confirmedBookings}</div>
            <div className="text-slate-600 font-medium">Confirmed</div>
          </div>

          <div className="glass rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{pendingBookings}</div>
            <div className="text-slate-600 font-medium">Pending</div>
          </div>

          <div className="glass rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">${totalRevenue}</div>
            <div className="text-slate-600 font-medium">Total Revenue</div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass rounded-xl border-0 focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>
            <button
              onClick={exportToCSV}
              className="glass-button-colorful px-6 py-3 rounded-xl text-white font-semibold flex items-center justify-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Export to CSV
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">All Bookings ({filteredBookings.length})</h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="text-slate-600">Loading bookings...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Booking ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Lead Booker</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Contact</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Package</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Guests</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-slate-100 hover:bg-white/50">
                        <td className="py-3 px-4 font-medium text-slate-800">BK{booking.id.slice(-3).toUpperCase()}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800">{booking.lead_booker_name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-slate-600">{booking.lead_booker_email}</div>
                          {booking.lead_booker_phone && (
                            <div className="text-sm text-slate-600">{booking.lead_booker_phone}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600 capitalize">{booking.package_type}</td>
                        <td className="py-3 px-4 text-slate-600">{booking.guests.length + 1}</td>
                        <td className="py-3 px-4 font-semibold text-blue-600">${booking.total_amount}</td>
                        <td className="py-3 px-4 text-slate-600">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              booking.payment_status === "completed"
                                ? "bg-green-100 text-green-800"
                                : booking.payment_status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.payment_status === "completed" ? "Confirmed" : booking.payment_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredBookings.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-slate-600">No bookings found.</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="glass rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display font-bold text-2xl text-slate-800">Booking Details</h2>
                <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-slate-600">
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <strong className="text-slate-700">Booking ID:</strong> {selectedBooking.id}
                </div>
                <div>
                  <strong className="text-slate-700">Date:</strong>{" "}
                  {new Date(selectedBooking.created_at).toLocaleString()}
                </div>
                <div>
                  <strong className="text-slate-700">Lead Booker:</strong> {selectedBooking.lead_booker_name}
                </div>
                <div>
                  <strong className="text-slate-700">Email:</strong> {selectedBooking.lead_booker_email}
                </div>
                {selectedBooking.lead_booker_phone && (
                  <div>
                    <strong className="text-slate-700">Phone:</strong> {selectedBooking.lead_booker_phone}
                  </div>
                )}
                <div>
                  <strong className="text-slate-700">Package:</strong> {selectedBooking.package_type}
                </div>
                <div>
                  <strong className="text-slate-700">Total Amount:</strong> ${selectedBooking.total_amount}
                </div>
                <div>
                  <strong className="text-slate-700">Payment Status:</strong> {selectedBooking.payment_status}
                </div>
                {selectedBooking.guests.length > 0 && (
                  <div>
                    <strong className="text-slate-700">Guests:</strong>
                    <ul className="mt-2 space-y-1">
                      {selectedBooking.guests.map((guest: any, index: number) => (
                        <li key={index} className="text-slate-600">
                          {guest.name} - {guest.dob} - {guest.phone}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
