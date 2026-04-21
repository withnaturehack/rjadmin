export type MemberPhase = 'ONBOARDING' | 'CHAT' | 'WAITING' | 'MATCHED' | 'CHATTING'
export type MemberStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type MatchStatus = 'PROPOSED' | 'PENDING_ONE' | 'MUTUAL' | 'REJECTED' | 'EXPIRED'
export type ChatStatus = 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' | 'ABANDONED'

export interface Member {
  id: string; name: string; email: string; age: number
  gender: 'M' | 'F'; city: string; phase: MemberPhase
  status: MemberStatus; ref: string | null; joined: Date
  bio?: string; instagram?: string; linkedin?: string
  photos: number
}

export interface Match {
  id: string
  a: { name: string; city: string }
  b: { name: string; city: string }
  score: number; status: MatchStatus
  note: string
  breakdown: { values: number; communication: number; lifestyle: number; goals: number }
  proposed: Date; expires: Date
}

export interface Chat {
  id: string
  member: { name: string; city: string }
  status: ChatStatus; q: number; total: number
  secs: number; updated: Date
}

export interface Referral {
  id: string; code: string; label: string
  by: string; used: number; conv: number
  active: boolean; max: number | null; created: string
}

const now = Date.now()
const d = (h: number) => new Date(now - h * 3600000)
const D = (days: number) => new Date(now - days * 86400000)

export const MEMBERS: Member[] = [
  { id: 'm01', name: 'Arya Kapoor',    email: 'arya@example.com',   age: 27, gender: 'F', city: 'Mumbai',    phase: 'MATCHED',    status: 'APPROVED', ref: 'ROMEO-2024', joined: D(2),   bio: 'Product designer who finds meaning in slow conversations and long walks.', photos: 3 },
  { id: 'm02', name: 'Sahil Mehta',    email: 'sahil@example.com',  age: 29, gender: 'M', city: 'Delhi',     phase: 'WAITING',    status: 'APPROVED', ref: 'JULIET-09',  joined: D(3),   bio: 'Writer, reader, occasional over-thinker. Looking for depth.', photos: 2 },
  { id: 'm03', name: 'Priya Rao',      email: 'priya@example.com',  age: 26, gender: 'F', city: 'Bangalore', phase: 'CHATTING',   status: 'APPROVED', ref: 'ROMEO-2024', joined: D(4),   bio: 'Researcher at heart. Believes in unhurried connection.', photos: 3 },
  { id: 'm04', name: 'Vikram Singh',   email: 'vikram@example.com', age: 31, gender: 'M', city: 'Pune',      phase: 'ONBOARDING', status: 'PENDING',  ref: null,         joined: D(1),   bio: '', photos: 0 },
  { id: 'm05', name: 'Neha Agarwal',   email: 'neha@example.com',   age: 28, gender: 'F', city: 'Hyderabad', phase: 'MATCHED',    status: 'APPROVED', ref: 'ROMEO-2024', joined: D(5),   bio: 'Architect. Sunday cooking. Fond of honest conversations over coffee.', photos: 3 },
  { id: 'm06', name: 'Rohan Desai',    email: 'rohan@example.com',  age: 30, gender: 'M', city: 'Mumbai',    phase: 'WAITING',    status: 'APPROVED', ref: 'JULIET-09',  joined: D(6),   bio: 'Filmmaker. Believes stories are how we understand each other.', photos: 2 },
  { id: 'm07', name: 'Ananya Sharma',  email: 'ananya@example.com', age: 25, gender: 'F', city: 'Delhi',     phase: 'ONBOARDING', status: 'PENDING',  ref: 'ROMEO-2024', joined: D(0.5), bio: '', photos: 1 },
  { id: 'm08', name: 'Kabir Nair',     email: 'kabir@example.com',  age: 32, gender: 'M', city: 'Kochi',     phase: 'CHAT',       status: 'PENDING',  ref: null,         joined: D(1.2), bio: '', photos: 2 },
  { id: 'm09', name: 'Meera Pillai',   email: 'meera@example.com',  age: 27, gender: 'F', city: 'Chennai',   phase: 'CHAT',       status: 'PENDING',  ref: 'JULIET-09',  joined: D(1.8), bio: '', photos: 3 },
  { id: 'm10', name: 'Dev Malhotra',   email: 'dev@example.com',    age: 28, gender: 'M', city: 'Gurgaon',   phase: 'ONBOARDING', status: 'PENDING',  ref: 'ROMEO-2024', joined: D(2.5), bio: '', photos: 1 },
  { id: 'm11', name: 'Isha Chauhan',   email: 'isha@example.com',   age: 26, gender: 'F', city: 'Jaipur',    phase: 'WAITING',    status: 'APPROVED', ref: 'MATCH-VIP',  joined: D(7),   bio: 'Musician and teacher. Values patience and presence.', photos: 3 },
  { id: 'm12', name: 'Nikhil Verma',   email: 'nikhil@example.com', age: 33, gender: 'M', city: 'Kolkata',   phase: 'MATCHED',    status: 'APPROVED', ref: 'JULIET-09',  joined: D(8),   bio: 'Chef and food writer. Believes the table is where connection happens.', photos: 2 },
]

export const MATCHES: Match[] = [
  { id: 'mt1', a: { name: 'Arya Kapoor', city: 'Mumbai' },    b: { name: 'Priya Rao', city: 'Bangalore' },   score: 91, status: 'MUTUAL',      note: 'You share a rare combination of intellectual curiosity and emotional groundedness. This pairing is among my most confident.',              breakdown: { values: 92, communication: 88, lifestyle: 76, goals: 97 }, proposed: d(2),  expires: new Date(now + 22 * 3600000) },
  { id: 'mt2', a: { name: 'Sahil Mehta', city: 'Delhi' },     b: { name: 'Neha Agarwal', city: 'Hyderabad' }, score: 84, status: 'PENDING_ONE', note: 'Your shared value of deep conversation over small talk is unusually rare. The distance is the only variable worth watching.',            breakdown: { values: 87, communication: 82, lifestyle: 79, goals: 88 }, proposed: d(5),  expires: new Date(now + 19 * 3600000) },
  { id: 'mt3', a: { name: 'Vikram Singh', city: 'Pune' },     b: { name: 'Ananya Sharma', city: 'Delhi' },    score: 76, status: 'PROPOSED',    note: 'Both of you describe home as your anchor — that alignment is foundational. Give this one time.',                                         breakdown: { values: 78, communication: 71, lifestyle: 74, goals: 81 }, proposed: d(24), expires: new Date(now + 12 * 3600000) },
  { id: 'mt4', a: { name: 'Rohan Desai', city: 'Mumbai' },    b: { name: 'Meera Pillai', city: 'Chennai' },   score: 88, status: 'MUTUAL',      note: 'The way you both describe ambition — not as striving but as becoming — is striking. I rarely see this so clearly in two people.',      breakdown: { values: 90, communication: 85, lifestyle: 84, goals: 93 }, proposed: d(3),  expires: new Date(now + 21 * 3600000) },
  { id: 'mt5', a: { name: 'Kabir Nair', city: 'Kochi' },      b: { name: 'Dev Malhotra', city: 'Gurgaon' },   score: 79, status: 'PROPOSED',    note: 'Different cities, same rhythm. Your pacing through life is remarkably aligned. The geography is workable if the connection is real.',   breakdown: { values: 82, communication: 76, lifestyle: 72, goals: 85 }, proposed: d(6),  expires: new Date(now + 18 * 3600000) },
  { id: 'mt6', a: { name: 'Isha Chauhan', city: 'Jaipur' },   b: { name: 'Nikhil Verma', city: 'Kolkata' },   score: 93, status: 'MUTUAL',      note: 'This is among the highest compatibility scores I have generated. Shared language around creativity, care, and future. Proceed with intention.', breakdown: { values: 95, communication: 92, lifestyle: 88, goals: 97 }, proposed: d(8),  expires: new Date(now + 16 * 3600000) },
]

export const CHATS: Chat[] = [
  { id: 'ch1', member: { name: 'Arya Kapoor', city: 'Mumbai' },   status: 'COMPLETED',   q: 15, total: 15, secs: 1120, updated: d(2)  },
  { id: 'ch2', member: { name: 'Priya Rao', city: 'Bangalore' },  status: 'IN_PROGRESS', q: 12, total: 15, secs: 840,  updated: d(0.2)},
  { id: 'ch3', member: { name: 'Rohan Desai', city: 'Mumbai' },   status: 'IN_PROGRESS', q: 7,  total: 15, secs: 480,  updated: d(0.08)},
  { id: 'ch4', member: { name: 'Kabir Nair', city: 'Kochi' },     status: 'IN_PROGRESS', q: 9,  total: 15, secs: 600,  updated: d(2)  },
  { id: 'ch5', member: { name: 'Meera Pillai', city: 'Chennai' }, status: 'COMPLETED',   q: 15, total: 15, secs: 1080, updated: d(4)  },
  { id: 'ch6', member: { name: 'Dev Malhotra', city: 'Gurgaon' }, status: 'IN_PROGRESS', q: 3,  total: 15, secs: 180,  updated: d(1)  },
  { id: 'ch7', member: { name: 'Isha Chauhan', city: 'Jaipur' },  status: 'PAUSED',      q: 6,  total: 15, secs: 390,  updated: d(8)  },
  { id: 'ch8', member: { name: 'Nikhil Verma', city: 'Kolkata' }, status: 'COMPLETED',   q: 15, total: 15, secs: 980,  updated: d(10) },
]

export let REFERRALS: Referral[] = [
  { id: 'r1', code: 'ROMEO-2024', label: 'Primary launch code',   by: 'Team',  used: 312, conv: 208, active: true,  max: null, created: 'Jan 2024' },
  { id: 'r2', code: 'JULIET-09',  label: 'Batch 9 invite',         by: 'Team',  used: 198, conv: 122, active: true,  max: null, created: 'Mar 2024' },
  { id: 'r3', code: 'MATCH-VIP',  label: 'VIP early access',       by: 'Admin', used: 44,  conv: 41,  active: true,  max: 50,   created: 'Jun 2024' },
  { id: 'r4', code: 'BETA-001',   label: 'Beta testers',           by: 'Admin', used: 89,  conv: 51,  active: false, max: null, created: 'Oct 2023' },
  { id: 'r5', code: 'SPRING25',   label: 'Spring 2025 campaign',   by: 'Admin', used: 67,  conv: 43,  active: true,  max: 100,  created: 'Mar 2025' },
]

export const GROWTH = [1800,1851,1879,1924,1943,1981,2024,2083,2141,2248,2341,2418]
export const WEEKS  = ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12']
export const DAILY  = { labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], accepted:[18,22,19,27,24,31,23], rejected:[8,10,9,11,9,12,8] }
export const API_TRAFFIC = [120,90,70,85,210,340,310,280,320,380,350,210]

export const PHASE_LABELS: Record<string, string> = {
  ONBOARDING:'Onboarding', CHAT:'Juliet chat', WAITING:'Waiting',
  MATCHED:'Matched', CHATTING:'In chat', PROFILE_SETUP:'Profile setup',
}
export const MATCH_LABELS: Record<string, string> = {
  PROPOSED:'Proposed', PENDING_ONE:'Pending', MUTUAL:'Mutual ✓',
  REJECTED:'Rejected', EXPIRED:'Expired',
}

export const AUDIT_LOG = [
  { action:'APPROVE_MEMBER',  entity:'Member',      meta:'Arya Kapoor',              admin:'Admin',     ip:'182.64.12.44', when: d(0.03) },
  { action:'UPDATE_CONFIG',   entity:'SystemConfig',meta:'min_compat_threshold → 70',admin:'Admin',     ip:'182.64.12.44', when: d(0.25) },
  { action:'REJECT_MEMBER',   entity:'Member',      meta:'Unknown User',             admin:'Moderator', ip:'103.21.58.9',  when: d(0.75) },
  { action:'CREATE_REFERRAL', entity:'Referral',    meta:'SPRING26',                 admin:'Admin',     ip:'182.64.12.44', when: d(2)    },
  { action:'SIGN_IN',         entity:'Session',     meta:'admin@romeoandjuliet.app', admin:'Admin',     ip:'182.64.12.44', when: d(4)    },
  { action:'UPDATE_MEMBER',   entity:'Member',      meta:'Vikram Singh',             admin:'Moderator', ip:'103.21.58.9',  when: d(6)    },
  { action:'APPROVE_MEMBER',  entity:'Member',      meta:'Rohan Desai',              admin:'Admin',     ip:'182.64.12.44', when: d(10)   },
  { action:'CREATE_REFERRAL', entity:'Referral',    meta:'WINTER24',                 admin:'Admin',     ip:'182.64.12.44', when: d(24)   },
]
