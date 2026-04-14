import { useState } from 'react';
import { Wallet, Check, Copy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useAuth } from '@/hooks/useAuth';
import { useSolanaWallet } from '@/providers/WalletProviders';

interface WalletConnectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletConnectDialog({ isOpen, onClose }: WalletConnectDialogProps) {
  const [activeTab, setActiveTab] = useState('solana');
  const [copied, setCopied] = useState(false);
  const { user, connectSolanaWallet, connectEVMWallet, disconnectSolanaWallet, disconnectEVMWallet } = useAuth();
  
  // Solana wallet
  const { publicKey: solanaPublicKey, connected: solanaConnected, connect: connectSolana, disconnect: disconnectSolana } = useSolanaWallet();
  
  // EVM wallet
  const { address: evmAddress, isConnected: evmConnected } = useAccount();
  const { connect: connectEVM, isPending: evmConnecting } = useConnect();
  const { disconnect: disconnectEVM } = useDisconnect();

  const handleConnectSolana = async () => {
    await connectSolana();
  };

  const handleConnectEVM = () => {
    connectEVM({ connector: injected() });
  };

  const handleDisconnectSolana = async () => {
    await disconnectSolana();
    disconnectSolanaWallet();
  };

  const handleDisconnectEVM = () => {
    disconnectEVM();
    disconnectEVMWallet();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Update auth when wallets connect
  if (solanaConnected && solanaPublicKey && user && user.wallets.solana !== solanaPublicKey) {
    connectSolanaWallet(solanaPublicKey);
  }

  if (evmConnected && evmAddress && user && user.wallets.evm !== evmAddress) {
    connectEVMWallet(evmAddress);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0d1220] border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-400" />
            Connect Wallets
          </DialogTitle>
        </DialogHeader>

        {!user && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
            Please log in first to connect and save your wallets.
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
            <TabsTrigger value="solana" className="data-[state=active]:bg-purple-600">
              <img src="https://cryptologos.cc/logos/solana-sol-logo.png" alt="SOL" className="w-4 h-4 mr-2" />
              Solana
            </TabsTrigger>
            <TabsTrigger value="evm" className="data-[state=active]:bg-blue-600">
              <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH" className="w-4 h-4 mr-2" />
              EVM
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solana" className="mt-4 space-y-4">
            <div className="text-sm text-gray-400">
              Connect your Solana wallet to trade SOL and SPL tokens.
            </div>

            {solanaConnected && solanaPublicKey ? (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400 text-sm font-medium">Connected</span>
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-800/50 px-2 py-1 rounded text-sm text-white">
                      {shortenAddress(solanaPublicKey)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(solanaPublicKey)}
                      className="p-1.5 bg-gray-700/50 rounded hover:bg-gray-700 transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleDisconnectSolana}
                  variant="outline"
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={handleConnectSolana}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3"
                >
                  <img src="https://cryptologos.cc/logos/solana-sol-logo.png" alt="SOL" className="w-5 h-5 mr-2" />
                  Connect Solana Wallet
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Supports Phantom, Solflare, and more
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="evm" className="mt-4 space-y-4">
            <div className="text-sm text-gray-400">
              Connect your EVM wallet to trade on Ethereum, Polygon, Arbitrum, and Base.
            </div>

            {evmConnected && evmAddress ? (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400 text-sm font-medium">Connected</span>
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-800/50 px-2 py-1 rounded text-sm text-white">
                      {shortenAddress(evmAddress)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(evmAddress)}
                      className="p-1.5 bg-gray-700/50 rounded hover:bg-gray-700 transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleDisconnectEVM}
                  variant="outline"
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={handleConnectEVM}
                  disabled={evmConnecting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3"
                >
                  {evmConnecting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connecting...</>
                  ) : (
                    <>
                      <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH" className="w-5 h-5 mr-2" />
                      Connect EVM Wallet
                    </>
                  )}
                </Button>
                <div className="flex items-center justify-center gap-4 py-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-6 h-6 opacity-50" />
                  <img src="https://cryptologos.cc/logos/walletconnect-wc-logo.png" alt="WalletConnect" className="w-6 h-6 opacity-50" />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Supports MetaMask, WalletConnect, and more
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Connected Wallets Summary */}
        {user?.wallets && (user.wallets.solana || user.wallets.evm) && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Saved Wallets</h4>
            <div className="space-y-2">
              {user.wallets.solana && (
                <div className="flex items-center justify-between bg-gray-800/30 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <img src="https://cryptologos.cc/logos/solana-sol-logo.png" alt="SOL" className="w-4 h-4" />
                    <span className="text-sm text-gray-300">Solana</span>
                  </div>
                  <code className="text-xs text-gray-500">{shortenAddress(user.wallets.solana)}</code>
                </div>
              )}
              {user.wallets.evm && (
                <div className="flex items-center justify-between bg-gray-800/30 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH" className="w-4 h-4" />
                    <span className="text-sm text-gray-300">EVM</span>
                  </div>
                  <code className="text-xs text-gray-500">{shortenAddress(user.wallets.evm)}</code>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
