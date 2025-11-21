import { getExerciseById, exercises } from '@/lib/exercises'
import { notFound } from 'next/navigation'
import ExerciseClient from './ExerciseClient'

export function generateStaticParams() {
  return exercises.map((exercise) => ({
    id: exercise.id,
  }))
}

interface ExerciseDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ExerciseDetailPage({ params }: ExerciseDetailPageProps) {
  const { id } = await params
  const exercise = getExerciseById(id)

  if (!exercise) {
    notFound()
  }

  return <ExerciseClient exercise={exercise} />
}
