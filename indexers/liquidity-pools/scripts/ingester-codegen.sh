for config in ingesterGqlTypesConfig/*.ts; do
    npx graphql-codegen --require dotenv/config --config $config
done