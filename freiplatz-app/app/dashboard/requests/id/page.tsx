import { getPlacementRequest } from "@/lib/requests/get-requests";
import { getPlacementInterests } from "@/lib/placements/get-interests";
import { notFound } from "next/navigation";
import ExpressInterestButton from "@/components/requests/ExpressInterestButton";

export default async function InterestsPage({
  params,
}: {
  params: { id: string };
}) {
  const request = await getPlacementRequest(params.id);

  if (!request) {
    notFound();
  }

  <ExpressInterestButton
  requestId={request.id}
/>

  const interests = await getPlacementInterests(params.id);

  return (
    <main>
      <h1>{request.case_number}</h1>

      <InterestedFacilities
        requestId={request.id}
        interests={interests}
      />
    </main>
  );
}