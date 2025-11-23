"use client"

import { useEffect, useState } from "react"
import { Contract, JsonRpcProvider } from "ethers"
import savingCircleAbi from "@/lib/abi/savingcircle.sol.abi.json"

export type CircleContractData = {
  address: string
  name: string
  currRound: number
  numRounds: number
  installmentSize: number
  numUsers: number
  protocolTokenRewardPerInstallment: number
  maxProtocolTokenInAuction: number
  timePerRound: number
  startTime: number
  nextRoundToPay: number
  roundDeadline: number
}

const DEFAULT_ALCHEMY_KEY = "5eMnDYb8SsrseqleUSYcq-Hr_Rt-1n26"

const getDefaults = () => ({
  rpc:
    process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ||
    (process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      ? `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
      : `https://eth-sepolia.g.alchemy.com/v2/${DEFAULT_ALCHEMY_KEY}`),
})

export function useCircleContractData(address?: string) {
  const [data, setData] = useState<CircleContractData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!address) return

    const { rpc } = getDefaults()

    if (!rpc) {
      setError("Missing Sepolia RPC URL")
      return
    }

    let cancelled = false
    const provider = new JsonRpcProvider(rpc)
    const contract = new Contract(address, savingCircleAbi, provider)

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [
          name,
          currRoundBn,
          numRoundsBn,
          installmentSizeBn,
          numUsersBn,
          protocolRewardBn,
          maxAuctionBn,
          timePerRoundBn,
          startTimeBn,
          nextRoundToPayBn,
        ] = await Promise.all([
          contract.name(),
          contract.currRound(),
          contract.numRounds(),
          contract.installmentSize(),
          contract.numUsers(),
          contract.protocolTokenRewardPerInstallment(),
          contract.maxProtocolTokenInAuction(),
          contract.timePerRound(),
          contract.startTime(),
          contract.nextRoundToPay(),
        ])

        let roundDeadlineBn: bigint
        try {
          roundDeadlineBn = await contract.roundDeadline(currRoundBn)
        } catch {
          roundDeadlineBn = startTimeBn + timePerRoundBn * (currRoundBn + 1n)
        }

        if (cancelled) return

        setData({
          address,
          name,
          currRound: Number(currRoundBn),
          numRounds: Number(numRoundsBn),
          installmentSize: Number(installmentSizeBn),
          numUsers: Number(numUsersBn),
          protocolTokenRewardPerInstallment: Number(protocolRewardBn),
          maxProtocolTokenInAuction: Number(maxAuctionBn),
          timePerRound: Number(timePerRoundBn),
          startTime: Number(startTimeBn),
          nextRoundToPay: Number(nextRoundToPayBn),
          roundDeadline: Number(roundDeadlineBn),
        })
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load circle data")
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [address])

  return { data, loading, error }
}

