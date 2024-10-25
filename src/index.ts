import {
  BooleanRecordProperty,
  QueryRecordsCommand,
  TextRecordProperty
} from 'cogfy'
import { cogfy, whapi } from './clients'
import { PostMessageTextBody } from './types'

const collectionId = process.env.COGFY_COLLECTION_ID ?? 'xyz'

exports.handler = async (event: any, _context: any) => {
  const isCboRule = event.resources[0].inclues('rule/cbo-clipping-scheduler')

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

  const recordsToPublish = (await cogfy.queryRecords(collectionId, filter)).data

  recordsToPublish.map(async record => {
    const bodyTextId = isCboRule ? process.env.COGFY_CBO_BODY_FIELD_ID! : process.env.COGFY_SBC_BODY_FIELD_ID!

    const body = (record.properties[bodyTextId] as TextRecordProperty).text.value!

    await postMessage(isCboRule, record.id, channelId, body)
  })
}

async function postMessage (
  isCboRule: boolean,
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

      await cogfy.updateRecords(collectionId, recordId, { properties })
    }
  } catch (err) {
    throw new Error(err)
  }
}
