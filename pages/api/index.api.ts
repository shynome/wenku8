import { PageConfig } from 'next'
export const config: PageConfig = { api: { bodyParser: false } }
import { ApolloServer, gql } from 'apollo-server-micro'
import { Resolvers } from '~graphql/codegen'
import fs from 'fs'
import { getBook } from './getChaptersVol'
import { getChapterContent } from './getChapterContent'

const typeDefs: string = fs.readFileSync('graphql/api.graphql', 'utf-8')

const resolvers: Resolvers = {
  Query: {
    Book(root, args) {
      return getBook(args.bid)
    },
    ChapterContent(root, args) {
      return getChapterContent(args.bid, args.cid)
    },
  },
}

const s = new ApolloServer({ typeDefs, resolvers })

export default s.createHandler({ path: '/api' })
