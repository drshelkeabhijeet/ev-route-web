'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Car, Plus, Edit, Trash2, Battery, Zap } from 'lucide-react'
import { Vehicle } from '@/lib/types'
import { toast } from 'sonner'

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      batteryCapacity: 75,
      range: 358,
      efficiency: 4.8,
      chargingPower: 250,
      isSelected: true
    }
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    batteryCapacity: '',
    range: '',
    efficiency: '',
    chargingPower: ''
  })

  const handleAddVehicle = () => {
    setEditingVehicle(null)
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      batteryCapacity: '',
      range: '',
      efficiency: '',
      chargingPower: ''
    })
    setIsDialogOpen(true)
  }

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      batteryCapacity: vehicle.batteryCapacity.toString(),
      range: vehicle.range.toString(),
      efficiency: vehicle.efficiency.toString(),
      chargingPower: vehicle.chargingPower.toString()
    })
    setIsDialogOpen(true)
  }

  const handleSaveVehicle = () => {
    if (!formData.make || !formData.model) {
      toast.error('Please fill in all required fields')
      return
    }

    const newVehicle: Vehicle = {
      id: editingVehicle?.id || Date.now().toString(),
      make: formData.make,
      model: formData.model,
      year: formData.year,
      batteryCapacity: parseFloat(formData.batteryCapacity) || 0,
      range: parseFloat(formData.range) || 0,
      efficiency: parseFloat(formData.efficiency) || 0,
      chargingPower: parseFloat(formData.chargingPower) || 0,
      isSelected: editingVehicle?.isSelected || false
    }

    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? newVehicle : v))
      toast.success('Vehicle updated successfully')
    } else {
      setVehicles([...vehicles, newVehicle])
      toast.success('Vehicle added successfully')
    }

    setIsDialogOpen(false)
  }

  const handleDeleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id))
    toast.success('Vehicle deleted successfully')
  }

  const handleSelectVehicle = (id: string) => {
    setVehicles(vehicles.map(v => ({ ...v, isSelected: v.id === id })))
    toast.success('Vehicle selected')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Vehicles
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your electric vehicles and their specifications
          </p>
        </div>
        <Button onClick={handleAddVehicle} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className={`${vehicle.isSelected ? 'ring-2 ring-green-500' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Car className="w-5 h-5 mr-2 text-green-600" />
                  <CardTitle className="text-lg">
                    {vehicle.make} {vehicle.model}
                  </CardTitle>
                </div>
                {vehicle.isSelected && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Selected
                  </span>
                )}
              </div>
              <CardDescription>
                {vehicle.year} • {vehicle.batteryCapacity}kWh Battery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Range:</span>
                  <p className="font-medium">{vehicle.range} km</p>
                </div>
                <div>
                  <span className="text-gray-600">Efficiency:</span>
                  <p className="font-medium">{vehicle.efficiency} km/kWh</p>
                </div>
                <div>
                  <span className="text-gray-600">Charging:</span>
                  <p className="font-medium">{vehicle.chargingPower} kW</p>
                </div>
                <div>
                  <span className="text-gray-600">Battery:</span>
                  <p className="font-medium">{vehicle.batteryCapacity} kWh</p>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSelectVehicle(vehicle.id)}
                  disabled={vehicle.isSelected}
                >
                  {vehicle.isSelected ? 'Selected' : 'Select'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditVehicle(vehicle)}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vehicles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Car className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No vehicles added yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add your first electric vehicle to start planning routes
            </p>
            <Button onClick={handleAddVehicle} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Vehicle
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Vehicle Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </DialogTitle>
            <DialogDescription>
              Enter your vehicle details to get accurate route planning
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  placeholder="Tesla"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Model 3"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batteryCapacity">Battery Capacity (kWh)</Label>
                <Input
                  id="batteryCapacity"
                  type="number"
                  value={formData.batteryCapacity}
                  onChange={(e) => setFormData({ ...formData, batteryCapacity: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="range">Range (km)</Label>
                <Input
                  id="range"
                  type="number"
                  value={formData.range}
                  onChange={(e) => setFormData({ ...formData, range: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="efficiency">Efficiency (km/kWh)</Label>
                <Input
                  id="efficiency"
                  type="number"
                  step="0.1"
                  value={formData.efficiency}
                  onChange={(e) => setFormData({ ...formData, efficiency: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chargingPower">Max Charging Power (kW)</Label>
                <Input
                  id="chargingPower"
                  type="number"
                  value={formData.chargingPower}
                  onChange={(e) => setFormData({ ...formData, chargingPower: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveVehicle} className="bg-green-600 hover:bg-green-700">
              {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
