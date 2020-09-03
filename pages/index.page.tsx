import { TextField, Grid, Button } from '@material-ui/core'

export default function Page() {
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      style={{ height: '60vh' }}
    >
      <Grid item>
        <form action="/book">
          <Grid container spacing={2} direction="column">
            <Grid item>
              <TextField
                name="bid"
                variant="outlined"
                placeholder="输入书籍编号"
                label="书籍编号"
                helperText="如: https://www.wenku8.net/book/1861.htm 中的 1861"
                required
                autoFocus
              />
            </Grid>
            <Grid item>
              <Button
                type="submit"
                size="large"
                variant="contained"
                color="primary"
                fullWidth
              >
                提交
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  )
}
