import { db } from "@/db/drizzle";
import { ilike, or, sql, asc, desc, SQL, Column } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import type { PgTable } from "drizzle-orm/pg-core";

/**
 * Cria um handler GET reutilizável para listagem com busca, ordenação e paginação.
 *
 * @param table Tabela do Drizzle (ex: note)
 * @param allowedOrderFields Campos permitidos para ordenação (chave: string, valor: coluna)
 */
export function getListHandler(
  table: PgTable,
  allowedOrderFields: Record<string, Column | SQL>
) {
  return async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search")?.trim() || "";
    const orderBy = searchParams.get("orderBy") || "createdAt";
    const orderDir = searchParams.get("orderDir") || "desc";

    const orderField =
      allowedOrderFields[orderBy] ?? Object.values(allowedOrderFields)[0];

    const offset = (page - 1) * limit;

    const searchConditions = Object.values(table).map((field) =>
      ilike(sql`${field}::text`, `%${search}%`)
    );

    const whereClause = or(...searchConditions);

    try {
      const items = await db
        .select()
        .from(table)
        .where(whereClause)
        .orderBy(orderDir === "asc" ? asc(orderField) : desc(orderField))
        .limit(limit)
        .offset(offset);

      const total = await db
        .select({ count: sql<number>`count(*)` })
        .from(table)
        .where(whereClause)
        .then((rows) => Number(rows[0].count));

      return NextResponse.json({
        data: items,
        total,
        page,
        limit,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Erro ao buscar dados" },
        { status: 500 }
      );
    }
  };
}
