# Changelog

## [1.2.0] - 2020-09-05

### Changed

- add redis cache support

### FIX

- nextjs getServerSide page.json do not hit cache, because their url is not the same, add a normalize url function has resoloved this problem
