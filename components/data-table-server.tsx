"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading/loading";
import { X } from "lucide-react";

interface DataTableServerProps<TData, TValue> {
  endpoint: string;
  columns: ColumnDef<TData, TValue>[];
}

export function DataTableServer<TData, TValue>({
  endpoint,
  columns,
}: DataTableServerProps<TData, TValue>) {
  const [inputSearch, setInputSearch] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [orderBy, setOrderBy] = useState("title");

  const { data, error, isLoading } = useSWR(
    `${endpoint}?page=${page}&limit=${limit}&search=${encodeURIComponent(
      search
    )}&orderBy=${orderBy}`,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Erro ao buscar dados");
      return res.json();
    }
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = Math.ceil((data?.total || 0) / limit);

  const handleSubmitSearch = () => {
    setSearch(inputSearch);
    setPage(1);
  };

  const handleClearSearch = () => {
    setInputSearch("");
    setSearch("");
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <p className="p-6 text-red-600">
        Erro ao carregar dados: {error.message}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex items-end gap-4 mt-4 flex-wrap">
        {/* Campo de busca */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitSearch();
          }}
          className="relative w-80"
        >
          <Input
            type="text"
            placeholder="🔍 Filtrar por nome..."
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            className="pr-10"
          />
          {inputSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
            >
              <X size={16} />
            </button>
          )}
        </form>

        {/* Ordenar por */}
        <div className="w-48">
          <label className="text-sm font-medium block mb-1">Ordenar por</label>
          <Select value={orderBy} onValueChange={setOrderBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Ordenar por">
                {orderBy === "title"
                  ? "Título"
                  : orderBy === "createdAt"
                  ? "Data de Criação"
                  : "Última Atualização"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Título</SelectItem>
              <SelectItem value="createdAt">Data de Criação</SelectItem>
              <SelectItem value="updatedAt">Última Atualização</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Itens por página */}
        <div className="w-48">
          <label className="text-sm font-medium block mb-1">
            Itens por página
          </label>
          <Select
            value={String(limit)}
            onValueChange={(value) => {
              setLimit(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Itens por página">{limit}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botão pesquisar */}
        <div>
          <label className="block h-5" />
          <Button onClick={handleSubmitSearch}>Pesquisar</Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Anterior
        </Button>
        <span>
          Página {page} de {totalPages} de {data?.total || 0} registos
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
