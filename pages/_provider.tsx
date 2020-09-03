import { ThemeProvider } from '@material-ui/core'
import { client } from './apollo-client'
import { ApolloProvider } from '@apollo/client'

export const Provider: React.FC = (props) => {
  return <ApolloProvider client={client}>{props.children}</ApolloProvider>
}

export default Provider
