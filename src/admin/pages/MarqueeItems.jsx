import CrudPage from '../components/CrudPage'

const COLUMNS = [
  { key: 'text',       label: 'Marquee Text' },
  { key: 'sort_order', label: 'Order' },
]

const FIELDS = [
  { key: 'text',       label: 'Text',       required: true, hint: 'e.g. 100% Natural Fruit' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
]

export default function MarqueeItems() {
  return (
    <CrudPage
      sheet="marquee_items"
      title="Marquee Banner"
      description="Manage the scrolling banner text at the top of the page"
      columns={COLUMNS}
      fields={FIELDS}
      defaultValues={{ sort_order: 0, is_active: 'TRUE' }}
    />
  )
}
