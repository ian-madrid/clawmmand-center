/**
 * App Version Checker
 * Detects when Vercel deploys new version and auto-refreshes
 */

const VERSION_CHECK_INTERVAL = 30000 // Check every 30 seconds

export function getCurrentVersion() {
  // Use build ID or timestamp as version
  return process.env.NEXT_PUBLIC_BUILD_ID || Date.now().toString()
}

export function startVersionWatcher(onNewVersion) {
  let lastVersion = getCurrentVersion()
  
  const checkVersion = async () => {
    try {
      // Fetch version.txt (updated on each deploy)
      const res = await fetch('/version.txt?t=' + Date.now())
      const newVersion = await res.text()
      
      if (newVersion !== lastVersion) {
        console.log('🔄 New version detected:', newVersion)
        onNewVersion(newVersion)
        lastVersion = newVersion
      }
    } catch (err) {
      // Silently fail - version check is optional
    }
  }
  
  // Check immediately, then periodically
  checkVersion()
  const intervalId = setInterval(checkVersion, VERSION_CHECK_INTERVAL)
  
  return () => clearInterval(intervalId)
}
