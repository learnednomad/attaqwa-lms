'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api';
import { CACHE_KEYS, CACHE_TTL, type Event } from '@attaqwa/shared';

interface UseEventsParams {
  page?: number;
  limit?: number;
  upcoming?: boolean;
  isActive?: boolean;
}

export function useEvents(params: UseEventsParams = {}) {
  return useQuery({
    queryKey: [CACHE_KEYS.EVENTS, params],
    queryFn: () => eventsApi.getAll(params),
    staleTime: CACHE_TTL.EVENTS,
  });
}

export function useUpcomingEvents(limit: number = 5) {
  return useQuery({
    queryKey: [CACHE_KEYS.EVENTS, 'upcoming', { limit }],
    queryFn: () => eventsApi.getAll({ upcoming: true, isActive: true, limit }),
    staleTime: CACHE_TTL.EVENTS,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: [CACHE_KEYS.EVENTS, id],
    queryFn: () => eventsApi.getById(id),
    staleTime: CACHE_TTL.EVENTS,
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.EVENTS] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
      eventsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.EVENTS] });
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.EVENTS, id] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.EVENTS] });
    },
  });
}