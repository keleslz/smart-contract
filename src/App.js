import './App.css';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import {useEffect, useState} from "react";

// Deploy adrress to smartt contract ,
const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {
  const images =[];

  const [greeting, setGreetingValue] = useState(''); // Message

  useEffect(() => {
    fetchGreeting();
  }, [])
  const requestAccount = async () => { // To connect wallet of user metamask
    await window.ethereum.request({method: 'eth_requestAccounts'});
  }

  const fetchGreeting = async () => {
    if(typeof window.ethereum !== 'undefined') // User's connected
    {
      const provider =  new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)

      try {
        const data = await contract.greet();
        setGreetingValue(data);
      }catch (err)
      {
        console.error(err)
      }
    }
  }

  const setGreeting = async () => {
    if(!greeting) return;
    if(typeof window.ethereum !== 'undefined')  // User's connected
    {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      setGreetingValue('');
      const res = await transaction.wait();

      console.log(res);
    }
  }

  return (
    <div className="App">

      <div className="container">
        <span>Text stocké : {greeting ? greeting : 'vide'}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column',  width : '50%', margin: '20px auto'}}>
        <input type="text" onChange={ e => setGreetingValue(e.target.value)} placeholder="Set greeting"/>
        <button onClick={setGreeting}  >Update</button>
      </div>
    </div>
  );
}

export default App;
