"use client"

import { useEffect, useState, useCallback } from "react"
import { Contract, JsonRpcProvider } from "ethers"
import savingCircleAbi from "@/lib/abi/savingcircle.sol.abi.json"

export type PaymentRecord = {
  circleAddress: string
  circlePrize: number
  amount: number
  round: number
  totalRounds: number
  date: string
  txHash: string
  pending?: boolean
}

const DEFAULT_RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/5eMnDYb8SsrseqleUSYcq-Hr_Rt-1n26"

const getDefaults = () => {
  let rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || DEFAULT_RPC_URL

  if (rpcUrl.includes("=")) {
    const parts = rpcUrl.split("=")
    rpcUrl = parts.slice(1).join("=")
  }

  if (rpcUrl.endsWith("/v2/") || rpcUrl.endsWith("/v2")) {
    rpcUrl = DEFAULT_RPC_URL
  }

  if (!rpcUrl.startsWith("http://") && !rpcUrl.startsWith("https://")) {
    rpcUrl = DEFAULT_RPC_URL
  }

  return { rpc: rpcUrl }
}

export function usePaymentHistory(circleAddresses: string[]) {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addPendingPayment = useCallback((payment: Omit<PaymentRecord, "txHash" | "date">) => {
    const pendingPayment: PaymentRecord = {
      ...payment,
      txHash: "pending",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      pending: true,
    }
    setPayments((prev) => [pendingPayment, ...prev])
  }, [])

  useEffect(() => {
    if (circleAddresses.length === 0) {
      setPayments([])
      return
    }

    const { rpc } = getDefaults()
    if (!rpc) {
      setError("Missing Sepolia RPC URL")
      return
    }

    let cancelled = false

    const fetchPaymentHistory = async () => {
      setLoading(true)
      setError(null)

      try {
        const provider = new JsonRpcProvider(rpc, {
          chainId: 11155111,
          name: "sepolia",
        })

        const allPayments: PaymentRecord[] = []

        for (const address of circleAddresses) {
          const contract = new Contract(address, savingCircleAbi, provider)

          try {
            const [numRoundsBn, installmentSizeBn] = await Promise.all([
              contract.numRounds(),
              contract.installmentSize(),
            ])
            const totalRounds = Number(numRoundsBn)
            const installmentSize = Number(installmentSizeBn)
            const circlePrize = installmentSize * totalRounds

            const filter = contract.filters.InstallmentPaid?.()
            if (filter) {
              const events = await contract.queryFilter(filter, -10000)

              for (const event of events) {
                const block = await event.getBlock()
                const args = event.args

                if (args && args.length >= 2) {
                  allPayments.push({
                    circleAddress: address,
                    circlePrize,
                    amount: Number(args[1]) || 100,
                    round: Number(args[0]) || 0,
                    totalRounds,
                    date: new Date(block.timestamp * 1000).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }),
                    txHash: event.transactionHash,
                  })
                }
              }
            }
          } catch (err) {
            console.error(`[v0] Failed to fetch payments for ${address}:`, err)
          }
        }

        if (!cancelled) {
          allPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          setPayments((prev) => {
            const pending = prev.filter((p) => p.pending)
            return [...pending, ...allPayments]
          })
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[v0] Payment history fetch error:", err)
          setError(err instanceof Error ? err.message : "Failed to load payment history")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchPaymentHistory()

    return () => {
      cancelled = true
    }
  }, [circleAddresses])

  return { payments, loading, error, addPendingPayment }
}
