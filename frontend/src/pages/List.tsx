import { 
  Navbar, NavbarBrand, NavbarContent, Card, CardBody, Link, Spinner, Table, 
  TableHeader, TableBody, TableColumn, TableRow, TableCell, Button, Modal, 
  ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure 
} from '@nextui-org/react';
import { Link as RouterLink } from 'react-router-dom';
import { useState, useEffect, useCallback, memo } from 'react';
import { useApi } from '../hooks/useApi';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface DynamicData {
  id: string;
  [key: string]: string | number | boolean | object;
}

interface FieldInput {
  name: string;
  value: string;
}

// Memoized table component
const DataTable = memo(({ data, columns, onEdit, onDelete }: {
  data: DynamicData[];
  columns: string[];
  onEdit: (item: DynamicData) => void;
  onDelete: (id: string) => void;
}) => (
  <Table aria-label="Dynamic data table">
    <TableHeader>
      {[
        { key: 'id', label: 'ID' },
        ...columns.map(column => ({ key: column, label: column.toUpperCase() })),
        { key: 'actions', label: 'ACTIONS' }
      ].map(({ key, label }) => (
        <TableColumn key={key}>{label}</TableColumn>
      ))}
    </TableHeader>
    <TableBody>
      {data.map((item) => (
        <TableRow key={item.id}>
          {[
            { key: 'id', content: item.id },
            ...columns.map(column => ({
              key: `${item.id}-${column}`,
              content: typeof item[column] === 'object' 
                ? JSON.stringify(item[column]) 
                : String(item[column] ?? '-')
            })),
            {
              key: `${item.id}-actions`,
              content: (
                <div className="flex gap-2">
                  <Button size="sm" color="primary" onPress={() => onEdit(item)}>Edit</Button>
                  <Button size="sm" color="danger" onPress={() => onDelete(item.id)}>Delete</Button>
                </div>
              )
            }
          ].map(({ key, content }) => (
            <TableCell key={key}>{content}</TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
));

DataTable.displayName = 'DataTable';

export function List() {
  const { useItems, useCreateItem, useUpdateItem, useDeleteItem } = useApi();
  const { data: apiData, isLoading } = useItems();
  const data = (apiData || []) as DynamicData[];
  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();
  const deleteMutation = useDeleteItem();
  
  const [selectedItem, setSelectedItem] = useState<DynamicData | null>(null);
  const [formData, setFormData] = useState<DynamicData>({} as DynamicData);
  const [newField, setNewField] = useState<FieldInput>({ name: '', value: '' });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const columns = Array.from(new Set(
    data.flatMap(item => Object.keys(item))
  )).filter(key => key !== 'id');

  const handleCreate = useCallback(async () => {
    try {
      await createMutation.mutateAsync(formData);
      onClose();
    } catch (err) {
      setErrorMessage('Failed to create item');
    }
  }, [createMutation, formData, onClose]);

  // ...rest of the handlers with useCallback...

  useEffect(() => {
    setErrorMessage('');
  }, [isOpen]);

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 to-violet-50">
      <Navbar className="border-b border-divider bg-background/70 backdrop-blur-sm">
        <NavbarBrand>
          <h1 className="font-bold text-inherit text-xl">Dynamic List</h1>
        </NavbarBrand>
        <NavbarContent justify="end" className="gap-4">
          <Button color="primary" onClick={openCreateModal} size="sm">
            Add New
          </Button>
          <Link as={RouterLink} to="/home" className="text-foreground hover:text-primary transition-colors">
            Back to Home
          </Link>
        </NavbarContent>
      </Navbar>

      <main className="max-w-[1024px] mx-auto px-6 pt-6">
        <Card className="shadow-md">
          <CardBody className="p-6">
            {errorMessage && <p className="text-danger text-center mb-4">{errorMessage}</p>}
            {data.length > 0 ? (
              <DataTable 
                data={data} 
                columns={columns}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ) : (
              <p className="text-center text-default-600">No data available</p>
            )}
          </CardBody>
        </Card>
      </main>

      {/* ...existing modal code... */}
    </div>
  );
}
