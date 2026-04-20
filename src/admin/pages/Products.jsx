import CrudPage from '../components/CrudPage'

const COLUMNS = [
  { key: 'name',         label: 'Name' },
  { key: 'category',     label: 'Type', render: v => <span className={`badge ${v === 'combo' ? 'badge-green' : 'badge-amber'}`}>{v}</span> },
  { key: 'ribbon_label', label: 'Ribbon' },
  { key: 'price_label',  label: 'Price' },
  { key: 'sort_order',   label: 'Order' },
]

const FIELDS = [
  { key: 'name',         label: 'Product Name',           required: true },
  { key: 'category',     label: 'Category',               required: true, type: 'select', options: [{ value:'combo', label:'Combo Pack' }, { value:'single', label:'Single Flavour' }] },
  { key: 'sub_title',    label: 'Sub Title',              type: 'textarea' },
  { key: 'ribbon_label', label: 'Ribbon Label',           hint: 'e.g. Starter Pack, Best Value (leave empty for none)' },
  { key: 'image_url',    label: 'Image Path',             hint: 'e.g. assets/mango-web.png' },
  { key: 'features',     label: 'Features (JSON Array)',  type: 'json', hint: '["Feature one","Feature two"]' },
  { key: 'price_label',  label: 'Price Label',            hint: 'e.g. Enquire, Enquire for price' },
  { key: 'sort_order',   label: 'Sort Order',             type: 'number' },
]

export default function Products() {
  return (
    <CrudPage
      sheet="products"
      title="Products"
      description="Manage combo packs and single flavour boxes"
      columns={COLUMNS}
      fields={FIELDS}
      defaultValues={{ category: 'single', features: '[]', sort_order: 0, price_label: 'Enquire for price', is_active: 'TRUE' }}
    />
  )
}
