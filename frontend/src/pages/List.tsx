import {
  Navbar, NavbarBrand, NavbarContent, Card, CardBody, Link, Table,
  TableHeader, TableBody, TableColumn, TableRow, TableCell, Button, Spinner,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure
} from '@nextui-org/react';
import { Link as RouterLink } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { signOut } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { type DynamicData } from '../types';
import { useListItems, useDeleteItem, useUpdateItem, useCreateItem } from '../api/hooks';

const AppNavbar = () => {
  const navigate = useNavigate();
  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [navigate]);

  return (
    <Navbar className="border-b border-divider bg-background/70 backdrop-blur-sm">
      <NavbarBrand>
        <h1 className="font-bold text-inherit text-xl">Dynamic List</h1>
      </NavbarBrand>
      <NavbarContent justify="end" className="gap-4">
        <Link 
          as={RouterLink} 
          to="/"
          className="text-foreground hover:text-primary transition-colors"
        >
          Back to Home
        </Link>
        <Button 
          color="danger" 
          variant="flat" 
          onClick={handleSignOut}
          size="sm"
          className="font-medium"
        >
          Sign Out
        </Button>
      </NavbarContent>
    </Navbar>
  );
};

interface FieldInput {
  name: string;
  value: string;
}

// Simplify the table structure
export function List() {
  const { data: items = [], isLoading } = useListItems();
  const deleteMutation = useDeleteItem();
  const updateMutation = useUpdateItem();
  const createMutation = useCreateItem();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<DynamicData | null>(null);
  const [editForm, setEditForm] = useState<DynamicData>({} as DynamicData);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [newField, setNewField] = useState<FieldInput>({ name: '', value: '' });

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }, [deleteMutation]);

  const handleEdit = useCallback((item: DynamicData) => {
    setSelectedItem(item);
    setEditForm(item);
    setModalMode('edit');
    onOpen();
  }, []);

  const handleUpdate = useCallback(async () => {
    if (!selectedItem?.id) return;
    try {
      await updateMutation.mutateAsync({ 
        id: selectedItem.id, 
        data: editForm 
      });
      onClose();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  }, [selectedItem, editForm, updateMutation]);

  const handleCreate = useCallback(async () => {
    try {
      const { id, ...data } = editForm;  // Remove ID from the data sent to API
      await createMutation.mutateAsync(data);
      onClose();
    } catch (error) {
      console.error('Error creating item:', error);
    }
  }, [editForm, createMutation]);

  const openCreateModal = useCallback(() => {
    setModalMode('create');
    setEditForm({ id: crypto.randomUUID(), name: '' } as DynamicData);
    setNewField({ name: '', value: '' });
    onOpen();
  }, []);

  const handleAddField = useCallback(() => {
    if (newField.name.trim()) {
      setEditForm(prev => ({
        ...prev,
        [newField.name.trim()]: newField.value
      }));
      setNewField({ name: '', value: '' });
    }
  }, [newField]);

  const removeField = useCallback((fieldName: string) => {
    setEditForm(prev => {
      const newForm = { ...prev };
      delete newForm[fieldName];
      return newForm;
    });
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-50">
        <Spinner size="lg" />
      </div>
    );
  }

  // Get all unique keys from items
  const columnKeys = Array.from(new Set(
    items.flatMap(item => Object.keys(item))
  )).filter(key => key !== 'id'); // Put ID first

  const columns = [
    { key: "id", label: "ID" },
    ...columnKeys.map(key => ({
      key,
      label: key.toUpperCase()
    })),
    { key: "actions", label: "ACTIONS" }
  ];

  const renderCell = (item: DynamicData, columnKey: React.Key) => {
    if (columnKey === "actions") {
      return (
        <div className="flex gap-2">
          <Button 
            color="primary" 
            variant="flat" 
            size="sm"
            onClick={() => handleEdit(item)}
          >
            Edit
          </Button>
          <Button 
            color="danger" 
            variant="flat" 
            size="sm"
            onClick={() => handleDelete(item.id)}
          >
            Delete
          </Button>
        </div>
      );
    }
    
    const value = item[columnKey as keyof DynamicData];
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value ?? '');
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 to-violet-50">
      <AppNavbar />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardBody>
            <div className="flex justify-end mb-4">
              <Button 
                color="primary"
                onClick={openCreateModal}
              >
                Add New
              </Button>
            </div>
            <Table
              aria-label="Items table"
              removeWrapper
              classNames={{
                base: "min-h-[100px]",
                emptyWrapper: "h-[300px]" // Changed from 'empty' to 'emptyWrapper'
              }}
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.key}>
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                items={items}
                emptyContent={items.length === 0 ? "No data found" : undefined}
              >
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            {modalMode === 'create' ? 'Add New Item' : 'Edit Item'}
          </ModalHeader>
          <ModalBody>
            {modalMode === 'create' && (
              <Card className="bg-default-50 mb-4">
                <CardBody>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                      <Input
                        label="Field Name"
                        placeholder="Enter field name"
                        value={newField.name}
                        onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                        className="flex-1"
                      />
                      <Input
                        label="Field Value"
                        placeholder="Enter value"
                        value={newField.value}
                        onChange={(e) => setNewField(prev => ({ ...prev, value: e.target.value }))}
                        className="flex-1"
                      />
                      <Button
                        color="primary"
                        onClick={handleAddField}
                        className="mt-1"
                        isDisabled={!newField.name.trim()}
                      >
                        Add Field
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {Object.entries(editForm)
              .filter(([key]) => key !== 'id')
              .map(([fieldName, value]) => (
                <div key={fieldName} className="flex gap-2 mb-4">
                  <Input
                    label={fieldName.toUpperCase()}
                    value={String(value || '')}
                    onChange={(e) => setEditForm(prev => ({
                      ...prev,
                      [fieldName]: e.target.value
                    }))}
                    className="flex-1"
                  />
                  {modalMode === 'create' && (
                    <Button
                      color="danger"
                      variant="light"
                      onClick={() => removeField(fieldName)}
                      className="mt-1"
                      isIconOnly
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}

            {modalMode === 'create' && Object.keys(editForm).length === 0 && (
              <div className="text-center text-default-400">
                Add fields using the form above
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button 
              color="primary" 
              onPress={modalMode === 'create' ? handleCreate : handleUpdate}
            >
              {modalMode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
