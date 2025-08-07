"use client"

import { useState } from "react"
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
import { CalendarIcon, Clock, X } from 'lucide-react'
import { format } from "date-fns"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: string
  category: "hair" | "beauty" | "makeup" | "nails"
}

interface BookingFormProps {
  services: Service[]
  onClose: () => void
}

export default function BookingForm({ services, onClose }: BookingFormProps) {
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [customerName, setCustomerName] = useState<string>("")
  const [customerPhone, setCustomerPhone] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
    "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM"
  ]

  const selectedServiceData = services.find(service => service.id === selectedService)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedService && selectedDate && selectedTime && customerName && customerPhone) {
      setIsSubmitted(true)
      // Here you would typically send the booking data to your backend
      console.log({
        service: selectedServiceData,
        date: selectedDate,
        time: selectedTime,
        customer: { name: customerName, phone: customerPhone },
        notes
      })
    }
  }

  if (isSubmitted) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">Booking Confirmed!</DialogTitle>
            <DialogDescription className="text-center">
              Your appointment has been successfully booked.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 text-center space-y-4">
            <div className="text-6xl">✅</div>
            <div className="space-y-2">
              <p><strong>Service:</strong> {selectedServiceData?.name}</p>
              <p><strong>Date:</strong> {selectedDate && format(selectedDate, "PPP")}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Customer:</strong> {customerName}</p>
              <p><strong>Phone:</strong> {customerPhone}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                We&apos;ll call you at {customerPhone} to confirm your appointment. 
                Please arrive 10 minutes early.
              </p>
            </div>
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5" />
            <span>Book Your Appointment</span>
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to book your appointment at The Legacy Salon.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Selection */}
          <div className="space-y-2">
            <Label htmlFor="service">Select Service *</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
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
            {selectedServiceData && (
              <Card className="mt-2">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{selectedServiceData.name}</h4>
                      <p className="text-sm text-gray-600">{selectedServiceData.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">₹{selectedServiceData.price}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {selectedServiceData.duration}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

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

          {/* Summary */}
          {selectedServiceData && selectedDate && selectedTime && (
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-semibold">{selectedServiceData.name}</span>
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
                  <span>Duration:</span>
                  <span className="font-semibold">{selectedServiceData.duration}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>₹{selectedServiceData.price}</span>
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
              disabled={!selectedService || !selectedDate || !selectedTime || !customerName || !customerPhone}
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
