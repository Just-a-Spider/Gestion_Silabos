'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Fragment, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { RegisterProfessorForm } from '../forms/auth/register-prof';
import { Button } from '../ui/button';
import { DialogContent } from '../ui/dialog';
import { Input } from '../ui/input';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  role: string;
  onProfessorRegistered: () => void;
}

export function ProfessorsTable<TData, TValue>({
  /**
   * @param initialData - The initial data for the table, we use an alias to
   *                       avoid conflicts with the useState variable.
   * @param onProfessorRegistered - The callback function to be called when
   *                                a professor is registered, this will be
   *                               passed to the RegisterProfessorForm component.
   */
  columns,
  data: initialData,
  role,
  onProfessorRegistered,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = useState(initialData);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showAddProfessor, setShowAddProfessor] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<string | null>(null);

  // Check if the screen is mobile
  const isMobile = useMediaQuery({ query: '(max-width: 760px)' });

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const table = useReactTable({
    /**
     * We define the table here using the useReactTable hook.
     * We pass the data, columns, and the state of the column filters.
     * We can also add thin to sort and stuff like that.
     * @param state - The state of the table. We can use this to get the column filters.
     */
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center py-4 space-y-2 md:space-y-0 md:space-x-1">
        <Input
          /**
           * The logic with this input is the same as the SelectComponent.
           * We set the @param value to the filter value of the column.
           * Then we set the filter value when the input changes.
           */
          placeholder="DNI"
          value={(table.getColumn('dni')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('dni')?.setFilterValue(event.target.value)
          }
          className="max-w-fit"
        />
      </div>
      <div className="rounded-md border overflow-x-auto bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : /**
                           * FlexRender is a utility function that renders a component or a function
                           * based on the context passed to it.
                           * In this case the context is the header column and the header context.
                           */
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                    {role === 'coordinator' && !isMobile && (
                      <TableCell>
                        <Button
                          onClick={() =>
                            setSelectedRowIndex(
                              selectedRowIndex === row.id ? null : row.id,
                            )
                          }
                          className={
                            selectedRowIndex === row.id
                              ? 'mt-4 bg-red-500 hover:bg-red-700'
                              : 'mt-4 bg-cyan-600 hover:bg-cyan-800'
                          }
                        >
                          {selectedRowIndex === row.id ? 'Cancelar' : 'Editar'}
                        </Button>
                      </TableCell>
                    )}
                    {role === 'coordinator' && isMobile && (
                      <TableCell>
                        <Dialog>
                          <DialogTrigger>
                            <div className="mt-4 bg-cyan-600 hover:bg-cyan-800 p-3 text-white rounded-lg text-sm">
                              Editar
                            </div>
                          </DialogTrigger>
                          <DialogContent>
                            <RegisterProfessorForm
                              /**
                               * Pass the onProfessorRegistered callback to the RegisterProfessorForm component.
                               * This will be called when a professor is registered. Re-fetching the professors.
                               * And thus re-rendering the table.
                               */
                              onProfessorRegistered={() => {
                                onProfessorRegistered();
                                setShowAddProfessor(false);
                              }}
                              isMobile={isMobile}
                              professorToModify={row.original as any}
                            />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    )}
                  </TableRow>
                  {selectedRowIndex === row.id && !isMobile && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="pl-2">
                        <RegisterProfessorForm
                          onProfessorRegistered={() => {
                            onProfessorRegistered();
                            setShowAddProfessor(false);
                          }}
                          professorToModify={row.original as any}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
            {showAddProfessor && !isMobile && (
              <TableRow>
                <TableCell colSpan={columns.length} className="pl-2">
                  <RegisterProfessorForm
                    /**
                     * Pass the onProfessorRegistered callback to the RegisterProfessorForm component.
                     * This will be called when a professor is registered. Re-fetching the professors.
                     * And thus re-rendering the table.
                     */
                    onProfessorRegistered={() => {
                      onProfessorRegistered();
                      setShowAddProfessor(false);
                    }}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {isMobile ? (
        <div className="flex justify-center">
          <Dialog>
            <DialogTrigger>
              <div className="mt-4 bg-cyan-600 hover:bg-cyan-800 p-3 text-white rounded-lg text-sm">
                Registrar Docente
              </div>
            </DialogTrigger>
            <DialogContent>
              <RegisterProfessorForm
                onProfessorRegistered={() => {
                  onProfessorRegistered();
                  setShowAddProfessor(false);
                }}
                isMobile={isMobile}
              />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button
            className={
              showAddProfessor
                ? 'mt-4 bg-red-500 hover:bg-red-700'
                : 'mt-4 bg-cyan-600 hover:bg-cyan-800'
            }
            onClick={() => setShowAddProfessor(!showAddProfessor)}
            type="button"
          >
            {showAddProfessor ? 'Cancelar' : 'Registrar Docente'}
          </Button>
        </div>
      )}
    </div>
  );
}
