interface THProps {
  children: React.ReactNode;
  right?: boolean;
}

interface TDProps {
  children: React.ReactNode;
  right?: boolean;
  mono?: boolean;
}

export function TH({ children, right }: THProps) {
  return (
    <th
      className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider ${right ? "text-right" : ""}`}
      style={{
        color: "var(--text-secondary)",
        borderBottom: "1px solid var(--bg-subtle)",
        background: "var(--bg-surface)",
      }}
    >
      {children}
    </th>
  );
}

export function TD({ children, right, mono }: TDProps) {
  return (
    <td
      className={`px-5 py-4 text-sm ${right ? "text-right" : ""} ${mono ? "font-mono" : ""}`}
      style={{ color: "var(--text-secondary)" }}
    >
      {children}
    </td>
  );
}
