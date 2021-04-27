import {gql} from '../getGQLInputStr'

export const getIssues = gql`
  query getIssues($first: Int) {
    viewer {
      issues(first: $first) {
        edges {
          cursor
          node {
            ...getIssuesNode
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
        }
        totalCount
      }
    }
  }
  fragment getIssuesNode on Issue {
    __typename
    id
    title
    url
    repository {
      nameWithOwner
    }
  }
`
