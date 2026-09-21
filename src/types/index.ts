/** Forma con la que httpBase rechaza cualquier error del API. */
export interface ApiError {
  status: number
  message: string
  data?: unknown
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

export type AccountType = 'staff' | 'admin'

/** Lo que devuelve el backapp en /auth/login y /auth/me. */
export interface SessionUser {
  id: string
  email: string
  name: string
  phone: string
  accountType: AccountType | string
}

export interface StaffUser {
  id: string
  email: string
  name: string
  phone: string
  accountType: AccountType
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
}

export type IdType = 'cedula' | 'ruc' | 'pasaporte'
export type Sex = 'F' | 'M' | ''
export type MaritalStatus = 'soltero' | 'casado' | 'divorciado' | 'viudo' | 'union_libre' | ''
export type BloodType = 'S/E' | 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-'
export type PatientStatus = 'active' | 'inactive'
export type StudyType = 'laboratorio' | 'imagen' | 'otro'

/** Ficha del paciente: mismos campos que "Consulta de Paciente" de DoctorSys. */
export interface Patient {
  id: string
  clinicalHistory: string
  idType: IdType
  isForeigner: boolean
  cedula: string
  fullName: string
  maritalStatus: MaritalStatus
  address: string
  email: string
  sex: Sex
  bloodType: BloodType
  status: PatientStatus
  admissionDate: string | null
  birthDate: string | null
  origin: string
  sector: string
  landline: string
  mobile1: string
  mobile2: string
  notes: string
  studiesCount: number
  createdAt: string
  updatedAt: string
}

/** Lo que se envía al crear o editar. */
export type PatientInput = Partial<
  Omit<Patient, 'id' | 'studiesCount' | 'createdAt' | 'updatedAt'>
> & { cedula: string; fullName: string }

export interface StudyFile {
  originalName: string
  format: string
  bytes: number
}

export interface Study {
  id: string
  patientId: string
  type: StudyType
  title: string
  examNumber: string
  doctor: string
  studyDate: string
  notes: string
  file: StudyFile
  isVisible: boolean
  downloadCount: number
  lastDownloadedAt: string | null
  notifiedAt: string | null
  uploadedBy: { id: string; name: string } | null
  createdAt: string
}

export interface RecentStudy extends Study {
  patient: { id: string; fullName: string; cedula: string }
}

export interface DashboardStats {
  patients: number
  studies: number
  studiesThisMonth: number
  downloads: number
  recentStudies: RecentStudy[]
}

export interface StudyInput {
  patientId: string
  type: StudyType
  title: string
  studyDate: string
  examNumber?: string
  doctor?: string
  notes?: string
  notify?: boolean
  file: { publicId: string; resourceType: string; originalName: string }
}

export interface UploadSignature {
  uploadUrl: string
  apiKey: string
  timestamp: number
  signature: string
  folder: string
  type: 'authenticated'
}

export interface DownloadLink {
  url: string
  filename: string
}

// ─── Portal público de pacientes ─────────────────────────────────────

export interface PortalStudy {
  id: string
  type: StudyType
  title: string
  examNumber: string
  doctor: string
  studyDate: string
  file: { format: string; bytes: number }
}

export interface PortalSession {
  token: string
  expiresIn: number
  patient: { fullName: string; cedulaMasked: string }
  studies: PortalStudy[]
}
