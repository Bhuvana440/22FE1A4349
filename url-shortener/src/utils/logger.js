export function logEvent(event) {
  console.info(`[LOG] ${new Date().toISOString()} - ${event}`);
}
