# Changelog

## [1.3.0] - 2020-09-05

### CHANGE

- disabled graphql api to avoid being attacked cc

## [1.2.1] - 2020-09-05

### FIX

- fix redis cache lock may not be unlocked
- fix cache cc, now every link hit the same cache

## [1.2.0] - 2020-09-05

### Changed

- add redis cache support

### FIX

- nextjs getServerSide page.json do not hit cache, because their url is not the same, add a normalize url function has resoloved this problem
