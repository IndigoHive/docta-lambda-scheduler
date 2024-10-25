import {
  BooleanRecordProperty,
  Cogfy,
  JsonRecordProperty,
  QueryRecordsCommand,
  TextRecordProperty
} from 'cogfy'
import { PostMessageTextBody } from './types'

exports.handler = async (event: any, _context: any) => {
  const isCboRule = event.resources[0].includes('rule/cbo-clipping-scheduler')

  const cogfy = new Cogfy({
    apiKey: isCboRule ? process.env.COGFY_CBO_API_KEY! : process.env.COGFY_SBC_API_KEY!
  })

  // Obter todos os records e verificar se o status é publicável
  const channelId = isCboRule ? process.env.CBO_CHANNEL_ID! : process.env.SBC_CHANNEL_ID!
  const collectionId = isCboRule ? process.env.COGFY_CBO_COLLECTION_ID! : process.env.COGFY_SBC_COLLECTION_ID!
  const selectionFieldId = isCboRule ? process.env.COGFY_CBO_SELECTION_FIELD_ID! : process.env.COGFY_SBC_SELECTION_FIELD_ID!
  const optionSelectedId = isCboRule ? process.env.COGFY_CBO_OPTION_SELECTED_ID! : process.env.COGFY_SBC_OPTION_SELECTED_ID!

  const filter: QueryRecordsCommand = {
    filter: {
      type: 'and',
      and: {
        filters: [{
          type: 'equals',
          equals: {
            fieldId: selectionFieldId,
            value: [optionSelectedId]
          }
        }]
      }
    }
  }

  const recordsToPublish = (await cogfy.records.query(collectionId, filter)).data

  recordsToPublish.map(async record => {
    const bodyFieldId = isCboRule ? process.env.COGFY_CBO_BODY_FIELD_ID! : process.env.COGFY_SBC_BODY_FIELD_ID!
    const body = (record.properties[bodyFieldId] as TextRecordProperty).text.value!

    const message: PostMessageTextBody = { to: channelId, body }
    const jsonFieldId = isCboRule ? process.env.COGFY_CBO_JSON_FIELD_ID! : process.env.COGFY_SBC_JSON_FIELD_ID!

    const jsonProperties = {
      [jsonFieldId]: {
        type: 'json',
        json: {
          value: JSON.stringify(message)
        }
      }
    } as unknown as Record<string, JsonRecordProperty>

    await cogfy.records.update(collectionId, record.id, { properties: jsonProperties })

    const booleanFieldId = isCboRule ? process.env.COGFY_CBO_BOOLEAN_FIELD_ID! : process.env.COGFY_SBC_BOOLEAN_FIELD_ID!

    const booleanProperties = {
      [booleanFieldId]: {
        type: 'boolean',
        boolean: {
          value: true
        }
      }
    } as unknown as Record<string, BooleanRecordProperty>

    await cogfy.records.update(collectionId, record.id, { properties: booleanProperties })
  })
}
