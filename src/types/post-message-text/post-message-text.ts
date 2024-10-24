export type PostMessageTextBody = {
  to: string
  body: string
  quoted?: string
  ephemeral?: number
  edit?: string
  typing_time?: number
  no_link_preview?: boolean
  mentions?: string[]
  view_once?: boolean
}
