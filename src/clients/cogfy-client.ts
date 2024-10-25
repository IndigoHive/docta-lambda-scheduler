import {
  Cogfy,
  QueryRecordsCommand,
  QueryRecordsResult,
  UpdateRecordCommand,
  UpdateRecordResult
} from 'cogfy'

class CogfyClient {
  /**
   *  GET | Gets the query data from a record
   *  @param {string} collectionId - The collection ID in Cogfy
   *  @param {QueryRecordsCommand} query - The query to filter the records
  */
  async queryRecords (
    apiKey: string,
    collectionId: string,
    query: QueryRecordsCommand
  ): Promise<QueryRecordsResult> {
    const cogfy = new Cogfy({ apiKey })
    return await cogfy.records.query(collectionId, query)
  }

  /**
   *  PATCH | Updates fields of a record
   *  @param {string} collectionId - The collection ID in Cogfy
   *  @param {string} recordId - The record that will be updated
   *  @param {UpdateRecordCommand} command - The command with the updated field properties
  */
  async updateRecords (
    apiKey: string,
    collectionId: string,
    recordId: string,
    command: UpdateRecordCommand
  ): Promise<UpdateRecordResult> {
    const cogfy = new Cogfy({ apiKey })
    return await cogfy.records.update(collectionId, recordId, command)
  }
}

export const cogfy = new CogfyClient()
