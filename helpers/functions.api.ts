import { applyPolyfills } from './polyfills.js'

import fs from 'node:fs/promises'
import { v4 as uuidv4 } from 'uuid'

import Debug from 'debug'

import type * as recordTypes from '../types/recordTypes'

const debug = Debug('lot-occupancy-system:functions.api')

applyPolyfills()

const apiKeyPath = 'data/apiKeys.json'
let apiKeys: Record<string, string>

async function loadApiKeys(): Promise<void> {
  try {
    const fileData = await fs.readFile(apiKeyPath, 'utf8')
    apiKeys = JSON.parse(fileData)
  } catch (error) {
    debug(error)
    apiKeys = {}
  }
}

async function saveApiKeys(): Promise<void> {
  try {
    await fs.writeFile(apiKeyPath, JSON.stringify(apiKeys), 'utf8')
  } catch (error) {
    debug(error)
  }
}

function generateApiKey(apiKeyPrefix: string): string {
  return `${apiKeyPrefix}-${uuidv4()}-${Date.now().toString()}`
}

export async function regenerateApiKey(userName: string): Promise<void> {
  apiKeys[userName] = generateApiKey(userName)
  await saveApiKeys()
}

export async function getApiKey(userName: string): Promise<string> {
  if (apiKeys === undefined) {
    await loadApiKeys()
  }

  if (!Object.hasOwn(apiKeys, userName)) {
    await regenerateApiKey(userName)
  }

  return apiKeys[userName]
}

export async function getApiKeyFromSession(
  session: recordTypes.PartialSession
): Promise<string> {
  return await getApiKey(session.user!.userName)
}

export async function getUserNameFromApiKey(
  apiKey: string
): Promise<string | undefined> {
  if (apiKeys === undefined) {
    await loadApiKeys()
  }

  for (const [userName, currentApiKey] of Object.entries(apiKeys)) {
    if (apiKey === currentApiKey) {
      return userName
    }
  }
}
