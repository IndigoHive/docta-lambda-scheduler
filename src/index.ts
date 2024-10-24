import {
  AsyncTask,
  CronJob,
  ToadScheduler
} from 'toad-scheduler'
import {
  BooleanRecordProperty,
  QueryRecordsCommand,
  TextRecordProperty
} from 'cogfy'
import { cogfy, whapi } from './clients'
import { PostMessageTextBody } from './types'

const collectionId = process.env.COGFY_COLLECTION_ID ?? 'xyz'

;(async function scheduleMessage () {
  // Obter todos os records e verificar se o status é publicável
  const selectionFieldId = ''
  const optionSelectedId = '' // Selection Field Option

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

  recordsToPublish.map(record => {
    const cronFieldId = '' // Cron schedule property
    const channelFieldId = ''
    const textFieldId = ''

    const cronExpression = (record.properties[cronFieldId] as TextRecordProperty).text.value!
    const channel = (record.properties[channelFieldId] as TextRecordProperty).text.value!
    const body = (record.properties[textFieldId] as TextRecordProperty).text.value!

    // Agendar a postagem utilizando cron
    const scheduler = new ToadScheduler()

    const task = new AsyncTask('send message using Whapi', async () =>
      await postMessage(
      record.id, channel, body
    ))
    const job = new CronJob({ cronExpression }, task, { preventOverrun: true })

    scheduler.addCronJob(job)
  })
})()

async function postMessage (
  recordId: string,
  channelId: string,
  body: string
): Promise<void> {
  const message: PostMessageTextBody = { to: channelId, body }
  try {
    const response = await whapi.postMessageText(message)

    if (response.sent) {
      const booleanFieldId = ''

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
