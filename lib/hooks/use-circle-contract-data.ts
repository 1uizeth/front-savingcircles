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

const DEFAULT_RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/5eMnDYb8SsrseqleUSYcq-Hr_Rt-1n26"

const getDefaults = () => {
  console.log("[v0] Raw env var:", process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL)

  let rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || DEFAULT_RPC_URL

  // Strip any potential environment variable artifacts like "VAR_NAME=value"
  if (rpcUrl.includes("=")) {
    const parts = rpcUrl.split("=")
    rpcUrl = parts.slice(1).join("=")
  }

  if (rpcUrl.endsWith("/v2/") || rpcUrl.endsWith("/v2")) {
    console.warn("[v0] RPC URL is incomplete (missing API key), using default")
    rpcUrl = DEFAULT_RPC_URL
  }

  // Validate the URL
  if (!rpcUrl.startsWith("http://") && !rpcUrl.startsWith("https://")) {
    console.warn("[v0] Invalid RPC URL, using default:", DEFAULT_RPC_URL)
    rpcUrl = DEFAULT_RPC_URL
  }

  console.log("[v0] Final RPC URL:", rpcUrl)

  return { rpc: rpcUrl }
}

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

    let provider: JsonRpcProvider
    try {
      provider = new JsonRpcProvider(rpc, {
        chainId: 11155111,
        name: "sepolia",
      })
    } catch (err) {
      console.error("[v0] Failed to create provider:", err)
      setError("Failed to initialize blockchain connection")
      setLoading(false)
      return
    }

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
        console.error("[v0] Contract fetch error:", err)
        setError(err instanceof Error ? err.message : "Failed to load on-chain data")
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
