import { 
  Navbar, NavbarBrand, NavbarContent, Card, CardBody, Link, Spinner, Table, 
  TableHeader, TableBody, TableColumn, TableRow, TableCell, Button, Modal, 
  ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure 
} from '@nextui-org/react';
import { Link as RouterLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

interface DynamicData {
  id: string;
  [key: string]: string | number | boolean | object;
}

interface FieldInput {
  name: string;
  value: string;
}

export function People() {
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

  const fetchData = () => {
    // Data is automatically fetched by useItems()
    setErrorMessage('');
  };

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync(formData);
      onClose();
    } catch (err) {
      setErrorMessage('Failed to create item');
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem?.id) return;
    try {
      await updateMutation.mutateAsync({ id: selectedItem.id, data: formData });
      onClose();
    } catch (err) {
      setErrorMessage('Failed to update item');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      setErrorMessage('Failed to delete item');
    }
  };

  const handleAddField = () => {
    if (newField.name.trim()) {
      setFormData({
        ...formData,
        [newField.name.trim()]: newField.value
      });
      setNewField({ name: '', value: '' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newField.name) {
      handleAddField();
    }
  };

  const removeField = (fieldName: string) => {
    const newFormData = { ...formData };
    delete newFormData[fieldName];
    setFormData(newFormData);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ id: crypto.randomUUID() });
    setNewField({ name: '', value: '' });
    onOpen();
  };

  const openEditModal = (item: DynamicData) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormData(item);
    setNewField({ name: '', value: '' });
    onOpen();
  };

  useEffect(() => {
    fetchData();
  }, [isOpen]);

  // Get unique columns from data with proper typing
  const columns: string[] = Array.from(new Set(
    data.flatMap((item: DynamicData) => Object.keys(item))
  )).filter(key => key !== 'id');

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 to-violet-50">
      <Navbar className="border-b border-divider bg-background/70 backdrop-blur-sm">
        <NavbarBrand>
          <h1 className="font-bold text-inherit text-xl">Dynamic Data</h1>
        </NavbarBrand>
        <NavbarContent justify="end" className="gap-4">
          <Button color="primary" onClick={openCreateModal} size="sm">
            Add New
          </Button>
          <Link as={RouterLink} to="/" className="text-foreground hover:text-primary transition-colors">
            Back to Home
          </Link>
        </NavbarContent>
      </Navbar>

      <main className="max-w-[1024px] mx-auto px-6 pt-6">
        <Card className="shadow-md">
          <CardBody className="p-6">
            {errorMessage && <p className="text-danger text-center mb-4">{errorMessage}</p>}
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Spinner size="lg" />
              </div>
            ) : data.length > 0 ? (
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
                  {data.map((item: DynamicData) => (
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
                              <Button size="sm" color="primary" onPress={() => openEditModal(item)}>
                                Edit
                              </Button>
                              <Button size="sm" color="danger" onPress={() => handleDelete(item.id)}>
                                Delete
                              </Button>
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
            ) : (
              <p className="text-center text-default-600">No data available</p>
            )}
          </CardBody>
        </Card>
      </main>

      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent className="m-4">
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
                        onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Input
                        label="Field Value"
                        placeholder="Enter value"
                        value={newField.value}
                        onChange={(e) => setNewField({ ...newField, value: e.target.value })}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button
                        color="primary"
                        onClick={handleAddField}
                        className="mt-1"
                        isDisabled={!newField.name.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="text-sm text-default-400">
                      Press Enter to quickly add fields
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            <div className="space-y-4">
              <Input
                label="ID"
                value={formData.id || ''}
                isDisabled
                className="mb-4"
              />
              {Object.entries(formData)
                .filter(([key]) => key !== 'id')
                .map(([fieldName, value]) => (
                  <div key={fieldName} className="flex gap-2">
                    <Input
                      label={fieldName.toUpperCase()}
                      value={String(value || '')}
                      onChange={(e) => setFormData({...formData, [fieldName]: e.target.value})}
                      className="flex-grow"
                    />
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => removeField(fieldName)}
                      className="mt-1"
                      isIconOnly
                    >
                      ✕
                    </Button>
                  </div>
                ))}
            </div>

            {Object.keys(formData).length <= 1 && (
              <div className="text-center text-default-400 mt-4">
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
              isDisabled={Object.keys(formData).length <= 1}
            >
              {modalMode === 'create' ? 'Create' : 'Update'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
