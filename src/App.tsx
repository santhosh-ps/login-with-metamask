import React, { useState } from 'react';
import './App.css';
import { ethers } from "ethers";

function App() {
  const storedToken = localStorage.getItem('token');
  const [token, setToken] = useState(storedToken);
  const onLogin = async() => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    const walletAddress = await signer.getAddress();
    const nonceResponse = await fetch('https://rapid-striped-advantage.glitch.me/api/metamask/login', {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({walletAddress})
    });
    const {nonce} = await nonceResponse.json();
    const signature = await signer.signMessage(nonce);
    const loginResponse = await fetch('https://rapid-striped-advantage.glitch.me/api/metamask/verify', {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({walletAddress, signature})
    });
    const {token} = await loginResponse.json();
    localStorage.setItem('token', token);
    setToken(token);
  }
  const onLogout = () => {
    localStorage.clear();
    setToken(null);
  }
  return (
    <div className="App">
      <div className='login-btn-wrap'>
        <button hidden={!!token} disabled={!(window as any).ethereum} onClick={onLogin}>
            Login With Metamask
        </button>
        {
          token && <>
                      <div>Successfully Logged in With Metamask!. JWT: </div>
                      <div className='token-wrap'><code style={{width: '120px'}}>{token}</code></div>
                      <div><button onClick={onLogout}>Logout</button></div>
                  </>

        }
      </div>
    </div>
  );
}

export default App;
