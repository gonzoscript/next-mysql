import Link from 'next/link'
import { useRouter } from 'next/router'
const db = require('lib/db')
const escape = require('sql-template-strings')

export default function ProfilePage({ profile }) {
  const router = useRouter()
  if (router.isFallback) return <p>loading...</p>
  return (
    <>
      <div>
        <img src={profile.avatar} />
        <h1>{profile.name}</h1>
        <p>{profile.address}</p>
        <p>{profile.email}</p>
        <Link href="/">
          <a>← Back to profiles</a>
        </Link>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  }
}

export async function getStaticProps({params}) {
  const [profile] = await db.query(escape`
    SELECT *
    FROM profiles
    WHERE id = ${params.id}
  `).then(res => JSON.parse(JSON.stringify(res)))

  return {
    props: { profile },
    unstable_revalidate: 60 * 5
  }
}