import { useRef } from "react";
import { useModalStore } from "@/stores/useModalStore";
import { useEditLocation } from "@/hooks/api/Locations/Patch/useEditLocation";
import { useCreateLocation } from "@/hooks/api/Locations/Post/useCreateLocation";
import { useGetAllLocations } from "@/hooks/api/Locations/Get/useGetAllLocations";
import { useDeleteLocation } from "@/hooks/api/Locations/Delete/useDeleteLocation";

export function useLocationsPage() {
    const editLocation = useEditLocation();
    const createLocation = useCreateLocation();
    const deleteLocation = useDeleteLocation();
    const openModal = useModalStore(s => s.openModal);
    const { locations, loading, refetch } = useGetAllLocations();
    const nameRef = useRef<HTMLInputElement>(null);
    const newNameRef = useRef<HTMLInputElement>(null);

    return { editLocation, createLocation, deleteLocation, openModal, locations, loading, refetch, nameRef, newNameRef };
}