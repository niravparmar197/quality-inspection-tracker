export function isOnline() {
  return navigator.onLine
}

export function onNetworkChange(callback: (online: boolean) => void) {
  const goOnline = () => callback(true)
  const goOffline = () => callback(false)

  window.addEventListener('online', goOnline)
  window.addEventListener('offline', goOffline)

  return () => {
    window.removeEventListener('online', goOnline)
    window.removeEventListener('offline', goOffline)
  }
}
