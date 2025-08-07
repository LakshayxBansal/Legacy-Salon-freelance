"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: string
  category: "hair" | "beauty" | "makeup" | "nails"
}

interface ServiceManagementProps {
  services: Service[]
  setServices: (services: Service[]) => void
  onClose: () => void
}

export default function ServiceManagement({ services, setServices, onClose }: ServiceManagementProps) {
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({
    name: "",
    description: "",
    price: 0,
    duration: "",
    category: "hair"
  })

  const handleAddService = () => {
    if (newService.name && newService.description && newService.price > 0 && newService.duration) {
      const service: Service = {
        ...newService,
        id: Date.now().toString()
      }
      setServices([...services, service])
      setNewService({
        name: "",
        description: "",
        price: 0,
        duration: "",
        category: "hair"
      })
      setIsAddingNew(false)
    }
  }

  const handleUpdateService = (updatedService: Service) => {
    setServices(services.map(service => 
      service.id === updatedService.id ? updatedService : service
    ))
    setEditingService(null)
  }

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(service => service.id !== serviceId))
  }

  const categoryColors = {
    hair: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    beauty: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800",
    makeup: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
    nails: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  }

  return (
    <>
      {/* Main Service Management Dialog */}
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Service Management</span>
              <Button onClick={() => setIsAddingNew(true)} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add New Service</span>
              </Button>
            </DialogTitle>
            <DialogDescription>
              Add, edit, or remove services from your salon
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {services.map((service) => (
                <Card key={service.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between space-x-2">
                      <CardTitle className="text-base sm:text-lg truncate flex-1">{service.name}</CardTitle>
                      <Badge className={`${categoryColors[service.category]} text-xs flex-shrink-0`}>
                        {service.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-lg sm:text-xl font-bold">₹{service.price}</span>
                        <span className="text-xs sm:text-sm text-gray-500 ml-2">{service.duration}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-xs sm:text-sm"
                        onClick={() => setEditingService(service)}
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add New Service Dialog */}
      {isAddingNew && (
        <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
          <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>
                Create a new service for your salon. Fill in all the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  placeholder="e.g., Men's Haircut"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  placeholder="Brief description of the service"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newService.price}
                    onChange={(e) => setNewService({...newService, price: parseInt(e.target.value) || 0})}
                    placeholder="500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={newService.duration}
                    onChange={(e) => setNewService({...newService, duration: e.target.value})}
                    placeholder="45 min"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newService.category} onValueChange={(value: "hair" | "beauty" | "makeup" | "nails") => setNewService({...newService, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hair">Hair</SelectItem>
                    <SelectItem value="beauty">Beauty</SelectItem>
                    <SelectItem value="makeup">Makeup</SelectItem>
                    <SelectItem value="nails">Nails</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddService}>
                <Save className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Service Dialog */}
      {editingService && (
        <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
          <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>
                Make changes to the service details below.
              </DialogDescription>
            </DialogHeader>
            <EditServiceForm 
              service={editingService} 
              onSave={handleUpdateService}
              onCancel={() => setEditingService(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

function EditServiceForm({ service, onSave, onCancel }: {
  service: Service
  onSave: (service: Service) => void
  onCancel: () => void
}) {
  const [editedService, setEditedService] = useState<Service>(service)

  const handleSave = () => {
    if (editedService.name && editedService.description && editedService.price > 0 && editedService.duration) {
      onSave(editedService)
    }
  }

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="edit-name">Service Name</Label>
        <Input
          id="edit-name"
          value={editedService.name}
          onChange={(e) => setEditedService({...editedService, name: e.target.value})}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={editedService.description}
          onChange={(e) => setEditedService({...editedService, description: e.target.value})}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="edit-price">Price (₹)</Label>
          <Input
            id="edit-price"
            type="number"
            value={editedService.price}
            onChange={(e) => setEditedService({...editedService, price: parseInt(e.target.value) || 0})}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-duration">Duration</Label>
          <Input
            id="edit-duration"
            value={editedService.duration}
            onChange={(e) => setEditedService({...editedService, duration: e.target.value})}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-category">Category</Label>
        <Select value={editedService.category} onValueChange={(value: "hair" | "beauty" | "makeup" | "nails") => setEditedService({...editedService, category: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hair">Hair</SelectItem>
            <SelectItem value="beauty">Beauty</SelectItem>
            <SelectItem value="makeup">Makeup</SelectItem>
            <SelectItem value="nails">Nails</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
