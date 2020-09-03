import { Link } from '@material-ui/core'
import NLink from 'next/link'

const CLink: React.FC<{ href: string }> = (props) => {
  return (
    <NLink href={props.href}>
      <Link href={props.href}>{props.children}</Link>
    </NLink>
  )
}

export { CLink as Link }
export default CLink
