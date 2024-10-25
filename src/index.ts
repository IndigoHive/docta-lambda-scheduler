import {
  BooleanRecordProperty,
  QueryRecordsCommand,
  TextRecordProperty
} from 'cogfy'
import { cogfy, whapi } from './clients'
import { PostMessageTextBody } from './types'

exports.handler = async (event: any, _context: any) => {
  const isCboRule = event.resources[0].includes('rule/cbo-clipping-scheduler')

  const collectionId = isCboRule ? process.env.COGFY_CBO_COLLECTION_ID! : process.env.COGFY_SBC_COLLECTION_ID!
  const apiKey = isCboRule ? process.env.COGFY_CBO_API_KEY! : process.env.COGFY_SBC_API_KEY!

  // Obter todos os records e verificar se o status é publicável
  const channelId = isCboRule ? process.env.CBO_CHANNEL_ID! : process.env.SBC_CHANNEL_ID!
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

  const recordsToPublish = (await cogfy.queryRecords(apiKey, collectionId, filter)).data

  recordsToPublish.map(async record => {
    const bodyTextId = isCboRule ? process.env.COGFY_CBO_BODY_FIELD_ID! : process.env.COGFY_SBC_BODY_FIELD_ID!

    const body = (record.properties[bodyTextId] as TextRecordProperty).text.value!

    await postMessage(apiKey, isCboRule, collectionId, record.id, channelId, body)
  })
}

async function postMessage (
  apiKey: string,
  isCboRule: boolean,
  collectionId: string,
  recordId: string,
  channelId: string,
  body: string
): Promise<void> {
  const message: PostMessageTextBody = { to: channelId, body }
  try {
    const response = await whapi.postMessageText(message)

    if (response.sent) {
      const booleanFieldId = isCboRule ? process.env.COGFY_CBO_BOOLEAN_FIELD_ID! : process.env.COGFY_SBC_BOOLEAN_FIELD_ID!

      const properties = {
        [booleanFieldId]: {
          type: 'boolean',
          boolean: {
            value: true
          }
        }
      } as unknown as Record<string, BooleanRecordProperty>

      await cogfy.updateRecords(apiKey, collectionId, recordId, { properties })
    }
  } catch (err) {
    throw new Error(err)
  }
}
