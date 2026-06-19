/**
 * In-memory mock database. Mutations from the handlers persist here for the
 * lifetime of the page session, so the UI reflects creates/edits/deletes.
 * This is the ONLY place that holds fake data — delete it once a real backend
 * is wired up.
 */

export type MockUser = {
  id: string
  full_name: string
  email: string
  role: 'admin' | 'manager' | 'member'
  status: 'active' | 'inactive' | 'pending'
  created_at: string
}

const FIRST = [
  'Ava',
  'Liam',
  'Mia',
  'Noah',
  'Emma',
  'Lucas',
  'Olivia',
  'Ethan',
  'Sophia',
  'Mason',
  'Isabella',
  'Logan',
  'Amelia',
  'James',
  'Harper',
  'Leo',
  'Ella',
  'Jack',
  'Aria',
  'Henry',
  'Luna',
  'Owen',
  'Nora',
]
const LAST = [
  'Carter',
  'Bennett',
  'Hughes',
  'Foster',
  'Reed',
  'Sloan',
  'Mercer',
  'Vance',
  'Hayes',
  'Cole',
]
const ROLES: MockUser['role'][] = ['admin', 'manager', 'member']
const STATUSES: MockUser['status'][] = ['active', 'inactive', 'pending']

const seedUsers = (): MockUser[] =>
  FIRST.map((first, i) => {
    const last = LAST[i % LAST.length]
    return {
      id: String(i + 1),
      full_name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
      role: ROLES[i % ROLES.length],
      status: STATUSES[i % STATUSES.length],
      created_at: new Date(2024, 0, (i % 28) + 1).toISOString(),
    }
  })

export const db = {
  users: seedUsers(),
}

let idCounter = db.users.length

export const nextId = () => String(++idCounter)
