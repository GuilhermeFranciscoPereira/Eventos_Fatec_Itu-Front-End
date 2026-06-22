import { useCallback } from 'react';
import { apiFetch } from '@/hooks/api/client';
import { useToastStore } from '@/stores/useToastStore';
import { UpdateCarouselDto } from '@/@Types/CarouselTypes';

type useEditCarouselProps = {
  (id: number, dto: UpdateCarouselDto): Promise<void>;
}

type useToggleActiveCarouselProps = {
  (id: number, isActive: boolean): Promise<void>
}

type useReorderCarouselProps = {
  (id: number, order: number): Promise<void>;
}

export function useEditCarousel(): useEditCarouselProps {
  const showToast = useToastStore(s => s.showToast);

  return useCallback(
    async (id, dto) => {
      let response: Response;
      if (dto.image) {
        const form = new FormData();
        if (dto.name !== undefined) form.append('name', dto.name);
        if (dto.order !== undefined) form.append('order', String(dto.order));
        if (dto.isActive !== undefined) form.append('isActive', String(dto.isActive));
        form.append('image', dto.image);

        response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/carousel/patch/${id}`, {
          method: 'PATCH',
          csrf: true,
          body: form,
        });
      } else {
        response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/carousel/patch/${id}`, {
          method: 'PATCH',
          csrf: true,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: dto.name,
            order: dto.order,
            isActive: dto.isActive,
          }),
        });
      }

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Falha ao atualizar carousel');
      }

      showToast({ message: 'Carrossel atualizado!', type: 'success' });
    },
    [showToast]
  );
}

export function useReorderCarousel(): useReorderCarouselProps {
  return useCallback(
    async (id: number, order: number) => {
      const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/carousel/patch/${id}`, {
        method: 'PATCH',
        csrf: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Falha ao reordenar carrossel');
      }
    },
    []
  );
}

export function useToggleActiveCarousel(): useToggleActiveCarouselProps {
  const showToast = useToastStore(s => s.showToast);

  return useCallback(
    async (id: number, isActive: boolean) => {
      const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/carousel/patch/toggle/${id}`, {
        method: 'PATCH',
        csrf: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Falha ao alternar ativo');
      }

      showToast({ message: isActive ? 'Imagem ativada!' : 'Imagem desativada!', type: 'success' });
    },
    [showToast]
  );
}
