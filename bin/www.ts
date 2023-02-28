import cluster from 'node:cluster'
import os from 'node:os'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import * as configFunctions from '../helpers/functions.config.js'
import '../helpers/polyfills.js'

import exitHook from 'exit-hook'

import ntfyPublish from '@cityssm/ntfy-publish'
import type * as ntfyTypes from '@cityssm/ntfy-publish/types'

import Debug from 'debug'
const debug = Debug('lot-occupancy-system:www')

const directoryName = dirname(fileURLToPath(import.meta.url))

const processCount = Math.min(
  configFunctions.getProperty('application.maximumProcesses'),
  os.cpus().length
)

debug(`Primary pid: ${process.pid}`)
debug(`Launching ${processCount} processes`)

cluster.setupPrimary({
  exec: directoryName + '/wwwProcess.js'
})

for (let index = 0; index < processCount; index += 1) {
  cluster.fork()
}

cluster.on('exit', (worker, code, signal) => {
  debug(`Worker ${worker.process.pid!.toString()} has been killed`)
  debug('Starting another worker')
  cluster.fork()
})

const ntfyStartupConfig = configFunctions.getProperty('application.ntfyStartup')

if (ntfyStartupConfig) {
  const topic = ntfyStartupConfig.topic
  const server = ntfyStartupConfig.server

  const ntfyStartupMessage: ntfyTypes.NtfyMessageOptions = {
    topic,
    title: configFunctions.getProperty('application.applicationName'),
    message: 'Application Started',
    tags: ['arrow_up']
  }

  const ntfyShutdownMessage: ntfyTypes.NtfyMessageOptions = {
    topic,
    title: configFunctions.getProperty('application.applicationName'),
    message: 'Application Shut Down',
    tags: ['arrow_down']
  }

  if (server) {
    ntfyStartupMessage.server = server
    ntfyShutdownMessage.server = server
  }

  await ntfyPublish(ntfyStartupMessage)

  exitHook(() => {
    debug('Sending ntfy notification')
    void ntfyPublish(ntfyShutdownMessage)
  })
}

if (process.env.STARTUP_TEST === 'true') {
  const killSeconds = 10

  debug(`Killing processes in ${killSeconds} seconds...`)

  setTimeout(() => {
    debug('Killing processes')

    // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
    process.exit(0)
  }, 10_000)
}
