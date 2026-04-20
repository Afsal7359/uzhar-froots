import CrudPage from '../components/CrudPage'

const COLUMNS = [
  { key: 'step_number', label: 'Step' },
  { key: 'icon',        label: 'Icon' },
  { key: 'title',       label: 'Title' },
  { key: 'description', label: 'Description', render: v => (v?.length > 70 ? v.slice(0, 70) + '…' : v) },
]

const FIELDS = [
  { key: 'step_number', label: 'Step Number',  type: 'number', required: true },
  { key: 'icon',        label: 'Icon (emoji)', hint: 'e.g. 🌳 🔪 🧊' },
  { key: 'title',       label: 'Title',        required: true },
  { key: 'description', label: 'Description',  type: 'textarea', required: true },
  { key: 'sort_order',  label: 'Sort Order',   type: 'number' },
]

export default function ProcessSteps() {
  return (
    <CrudPage
      sheet="process_steps"
      title="Process Steps"
      description='Manage the "From Fruit to Powder" timeline steps'
      orderCol="step_number"
      columns={COLUMNS}
      fields={FIELDS}
      hasActive={false}
      defaultValues={{ step_number: 1, sort_order: 0 }}
    />
  )
}
