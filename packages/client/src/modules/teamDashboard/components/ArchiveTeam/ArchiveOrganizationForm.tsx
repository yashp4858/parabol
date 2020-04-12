import useAtmosphere from 'parabol-client/src/hooks/useAtmosphere'
import useForm from 'parabol-client/src/hooks/useForm'
import useMutationProps from 'parabol-client/src/hooks/useMutationProps'
import useRouter from 'parabol-client/src/hooks/useRouter'
import React from 'react'
import FieldLabel from '../../../../components/FieldLabel/FieldLabel'
import BasicInput from '../../../../components/InputField/BasicInput'
import Legitity from '../../../../validation/Legitity'
import graphql from 'babel-plugin-relay/macro'
import {ArchiveOrganizationForm_organization} from 'parabol-client/src/__generated__/ArchiveOrganizationForm_organization.graphql'
import {createFragmentContainer} from 'react-relay'
import ArchiveOrganizationMutation from 'parabol-client/src/mutations/ArchiveOrganizationMutation'

interface Props {
  handleFormBlur: () => any
  organization: ArchiveOrganizationForm_organization
}

const normalize = (str) => str && str.toLowerCase().replace('’', "'")

const ArchiveOrganizationForm = (props: Props) => {
  const atmosphere = useAtmosphere()
  const {onCompleted, onError, submitMutation, submitting} = useMutationProps()
  const {history} = useRouter()
  const {handleFormBlur, organization} = props
  const {id: orgId, name: orgName} = organization
  const {validateField, setDirtyField, onChange, fields} = useForm({
    archivedOrganizationName: {
      getDefault: () => '',
      validate: (rawInput) => {
        return new Legitity(rawInput)
          .normalize(normalize, 'err')
          .test((val) =>
            val === normalize(orgName) ? undefined : 'The organization name entered was incorrect.'
          )
      }
    }
  })
  const {archivedOrganizationName} = fields
  const {value, error, dirty} = archivedOrganizationName

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDirtyField()
    const {archivedOrganizationName: res} = validateField()
    if (submitting || res.error) return
    submitMutation()
    ArchiveOrganizationMutation(atmosphere, {orgId}, {history, onError, onCompleted})
  }

  return (
    <form onSubmit={onSubmit}>
      <FieldLabel
        fieldSize='medium'
        htmlFor='archivedOrganizationName'
        indent
        inline
        label='Enter your organization name and hit Enter to delete it.'
      />
      <BasicInput
        value={value}
        error={dirty ? error : undefined}
        onChange={onChange}
        autoFocus
        onBlur={handleFormBlur}
        name='archivedOrganizationName'
        placeholder='E.g. "My organization"'
      />
    </form>
  )
}

export default createFragmentContainer(ArchiveOrganizationForm, {
  organization: graphql`
    fragment ArchiveOrganizationForm_organization on Organization {
      id
      name
    }
  `
})