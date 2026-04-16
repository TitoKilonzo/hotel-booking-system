import { Link } from 'react-router-dom'
import { Hotel, Github, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center">
                <Hotel size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Luxe<span className="text-gradient-gold">Stay</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Discover the world's finest hotels and resorts. Premium stays curated for the discerning traveller.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-gold-500 hover:text-white transition-all duration-200">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/hotels', 'All Hotels'], ['/dashboard', 'My Bookings']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm hover:text-gold-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5 text-sm">
              {['Help Center', 'Cancellation Policy', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}><a href="#" className="hover:text-gold-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5"><Mail size={14} className="text-gold-500 shrink-0" /><span>support@luxestay.com</span></li>
              <li className="flex items-center gap-2.5"><Phone size={14} className="text-gold-500 shrink-0" /><span>+1 (800) LUXE-STAY</span></li>
              <li className="flex items-center gap-2.5"><MapPin size={14} className="text-gold-500 shrink-0" /><span>1 Grand Avenue, New York, NY</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} LuxeStay. All rights reserved.</p>
          <p className="text-slate-600">Crafted with care for extraordinary experiences.</p>
        </div>
      </div>
    </footer>
  )
}
