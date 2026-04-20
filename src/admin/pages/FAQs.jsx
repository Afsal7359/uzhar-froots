import CrudPage from '../components/CrudPage'

const COLUMNS = [
  { key: 'question',   label: 'Question' },
  { key: 'answer',     label: 'Answer', render: v => (v?.length > 80 ? v.slice(0, 80) + '…' : v) },
  { key: 'sort_order', label: 'Order' },
]

const FIELDS = [
  { key: 'question',   label: 'Question',   required: true },
  { key: 'answer',     label: 'Answer',     type: 'textarea', required: true },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
]

export default function FAQs() {
  return (
    <CrudPage
      sheet="faqs"
      title="FAQs"
      description='Manage the "Curious to know more?" section'
      columns={COLUMNS}
      fields={FIELDS}
      defaultValues={{ sort_order: 0, is_active: 'TRUE' }}
    />
  )
}
