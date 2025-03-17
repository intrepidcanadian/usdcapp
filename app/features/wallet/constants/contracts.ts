
// this is the address of the USDC contract on the unichain sepolia testnet
export const USDC_CONTRACT_ADDRESS = '0x31d0220469e10c4E71834a79b1f276d740d3768F';

// this is the ABI of the USDC contract
export const USDC_ABI = [
    {
      // Function to transfer USDC tokens from the caller's address to a specified address
      constant: false,
      inputs: [
        { name: '_to', type: 'address' },
        { name: '_value', type: 'uint256' },
      ],
      name: 'transfer',
      outputs: [{ name: '', type: 'bool' }],
      type: 'function',
    },
    {
      // Function to get the balance of USDC tokens for a specific address
      constant: true,
      inputs: [{ name: '_owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: 'balance', type: 'uint256' }],
      type: 'function',
    }
  ];