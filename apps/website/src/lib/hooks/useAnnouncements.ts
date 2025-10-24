'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementsApi } from '@/lib/api';
import { CACHE_KEYS, CACHE_TTL, type Announcement } from '@attaqwa/shared';

interface UseAnnouncementsParams {
  page?: number;
  limit?: number;
  isEvent?: boolean;
  isActive?: boolean;
}

export function useAnnouncements(params: UseAnnouncementsParams = {}) {
  return useQuery({
    queryKey: [CACHE_KEYS.ANNOUNCEMENTS, params],
    queryFn: () => announcementsApi.getAll(params),
    staleTime: CACHE_TTL.ANNOUNCEMENTS,
  });
}

export function useAnnouncement(id: string) {
  return useQuery({
    queryKey: [CACHE_KEYS.ANNOUNCEMENTS, id],
    queryFn: () => announcementsApi.getById(id),
    staleTime: CACHE_TTL.ANNOUNCEMENTS,
    enabled: !!id,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: announcementsApi.create,
    onSuccess: () => {
      // Invalidate and refetch announcements
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ANNOUNCEMENTS] });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Announcement> }) =>
      announcementsApi.update(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate all announcements and the specific announcement
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ANNOUNCEMENTS] });
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ANNOUNCEMENTS, id] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: announcementsApi.delete,
    onSuccess: () => {
      // Invalidate all announcements
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ANNOUNCEMENTS] });
    },
  });
}