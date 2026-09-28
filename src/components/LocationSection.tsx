import React, { useState } from 'react';
import { Sparkles, MapPin, Phone, Clock, ArrowRight, ExternalLink, Map, Image as ImageIcon, Mail } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<'map' | 'photo'>('map');
  const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=Aakar+Computer+Institute+Kurla+Mumbai';
  const mapsUrl = 'https://maps.google.com/?q=Aakar+Computer+Institute,+S.K.P+School+Campus,+Mother+Dairy+Road,+Nehru+Nagar,+Kurla,+Mumbai,+Maharashtra+400024';

  return (
    <section id="location" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-blue-400 uppercase mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Visit Aakar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow">
            Practical learning, right here in Kurla
          </h2>
        </div>

        {/* Location & Map Card */}
        <div className="bg-slate-950/40 backdrop-blur-md rounded-3xl border border-white/15 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Details Panel */}
          <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Pin Icon */}
              <div className="w-12 h-12 rounded-2xl bg-blue-950/80 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>

              {/* Institute Name & Address */}
              <div>
                <h3 className="text-2xl font-extrabold text-white mb-2">
                  AAKAR COMPUTER INSTITUTE
                </h3>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  S.K.P School Campus, Mother Dairy Road, Near Nehru Nagar Signal, Nehru Nagar, Kurla East,
                  Mumbai, Maharashtra 400024
                </p>
              </div>

              {/* Contact & Hours */}
              <div className="space-y-4 pt-2">
                <a
                  href="tel:09821085899"
                  className="flex items-center gap-3 text-white hover:text-blue-400 transition-colors font-semibold text-base group"
                >
                  <Phone className="w-5 h-5 text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>098210 85899</span>
                </a>

                <a
                  href="mailto:aakaroffice99@gmail.com"
                  className="flex items-center gap-3 text-white hover:text-red-400 transition-colors font-semibold text-base group"
                >
                  <Mail className="w-5 h-5 text-red-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>aakaroffice99@gmail.com</span>
                </a>

                <div className="flex items-start gap-3 text-slate-200 text-sm sm:text-base">
                  <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">
                      Monday: 7 am–10 pm
                    </div>
                    <div className="text-slate-300">
                      Tuesday–Sunday: 7 am–9 pm
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Get directions button */}
            <div>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full transition-all shadow-lg shadow-blue-600/30 active:scale-95 group border border-blue-400/40"
                id="get-directions-btn"
              >
                <span>Get directions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Map & Building View */}
          <div className="lg:col-span-7 bg-slate-950 relative min-h-[380px] lg:min-h-[480px] border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col">
            {/* View Switcher Controls */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-700 flex items-center gap-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    viewMode === 'map'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  aria-pressed={viewMode === 'map'}
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>Map View</span>
                </button>
                <button
                  onClick={() => setViewMode('photo')}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    viewMode === 'photo'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  aria-pressed={viewMode === 'photo'}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Center & Banner</span>
                </button>
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 text-blue-300 font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-lg border border-slate-700 transition backdrop-blur-sm min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <span>Open in Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {viewMode === 'map' ? (
              <>
                {/* Google Map Interactive Iframe */}
                <iframe
                  title="Aakar Computer Institute Location Map"
                  src="https://maps.google.com/maps?q=Aakar+Computer+Institute,+Nehru+Nagar,+Kurla,+Mumbai&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full min-h-[380px] lg:min-h-[480px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

                {/* Map Pin Callout Card */}
                <div className="absolute bottom-4 right-4 bg-slate-900/95 backdrop-blur-md p-3 rounded-xl shadow-2xl border border-slate-700 max-w-xs pointer-events-none hidden sm:block">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
                    <div className="text-xs font-bold text-white">Aakar Computer Institute</div>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Near Nehru Nagar Signal & Kurla Station</div>
                </div>
              </>
            ) : (
              <div className="w-full h-full min-h-[380px] lg:min-h-[480px] relative bg-black flex items-center justify-center">
                <img
                  src="/images/aakar_contact_banner.png"
                  alt="Aakar Computer & Healthcare Institute Official Contact & Admissions Banner"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('ChatGPT')) {
                      target.src = '/images/ChatGPT Image Sep 18, 2026, 09_43_02 PM.png';
                    } else {
                      target.src = '/images/aakar_institute_front.jpg';
                    }
                  }}
                />
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 text-white">
                  <div className="text-xs font-bold text-amber-300">Official Admissions & Contact Center</div>
                  <div className="text-[11px] text-slate-200 mt-0.5">S.K.P School Campus, Mother Dairy Road, Nehru Nagar, Kurla East • Call 098210 85899</div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
