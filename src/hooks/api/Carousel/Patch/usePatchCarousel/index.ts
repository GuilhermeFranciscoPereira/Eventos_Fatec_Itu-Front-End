import { useCallback } from 'react';
import { useToastStore } from '@/stores/useToastStore';
import { UpdateCarouselDto } from '@/@Types/CarouselTypes';

type useEditCarouselProps = {
  (id: number, dto: UpdateCarouselDto): Promise<void>;
}

type useToggleActiveCarouselProps = {
  (id: number, isActive: boolean): Promise<void>
}

export function useEditCarousel(): useEditCarouselProps {
  const showToast = useToastStore(s => s.showToast);

  return useCallback(
    async (id, dto) => {
      const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());
      let response: Response;
      if (dto.image) {
        const form = new FormData();
        if (dto.name !== undefined) form.append('name', dto.name);
        if (dto.order !== undefined) form.append('order', String(dto.order));
        if (dto.isActive !== undefined) form.append('isActive', String(dto.isActive));
        form.append('image', dto.image);

        response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/carousel/patch/${id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'X-CSRF-Token': csrfToken },
          body: form,
        });
      } else {
        response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/carousel/patch/${id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
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

      showToast({ message: 'Carrossel atualizado com sucesso!', type: 'Success' });
    },
    [showToast]
  );
}

export function useToggleActiveCarousel(): useToggleActiveCarouselProps {
  const showToast = useToastStore(s => s.showToast);

  return useCallback(
    async (id: number, isActive: boolean) => {
      const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());

      const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/carousel/patch/toggle/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Falha ao alternar ativo');
      }

      showToast({ message: isActive ? 'Imagem ativada!' : 'Imagem desativada!', type: 'Success' });
    },
    [showToast]
  );
}
