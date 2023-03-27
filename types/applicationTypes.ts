export interface WorkerMessage {
  messageType: 'clearCache'
  tableName: string
  timeMillis: number
  pid: number
}
