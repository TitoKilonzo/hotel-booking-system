import { Link } from 'react-router-dom'
import { Palmtree, Twitter, Instagram, Mail, Phone, MapPin, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-auto" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Palmtree size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Tembea<span className="text-gradient-gold">Kenya</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Discover Kenya's finest hotels and resorts. From the bustling streets of Nairobi to the serene beaches of Diani — premium stays curated for you. 🇰🇪
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all duration-200" aria-label={`Social link ${i}`}>
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
                  <Link to={to} className="text-sm hover:text-emerald-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Popular Destinations</h4>
            <ul className="space-y-2.5 text-sm">
              {['Nairobi', 'Mombasa', 'Diani Beach', 'Maasai Mara', 'Nakuru', 'Malindi'].map(item => (
                <li key={item}>
                  <Link to={`/hotels?location=${encodeURIComponent(item)}`} className="hover:text-emerald-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5"><Mail size={14} className="text-emerald-500 shrink-0" /><span>hello@tembeakenya.co.ke</span></li>
              <li className="flex items-center gap-2.5"><Phone size={14} className="text-emerald-500 shrink-0" /><span>+254 700 123 456</span></li>
              <li className="flex items-center gap-2.5"><MapPin size={14} className="text-emerald-500 shrink-0" /><span>Westlands, Nairobi, Kenya</span></li>
            </ul>
          </div>
        </div>

        <div className="divider-gradient mt-12 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} TembeaKenya. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <span className="text-slate-600">Crafted with ❤️ in Kenya</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
