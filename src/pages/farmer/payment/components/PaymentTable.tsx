import React, { useState } from "react";

export interface ColumnDef<T> {
  header: string;
  width?: string;
  align?: "left" | "right" | "center";
  render: (row: T) => React.ReactNode;
}

interface PaymentTableProps<T> {
  columns: ColumnDef<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  accentColor: string;
  pageSize?: number;
}

function alignClass(align?: "left" | "right" | "center"): string {
  if (align === "right") return "text-right justify-end";
  if (align === "center") return "text-center justify-center";
  return "text-left justify-start";
}

export function PaymentTable<T>({
  columns,
  rows,
  rowKey,
  accentColor,
  pageSize,
}: PaymentTableProps<T>) {
  const [page, setPage] = useState(0);

  const paginated = pageSize
    ? rows.slice(page * pageSize, (page + 1) * pageSize)
    : rows;
  const totalPages = pageSize ? Math.ceil(rows.length / pageSize) : 1;

  const gridCols = columns.map((c) => c.width ?? "1fr").join(" ");

  return (
    <div>
      <div
        className="grid items-center px-5 py-2.5 text-xs font-semibold uppercase tracking-widest"
        style={{
          gridTemplateColumns: gridCols,
          color: "var(--neutral-500)",
          borderBottom: "1px solid var(--bg-overlay)",
          background: "var(--bg-surface)",
        }}
      >
        {columns.map((col) => (
          <span key={col.header} className={alignClass(col.align)}>
            {col.header}
          </span>
        ))}
      </div>

      {paginated.map((row, i) => (
        <div
          key={rowKey(row)}
          className="grid items-center px-5 py-4 transition-colors duration-150"
          style={{
            gridTemplateColumns: gridCols,
            borderTop: i > 0 ? "1px solid var(--bg-overlay)" : undefined,
            background: "transparent",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = `${accentColor}08`)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          {columns.map((col) => (
            <div
              key={col.header}
              className={`flex items-center ${alignClass(col.align)}`}
            >
              {col.render(row)}
            </div>
          ))}
        </div>
      ))}

      {pageSize && totalPages > 1 && (
        <div
          className="flex items-center justify-between px-5 py-2.5"
          style={{
            borderTop: "1px solid var(--bg-overlay)",
            background: "var(--bg-surface)",
          }}
        >
          <span className="text-xs" style={{ color: "var(--neutral-500)" }}>
            Showing{" "}
            <span style={{ color: "var(--text-secondary)" }}>
              {page * pageSize + 1}–
              {Math.min((page + 1) * pageSize, rows.length)}
            </span>{" "}
            of{" "}
            <span style={{ color: "var(--text-secondary)" }}>
              {rows.length}
            </span>
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-2.5 py-1 rounded text-xs transition-colors disabled:opacity-30"
              style={{
                background: "var(--bg-overlay)",
                color:
                  page === 0 ? "var(--neutral-700)" : "var(--text-secondary)",
                border: "1px solid var(--bg-subtle)",
                cursor: page === 0 ? "not-allowed" : "pointer",
              }}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className="w-7 h-7 rounded text-xs font-medium transition-colors"
                style={{
                  background: i === page ? accentColor : "var(--bg-overlay)",
                  color:
                    i === page ? "var(--text-primary)" : "var(--neutral-400)",
                  border: `1px solid ${i === page ? accentColor : "var(--bg-subtle)"}`,
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page === totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="px-2.5 py-1 rounded text-xs transition-colors disabled:opacity-30"
              style={{
                background: "var(--bg-overlay)",
                color:
                  page === totalPages - 1
                    ? "var(--neutral-700)"
                    : "var(--text-secondary)",
                border: "1px solid var(--bg-subtle)",
                cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
 