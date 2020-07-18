import Link from 'next/link'
const db = require('lib/db')
const escape = require('sql-template-strings')

export default function HomePage({ profiles }) {
  return (
    <>
      <ul>
        {profiles.map(p => (
          <li className="profile" key={p.id}>
            <Link href={`/profiles/${p.id}`}>
              <a>
                <img src={p.avatar} />
                <span>{p.name}</span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export async function getStaticProps({params}) {
  const profiles = await db.query(escape`
    SELECT *
    FROM profiles
    ORDER BY id
  `).then(res => JSON.parse(JSON.stringify(res)))
  return {
    props: { profiles },
    unstable_revalidate: 60
  }
}