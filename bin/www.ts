import cluster, { type Worker } from 'node:cluster'
import os from 'node:os'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import ntfyPublish, { type NtfyMessageOptions } from '@cityssm/ntfy-publish'
import Debug from 'debug'
import exitHook from 'exit-hook'

import * as configFunctions from '../helpers/functions.config.js'
import type { WorkerMessage } from '../types/applicationTypes.js'

const debug = Debug(`lot-occupancy-system:www:${process.pid}`)

const directoryName = dirname(fileURLToPath(import.meta.url))

const processCount = Math.min(
  configFunctions.getProperty('application.maximumProcesses'),
  os.cpus().length
)

process.title = `${configFunctions.getProperty(
  'application.applicationName'
)} (Primary)`

debug(`Primary pid:   ${process.pid}`)
debug(`Primary title: ${process.title}`)
debug(`Launching ${processCount} processes`)

const clusterSettings = {
  exec: `${directoryName}/wwwProcess.js`
}

cluster.setupPrimary(clusterSettings)

const activeWorkers = new Map<number, Worker>()

for (let index = 0; index < processCount; index += 1) {
  const worker = cluster.fork()
  activeWorkers.set(worker.process.pid!, worker)
}

cluster.on('message', (worker, message: WorkerMessage) => {
  for (const [pid, activeWorker] of activeWorkers.entries()) {
    if (activeWorker === undefined || pid === message.pid) {
      continue
    }

    debug(`Relaying message to worker: ${pid}`)
    worker.send(message)
  }
})

cluster.on('exit', (worker, code, signal) => {
  debug(`Worker ${worker.process.pid!.toString()} has been killed`)
  activeWorkers.delete(worker.process.pid!)

  debug('Starting another worker')
  cluster.fork()
})

const ntfyStartupConfig = configFunctions.getProperty('application.ntfyStartup')

if (ntfyStartupConfig !== undefined) {
  const topic = ntfyStartupConfig.topic
  const server = ntfyStartupConfig.server

  const ntfyStartupMessage: NtfyMessageOptions = {
    topic,
    title: configFunctions.getProperty('application.applicationName'),
    message: 'Application Started',
    tags: ['arrow_up']
  }

  const ntfyShutdownMessage: NtfyMessageOptions = {
    topic,
    title: configFunctions.getProperty('application.applicationName'),
    message: 'Application Shut Down',
    tags: ['arrow_down']
  }

  if (server !== undefined) {
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

    // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
    process.exit(0)
  }, 10_000)
}
