import {ExecutionResult} from 'graphql'
import {ServerChannel} from 'parabol-client/types/constEnums'
import type {GQLRequest} from '../types/custom'
import SocketServerChannelId from '../../client/shared/gqlIds/SocketServerChannelId'
import PubSubPromise from './PubSubPromise'

let pubsub: PubSubPromise<GQLRequest & {executorServerId?: string}, ExecutionResult>
const getGraphQLExecutor = () => {
  if (!pubsub) {
    pubsub = new PubSubPromise(
      ServerChannel.GQL_EXECUTOR_STREAM,
      SocketServerChannelId.join(process.env.SERVER_ID!)
    )
  }
  return pubsub
}
export default getGraphQLExecutor
