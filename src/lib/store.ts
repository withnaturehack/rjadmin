import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Member, Referral, MEMBERS, REFERRALS } from './data'

export type Page = 'dashboard' | 'analytics' | 'members' | 'approvals' |
  'referrals' | 'matches' | 'juliet' | 'romeo' | 'health' | 'security' | 'settings'

export interface AppState {
  user: { name: string; role: 'SUPER_ADMIN' | 'MODERATOR'; email: string } | null
  page: Page
  sidebarCollapsed: boolean
  members: Member[]
  referrals: Referral[]
  memberSearch: string
  memberStatusFilter: string
  matchFilter: string
  chatFilter: string
  settings: {
    thresh: number; window: number; intro: number
    questions: number; checkin: number; voice: boolean; gate: boolean
  }
  approvalsDone: Record<string, 'approved' | 'rejected'>
  toast: { id: number; msg: string; type: 'ok' | 'err' | 'info' } | null
}

type Action =
  | { type: 'LOGIN'; payload: AppState['user'] }
  | { type: 'LOGOUT' }
  | { type: 'HYDRATE_DATA'; payload: { members: Member[]; referrals: Referral[] } }
  | { type: 'NAV'; payload: Page }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_MEMBER_SEARCH'; payload: string }
  | { type: 'SET_MEMBER_STATUS'; payload: string }
  | { type: 'SET_MATCH_FILTER'; payload: string }
  | { type: 'SET_CHAT_FILTER'; payload: string }
  | { type: 'APPROVE_MEMBER'; payload: string }
  | { type: 'REJECT_MEMBER'; payload: string }
  | { type: 'TOGGLE_REFERRAL'; payload: string }
  | { type: 'ADD_REFERRAL'; payload: Referral }
  | { type: 'SAVE_SETTINGS'; payload: AppState['settings'] }
  | { type: 'TOAST'; payload: { msg: string; type: 'ok' | 'err' | 'info' } }
  | { type: 'CLEAR_TOAST' }

const initialState: AppState = {
  user: null,
  page: 'dashboard',
  sidebarCollapsed: false,
  members: [...MEMBERS],
  referrals: [...REFERRALS],
  memberSearch: '',
  memberStatusFilter: '',
  matchFilter: '',
  chatFilter: '',
  settings: { thresh: 70, window: 24, intro: 1, questions: 15, checkin: 24, voice: true, gate: true },
  approvalsDone: {},
  toast: null,
}

let toastId = 0

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOGIN': return { ...state, user: action.payload, page: 'dashboard' }
    case 'LOGOUT': return { ...initialState }
    case 'HYDRATE_DATA': return {
      ...state,
      members: action.payload.members,
      referrals: action.payload.referrals,
    }
    case 'NAV': return { ...state, page: action.payload }
    case 'TOGGLE_SIDEBAR': return { ...state, sidebarCollapsed: !state.sidebarCollapsed }
    case 'SET_MEMBER_SEARCH': return { ...state, memberSearch: action.payload }
    case 'SET_MEMBER_STATUS': return { ...state, memberStatusFilter: action.payload }
    case 'SET_MATCH_FILTER': return { ...state, matchFilter: action.payload }
    case 'SET_CHAT_FILTER': return { ...state, chatFilter: action.payload }
    case 'APPROVE_MEMBER': return {
      ...state,
      members: state.members.map(m => m.id === action.payload ? { ...m, status: 'APPROVED', phase: 'WAITING' } : m),
      approvalsDone: { ...state.approvalsDone, [action.payload]: 'approved' },
    }
    case 'REJECT_MEMBER': return {
      ...state,
      members: state.members.map(m => m.id === action.payload ? { ...m, status: 'REJECTED' } : m),
      approvalsDone: { ...state.approvalsDone, [action.payload]: 'rejected' },
    }
    case 'TOGGLE_REFERRAL': return {
      ...state,
      referrals: state.referrals.map(r => r.id === action.payload ? { ...r, active: !r.active } : r),
    }
    case 'ADD_REFERRAL': return { ...state, referrals: [...state.referrals, action.payload] }
    case 'SAVE_SETTINGS': return { ...state, settings: action.payload }
    case 'TOAST': return { ...state, toast: { id: ++toastId, msg: action.payload.msg, type: action.payload.type } }
    case 'CLEAR_TOAST': return { ...state, toast: null }
    default: return state
  }
}

const Ctx = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return React.createElement(Ctx.Provider, { value: { state, dispatch } }, children)
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore outside StoreProvider')
  return ctx
}
