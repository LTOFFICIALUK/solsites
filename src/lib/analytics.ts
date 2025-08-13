import { supabase } from './supabase'

export interface PageView {
  id: string
  project_id: string
  visitor_id: string
  session_id: string
  page_url: string
  referrer?: string
  user_agent?: string
  ip_address?: string
  country?: string
  city?: string
  device_type?: string
  browser?: string
  os?: string
  screen_resolution?: string
  language?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  created_at: string
}

export interface Session {
  id: string
  project_id: string
  visitor_id: string
  session_id: string
  started_at: string
  ended_at?: string
  duration_seconds?: number
  page_views_count: number
  is_bounce: boolean
  referrer?: string
  entry_page?: string
  exit_page?: string
  device_type?: string
  browser?: string
  os?: string
  country?: string
  city?: string
}

export interface UniqueVisitor {
  id: string
  project_id: string
  visitor_id: string
  first_visit_at: string
  last_visit_at: string
  total_visits: number
  total_page_views: number
  total_session_duration: number
  country?: string
  city?: string
  device_type?: string
  browser?: string
  os?: string
}

export interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  totalSessions: number
  averageSessionDuration: number
  bounceRate: number
  topPages: Array<{ page: string; views: number }>
  topReferrers: Array<{ referrer: string; visits: number }>
  deviceBreakdown: Array<{ device: string; percentage: number }>
  browserBreakdown: Array<{ browser: string; percentage: number }>
  countryBreakdown: Array<{ country: string; visits: number }>
  dailyViews: Array<{ date: string; views: number }>
}

// Generate a unique visitor ID
export const generateVisitorId = (): string => {
  if (typeof window !== 'undefined') {
    let visitorId = localStorage.getItem('sol_sites_visitor_id')
    if (!visitorId) {
      visitorId = 'visitor_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
      localStorage.setItem('sol_sites_visitor_id', visitorId)
    }
    return visitorId
  }
  return 'visitor_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
}

// Generate a session ID
export const generateSessionId = (): string => {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
}

// Get device information
export const getDeviceInfo = () => {
  if (typeof window === 'undefined') return {}

  const userAgent = navigator.userAgent
  const screen = window.screen

  // Device type detection
  let deviceType = 'desktop'
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    deviceType = 'mobile'
    if (/iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent)) {
      deviceType = 'tablet'
    }
  }

  // Browser detection
  let browser = 'Unknown'
  if (userAgent.includes('Chrome')) browser = 'Chrome'
  else if (userAgent.includes('Firefox')) browser = 'Firefox'
  else if (userAgent.includes('Safari')) browser = 'Safari'
  else if (userAgent.includes('Edge')) browser = 'Edge'

  // OS detection
  let os = 'Unknown'
  if (userAgent.includes('Windows')) os = 'Windows'
  else if (userAgent.includes('Mac')) os = 'macOS'
  else if (userAgent.includes('Linux')) os = 'Linux'
  else if (userAgent.includes('Android')) os = 'Android'
  else if (userAgent.includes('iOS')) os = 'iOS'

  return {
    device_type: deviceType,
    browser,
    os,
    screen_resolution: `${screen.width}x${screen.height}`,
    language: navigator.language
  }
}

// Get UTM parameters from URL
export const getUTMParams = () => {
  if (typeof window === 'undefined') return {}
  
  const urlParams = new URLSearchParams(window.location.search)
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined
  }
}

// Track a page view
export const trackPageView = async (projectId: string, pageUrl: string) => {
  try {
    const visitorId = generateVisitorId()
    const sessionId = generateSessionId()
    const deviceInfo = getDeviceInfo()
    const utmParams = getUTMParams()

    // Get or create session
  const session = await getOrCreateSession(projectId, visitorId, sessionId, pageUrl)

    // Record page view
    const { data: pageView, error: pageViewError } = await supabase
      .from('page_views')
      .insert({
        project_id: projectId,
        visitor_id: visitorId,
        session_id: sessionId,
        page_url: pageUrl,
        referrer: document.referrer || undefined,
        user_agent: navigator.userAgent,
        ...deviceInfo,
        ...utmParams
      })
      .select()
      .single()

    if (pageViewError) throw pageViewError

    // Update unique visitor
    await updateUniqueVisitor(projectId, visitorId, deviceInfo)

    // Update session page count
    await updateSessionPageCount(sessionId)

    return pageView
  } catch (error) {
    console.error('Error tracking page view:', error)
    // Don't throw error to avoid breaking user experience
  }
}

// Get or create a session
const getOrCreateSession = async (projectId: string, visitorId: string, sessionId: string, entryPage: string) => {
  const { data: existingSession } = await supabase
    .from('sessions')
    .select()
    .eq('session_id', sessionId)
    .single()

  if (existingSession) {
    return existingSession
  }

  const { data: session, error } = await supabase
    .from('sessions')
    .insert({
      project_id: projectId,
      visitor_id: visitorId,
      session_id: sessionId,
      entry_page: entryPage,
      referrer: document.referrer || undefined,
      ...getDeviceInfo()
    })
    .select()
    .single()

  if (error) throw error
  return session
}

// Update unique visitor record
const updateUniqueVisitor = async (projectId: string, visitorId: string, deviceInfo: Record<string, unknown>) => {
  const { data: existingVisitor } = await supabase
    .from('unique_visitors')
    .select()
    .eq('project_id', projectId)
    .eq('visitor_id', visitorId)
    .single()

  if (existingVisitor) {
    // Update existing visitor
    await supabase
      .from('unique_visitors')
      .update({
        last_visit_at: new Date().toISOString(),
        total_visits: existingVisitor.total_visits + 1,
        total_page_views: existingVisitor.total_page_views + 1
      })
      .eq('id', existingVisitor.id)
  } else {
    // Create new visitor
    await supabase
      .from('unique_visitors')
      .insert({
        project_id: projectId,
        visitor_id: visitorId,
        ...deviceInfo
      })
  }
}

// Update session page count
const updateSessionPageCount = async (sessionId: string) => {
  await supabase
    .from('sessions')
    .update({
      page_views_count: supabase.rpc('increment', { row_id: 'id', table_name: 'sessions', column_name: 'page_views_count' })
    })
    .eq('session_id', sessionId)
}

// End a session
export const endSession = async (sessionId: string) => {
  try {
    const { data: session } = await supabase
      .from('sessions')
      .select('started_at, page_views_count')
      .eq('session_id', sessionId)
      .single()

    if (session) {
      const duration = Math.floor((Date.now() - new Date(session.started_at).getTime()) / 1000)
      
      await supabase
        .from('sessions')
        .update({
          ended_at: new Date().toISOString(),
          duration_seconds: duration,
          is_bounce: session.page_views_count <= 1
        })
        .eq('session_id', sessionId)
    }
  } catch (error) {
    console.error('Error ending session:', error)
  }
}

// Analytics service
export const analyticsService = {
  // Get analytics data for a project
  async getProjectAnalytics(projectId: string, days: number = 30): Promise<AnalyticsData> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    try {
      // Get basic metrics
      const [pageViews, uniqueVisitors, sessions] = await Promise.all([
        this.getPageViews(projectId, startDate),
        this.getUniqueVisitors(projectId, startDate),
        this.getSessions(projectId, startDate)
      ])

      // Calculate derived metrics
      const totalViews = pageViews.length
      const uniqueVisitorsCount = uniqueVisitors.length
      const totalSessions = sessions.length
      
      const averageSessionDuration = sessions.length > 0 
        ? sessions.reduce((sum, session) => sum + (session.duration_seconds || 0), 0) / sessions.length
        : 0

      const bounceRate = sessions.length > 0
        ? (sessions.filter(s => s.is_bounce).length / sessions.length) * 100
        : 0

      // Get breakdowns
      const [topPages, topReferrers, deviceBreakdown, browserBreakdown, countryBreakdown, dailyViews] = await Promise.all([
        this.getTopPages(projectId, startDate),
        this.getTopReferrers(projectId, startDate),
        this.getDeviceBreakdown(projectId, startDate),
        this.getBrowserBreakdown(projectId, startDate),
        this.getCountryBreakdown(projectId, startDate),
        this.getDailyViews(projectId, startDate)
      ])

      return {
        totalViews,
        uniqueVisitors: uniqueVisitorsCount,
        totalSessions,
        averageSessionDuration,
        bounceRate,
        topPages,
        topReferrers,
        deviceBreakdown,
        browserBreakdown,
        countryBreakdown,
        dailyViews
      }
    } catch (error) {
      console.error('Error getting analytics:', error)
      throw error
    }
  },

  // Get page views
  async getPageViews(projectId: string, startDate: Date): Promise<PageView[]> {
    const { data, error } = await supabase
      .from('page_views')
      .select('*')
      .eq('project_id', projectId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get unique visitors
  async getUniqueVisitors(projectId: string, startDate: Date): Promise<UniqueVisitor[]> {
    const { data, error } = await supabase
      .from('unique_visitors')
      .select('*')
      .eq('project_id', projectId)
      .gte('first_visit_at', startDate.toISOString())
      .order('first_visit_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get sessions
  async getSessions(projectId: string, startDate: Date): Promise<Session[]> {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('project_id', projectId)
      .gte('started_at', startDate.toISOString())
      .order('started_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get top pages
  async getTopPages(projectId: string, startDate: Date) {
    const { data, error } = await supabase
      .from('page_views')
      .select('page_url, count')
      .eq('project_id', projectId)
      .gte('created_at', startDate.toISOString())
      .select('page_url')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Group by page_url and count
    const pageCounts: { [key: string]: number } = {}
    data?.forEach(view => {
      pageCounts[view.page_url] = (pageCounts[view.page_url] || 0) + 1
    })

    return Object.entries(pageCounts)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)
  },

  // Get top referrers
  async getTopReferrers(projectId: string, startDate: Date) {
    const { data, error } = await supabase
      .from('page_views')
      .select('referrer')
      .eq('project_id', projectId)
      .gte('created_at', startDate.toISOString())
      .not('referrer', 'is', null)

    if (error) throw error

    const referrerCounts: { [key: string]: number } = {}
    data?.forEach(view => {
      if (view.referrer) {
        referrerCounts[view.referrer] = (referrerCounts[view.referrer] || 0) + 1
      }
    })

    return Object.entries(referrerCounts)
      .map(([referrer, visits]) => ({ referrer, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10)
  },

  // Get device breakdown
  async getDeviceBreakdown(projectId: string, startDate: Date) {
    const { data, error } = await supabase
      .from('page_views')
      .select('device_type')
      .eq('project_id', projectId)
      .gte('created_at', startDate.toISOString())
      .not('device_type', 'is', null)

    if (error) throw error

    const deviceCounts: { [key: string]: number } = {}
    const total = data?.length || 0

    data?.forEach(view => {
      if (view.device_type) {
        deviceCounts[view.device_type] = (deviceCounts[view.device_type] || 0) + 1
      }
    })

    return Object.entries(deviceCounts)
      .map(([device, count]) => ({ 
        device, 
        percentage: total > 0 ? Math.round((count / total) * 100) : 0 
      }))
      .sort((a, b) => b.percentage - a.percentage)
  },

  // Get browser breakdown
  async getBrowserBreakdown(projectId: string, startDate: Date) {
    const { data, error } = await supabase
      .from('page_views')
      .select('browser')
      .eq('project_id', projectId)
      .gte('created_at', startDate.toISOString())
      .not('browser', 'is', null)

    if (error) throw error

    const browserCounts: { [key: string]: number } = {}
    const total = data?.length || 0

    data?.forEach(view => {
      if (view.browser) {
        browserCounts[view.browser] = (browserCounts[view.browser] || 0) + 1
      }
    })

    return Object.entries(browserCounts)
      .map(([browser, count]) => ({ 
        browser, 
        percentage: total > 0 ? Math.round((count / total) * 100) : 0 
      }))
      .sort((a, b) => b.percentage - a.percentage)
  },

  // Get country breakdown
  async getCountryBreakdown(projectId: string, startDate: Date) {
    const { data, error } = await supabase
      .from('page_views')
      .select('country')
      .eq('project_id', projectId)
      .gte('created_at', startDate.toISOString())
      .not('country', 'is', null)

    if (error) throw error

    const countryCounts: { [key: string]: number } = {}
    data?.forEach(view => {
      if (view.country) {
        countryCounts[view.country] = (countryCounts[view.country] || 0) + 1
      }
    })

    return Object.entries(countryCounts)
      .map(([country, visits]) => ({ country, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10)
  },

  // Get daily views
  async getDailyViews(projectId: string, startDate: Date) {
    const { data, error } = await supabase
      .from('page_views')
      .select('created_at')
      .eq('project_id', projectId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    if (error) throw error

    const dailyCounts: { [key: string]: number } = {}
    data?.forEach(view => {
      const date = new Date(view.created_at).toISOString().split('T')[0]
      dailyCounts[date] = (dailyCounts[date] || 0) + 1
    })

    return Object.entries(dailyCounts)
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }
}
