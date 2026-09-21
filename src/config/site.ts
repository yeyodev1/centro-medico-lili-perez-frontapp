/**
 * El copy es configuración: todos los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan.
 */
export const site = {
  name: 'Centro Médico Dra. Lili Pérez',
  shortName: 'Dra. Lili Pérez',
  tagline: 'Especialidades Médicas',
  description:
    'Consulta y descarga tus resultados de laboratorio e imágenes en línea, solo con tu número de cédula.',
  url: 'https://cliente.com',
  // El correo del centro llegó cortado en el PDF de ejemplo: pendiente de confirmar.
  email: '',
  address: 'Av. Juan Péndola Mz. 24 Solar 15 y Domingo Comín, Guayaquil',
  phones: ['099 352 7954', '098 289 1526'],
  // Solo dígitos con código de país, ej: 593984934039. Pendiente de confirmar cuál número atiende WhatsApp.
  whatsapp: '',
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },
  nav: [
    { label: 'Inicio', to: '/' },
    { label: 'Cómo funciona', to: '/#como-funciona' },
    { label: 'Contacto', to: '/#contacto' },
  ],
} as const

export const home = {
  hero: {
    eyebrow: 'Resultados en línea',
    title: 'Tus resultados médicos, sin venir a retirarlos',
    lead: 'Ingresa tu número de cédula y descarga tus exámenes de laboratorio e imágenes desde tu celular o computadora.',
    cta: 'Consultar mis resultados',
  },
  steps: {
    eyebrow: 'Cómo funciona',
    title: 'Tres pasos, menos de un minuto',
    items: [
      {
        icon: 'fa-solid fa-id-card',
        title: 'Escribe tu cédula',
        text: 'Usa el mismo número que diste en recepción el día de tu examen.',
      },
      {
        icon: 'fa-solid fa-list-check',
        title: 'Revisa tus estudios',
        text: 'Verás todos tus resultados ordenados por fecha, del más reciente al más antiguo.',
      },
      {
        icon: 'fa-solid fa-file-arrow-down',
        title: 'Descarga el PDF',
        text: 'Guárdalo en tu teléfono o envíalo a tu médico cuando lo necesites.',
      },
    ],
  },
  benefits: {
    eyebrow: 'Por qué usarlo',
    title: 'Pensado para que no tengas que volver',
    items: [
      {
        icon: 'fa-solid fa-clock',
        title: 'Disponible a toda hora',
        text: 'Tus resultados quedan guardados. Descárgalos las veces que quieras.',
      },
      {
        icon: 'fa-solid fa-shield-halved',
        title: 'Archivos protegidos',
        text: 'Cada descarga usa un enlace temporal que vence a los pocos minutos.',
      },
      {
        icon: 'fa-solid fa-mobile-screen',
        title: 'Desde cualquier equipo',
        text: 'Funciona en celular, tablet o computadora. No hay que instalar nada.',
      },
    ],
  },
  help: {
    title: '¿No encuentras tus resultados?',
    text: 'Puede que todavía estén en proceso. Llámanos y te confirmamos cuándo estarán listos.',
  },
} as const

export const portal = {
  title: 'Consulta tus resultados',
  lead: 'Escribe tu número de cédula tal como lo diste en recepción.',
  cedulaLabel: 'Número de cédula, RUC o pasaporte',
  cedulaPlaceholder: 'Ej: 0912345678',
  birthDateLabel: 'Fecha de nacimiento',
  submit: 'Ver mis resultados',
  empty: 'Todavía no tienes resultados publicados. Si te hiciste un examen hace poco, puede que siga en proceso.',
  sessionExpired: 'Por seguridad la consulta se cerró. Vuelve a escribir tu cédula.',
  privacy:
    'Tus resultados son confidenciales. No compartas tu número de cédula con personas que no deban verlos.',
  logout: 'Salir',
} as const

export const studyTypes = {
  laboratorio: { label: 'Laboratorio', icon: 'fa-solid fa-vial' },
  imagen: { label: 'Imagen', icon: 'fa-solid fa-x-ray' },
  otro: { label: 'Otro', icon: 'fa-solid fa-file-medical' },
} as const

export const patientOptions = {
  idType: [
    { value: 'cedula', label: 'Cédula' },
    { value: 'ruc', label: 'RUC' },
    { value: 'pasaporte', label: 'Pasaporte' },
  ],
  sex: [
    { value: '', label: 'Sin especificar' },
    { value: 'F', label: 'F - Femenino' },
    { value: 'M', label: 'M - Masculino' },
  ],
  maritalStatus: [
    { value: '', label: 'Sin especificar' },
    { value: 'soltero', label: 'S - Soltero' },
    { value: 'casado', label: 'C - Casado' },
    { value: 'divorciado', label: 'D - Divorciado' },
    { value: 'viudo', label: 'V - Viudo' },
    { value: 'union_libre', label: 'U - Unión libre' },
  ],
  bloodType: ['S/E', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
  status: [
    { value: 'active', label: 'A - Activo' },
    { value: 'inactive', label: 'I - Inactivo' },
  ],
} as const

export const panelNav = [
  { label: 'Resumen', to: '/panel', icon: 'fa-solid fa-chart-simple', exact: true },
  { label: 'Pacientes', to: '/panel/pacientes', icon: 'fa-solid fa-hospital-user' },
  { label: 'Usuarios', to: '/panel/usuarios', icon: 'fa-solid fa-user-gear', adminOnly: true },
  { label: 'Mi cuenta', to: '/panel/cuenta', icon: 'fa-solid fa-circle-user' },
] as const

export function whatsappLink(message = 'Hola, quiero consultar por mis resultados'): string {
  if (!site.whatsapp) return '#'
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}

export function telLink(phone: string): string {
  return `tel:+593${phone.replace(/\D/g, '').replace(/^0/, '')}`
}
