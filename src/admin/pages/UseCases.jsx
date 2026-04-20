import CrudPage from '../components/CrudPage'

const COLUMNS = [
  { key: 'icon',        label: 'Icon' },
  { key: 'title',       label: 'Title' },
  { key: 'description', label: 'Description', render: v => (v?.length > 70 ? v.slice(0, 70) + '…' : v) },
  { key: 'sort_order',  label: 'Order' },
]

const FIELDS = [
  { key: 'icon',        label: 'Icon (emoji)',  hint: 'e.g. 🥤 🥛 🎂' },
  { key: 'title',       label: 'Title',         required: true },
  { key: 'description', label: 'Description',   type: 'textarea', required: true },
  { key: 'bg_color',    label: 'BG Color',      hint: 'e.g. #f0fdf4' },
  { key: 'tip',         label: 'Tip Text',      hint: 'e.g. → Try: Mango + Chilled Water + Mint' },
  { key: 'sort_order',  label: 'Sort Order',    type: 'number' },
]

export default function UseCases() {
  return (
    <CrudPage
      sheet="use_cases"
      title="Use Cases"
      description='Manage the "How to Enjoy" section cards'
      columns={COLUMNS}
      fields={FIELDS}
      defaultValues={{ sort_order: 0, is_active: 'TRUE', bg_color: '#f0fdf4' }}
    />
  )
}
