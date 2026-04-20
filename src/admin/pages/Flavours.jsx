import CrudPage from '../components/CrudPage'

const COLUMNS = [
  { key: 'name',       label: 'Name' },
  { key: 'note',       label: 'Note' },
  { key: 'image_url',  label: 'Image Path' },
  { key: 'sort_order', label: 'Order' },
]

const FIELDS = [
  { key: 'name',       label: 'Flavour Name',   required: true },
  { key: 'note',       label: 'Note / Tagline', hint: 'e.g. Alphonso blend · Tropical sweet' },
  { key: 'image_url',  label: 'Image Path',     hint: 'e.g. assets/Mango.jpeg' },
  { key: 'sort_order', label: 'Sort Order',     type: 'number' },
]

export default function Flavours() {
  return (
    <CrudPage
      sheet="flavours"
      title="Flavour Garden"
      description="Manage the Shop by Flavour section tiles"
      columns={COLUMNS}
      fields={FIELDS}
      defaultValues={{ sort_order: 0, is_active: 'TRUE' }}
    />
  )
}
