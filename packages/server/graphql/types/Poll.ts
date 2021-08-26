import {GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString} from 'graphql'
import connectionDefinitions from '../connectionDefinitions'
import {GQLContext} from '../graphql'
import GraphQLISO8601Type from './GraphQLISO8601Type'
import PageInfoDateCursor from './PageInfoDateCursor'
import Team from './Team'
import Threadable, {threadableFields} from './Threadable'
import PollOption from './PollOption'
import PollId from '../../../client/shared/gqlIds/PollId'

const Poll = new GraphQLObjectType<any, GQLContext>({
  name: 'Poll',
  description: 'A poll created during the meeting',
  interfaces: () => [Threadable],
  isTypeOf: ({title}) => !!title,
  fields: () => ({
    ...(threadableFields() as any),
    id: {
      type: GraphQLNonNull(GraphQLID),
      description: 'Poll id in a format of `poll:idGeneratedByDatabase`',
      resolve: ({id}) => PollId.create(id)
    },
    meetingId: {
      type: GraphQLNonNull(GraphQLID),
      description: 'the foreign key for the meeting the task was created in'
    },
    teamId: {
      type: GraphQLNonNull(GraphQLID),
      description: 'The id of the team (indexed). Needed for subscribing to archived tasks'
    },
    team: {
      type: GraphQLNonNull(Team),
      description: 'The team this task belongs to',
      resolve: ({teamId}, _args, {dataLoader}) => {
        return dataLoader.get('teams').load(teamId)
      }
    },
    title: {
      type: GraphQLNonNull(GraphQLString),
      description: 'Poll title'
    },
    options: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(PollOption))),
      description: 'A list of the most recent estimates for the task',
      resolve: async ({id: pollId}, _args, {dataLoader}) => {
        return dataLoader.get('pollOptions').load(pollId)
      }
    }
  })
})

const {connectionType, edgeType} = connectionDefinitions({
  name: Poll.name,
  nodeType: Poll,
  edgeFields: () => ({
    cursor: {
      type: GraphQLISO8601Type
    }
  }),
  connectionFields: () => ({
    pageInfo: {
      type: PageInfoDateCursor,
      description: 'Page info with cursors coerced to ISO8601 dates'
    }
  })
})

export const PollConnection = connectionType
export const PollEdge = edgeType
export default Poll
