import OsmForm from '@/components/OsmForm';

type EditarOsmPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditarOsmPage({ params }: EditarOsmPageProps) {
  const { id } = await params;
  return <OsmForm osmId={id} />;
}

