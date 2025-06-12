for config in typegenConfig/*.json; do
    npx squid-substrate-typegen $config
done