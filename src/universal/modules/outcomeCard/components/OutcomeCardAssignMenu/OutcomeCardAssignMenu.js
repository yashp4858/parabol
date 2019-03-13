import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {createFragmentContainer} from 'react-relay'
import {css} from 'aphrodite-local-styles/no-important'
import withAtmosphere from 'universal/decorators/withAtmosphere/withAtmosphere'
import UpdateTaskMutation from 'universal/mutations/UpdateTaskMutation'
import appTheme from 'universal/styles/theme/appTheme'
import avatarUser from 'universal/styles/theme/images/avatar-user.svg'
import ui from 'universal/styles/ui'
import withStyles from 'universal/styles/withStyles'
import MenuItemWithShortcuts from 'universal/components/MenuItemWithShortcuts'
import MenuWithShortcuts from 'universal/components/MenuWithShortcuts'
import textOverflow from 'universal/styles/helpers/textOverflow'

class OutcomeCardAssignMenu extends Component {
  state = {
    assignees: []
  }

  componentDidMount () {
    this.setAssignees(this.props)
  }

  componentWillReceiveProps (nextProps) {
    const {
      viewer: {
        team: {teamMembers}
      }
    } = nextProps
    const {
      viewer: {
        team: {teamMembers: oldTeamMembers}
      }
    } = this.props
    if (teamMembers !== oldTeamMembers) {
      this.setAssignees(nextProps)
    }
  }

  setAssignees (props) {
    const {
      viewer: {
        team: {teamMembers}
      },
      task: {
        assignee: {assigneeId}
      }
    } = props
    this.setState({
      assignees: teamMembers.filter((teamMember) => teamMember.id !== assigneeId)
    })
  }

  handleTaskUpdate = (newOwner) => {
    const {
      atmosphere,
      area,
      task: {
        taskId,
        assignee: {assigneeId}
      }
    } = this.props
    if (newOwner === assigneeId) {
      return
    }
    const updatedTask = {
      id: taskId,
      assigneeId: newOwner
    }
    UpdateTaskMutation(atmosphere, updatedTask, area)
  }

  handleMenuItemClick = (assignee) => () => {
    this.handleTaskUpdate(assignee.id)
  }

  render () {
    const {closePortal, styles} = this.props
    const {assignees} = this.state

    return (
      <MenuWithShortcuts ariaLabel={'Assign this task to a teammate'} closePortal={closePortal}>
        <div className={css(styles.label)}>{'Assign to:'}</div>
        {assignees.map((teamMember) => {
          return (
            <MenuItemWithShortcuts
              key={teamMember.id}
              avatar={teamMember.picture || avatarUser}
              label={teamMember.preferredName}
              onClick={this.handleMenuItemClick(teamMember)}
            />
          )
        })}
      </MenuWithShortcuts>
    )
  }
}

OutcomeCardAssignMenu.propTypes = {
  area: PropTypes.string.isRequired,
  atmosphere: PropTypes.object.isRequired,
  closePortal: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
  task: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired
}

const styleThunk = () => ({
  label: {
    ...textOverflow,
    borderBottom: `1px solid ${appTheme.palette.mid30l}`,
    color: ui.palette.dark,
    fontSize: ui.menuItemFontSize,
    fontWeight: 600,
    lineHeight: ui.menuItemHeight,
    marginBottom: ui.menuGutterVertical,
    padding: `0 ${ui.menuGutterHorizontal}`
  }
})

export default createFragmentContainer(
  withAtmosphere(withStyles(styleThunk)(OutcomeCardAssignMenu)),
  graphql`
    fragment OutcomeCardAssignMenu_viewer on User {
      team(teamId: $teamId) {
        teamId: id
        teamMembers(sortBy: "preferredName") {
          id
          picture
          preferredName
        }
      }
    }

    fragment OutcomeCardAssignMenu_task on Task {
      taskId: id
      assignee {
        assigneeId: id
      }
    }
  `
)
