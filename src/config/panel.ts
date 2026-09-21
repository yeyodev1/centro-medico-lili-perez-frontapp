/**
 * Copy y configuración del panel del personal.
 * Vive aparte de site.ts solo porque ese archivo lo administra el coordinador:
 * se puede fusionar ahí sin tocar los componentes (mismos nombres de export).
 */
import type { PatientInput, StudyType } from '@/types'

export const panelCopy = {
  brand: 'Panel del personal',
  logout: 'Cerrar sesión',
  viewPortal: 'Ver portal de pacientes',
  sessionExpired: 'Tu sesión venció. Vuelve a ingresar.',
  roles: { admin: 'Administrador', staff: 'Asesor' } as Record<string, string>,
  search: {
    label: 'Buscar paciente',
    placeholder: 'Cédula, nombre o historia clínica',
    submit: 'Buscar',
    hint: 'Escribe la cédula, parte del nombre o la historia clínica.',
  },
  dashboard: {
    title: 'Resumen',
    searchTitle: '¿A quién le vas a subir un estudio?',
    newPatient: 'Nuevo paciente',
    allPatients: 'Ver todos los pacientes',
    recentTitle: 'Últimos estudios subidos',
    recentEmpty: 'Todavía no se ha subido ningún estudio.',
    stats: {
      patients: 'Pacientes',
      studies: 'Estudios',
      studiesThisMonth: 'Estudios este mes',
      downloads: 'Descargas de pacientes',
    },
  },
  patients: {
    title: 'Pacientes',
    empty: 'No hay pacientes con esa búsqueda',
    emptyAll: 'Todavía no hay pacientes registrados',
    createWithCedula: 'Crear paciente con esta cédula',
    create: 'Nuevo paciente',
    filters: [
      { value: '', label: 'Todos' },
      { value: 'active', label: 'Activos' },
      { value: 'inactive', label: 'Inactivos' },
    ],
  },
  patientForm: {
    general: 'Generales',
    notes: 'Observación',
    foreigner: 'Extranjero',
    save: 'Guardar paciente',
    saving: 'Guardando…',
    created: 'Paciente creado',
    updated: 'Cambios guardados',
    unsavedTitle: 'Hay cambios sin guardar',
    unsavedMessage: 'Si sales ahora se pierde lo que escribiste en la ficha.',
    unsavedConfirm: 'Salir sin guardar',
    unsavedCancel: 'Seguir editando',
    errors: {
      cedulaRequired: 'Escribe la cédula, RUC o pasaporte',
      cedulaFormat: 'Debe tener entre 5 y 20 letras o números, sin espacios',
      nameRequired: 'Escribe los apellidos y nombres',
      email: 'El correo no tiene un formato válido',
      review: 'Revisa los campos marcados',
    },
  },
  studies: {
    title: 'Estudios',
    upload: 'Subir estudio',
    empty: 'Este paciente todavía no tiene estudios.',
    hidden: 'Oculto al paciente',
    notNotified: 'Sin aviso',
    noEmail: 'El paciente no tiene correo registrado',
    deleteTitle: 'Eliminar estudio',
    deleteMessage:
      'Se borra el registro y el archivo. El paciente dejará de verlo. No se puede deshacer.',
  },
  upload: {
    title: 'Subir estudio',
    dropTitle: 'Arrastra el archivo aquí',
    dropHint: 'PDF, JPG o PNG · máximo 20 MB',
    pick: 'Elegir archivo',
    change: 'Cambiar archivo',
    notify: 'Avisar al paciente por correo',
    notifyDisabled:
      'El paciente no tiene correo registrado: agrégalo en su ficha para poder avisarle.',
    submit: 'Subir estudio',
    retry: 'Reintentar',
    success: 'Estudio subido',
    steps: {
      signing: 'Preparando la subida…',
      uploading: 'Subiendo archivo…',
      saving: 'Guardando el estudio…',
    },
    errors: {
      noFile: 'Elige el archivo del estudio',
      type: 'Formato no permitido. Solo PDF, JPG o PNG.',
      size: 'El archivo pesa más de 20 MB.',
      empty: 'El archivo está vacío.',
      title: 'Escribe un título',
      date: 'Indica la fecha del estudio',
      signing: 'No se pudo preparar la subida.',
      uploading: 'No se pudo subir el archivo. Revisa tu conexión.',
      saving:
        'El archivo subió, pero no se pudo guardar el estudio. Reintenta: no se vuelve a subir.',
      cancelled: 'Subida cancelada',
    },
  },
  deletePatient: {
    title: 'Eliminar paciente',
    message:
      'Se borran la ficha, todos sus estudios y los archivos. No se puede deshacer. Para confirmar, escribe la cédula del paciente.',
    mismatch: 'La cédula no coincide',
    confirm: 'Eliminar paciente',
  },
} as const

export const uploadRules = {
  accept: '.pdf,.jpg,.jpeg,.png',
  extensions: ['pdf', 'jpg', 'jpeg', 'png'],
  mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  maxBytes: 20 * 1024 * 1024,
} as const

/** El primer título de cada tipo es el que se propone solo; el resto alimenta el autocompletar. */
export const studyTitleSuggestions: Record<StudyType, readonly string[]> = {
  laboratorio: [
    'Exámenes de laboratorio',
    'Hemograma completo',
    'Perfil lipídico',
    'Examen de orina',
    'Coproparasitario',
  ],
  imagen: ['Estudio de imagen', 'Ecografía', 'Rayos X', 'Mamografía', 'Tomografía', 'Resonancia'],
  otro: ['Resultado médico', 'Electrocardiograma', 'Informe médico', 'Certificado médico'],
}

export type PatientFieldKey = Exclude<keyof PatientInput, 'isForeigner' | 'notes'>

export interface PatientFieldConfig {
  key: PatientFieldKey | 'isForeigner'
  label: string
  type: 'text' | 'email' | 'tel' | 'date' | 'select' | 'checkbox'
  /** Columnas que ocupa de una fila de cuatro: sm = 1, md = 2, lg = 3. */
  size: 'sm' | 'md' | 'lg'
  options?: 'idType' | 'sex' | 'maritalStatus' | 'bloodType' | 'status'
  required?: boolean
  uppercase?: boolean
  maxlength?: number
  inputmode?: 'numeric' | 'tel' | 'email' | 'text'
  autocomplete?: string
}

/** Mismos campos y orden que la pantalla "Consulta de Paciente" de DoctorSys. */
export const patientGeneralFields: readonly PatientFieldConfig[] = [
  {
    key: 'clinicalHistory',
    label: 'Historia clínica',
    type: 'text',
    size: 'sm',
    uppercase: true,
    maxlength: 30,
  },
  { key: 'idType', label: 'Tipo identificación', type: 'select', size: 'sm', options: 'idType' },
  { key: 'isForeigner', label: 'Extranjero', type: 'checkbox', size: 'sm' },
  { key: 'cedula', label: 'RUC/Cédula', type: 'text', size: 'sm', required: true, maxlength: 20 },
  {
    key: 'fullName',
    label: 'Apellidos y nombres',
    type: 'text',
    size: 'lg',
    required: true,
    uppercase: true,
    maxlength: 120,
  },
  {
    key: 'maritalStatus',
    label: 'Estado civil',
    type: 'select',
    size: 'sm',
    options: 'maritalStatus',
  },
  { key: 'address', label: 'Dirección', type: 'text', size: 'md', maxlength: 200 },
  { key: 'email', label: 'Email', type: 'email', size: 'md', inputmode: 'email', maxlength: 120 },
  { key: 'sex', label: 'Sexo', type: 'select', size: 'sm', options: 'sex' },
  { key: 'bloodType', label: 'Tipo sangre', type: 'select', size: 'sm', options: 'bloodType' },
  { key: 'status', label: 'Estado', type: 'select', size: 'sm', options: 'status' },
  { key: 'admissionDate', label: 'Fecha ingreso', type: 'date', size: 'sm' },
  { key: 'birthDate', label: 'Fecha nacimiento', type: 'date', size: 'sm' },
  { key: 'origin', label: 'Procedencia', type: 'text', size: 'sm', uppercase: true, maxlength: 80 },
  { key: 'sector', label: 'Sector', type: 'text', size: 'sm', uppercase: true, maxlength: 80 },
  {
    key: 'landline',
    label: 'Convencional',
    type: 'tel',
    size: 'sm',
    inputmode: 'tel',
    maxlength: 20,
  },
  { key: 'mobile1', label: 'Celular 1', type: 'tel', size: 'sm', inputmode: 'tel', maxlength: 20 },
  { key: 'mobile2', label: 'Celular 2', type: 'tel', size: 'sm', inputmode: 'tel', maxlength: 20 },
]
