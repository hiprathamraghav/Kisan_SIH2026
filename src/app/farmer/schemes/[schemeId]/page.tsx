import { FarmerApp } from "../../../components/prototype/farmer-app";

export default async function FarmerSchemeDetailPage({ params }: { params: Promise<{ schemeId: string }> }) {
  const { schemeId } = await params;
  return <FarmerApp screen="scheme-detail" schemeId={schemeId} />;
}
