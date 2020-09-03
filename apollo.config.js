module.exports = {
  client: {
    service: {
      name: 'lcoal server',
      localSchemaFile: 'graphql/codegen/schema.json',
    },
    includes: ['./pages/**/*.{ts,tsx}'],
  },
}
