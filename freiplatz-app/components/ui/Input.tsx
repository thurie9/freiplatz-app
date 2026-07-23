export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;

  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  placeholder?: string;

  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "18px",
        border: "none",
        borderRadius: "18px",
        background: "#f5f7fb",
        fontSize: "16px",
        color: "#111827",
        outline: "none",
      }}
    />
  );
}