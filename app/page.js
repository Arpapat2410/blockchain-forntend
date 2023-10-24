"use client"
import React, {useState , useEffect} from 'react'
import {initializeConnector} from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { ethers } from 'ethers'
import { formatEther, parseEther } from '@ethersproject/units'
import abi from './abi.json'


import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import FaceIcon from '@mui/icons-material/Face';


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
  
  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar  position="static">
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
          </Typography>
          
          { isActive ? 
          
          < Stack direction = "row" spacing = {1} alignItems = "center" >
              <Chip icon = {< FaceIcon / >}label = {accounts ? accounts[0] : ''}variant = "outlined" / >
              <Button color='inherit' onClick={handleDisconnect} >Disconnect</Button> 
          </Stack>
            : 
              <Button color='inherit' onClick={handleConnect} >Connect</Button>
          } 
        </Toolbar>
      </AppBar>
    </Box>
    <div class = "card">
      <div class="card-body">
      <p>chainId : { chainId }</p>
      <p>isActive : { isActive.toString() }</p>
      <p>accounts : { accounts ? accounts[0] : '' }</p>
      { isActive ? 
        <input type='button' class="btn btn-denger" onClick={handleDisconnect} value={'Disconnect'} />
      :
        <input type='button'class="btn btn-primary"  onClick={handleConnect} value={'Connect Wallet'} />
      }
    </div>
    </div>
    
    </>
  )
}