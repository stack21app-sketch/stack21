// Prisma Client mock (in-memory)

type ConsentPreferences = {
  essential: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
  timestamp?: string
  ip_address?: string
  user_agent?: string
}

class InMemoryTable<T extends { id: string }> {
  private rows = new Map<string, T>()
  findUnique(where: any) {
    if (where.userId) {
      for (const r of this.rows.values()) {
        // @ts-ignore
        if (r.userId === where.userId) return Promise.resolve(r)
      }
      return Promise.resolve(null)
    }
    return Promise.resolve(this.rows.get(where.id) || null)
  }
  findFirst(where: any) {
    for (const r of this.rows.values()) {
      let ok = true
      for (const k of Object.keys(where)) {
        // @ts-ignore
        if (r[k] !== where[k]) ok = false
      }
      if (ok) return Promise.resolve(r)
    }
    return Promise.resolve(null)
  }
  findMany(args: any = {}) {
    const all = Array.from(this.rows.values())
    return Promise.resolve(all)
  }
  create({ data }: any) {
    // @ts-ignore
    const id = data.id || `id_${Math.random().toString(36).slice(2)}`
    const now = new Date()
    const row = { id, createdAt: now, updatedAt: now, ...data }
    // @ts-ignore
    this.rows.set(row.id, row)
    // @ts-ignore
    return Promise.resolve(row)
  }
  upsert({ where, update, create }: any) {
    return this.findUnique(where).then((existing) => {
      if (existing) {
        const updated = { ...existing, ...update, updatedAt: new Date() }
        // @ts-ignore
        this.rows.set(updated.id, updated)
        return updated
      }
      return this.create({ data: create })
    })
  }
  update({ where, data }: any) {
    return this.findUnique(where).then((existing) => {
      if (!existing) throw new Error('Not found')
      const updated = { ...existing, ...data, updatedAt: new Date() }
      // @ts-ignore
      this.rows.set(updated.id, updated)
      return updated
    })
  }
  delete({ where }: any) {
    return this.findUnique(where).then((existing) => {
      if (!existing) throw new Error('Not found')
      // @ts-ignore
      this.rows.delete(existing.id)
      return existing
    })
  }
}

export enum DeletionStatus { PENDING='PENDING', PROCESSING='PROCESSING', COMPLETED='COMPLETED', FAILED='FAILED' }
export enum ExportStatus { PROCESSING='PROCESSING', COMPLETED='COMPLETED', FAILED='FAILED' }

export class PrismaClient {
  userConsent = new InMemoryTable<any>()
  privacySettings = new InMemoryTable<any>()
  dataDeletionRequest = new InMemoryTable<any>()
  dataExportJob = new InMemoryTable<any>()
}

export default PrismaClient
