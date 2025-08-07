"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, Clock, X, Trash2, CheckCircle, AlertCircle, Tag, Check } from 'lucide-react'
import { format } from "date-fns"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: string
  category: "hair" | "beauty" | "makeup" | "nails"
}

interface SelectedService {
  service: Service
  id: string // unique ID for this selection
}

interface BookingFormProps {
  services: Service[]
  onClose: () => void
}

interface Coupon {
  code: string
  discount: number // percentage
  description: string
  minAmount?: number
}

// Sample coupon codes - in real app, this would come from backend
const availableCoupons: Coupon[] = [
  { code: "FIRST10", discount: 10, description: "10% off for first-time customers" },
  { code: "BEAUTY20", discount: 20, description: "20% off on beauty services", minAmount: 1000 },
  { code: "LEGACY15", discount: 15, description: "15% off on all services" },
  { code: "NEWCLIENT", discount: 25, description: "25% off for new clients", minAmount: 1500 },
]

const categoryColors = {
  hair: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  beauty: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800",
  makeup: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
  nails: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
}

export default function BookingForm({ services, onClose }: BookingFormProps) {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [customerName, setCustomerName] = useState<string>("")
  const [customerPhone, setCustomerPhone] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentServiceSelection, setCurrentServiceSelection] = useState<string>("")
  
  // Coupon states
  const [couponCode, setCouponCode] = useState<string>("")
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [couponError, setCouponError] = useState<string>("")
  const [isCouponApplied, setIsCouponApplied] = useState(false)

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
    "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM"
  ]

  // Get available services (not already selected)
  const availableServices = services.filter(service => 
    !selectedServices.some(selected => selected.service.id === service.id)
  )

  // Calculate totals
  const subtotal = selectedServices.reduce((sum, selected) => sum + selected.service.price, 0)
  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discount) / 100) : 0
  const totalPrice = subtotal - discountAmount
  
  const totalDurationMinutes = selectedServices.reduce((sum, selected) => {
    const minutes = parseInt(selected.service.duration.replace(/\D/g, '')) || 0
    return sum + minutes
  }, 0)
  const totalDuration = totalDurationMinutes > 0 ? 
    `${Math.floor(totalDurationMinutes / 60)}h ${totalDurationMinutes % 60}m` : "0m"

  // Auto-add service when selected
  useEffect(() => {
    if (currentServiceSelection) {
      const service = services.find(s => s.id === currentServiceSelection)
      if (service && !selectedServices.some(selected => selected.service.id === service.id)) {
        const newSelectedService: SelectedService = {
          service,
          id: `${service.id}-${Date.now()}`
        }
        setSelectedServices(prev => [...prev, newSelectedService])
      }
      setCurrentServiceSelection("")
    }
  }, [currentServiceSelection, services, selectedServices])

  const removeService = (selectedServiceId: string) => {
    setSelectedServices(selectedServices.filter(selected => selected.id !== selectedServiceId))
  }

  const applyCoupon = () => {
    setCouponError("")
    
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code")
      return
    }

    const coupon = availableCoupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase())
    
    if (!coupon) {
      setCouponError("Invalid coupon code")
      return
    }

    if (coupon.minAmount && subtotal < coupon.minAmount) {
      setCouponError(`Minimum order amount of ₹${coupon.minAmount} required for this coupon`)
      return
    }

    setAppliedCoupon(coupon)
    setIsCouponApplied(true)
    setCouponError("")
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setIsCouponApplied(false)
    setCouponCode("")
    setCouponError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedServices.length > 0 && selectedDate && selectedTime && customerName && customerPhone) {
      setIsSubmitted(true)
      // Here you would typically send the booking data to your backend
      console.log({
        services: selectedServices.map(s => s.service),
        date: selectedDate,
        time: selectedTime,
        customer: { name: customerName, phone: customerPhone },
        notes,
        subtotal,
        appliedCoupon,
        discountAmount,
        totalPrice,
        totalDuration
      })
    }
  }

  if (isSubmitted) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600 flex items-center justify-center space-x-2">
              <CheckCircle className="w-6 h-6" />
              <span>Booking Confirmed!</span>
            </DialogTitle>
            <DialogDescription className="text-center">
              Your appointment has been successfully booked.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Services:</span>
                <div className="text-right">
                  {selectedServices.map((selected, index) => (
                    <div key={selected.id} className="text-sm">
                      {selected.service.name}
                      {index < selectedServices.length - 1 && <br />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{selectedDate && format(selectedDate, "PPP")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Time:</span>
                <span>{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Duration:</span>
                <span>{totalDuration}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Customer:</span>
                <span>{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Phone:</span>
                <span>{customerPhone}</span>
              </div>
              
              {/* Payment Summary */}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.code}):</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total Paid:</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                We&apos;ll call you at {customerPhone} to confirm your appointment. 
                Please arrive 10 minutes early.
              </AlertDescription>
            </Alert>
          </div>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5" />
            <span>Book Your Appointment</span>
          </DialogTitle>
          <DialogDescription>
            Select services and fill in your details to book your appointment at The Legacy Salon.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Select Services *</Label>
            
            {/* Add Service Section - Auto-add on selection */}
            <div className="space-y-2">
              <Select value={currentServiceSelection} onValueChange={setCurrentServiceSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service (auto-adds when selected)" />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{service.name}</span>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge variant="secondary" className="text-xs">
                            {service.category}
                          </Badge>
                          <span className="text-sm font-semibold">₹{service.price}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableServices.length === 0 && selectedServices.length > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  All available services have been selected
                </p>
              )}
            </div>

            {/* Selected Services */}
            {selectedServices.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Selected Services ({selectedServices.length})
                </Label>
                <div className="space-y-2">
                  {selectedServices.map((selected) => (
                    <Card key={selected.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-sm">{selected.service.name}</h4>
                            <Badge className={`${categoryColors[selected.service.category]} text-xs`}>
                              {selected.service.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {selected.service.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="font-bold">₹{selected.service.price}</span>
                            <span className="text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {selected.service.duration}
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeService(selected.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {selectedServices.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please select at least one service to continue with your booking.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Coupon Code Section */}
          {selectedServices.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center space-x-2">
                <Tag className="w-4 h-4" />
                <span>Coupon Code (Optional)</span>
              </Label>
              
              {!isCouponApplied ? (
                <div className="flex space-x-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={applyCoupon}
                    disabled={!couponCode.trim()}
                    variant="outline"
                  >
                    Apply
                  </Button>
                </div>
              ) : (
                <Card className="p-3 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-700 dark:text-green-300">
                          {appliedCoupon?.code} Applied!
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {appliedCoupon?.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeCoupon}
                      className="text-green-700 hover:text-green-800"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              )}

              {couponError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{couponError}</AlertDescription>
                </Alert>
              )}

              {/* Available Coupons Hint */}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p className="font-medium mb-1">Available Coupons:</p>
                <div className="space-y-1">
                  {availableCoupons.map((coupon) => (
                    <div key={coupon.code} className="flex justify-between">
                      <span className="font-mono">{coupon.code}</span>
                      <span>{coupon.discount}% off{coupon.minAmount ? ` (min ₹${coupon.minAmount})` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Select Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">Select Time *</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91-XXXXXXXXXX"
                required
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or notes for your appointment..."
              rows={3}
            />
          </div>

          {/* Booking Summary */}
          {selectedServices.length > 0 && selectedDate && selectedTime && (
            <Card className="bg-gray-50 dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Services:</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="space-y-1 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                    {selectedServices.map((selected) => (
                      <div key={selected.id} className="flex justify-between text-sm">
                        <span>{selected.service.name}</span>
                        <span>₹{selected.service.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-semibold">{format(selectedDate, "PPP")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-semibold">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Duration:</span>
                  <span className="font-semibold">{totalDuration}</span>
                </div>
                
                {/* Price Breakdown */}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code} - {appliedCoupon.discount}%):</span>
                      <span className="font-semibold">-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold border-t pt-2">
                    <span>Total to Pay:</span>
                    <span className="text-green-600">₹{totalPrice}</span>
                  </div>
                  {appliedCoupon && (
                    <p className="text-sm text-green-600 text-center">
                      You saved ₹{discountAmount} with {appliedCoupon.code}!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={selectedServices.length === 0 || !selectedDate || !selectedTime || !customerName || !customerPhone}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
