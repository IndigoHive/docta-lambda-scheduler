export type PostMessageTextResult = {
  sent: boolean
  message: {
    id: string
    from_me: boolean
    type: string
    chat_id: string
    timestamp: number
    source: string
    device_id: number
    status: string
    text: {
      body: string
    },
    from: string
  }
}
