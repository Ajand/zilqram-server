import { Zilliqa } from '@zilliqa-js/zilliqa'

// List of Contract to check

// NFT Holder Model

// Cron Job

// Extract Data From Contract

// 



const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');

// Standard fungible token deployed on devnet
const tokenContract = '0xfc4fFBd0860D014f1E38eB1D4fF49AFDB6e955f0';

async function getContractState(contractAddress) {
  /**
   * initialising contract class. Contract class is a convenient way for you to use
   * repeatedly call contracts and make queries from.
   *
   * There's two types of "data" in scilla. Mutable fields (available through getState)
   * and immutable fields (cannot be changed once deployed, available through getInit)
   */
  const contract = zilliqa.contracts.at(contractAddress);
  const allState = await contract.getState();
  console.log(`Getting the entire contract state`);
  console.log(allState);
}

//getContractState(tokenContract);
//