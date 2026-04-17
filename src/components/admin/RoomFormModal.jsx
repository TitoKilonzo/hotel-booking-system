import { useState } from 'react'
import { roomService } from '../../services/roomService'
import { Input, Textarea, Select, Button, Modal } from '../common/UI'
import { ROOM_TYPES } from '../../utils'
import toast from 'react-hot-toast'

const ROOM_FEATURES = [
  'King Bed', 'Twin Beds', 'Queen Bed', 'Ocean View', 'City View',
  'Balcony', 'Bathtub', 'Mini Bar', 'Kitchenette', 'Work Desk',
  'Smart TV', 'Walk-in Closet', 'Fireplace', 'Jacuzzi'
]

export default function RoomFormModal({ open, onClose, room, hotelId, onSuccess }) {
  const isEdit = !!room

  const [form, setForm] = useState({
    hotelId:      hotelId || room?.hotelId || '',
    type:         room?.type || 'Standard',
    description:  room?.description || '',
    pricePerNight: room?.pricePerNight || '',
    capacity:     room?.capacity || 2,
    size:         room?.size || '',
    features:     room?.features || [],
    isAvailable:  room?.isAvailable ?? true,
    roomNumber:   room?.roomNumber || '',
    floor:        room?.floor || '',
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const toggleFeature = (feat) => setForm(f => ({
    ...f,
    features: f.features.includes(feat)
      ? f.features.filter(x => x !== feat)
      : [...f.features, feat]
  }))

  const validate = () => {
    const e = {}
    if (!form.type) e.type = 'Type required'
    if (!form.pricePerNight || isNaN(form.pricePerNight)) e.pricePerNight = 'Valid price required'
    if (!form.capacity || isNaN(form.capacity)) e.capacity = 'Valid capacity required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      const data = {
        ...form,
        pricePerNight: Number(form.pricePerNight),
        capacity:      Number(form.capacity),
        size:          form.size ? Number(form.size) : null,
        floor:         form.floor ? Number(form.floor) : null,
      }
      if (isEdit) await roomService.updateRoom(room.$id, data)
      else        await roomService.createRoom(data)
      toast.success(isEdit ? 'Room updated!' : 'Room created!')
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Room' : 'Add Room'} className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select label="Room Type *" value={form.type} onChange={set('type')} error={errors.type} id="room-form-type">
            {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Input label="Price / Night (KES) *" type="number" value={form.pricePerNight} onChange={set('pricePerNight')} error={errors.pricePerNight} min={1} id="room-form-price" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input label="Capacity *" type="number" value={form.capacity} onChange={set('capacity')} error={errors.capacity} min={1} max={20} id="room-form-capacity" />
          <Input label="Size (m²)" type="number" value={form.size} onChange={set('size')} min={1} id="room-form-size" />
          <Input label="Floor" type="number" value={form.floor} onChange={set('floor')} min={0} id="room-form-floor" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Room Number" value={form.roomNumber} onChange={set('roomNumber')} placeholder="101" id="room-form-number" />
          <Select label="Availability" value={String(form.isAvailable)}
            onChange={e => setForm(f => ({ ...f, isAvailable: e.target.value === 'true' }))} id="room-form-available">
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </Select>
        </div>

        <Textarea label="Description" value={form.description} onChange={set('description')}
          placeholder="Room details, view, included amenities..." rows={2} id="room-form-desc" />

        {/* Features */}
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Room Features</label>
          <div className="flex flex-wrap gap-1.5">
            {ROOM_FEATURES.map(f => {
              const active = form.features.includes(f)
              return (
                <button key={f} type="button" onClick={() => toggleFeature(f)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${active ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:border-emerald-300'}`}>
                  {f}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" loading={saving} id="room-form-submit">{isEdit ? 'Save Changes' : 'Add Room'}</Button>
        </div>
      </form>
    </Modal>
  )
}
