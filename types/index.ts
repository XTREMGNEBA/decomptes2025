export interface User {
  organism: any
  _id: any
  countryCode: any
  phoneNumber: any
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: string
}

export interface Organism {
  _id: string
  name: string
  type: 'public' | 'private'
  address: string
  contact: {
    email: string
    phone: string
  }
}

export interface Decompte {
  _id: string
  reference: string
  title: string
  status: 'draft' | 'pending' | 'validated' | 'signed' | 'closed'
  amount: number
  currency: string
  organism?: Organism
  createdAt: string
  validations?: Array<{
    user?: User
    date: string
    status: string
  }>
  signatures?: Array<{
    user?: User
    date: string
  }>
}

export interface Stats {
  decomptes: number
  organisms: number
  users: number
}