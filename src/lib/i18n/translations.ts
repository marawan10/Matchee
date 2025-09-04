export interface Translation {
  // Navigation
  live: string
  calendar: string
  favorites: string
  leagues: string
  stats: string
  social: string
  
  // Match Status
  notStarted: string
  firstHalf: string
  halfTime: string
  secondHalf: string
  fullTime: string
  extraTime: string
  penalties: string
  suspended: string
  cancelled: string
  
  // Actions
  search: string
  refresh: string
  addToFavorites: string
  removeFromFavorites: string
  viewDetails: string
  lineups: string
  statistics: string
  timeline: string
  
  // Time
  today: string
  tomorrow: string
  yesterday: string
  thisWeek: string
  nextWeek: string
  
  // Common
  loading: string
  error: string
  noMatches: string
  tryAgain: string
  settings: string
  darkMode: string
  lightMode: string
  language: string
  notifications: string
}

export const translations: Record<string, Translation> = {
  en: {
    // Navigation
    live: 'Live',
    calendar: 'Calendar',
    favorites: 'My Feed',
    leagues: 'Leagues',
    stats: 'Stats',
    social: 'Social',
    
    // Match Status
    notStarted: 'Not Started',
    firstHalf: 'First Half',
    halfTime: 'Half Time',
    secondHalf: 'Second Half',
    fullTime: 'Full Time',
    extraTime: 'Extra Time',
    penalties: 'Penalties',
    suspended: 'Suspended',
    cancelled: 'Cancelled',
    
    // Actions
    search: 'Search teams, players, leagues...',
    refresh: 'Refresh',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    viewDetails: 'View Details',
    lineups: 'Lineups',
    statistics: 'Statistics',
    timeline: 'Timeline',
    
    // Time
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    nextWeek: 'Next Week',
    
    // Common
    loading: 'Loading...',
    error: 'Error occurred',
    noMatches: 'No matches found',
    tryAgain: 'Try again',
    settings: 'Settings',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    notifications: 'Notifications'
  },
  
  ar: {
    // Navigation
    live: 'مباشر',
    calendar: 'التقويم',
    favorites: 'متابعاتي',
    leagues: 'البطولات',
    stats: 'الإحصائيات',
    social: 'اجتماعي',
    
    // Match Status
    notStarted: 'لم تبدأ',
    firstHalf: 'الشوط الأول',
    halfTime: 'استراحة',
    secondHalf: 'الشوط الثاني',
    fullTime: 'انتهت',
    extraTime: 'وقت إضافي',
    penalties: 'ركلات ترجيح',
    suspended: 'معلقة',
    cancelled: 'ملغية',
    
    // Actions
    search: 'البحث عن فرق، لاعبين، بطولات...',
    refresh: 'تحديث',
    addToFavorites: 'إضافة للمفضلة',
    removeFromFavorites: 'إزالة من المفضلة',
    viewDetails: 'عرض التفاصيل',
    lineups: 'التشكيلات',
    statistics: 'الإحصائيات',
    timeline: 'الأحداث',
    
    // Time
    today: 'اليوم',
    tomorrow: 'غداً',
    yesterday: 'أمس',
    thisWeek: 'هذا الأسبوع',
    nextWeek: 'الأسبوع القادم',
    
    // Common
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    noMatches: 'لا توجد مباريات',
    tryAgain: 'حاول مرة أخرى',
    settings: 'الإعدادات',
    darkMode: 'الوضع المظلم',
    lightMode: 'الوضع المضيء',
    language: 'اللغة',
    notifications: 'الإشعارات'
  },
  
  es: {
    // Navigation
    live: 'En Vivo',
    calendar: 'Calendario',
    favorites: 'Mi Feed',
    leagues: 'Ligas',
    stats: 'Estadísticas',
    social: 'Social',
    
    // Match Status
    notStarted: 'No Iniciado',
    firstHalf: 'Primer Tiempo',
    halfTime: 'Medio Tiempo',
    secondHalf: 'Segundo Tiempo',
    fullTime: 'Tiempo Completo',
    extraTime: 'Tiempo Extra',
    penalties: 'Penales',
    suspended: 'Suspendido',
    cancelled: 'Cancelado',
    
    // Actions
    search: 'Buscar equipos, jugadores, ligas...',
    refresh: 'Actualizar',
    addToFavorites: 'Añadir a Favoritos',
    removeFromFavorites: 'Quitar de Favoritos',
    viewDetails: 'Ver Detalles',
    lineups: 'Alineaciones',
    statistics: 'Estadísticas',
    timeline: 'Cronología',
    
    // Time
    today: 'Hoy',
    tomorrow: 'Mañana',
    yesterday: 'Ayer',
    thisWeek: 'Esta Semana',
    nextWeek: 'Próxima Semana',
    
    // Common
    loading: 'Cargando...',
    error: 'Ocurrió un error',
    noMatches: 'No se encontraron partidos',
    tryAgain: 'Intentar de nuevo',
    settings: 'Configuración',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro',
    language: 'Idioma',
    notifications: 'Notificaciones'
  }
}
