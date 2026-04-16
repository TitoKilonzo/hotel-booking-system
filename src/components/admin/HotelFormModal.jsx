import { useState, useRef } from 'react'
import { hotelService } from '../../services/hotelService'
import { Input, Textarea, Select, Button, Modal } from '../common/UI'
import { Upload, X, Plus } from 'lucide-react'
import { AMENITIES } from '../../utils'
import toast from 'react-hot-toast'

const HOTEL_CATEGORIES = ['Budget', 'Standard', 'Superior', 'Luxury', 'Ultra-Luxury', 'Boutique', 'Resort']

export default function HotelFormModal({ open, onClose, hotel, onSuccess }) {
  const isEdit = !!hotel
  const fileRef = useRef()

  const [form, setForm] = useState({
    name:          hotel?.name || '',
    description:   hotel?.description || '',
    location:      hotel?.location || '',
    address:       hotel?.address || '',
    category:      hotel?.category || 'Standard',
    startingPrice: hotel?.startingPrice || '',
    amenities:     hotel?.amenities || [],
    imageIds:      hotel?.imageIds || [],
    phone:         hotel?.phone || '',
    email:         hotel?.email || '',
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [errors, setErrors]       = useState({})

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const toggleAmenity = (a) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter(x => x !== a)
        : [...f.amenities, a]
    }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      const ids = await Promise.all(files.map(f => hotelService.uploadImage(f)))
      setForm(f => ({ ...f, imageIds: [...f.imageIds, ...ids] }))
      toast.success(`${ids.length} image(s) uploaded`)
    } catch (err) {
      toast.error('Image upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (id) => setForm(f => ({ ...f, imageIds: f.imageIds.filter(x => x !== id) }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Hotel name is required'
    if (!form.location.trim()) e.location = 'Location is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.startingPrice || isNaN(form.startingPrice)) e.startingPrice = 'Valid starting price required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      const data = { ...form, startingPrice: Number(form.startingPrice) }
      if (isEdit) await hotelService.updateHotel(hotel.$id, data)
      else        await hotelService.createHotel(data)
      toast.success(isEdit ? 'Hotel updated!' : 'Hotel created!')
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Hotel' : 'Add New Hotel'} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Hotel Name *" value={form.name} onChange={set('name')} error={errors.name} placeholder="Grand Palace Hotel" />
          <Select label="Category" value={form.category} onChange={set('category')}>
            {HOTEL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Location / City *" value={form.location} onChange={set('location')} error={errors.location} placeholder="New York" />
          <Input label="Starting Price ($/night) *" type="number" value={form.startingPrice} onChange={set('startingPrice')} error={errors.startingPrice} placeholder="299" min={1} />
        </div>

        <Input label="Full Address" value={form.address} onChange={set('address')} placeholder="123 Grand Ave, New York, NY 10001" />

        <Textarea label="Description *" value={form.description} onChange={set('description')} error={errors.description}
          placeholder="Describe the hotel experience, atmosphere, and unique offerings..." rows={3} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 (212) 555-0100" />
          <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="info@hotel.com" />
        </div>

        {/* Amenities */}
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map(a => {
              const active = form.amenities.includes(a)
              return (
                <button key={a} type="button" onClick={() => toggleAmenity(a)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${active ? 'bg-gold-500 text-white border-gold-500' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:border-gold-300'}`}
                >
                  {a}
                </button>
              )
            })}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Hotel Images</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.imageIds.map(id => (
              <div key={id} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                <img src={hotelService.getImageUrl(id, 100, 100)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(id)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <X size={16} className="text-white" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-slate-400 hover:border-gold-400 hover:text-gold-500 transition-colors">
              {uploading ? <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /> : <Upload size={18} />}
              <span className="text-xs mt-1">Upload</span>
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" loading={saving}>
            {isEdit ? 'Save Changes' : 'Create Hotel'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
