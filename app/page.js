
"use client";
import React, { useState, useEffect } from "react";

import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import {
  Container,
  Card,
  CardContent,
  TextField,
  Divider,
} from "@mui/material";

// Knowledge about Ether.js https://docs.ethers.org/v6/getting-started/
import { ethers } from "ethers";
import { formatEther, parseUnits } from "ethers";
import abi from "./abi.json";


const [ metaMask , hooks ] = initializeConnector((actions) => new MetaMask({ actions }))
const { useChainId , useAccounts, useIsActivating , useIsActive , useProvider } = hooks
const contractChain = 11155111 
const contractAddress = '0xfA8586F464D059E23bcd6F60F55295232769b8f9'

export default function Page() {
  const chainId = useChainId()
  const accounts = useAccounts()
  const isActive = useIsActive()

  const provider = useProvider()
  const [error, setError] = useState(undefined)

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to metamask')
    })
  }, [])

  //เชือ่มต่อ
  const handleConnect = () => {
    metaMask.activate(contractChain)
  }
  //ยกเลิกการเชื่อมต่อ
  const handleDisconnect = () => {
    metaMask.resetState()
  }

  const [ balance , setBalance ] = useState("") 
  useEffect (() => {
    const fetchBalance = async () => {
      const signer = provider.getSigner()
      const smaetContract = new ethers.Contract( contractAddress, abi , signer )
      const myBalance = await smaetContract.balanceOf(accounts[0])
      console.log(formatEther(myBalance));
      setBalance(formatEther(myBalance))
      
    }
    if (isActive) {
      fetchBalance()
    }
  },[isActive])


  
  const [aonValue, setAonValue] = useState(0);

  const handleSetAonValue = event => {
    setAonValue(event.target.value);
  };

  const handleBuy = async () => {
    try {
      if (aonValue <= 0) {
        return;
      }

      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      const buyValue = parseUnits(aonValue.toString(), "ether");
      const tx = await smartContract.buy({
        value: buyValue.toString(),
      });
      console.log("Transaction hash:", tx.hash);
    } catch (err) {
      console.log(err);
    }
  };
  return (

    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SE Crypto exchange
          </Typography>

          {isActive ? (
            <Stack direction="row" spacing={1}>
              <Chip label={accounts[0]} variant="outlined" />
              <Button color="inherit" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </Stack>
          ) : (
            <Button color="inherit" onClick={handleConnect}>
              Connect
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {isActive && (
        <Container maxWidth="sm" sx={{ mt: 2  }}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography
                  sx={{ fontSize: 20 }}
                  color="text.secondary"
                  gutterBottom
                >
                  My wallet balance
                </Typography>
                <TextField
                  id="outlined-basic"
                  label="Address"
                  value={accounts[0]}
                  variant="outlined"
                />
                <TextField
                  id="outlined-basic"
                  label="Aon Balance"
                  value={balance}
                  variant="outlined"
                />

                <Divider />
                <Typography
                  sx={{ fontSize: 20 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Buy Aon Token
                </Typography>

                <TextField
                  required
                  id="outlined-required"
                  label="Enter amount of Ether you want to buy Aon Token"
                  defaultValue=""
                  type="number"
                  onChange={handleSetAonValue}
                />

                <Button variant="contained" onClick={handleBuy}>
                  Buy Aon Token
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      )}
    </Box>
        
          
        
    

  )
}