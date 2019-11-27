import TeamInvitation from '../../../database/types/TeamInvitation'
import getRethink from '../../../database/rethinkDriver'
import {InvitationTokenError} from 'parabol-client/types/constEnums'

const handleTeamInviteToken = async (
  invitationToken: string,
  viewerId: string,
  tms: string[],
  notificationId?: string
) => {
  const r = await getRethink()
  const invitation = (await r
    .table('TeamInvitation')
    .getAll(invitationToken, {index: 'token'})
    .nth(0)
    .default(null)
    .run()) as TeamInvitation
  if (!invitation) return {error: InvitationTokenError.NOT_FOUND}
  const {expiresAt} = invitation
  if (expiresAt.getTime() < Date.now()) {
    // using the notification has no expiry
    const notification = notificationId
      ? await r
          .table('Notification')
          .get(notificationId)
          .run()
      : undefined
    if (!notification || notification.userIds[0] !== viewerId) {
      return {error: InvitationTokenError.EXPIRED}
    }
  }
  const {acceptedAt, teamId} = invitation
  if (acceptedAt || tms?.includes(teamId)) {
    return {error: InvitationTokenError.ALREADY_ACCEPTED}
  }
  return {invitation}
}

export default handleTeamInviteToken
