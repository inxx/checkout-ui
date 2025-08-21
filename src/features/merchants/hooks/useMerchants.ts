import { useQuery } from '@tanstack/react-query'
import { merchantService } from '@/shared/api/merchantService'
import type { MerchantListParams } from '../types'

export const useMerchants = (params: MerchantListParams = {}) => {
  return useQuery({
    queryKey: ['merchants', params],
    queryFn: () => merchantService.getMerchantList(params),
    staleTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: false,
  })
}

export const useMerchant = (id: string) => {
  return useQuery({
    queryKey: ['merchant', id],
    queryFn: () => merchantService.getMerchantDetail(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10분
  })
}

export const useMerchantItems = (id: string) => {
  return useQuery({
    queryKey: ['merchant', id, 'items'],
    queryFn: () => merchantService.getMerchantItems(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5분
  })
}