export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;

  subtitle: string;
}) {
  return (
    <div
      style={{
        marginBottom: "40px",
      }}
    >
      <h1
        style={{
          fontSize: "52px",
          fontWeight: "bold",
          color: "#111827",
          marginBottom: "10px",
        }}
      >
        {title}
      </h1>

      <p
        style={{
          color: "#6b7280",
          fontSize: "20px",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}