import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import React, {useCallback, useRef} from 'react'
import {createFragmentContainer} from 'react-relay'
import useAllIntegrations from '~/hooks/useAllIntegrations'
import useAtmosphere from '~/hooks/useAtmosphere'
import useFilteredItems from '~/hooks/useFilteredItems'
import useForm from '~/hooks/useForm'
import {MenuProps} from '~/hooks/useMenu'
import {PALETTE} from '~/styles/paletteV3'
import {ICON_SIZE} from '~/styles/typographyV2'
import {NewJiraIssueMenu_repoIntegrations} from '~/__generated__/NewJiraIssueMenu_repoIntegrations.graphql'
import Icon from './Icon'
import Menu from './Menu'
import MenuItemComponentAvatar from './MenuItemComponentAvatar'
import MenuItemLabel from './MenuItemLabel'
import RepoIntegrationJiraMenuItem from './RepoIntegrationJiraMenuItem'

const NoResults = styled(MenuItemLabel)({
  color: PALETTE.SLATE_600,
  justifyContent: 'center',
  paddingLeft: 8,
  paddingRight: 8,
  fontStyle: 'italic'
})

const SearchItem = styled(MenuItemLabel)({
  margin: '0 8px 8px',
  overflow: 'visible',
  padding: 0,
  position: 'relative'
})

const StyledMenuItemIcon = styled(MenuItemComponentAvatar)({
  position: 'absolute',
  left: 8,
  margin: 0,
  pointerEvents: 'none',
  top: 4
})

const SearchIcon = styled(Icon)({
  color: PALETTE.SLATE_600,
  fontSize: ICON_SIZE.MD18
})

const Input = styled('input')({
  appearance: 'none',
  background: 'inherit',
  border: `1px solid ${PALETTE.SLATE_400}`,
  borderRadius: 2,
  display: 'block',
  fontSize: 14,
  lineHeight: '24px',
  outline: 'none',
  padding: '3px 0 3px 39px',
  width: '100%',
  '&:focus, &:active': {
    border: `1px solid ${PALETTE.SKY_500}`,
    boxShadow: `0 0 1px 1px ${PALETTE.SKY_300}`
  }
})

interface Props {
  handleSelectProjectKey: (key: string) => void
  menuProps: MenuProps
  repoIntegrations: NewJiraIssueMenu_repoIntegrations
  teamId: string
  userId: string
}

const getValue = (item: {name?: string; nameWithOwner?: string}) => {
  const repoName = item.name ?? item.nameWithOwner ?? 'Unknown Project'
  return repoName.toLowerCase()
}

const NewJiraIssueMenu = (props: Props) => {
  const {handleSelectProjectKey, menuProps, repoIntegrations, teamId, userId} = props
  const {hasMore, items} = repoIntegrations
  const {fields, onChange} = useForm({
    search: {
      getDefault: () => ''
    }
  })
  const atmosphere = useAtmosphere()
  const {search} = fields
  const {value} = search
  const query = value.toLowerCase()
  const filteredIntegrations = useFilteredItems(query, items!, getValue)
  const {allItems, status} = useAllIntegrations(
    atmosphere,
    query,
    filteredIntegrations,
    !!hasMore,
    teamId,
    userId
  )

  const ref = useRef<HTMLInputElement>(null)
  const onBlur = useCallback(() => {
    ref.current && ref.current.focus()
  }, [])

  return (
    <Menu
      ariaLabel='Select Jira project'
      keepParentFocus
      {...menuProps}
      resetActiveOnChanges={[allItems]}
    >
      <SearchItem>
        <StyledMenuItemIcon>
          <SearchIcon>search</SearchIcon>
        </StyledMenuItemIcon>
        <Input
          autoFocus
          autoComplete='off'
          name='search'
          onBlur={onBlur}
          onChange={onChange}
          placeholder='Search Jira'
          ref={ref}
          type='text'
        />
      </SearchItem>
      {(query && allItems.length === 0 && status !== 'loading' && (
        <NoResults key='no-results'>No integrations found!</NoResults>
      )) ||
        null}

      {allItems.slice(0, 10).map((repoIntegration) => {
        const {id, __typename} = repoIntegration
        if (__typename === 'JiraRemoteProject') {
          const {key} = repoIntegration
          const onClick = () => {
            handleSelectProjectKey(key)
          }
          return (
            <RepoIntegrationJiraMenuItem
              key={id}
              query={query}
              repoIntegration={repoIntegration}
              onClick={onClick}
            />
          )
        }
        return null
      })}
    </Menu>
  )
}

export default createFragmentContainer(NewJiraIssueMenu, {
  repoIntegrations: graphql`
    fragment NewJiraIssueMenu_repoIntegrations on RepoIntegrationQueryPayload {
      hasMore
      items {
        ... on JiraRemoteProject {
          __typename
          id
          name
          key
        }
        ...RepoIntegrationJiraMenuItem_repoIntegration
      }
    }
  `
})
