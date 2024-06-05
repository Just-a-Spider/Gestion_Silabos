'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { currentCycle } from '@/constants';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { CreateCourseForm } from '../forms/courses/create_course';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  role: string;
  professors: any[];
  onCourseCreated: () => void;
}

/**
 * Renders a table of courses.
 *
 * @template TData - The type of data for each row in the table.
 * @template TValue - The type of values used for filtering and sorting the table.
 *
 * @param {DataTableProps<TData, TValue>} props - The props for the CoursesTable component.
 * @param {Array<DataTableColumn<TData, TValue>>} props.columns - The columns configuration for the table.
 * @param {Array<TData>} props.data - The initial data for the table.
 * @param {() => void} props.onCourseCreated - The callback function to be called when a course is created.
 */
export function CoursesTable<TData, TValue>({
  /**
   * @param initialData - The initial data for the table, we use an alias to avoid conflicts with the useState variable.
   * @param onCourseCreated - The callback function to be called when a course is created,
   *                          this will be passed to the CreateCourseForm component.
   */
  columns,
  data: initialData,
  role,
  professors,
  onCourseCreated,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = useState(initialData);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<string | null>(null);
  // Check if the screen is mobile.
  const isMobile = useMediaQuery({ query: '(max-width: 760px)' });

  useEffect(() => {
    setData(initialData);
    /**
     * Set the initial column filters based on the user's role.
     */
    setColumnFilters([
      { id: 'cycle', value: '1' },
      { id: 'semester', value: `${currentCycle}` },
      { id: 'name', value: '' },
    ]);
    if (role === 'professor') {
      setColumnFilters([
        { id: 'cycle', value: '' },
        { id: 'semester', value: `${currentCycle}` },
        { id: 'name', value: '' },
      ]);
    }
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

  /**
   * Get and set the filter value for a specific column.
   * We use the column ID and the value to set the filter value.
   *
   */
  const getFilterValue = (column: string) =>
    (table.getColumn(column)?.getFilterValue() as string) ?? '';
  const setFilterValue = (column: string, value: string) =>
    table.getColumn(column)?.setFilterValue(value);

  // Create an array of cycles from 1 to 14. We use useMemo to memoize the array.
  const cycles = useMemo(() => Array.from({ length: 14 }, (_, i) => i + 1), []);

  /**
   * Create a Select component for the "Ciclo" column.
   * By memoizing the component, we avoid re-rendering it on every state change.
   * Basically this component only re-renders when the filter value changes.
   * If we reload the page, the component will be re-rendered, but if the Table component
   * re-renders, this component will not re-render.
   */
  const SelectComponent = useMemo(
    () => (
      <Select
        value={getFilterValue('cycle')}
        onValueChange={(value) => {
          setFilterValue('cycle', value !== 'nofilter' ? value : '');
        }}
      >
        <SelectTrigger className="max-w-full md:max-w-16">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="nofilter">No Filtrar</SelectItem>
          {cycles.map((cycle) => (
            <SelectItem key={cycle} value={cycle.toString()}>
              {cycle}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    [getFilterValue('cycle')],
  );

  /**
   * Handle the course created event.
   * When a course is created, we call the onCourseCreated callback function.
   * This function is passed as a prop to the CoursesTable component.
   */
  function handleCourseCreated() {
    onCourseCreated();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center py-4 space-y-2 md:space-y-0 md:space-x-1">
        {SelectComponent}
        <Input
          /**
           * The logic with this input is the same as the SelectComponent.
           * We set the @param value to the filter value of the column.
           * Then we set the filter value when the input changes.
           */
          placeholder="Semestre"
          value={
            (table.getColumn('semester')?.getFilterValue() as string) ??
            `${currentCycle}`
          }
          onChange={(event) =>
            table.getColumn('semester')?.setFilterValue(event.target.value)
          }
          className="max-w-full md:max-w-24"
        />
        <Input
          placeholder="Nombre"
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-full md:max-w-96"
        />
      </div>
      <div className="rounded-md border overflow-x-auto">
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
                            <CreateCourseForm
                              onCourseCreated={handleCourseCreated}
                              professors={professors}
                              isMobile={isMobile}
                              courseToModify={row.original as any}
                            />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    )}
                  </TableRow>
                  {selectedRowIndex === row.id && !isMobile && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="pl-2">
                        <CreateCourseForm
                          onCourseCreated={handleCourseCreated}
                          professors={professors}
                          isMobile={isMobile}
                          courseToModify={row.original as any}
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
                  No se encontraron cursos para mostrar.
                </TableCell>
              </TableRow>
            )}
            {showAddCourse && !isMobile && (
              <TableRow>
                <TableCell colSpan={columns.length} className="pl-2">
                  <CreateCourseForm
                    /**
                     * Pass the onCourseCreated callback function to the CreateCourseForm component.
                     * This function is actually obtained form the MainView component.
                     * We get it from that component becuase that's where we fetch the courses.
                     */
                    onCourseCreated={handleCourseCreated}
                    professors={professors}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {role === 'coordinator' && !isMobile && (
        <div className="flex justify-center">
          <Button
            className={
              showAddCourse
                ? 'mt-4 bg-red-500 hover:bg-red-700'
                : 'mt-4 bg-cyan-600 hover:bg-cyan-800'
            }
            onClick={() => setShowAddCourse(!showAddCourse)}
            type="button"
          >
            {showAddCourse ? 'Cancelar' : 'Agregar Curso'}
          </Button>
        </div>
      )}
      {role === 'coordinator' && isMobile && (
        <div className="flex justify-center">
          <Dialog>
            <DialogTrigger>
              <div className="mt-4 bg-cyan-600 hover:bg-cyan-800 p-3 text-white rounded-lg text-sm">
                Agregar Curso
              </div>
            </DialogTrigger>
            <DialogContent>
              <CreateCourseForm
                /**
                 * Repeat the same logic as before
                 * But add the isMobile prop to the CreateCourseForm component.
                 */
                onCourseCreated={handleCourseCreated}
                professors={professors}
                isMobile={isMobile}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
