import PtForm from '@/components/PtForm';

type EditarPtPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditarPtPage({ params }: EditarPtPageProps) {
  const { id } = await params;

  return <PtForm ptId={id} />;
}
