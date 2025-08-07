"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, MapPin, Clock, Scissors, Sparkles, Palette, Hand, Menu, Star, CheckCircle, Settings } from 'lucide-react'
import Image from "next/image"
import ServiceManagement from "@/components/service-management"
import BookingForm from "@/components/booking-form"
import { ThemeToggle } from "@/components/theme-toggle"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: string
  category: "hair" | "beauty" | "makeup" | "nails"
}

const initialServices: Service[] = [
  // Hair Services
  { id: "1", name: "Men's Haircut", description: "Professional styling and cut", price: 500, duration: "45 min", category: "hair" },
  { id: "2", name: "Women's Haircut", description: "Cut and basic styling", price: 800, duration: "60 min", category: "hair" },
  { id: "3", name: "Hair Coloring", description: "Full head color treatment", price: 2500, duration: "120 min", category: "hair" },
  { id: "4", name: "Hair Wash & Blow Dry", description: "Deep cleanse and professional styling", price: 400, duration: "30 min", category: "hair" },
  
  // Beauty Services
  { id: "5", name: "Facial Treatment", description: "Deep cleansing facial", price: 1200, duration: "60 min", category: "beauty" },
  { id: "6", name: "Eyebrow Threading", description: "Precise eyebrow shaping", price: 200, duration: "15 min", category: "beauty" },
  { id: "7", name: "Full Body Waxing", description: "Complete body hair removal", price: 3000, duration: "90 min", category: "beauty" },
  { id: "8", name: "Beard Trim & Style", description: "Professional beard grooming", price: 300, duration: "30 min", category: "beauty" },
  
  // Makeup Services
  { id: "9", name: "Bridal Makeup", description: "Complete bridal look", price: 5000, duration: "120 min", category: "makeup" },
  { id: "10", name: "Party Makeup", description: "Glamorous evening look", price: 2000, duration: "60 min", category: "makeup" },
  { id: "11", name: "Natural Day Makeup", description: "Subtle everyday look", price: 1000, duration: "45 min", category: "makeup" },
  
  // Nail Services
  { id: "12", name: "Manicure", description: "Complete nail care and polish", price: 600, duration: "45 min", category: "nails" },
  { id: "13", name: "Pedicure", description: "Foot care and nail treatment", price: 800, duration: "60 min", category: "nails" },
  { id: "14", name: "Gel Nail Extensions", description: "Long-lasting nail extensions", price: 1500, duration: "90 min", category: "nails" },
]

const categoryIcons = {
  hair: Scissors,
  beauty: Sparkles,
  makeup: Palette,
  nails: Hand,
}

const categoryColors = {
  hair: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  beauty: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800",
  makeup: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
  nails: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
}

export default function LegacySalonWebsite() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [showBooking, setShowBooking] = useState(false)
  const [showServiceManagement, setShowServiceManagement] = useState(false)

  const getServicesByCategory = (category: string) => {
    return services.filter(service => service.category === category)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                <Image
                  src="/logo.png"
                  alt="The Legacy Salon Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">The Legacy Salon</h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Unisex Art Studio</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <Button 
                variant="outline" 
                onClick={() => setShowServiceManagement(true)}
                className="flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Manage Services</span>
              </Button>
              <Button onClick={() => setShowBooking(true)}>
                Book Appointment
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4 mt-6">
                    <Button onClick={() => setShowBooking(true)} className="w-full">
                      Book Appointment
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowServiceManagement(true)} 
                      className="w-full flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Manage Services</span>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Professional Hair, Beauty & Makeup Services
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience premium grooming and beauty treatments at The Legacy Salon. 
            Our expert stylists and beauticians are dedicated to making you look and feel your best.
          </p>
          
          <Alert className="max-w-2xl mx-auto mb-8">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Special Offer:</strong> Book your first appointment and get 10% off on all services!
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-700 dark:text-gray-300">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span className="text-sm sm:text-base">+91-9718020090</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm sm:text-base">Open Daily 9 AM - 9 PM</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span className="text-sm sm:text-base">Visit Us Today</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with Tabs */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Services</h3>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">Choose from our wide range of professional services</p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6 sm:mb-8 h-auto">
              <TabsTrigger value="all" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 p-2 sm:p-3">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs sm:text-sm">All</span>
              </TabsTrigger>
              <TabsTrigger value="hair" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 p-2 sm:p-3">
                <Scissors className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Hair</span>
              </TabsTrigger>
              <TabsTrigger value="beauty" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 p-2 sm:p-3">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Beauty</span>
              </TabsTrigger>
              <TabsTrigger value="makeup" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 p-2 sm:p-3">
                <Palette className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Makeup</span>
              </TabsTrigger>
              <TabsTrigger value="nails" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 p-2 sm:p-3">
                <Hand className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Nails</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} onBook={() => setShowBooking(true)} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hair">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {getServicesByCategory("hair").map((service) => (
                  <ServiceCard key={service.id} service={service} onBook={() => setShowBooking(true)} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="beauty">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {getServicesByCategory("beauty").map((service) => (
                  <ServiceCard key={service.id} service={service} onBook={() => setShowBooking(true)} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="makeup">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {getServicesByCategory("makeup").map((service) => (
                  <ServiceCard key={service.id} service={service} onBook={() => setShowBooking(true)} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="nails">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {getServicesByCategory("nails").map((service) => (
                  <ServiceCard key={service.id} service={service} onBook={() => setShowBooking(true)} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white dark:bg-gray-900 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">Visit Us</h3>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">Experience the legacy of professional beauty services</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Phone className="w-8 h-8 mx-auto text-gray-600 dark:text-gray-400 mb-2" />
                <CardTitle className="dark:text-white">Call Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold dark:text-white">+91-9718020090</p>
                <p className="text-gray-600 dark:text-gray-400">Available for appointments</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="w-8 h-8 mx-auto text-gray-600 dark:text-gray-400 mb-2" />
                <CardTitle className="dark:text-white">Opening Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold dark:text-white">9:00 AM - 9:00 PM</p>
                <p className="text-gray-600 dark:text-gray-400">Open all days</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <MapPin className="w-8 h-8 mx-auto text-gray-600 dark:text-gray-400 mb-2" />
                <CardTitle className="dark:text-white">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold dark:text-white">The Legacy Salon</p>
                <p className="text-gray-600 dark:text-gray-400">Unisex Art Studio</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="relative w-6 h-6 sm:w-8 sm:h-8">
              <Image
                src="/logo.png"
                alt="The Legacy Salon Logo"
                fill
                className="object-contain filter brightness-0 invert"
              />
            </div>
            <h4 className="text-lg sm:text-xl font-bold">The Legacy Salon</h4>
          </div>
          <p className="text-gray-400 mb-4 text-sm sm:text-base">Professional Hair, Beauty & Makeup Services</p>
          <div className="flex justify-center items-center space-x-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2 text-gray-400 text-sm">4.9/5 Customer Rating</span>
          </div>
          <Separator className="my-4 bg-gray-700" />
          <p className="text-gray-500 text-sm">© 2024 The Legacy Salon. All rights reserved.</p>
        </div>
      </footer>

      {/* Service Management Modal */}
      {showServiceManagement && (
        <ServiceManagement 
          services={services} 
          setServices={setServices} 
          onClose={() => setShowServiceManagement(false)}
        />
      )}

      {/* Booking Modal */}
      {showBooking && (
        <BookingForm 
          services={services} 
          onClose={() => setShowBooking(false)} 
        />
      )}
    </div>
  )
}

// Service Card Component
function ServiceCard({ service, onBook }: { service: Service; onBook: () => void }) {
  const Icon = categoryIcons[service.category]
  const categoryColor = categoryColors[service.category]

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between space-x-2">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            <CardTitle className="text-base sm:text-lg truncate">{service.name}</CardTitle>
          </div>
          <Badge className={`${categoryColor} text-xs flex-shrink-0`}>
            {service.category}
          </Badge>
        </div>
        <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
          {service.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">₹{service.price}</span>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-2">{service.duration}</span>
          </div>
          <Button size="sm" onClick={onBook} className="hover:scale-105 transition-transform text-xs sm:text-sm">
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
