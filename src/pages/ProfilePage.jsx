import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Input, Button } from '../components/common/UI'
import { User, Mail, Phone, Save } from 'lucide-react'

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth()
  const [form, setForm] = useState({
    name:  profile?.name  || '',
    phone: profile?.phone || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try { await updateProfile(form) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/30 page-enter">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-8">My Profile</h1>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-8">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100 dark:border-slate-700">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-display font-bold shadow-lg">
              {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white text-lg">{profile?.name}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{profile?.role === 'admin' ? '🔑 Admin' : '🇰🇪 Guest'}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              icon={User}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="John Kamau"
              id="profile-name"
            />
            <Input
              label="Email address"
              icon={Mail}
              type="email"
              value={user?.email || ''}
              disabled
              className="opacity-60 cursor-not-allowed"
              id="profile-email"
            />
            <Input
              label="Phone number"
              icon={Phone}
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+254 7XX XXX XXX"
              id="profile-phone"
            />
            <Button type="submit" icon={Save} loading={loading} size="lg" id="profile-save-btn">
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
