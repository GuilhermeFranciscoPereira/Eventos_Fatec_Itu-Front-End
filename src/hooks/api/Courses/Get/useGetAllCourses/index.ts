import { useRouter } from 'next/navigation';
import { apiFetch } from '@/hooks/api/client';
import { useState, useEffect, useCallback } from 'react';
import { CoursePublicResponse, CourseProps } from '@/@Types/CoursesTypes';

type useGetAllCoursesProps = {
    courses: CourseProps[];
    loading: boolean;
    refetch: () => Promise<void>;
}

export function useGetAllCourses(): useGetAllCoursesProps {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [courses, setCourses] = useState<CourseProps[]>([]);

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/courses`);
            if (response.status === 401) {
                router.push('/');
                return;
            }
            if (!response.ok) throw new Error('Falha para carregar os cursos');
            setCourses(await response.json());
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            console.log(msg);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { fetchCourses(); }, [fetchCourses]);

    return { courses, loading, refetch: fetchCourses };
}

export function useGetAllCoursesPublic() {
    const [datas, setDatas] = useState<CoursePublicResponse[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const fetchAll = useCallback(async () => {
        setLoading(true)
        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/courses/publicAllCourses`)
        if (response.ok) setDatas(await response.json())
        setLoading(false)
    }, [])

    useEffect(() => { fetchAll() }, [fetchAll])

    return { datas, loading }
}
