import React from 'react';
import { Instagram, Github, Mail, User } from 'lucide-react';
import { TEAM_MEMBERS } from '../../models/team.model';

export const TeamSectionView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Team Cards Grid (2x2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TEAM_MEMBERS.map((member, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative group"
          >
            {/* Lanyard Clip / ID Card Slot Accent */}
            <div className="pt-3 pb-1.5 flex justify-center bg-slate-100/70 border-b border-slate-200/60">
              <div className="w-12 h-2 rounded-full bg-slate-300 border border-slate-400/40 shadow-inner" />
            </div>

            {/* Card Content Body */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col items-center">
              {/* 1. FOTO PROFIL (3x4 ID Card Ratio) */}
              <div className="relative">
                <div className="w-32 h-40 sm:w-36 sm:h-44 rounded-2xl border-2 border-slate-200 shadow-md bg-gradient-to-b from-slate-100 to-slate-200 overflow-hidden relative flex flex-col items-center justify-center group-hover:border-emerald-300 transition-colors">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={`Foto Profil ${member.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full ${member.iconColor} flex flex-col items-center justify-center p-3 relative`}
                    >
                      {/* Avatar Silhouette Icon & Large Monogram */}
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white/90 shadow-sm flex items-center justify-center mb-2 border border-slate-200/60">
                        <User className="w-9 h-9 sm:w-10 sm:h-10 text-slate-700" />
                      </div>
                      <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                        {member.name.charAt(0)}
                      </span>
                      {/* Watermark Pasfoto */}
                      <div className="absolute bottom-1.5 inset-x-0 text-center">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-600/80 bg-white/70 px-2 py-0.5 rounded-md backdrop-blur-xs">
                          PASFOTO 3×4
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. NAMA LENGKAP & ROLE BADGE */}
              <div className="text-center mt-5 w-full">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug tracking-tight">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-600">
                  {member.role}
                </p>
              </div>

              {/* 3. DETAIL KARTU PENGENAL (NIM, Angkatan, Program Studi, dll) */}
              <div className="mt-5 w-full bg-slate-50 rounded-2xl border border-slate-200/80 p-4 space-y-2.5 text-xs sm:text-sm">
                {/* NIM / NIP */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">
                    {member.isLecturer ? 'NIP' : 'Nomor Induk (NIM)'}
                  </span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200/70 shadow-2xs">
                    {member.nim}
                  </span>
                </div>

                {/* Angkatan / Status */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">
                    {member.isLecturer ? 'Status' : 'Angkatan'}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {member.batch}
                  </span>
                </div>

                {/* Program Studi */}
                <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium shrink-0">Program Studi</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {member.program}
                  </span>
                </div>

                {/* Afiliasi Fakultas & Universitas */}
                <div className="flex items-center justify-between pb-1">
                  <span className="text-slate-500 font-medium">Afiliasi</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {member.faculty || 'Fakultas Teknik UNNES'}
                  </span>
                </div>
              </div>
            </div>

            {/* Social & Contact Icons Strip */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500">
                Kontak Peneliti:
              </span>
              <div className="flex items-center gap-1.5">
                {/* Instagram */}
                {member.instagram && (
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-pink-600 hover:bg-pink-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    aria-label={`Instagram ${member.name}`}
                    title={`Instagram ${member.name}`}
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}

                {/* GitHub */}
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    aria-label={`GitHub ${member.name}`}
                    title={`GitHub ${member.name}`}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}

                {/* Google Email */}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    aria-label={`Email ${member.name}`}
                    title={`Google Email: ${member.email}`}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
