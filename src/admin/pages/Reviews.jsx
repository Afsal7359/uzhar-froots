import CrudPage from '../components/CrudPage'

const COLUMNS = [
  { key: 'author_name', label: 'Author' },
  { key: 'author_role', label: 'Role' },
  { key: 'rating',      label: 'Rating', render: v => '★'.repeat(Number(v)) + '☆'.repeat(5 - Number(v)) },
  { key: 'review_text', label: 'Review', render: v => (v?.length > 60 ? v.slice(0, 60) + '…' : v) },
]

const FIELDS = [
  { key: 'author_name',  label: 'Author Name',     required: true },
  { key: 'author_role',  label: 'Role / Location', hint: 'e.g. Juice Bar Owner, Kochi' },
  { key: 'author_emoji', label: 'Avatar Emoji',    hint: 'e.g. 👨 👩 💪' },
  { key: 'rating',       label: 'Rating (1–5)',    type: 'number', min: 1, max: 5, required: true },
  { key: 'review_text',  label: 'Review Text',     type: 'textarea', required: true },
  { key: 'sort_order',   label: 'Sort Order',      type: 'number' },
]

export default function Reviews() {
  return (
    <CrudPage
      sheet="reviews"
      title="Customer Reviews"
      description='Manage the Customer Love section'
      columns={COLUMNS}
      fields={FIELDS}
      defaultValues={{ rating: 5, author_emoji: '😊', sort_order: 0, is_active: 'TRUE', is_verified: 'TRUE' }}
    />
  )
}
