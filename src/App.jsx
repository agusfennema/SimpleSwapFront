import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import SimpleSwapABI from './abi/SimpleSwap.json';

const CONTRACT_ADDRESS = "0xTU_CONTRATO_DEPLOYADO"; // reemplazá esto

function App() {
  const [wallet, setWallet] = useState(null);
  const [signer, setSigner] = useState(null);
  const [amount, setAmount] = useState("1");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Instalá Metamask");
      return;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    setWallet(address);
    setSigner(signer);
  };

  const [price, setPrice] = useState(null);

const getPrice = async () => {
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SimpleSwapABI.abi, signer);
  const parsed = ethers.utils.parseEther(amount);
  const result = await contract.getPrice(parsed, await signer.getAddress());
  setPrice(ethers.utils.formatEther(result));
};

  const swapAToB = async () => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, SimpleSwapABI.abi, signer);
    const parsed = ethers.utils.parseEther(amount);
    await contract.swapAToB(parsed);
    alert("¡Swap A → B realizado!");
  };

  const swapBToA = async () => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, SimpleSwapABI.abi, signer);
    const parsed = ethers.utils.parseEther(amount);
    await contract.swapBToA(parsed);
    alert("¡Swap B → A realizado!");
  };

  return (
      <div className="container">
      <h1>SimpleSwap</h1>

      {!wallet ? (
        <button onClick={connectWallet}>Conectar wallet</button>
      ) : (
        <p>Conectado: {wallet}</p>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button onClick={getPrice}>Obtener precio</button>
        {price && <p>Precio estimado: {price}</p>}
      </div>


      <input
        type="text"
        placeholder="Cantidad"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <div style={{ marginTop: "1rem" }}>
        <button onClick={swapAToB}>Swap A → B</button>
        <button onClick={swapBToA} style={{ marginLeft: "1rem" }}>
          Swap B → A
        </button>
      </div>
    </div>
  );
}

export default App;
