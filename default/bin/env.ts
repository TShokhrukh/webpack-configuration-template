type TEnvMode = 'none' | 'development' | 'production' | undefined

export function envMode(): TEnvMode {
  return (process.env.NODE_ENV as TEnvMode)
}

export function isDev() {
  return envMode() === 'development'
}