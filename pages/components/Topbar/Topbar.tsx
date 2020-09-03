import {
  AppBar,
  Slide,
  useScrollTrigger,
  Toolbar,
  Typography,
  makeStyles,
} from '@material-ui/core'
import { ReactNode } from 'react'

export const HideOnScroll: React.FC = (props) => {
  const trigger = useScrollTrigger()
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {props.children as any}
    </Slide>
  )
}

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
  },
}))

export const Topbar: React.FC<{ title: ReactNode }> = (props) => {
  const classes = useStyles()
  return (
    <HideOnScroll>
      <AppBar position="sticky">
        <Toolbar>
          <Typography>{props.title}</Typography>
          <span className={classes.grow} />
          <div>{props.children}</div>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  )
}
