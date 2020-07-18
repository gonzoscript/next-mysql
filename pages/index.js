import Link from 'next/link'
const db = require('lib/db')
const escape = require('sql-template-strings')

export default function HomePage({ profiles, page, pageCount }) {
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
      <nav>
        {page > 1 && (
          <Link href={`/?page=${page - 1}&limit=9`}>
            <a>Previous</a>
          </Link>
        )}
        {page < pageCount && (
          <Link href={`/?page=${page + 1}&limit=9`}>
            <a className="next">Next</a>
          </Link>
        )}
      </nav>
    </>
  )
}

export async function getStaticProps({params}) {
  const page = parseInt(params?.page || 1)
  const limit = parseInt(params?.limit || 9)
  const profiles = await db.query(escape`
    SELECT *
    FROM profiles
    ORDER BY id
    LIMIT ${(page - 1) * limit}, ${limit}
  `).then(res => JSON.parse(JSON.stringify(res)))
  const count = await db.query(escape`
    SELECT COUNT(*)
    AS profilesCount
    FROM profiles
  `).then(res => {
    console.log("profile count response:\n\n", res, "\n")
    JSON.parse(JSON.stringify(res))
  })
  const { profilesCount } = count[0]
  const pageCount = Math.ceil(profilesCount / limit)
  return {
    props: { profiles, pageCount, page },
    unstable_revalidate: 60
  }
}