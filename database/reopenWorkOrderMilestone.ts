import { acquireConnection } from './pool.js'

export async function reopenWorkOrderMilestone(
  workOrderMilestoneId: number | string,
  user: User
): Promise<boolean> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `update WorkOrderMilestones
        set workOrderMilestoneCompletionDate = null,
        workOrderMilestoneCompletionTime = null,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where workOrderMilestoneId = ?
        and workOrderMilestoneCompletionDate is not null`
    )
    .run(user.userName, Date.now(), workOrderMilestoneId)

  database.release()

  return result.changes > 0
}

export default reopenWorkOrderMilestone
