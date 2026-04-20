import CrudPage from '../components/CrudPage'

const COLUMNS = [
  { key: 'prefix',       label: 'Prefix' },
  { key: 'number_value', label: 'Number' },
  { key: 'suffix',       label: 'Suffix' },
  { key: 'label',        label: 'Label' },
  { key: 'sort_order',   label: 'Order' },
]

const FIELDS = [
  { key: 'prefix',        label: 'Prefix',       hint: 'e.g. − (leave blank for none)' },
  { key: 'number_value',  label: 'Number Value',  required: true, hint: 'e.g. 500, 15, 0' },
  { key: 'suffix',        label: 'Suffix',        hint: 'e.g. + or gms or % Sugar' },
  { key: 'label',         label: 'Label',         required: true },
  { key: 'is_bold_label', label: 'Bold Label',    type: 'checkbox', checkLabel: 'Make label bold' },
  { key: 'sort_order',    label: 'Sort Order',    type: 'number' },
]

export default function StatsPage() {
  return (
    <CrudPage
      sheet="stats"
      title="Stats Bar"
      description="Manage the 4 stat numbers shown below the hero section"
      columns={COLUMNS}
      fields={FIELDS}
      hasActive={false}
      defaultValues={{ prefix: '', suffix: '', sort_order: 0, is_bold_label: false }}
    />
  )
}
