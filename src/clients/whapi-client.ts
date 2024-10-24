import { PostMessageTextBody, PostMessageTextResult } from '../types'

class WhapiClient {
  private readonly baseUrl: string = 'https://gate.whapi.cloud'
  private readonly apiKey: string = process.env.WHAPI_API_KEY ?? 'xyz'

  /**
   *  POST | Send text message
   *  @param {PostMessageTextBody} message - An object for sending message request
  */
  async postMessageText (
    message: PostMessageTextBody
  ): Promise<PostMessageTextResult> {
    const response = await fetch(
      `${this.baseUrl}/messages/text`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      }
    )

    return response.json()
  }
}

export const whapi = new WhapiClient()
