import {
  Cogfy,
  QueryRecordsCommand,
  QueryRecordsResult,
  UpdateRecordCommand,
  UpdateRecordResult
} from 'cogfy'

class CogfyClient {
  private readonly apiKey: string = process.env.COGFY_API_KEY ?? 'xyz'
  private readonly cogfy: Cogfy = new Cogfy({ apiKey: this.apiKey })

  /**
   *  GET | Gets the query data from a record
   *  @param {string} collectionId - The collection ID in Cogfy
   *  @param {QueryRecordsCommand} query - The query to filter the records
  */
  async queryRecords (
    collectionId: string,
    query: QueryRecordsCommand
  ): Promise<QueryRecordsResult> {
    return await this.cogfy.records.query(collectionId, query)
  }

  /**
   *  PATCH | Updates fields of a record
   *  @param {string} collectionId - The collection ID in Cogfy
   *  @param {string} recordId - The record that will be updated
   *  @param {UpdateRecordCommand} command - The command with the updated field properties
  */
  async updateRecords (
    collectionId: string,
    recordId: string,
    command: UpdateRecordCommand
  ): Promise<UpdateRecordResult> {
    return await this.cogfy.records.update(collectionId, recordId, command)
  }
}

export const cogfy = new CogfyClient()
