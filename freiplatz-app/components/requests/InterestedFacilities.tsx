interface Props {
  requestId: string;
  interests: any[];
}

export default function InterestedFacilities({
  interests,
}: Props) {
  return (
    <div>
      <h2>
        Interessierte Einrichtungen ({interests.length})
      </h2>

      {interests.map((interest) => (
        <div key={interest.id}>
          <h3>{interest.profiles.name}</h3>

          <p>{interest.profiles.city}</p>

          <button>
            Einrichtung auswählen
          </button>
        </div>
      ))}
    </div>
  );
}