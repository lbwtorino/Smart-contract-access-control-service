ETH_FOLDER=/tmp/ECFCheckerEthereum
#ETH_FOLDER=~/.ethereum
echo "TestScript ::: Erasing ethereum folder: ${ETH_FOLDER}"
rm -rf /tmp/ECFCheckerEthereum

echo "TestScript ::: Creating primary account..."
ADDRESS=`./ecfpolicy/ECFChecker/build/bin/geth --datadir=${ETH_FOLDER} --password "password" account new | grep Address | awk '{print $2}' | cut -d "{" -f 2 | cut -d "}" -f 1`
echo "TestScript ::: Writing ${ADDRESS} to genesis file..."
sed "s/REPLACEME/${ADDRESS}/g" ./ecfpolicy/genesis_template.json > ./ecfpolicy/genesis.json

echo "TestScript ::: Creating secondary account..."
./ecfpolicy/ECFChecker/build/bin/geth --datadir=${ETH_FOLDER} --password "password" account new >& /dev/null

echo "TestScript ::: Initializing ethereum network..."
./ecfpolicy/ECFChecker/build/bin/geth --datadir=${ETH_FOLDER} init ./ecfpolicy/genesis.json  >& /dev/null

echo "TestScript ::: Deploying and attacking the non-ECF contract:"
./ecfpolicy/ECFChecker/build/bin/geth --datadir=${ETH_FOLDER} --unlock 0 --password "password" --verbosity 0 js ./ecfpolicy/result.js


