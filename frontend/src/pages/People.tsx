import { 
  Navbar, NavbarBrand, NavbarContent, Card, CardBody, Link, Spinner, Table, 
  TableHeader, TableBody, TableColumn, TableRow, TableCell, Button, Modal, 
  ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure 
} from '@nextui-org/react';
import { Link as RouterLink } from 'react-router-dom';
import { useState, useEffect, ReactElement } from 'react';
import { get, post, del, put } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';

interface DynamicData {
  id: string;
  [key: string]: any;
}

interface FieldInput {
  name: string;
  value: string;
}

interface ApiError {
  message: string;
  statusCode?: number;
}

const useApi = () => {
  const updateItem = async (id: string, data: DynamicData) => {
    const session = await fetchAuthSession();
    return put({
      apiName: 'myApi',
      path: `/crud/${id}`,
      options: {
        headers: {
          Authorization: `Bearer ${session.tokens?.idToken?.toString()}`,
          'Content-Type': 'application/json'
        },
        body: data
      }
    });
  };

  return { updateItem };
};

export function People() {
  const [data, setData] = useState<DynamicData[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<DynamicData | null>(null);
  const [formData, setFormData] = useState<DynamicData>({} as DynamicData);
  const [newField, setNewField] = useState<FieldInput>({ name: '', value: '' });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const { updateItem } = useApi();

  const fetchData = async () => {
    setIsLoading(true);
    try {
        const session = await fetchAuthSession();
        const response = await get({
            apiName: 'myApi',
            path: '/crud',
            options: {
                headers: {
                    'Authorization': `Bearer ${session.tokens?.idToken?.toString()}`
                },
                withCredentials: false
            }
        }).response;
        const json = await response.body.json();
        setData(Array.isArray(json) ? json.map(item => item as DynamicData) : []);
        setError('');
    } catch (err) {
        setError('Failed to fetch data');
        // Remove the setTimeout(fetchData, 3000);
    } finally {
        setIsLoading(false);
    }
};

  const handleCreate = async () => {
    try {
      const session = await fetchAuthSession();
      const response = await post({
        apiName: 'myApi',
        path: '/crud',
        options: {
          headers: {
            'Authorization': `Bearer ${session.tokens?.idToken?.toString()}`
          },
          body: formData
        }
      }).response;
      
      const newItem = await response.body.json() as DynamicData;
      setData(prevData => [...prevData, newItem]);
      onClose();
    } catch (err) {
      setError('Failed to create item');
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem?.id) {
      setError('No item selected for update');
      return;
    }

    setIsLoading(true);

    try {
      // Optimistic update
      const updatedData = data.map(item => 
        item.id === selectedItem.id ? formData : item
      );
      setData(updatedData);
      
      await updateItem(selectedItem.id, formData);
      onClose();
      setError('');
    } catch (err: unknown) {
      console.error('Update error:', err);
      const error = err as ApiError;
      setError(error.message || 'Failed to update item');
      setData(data); // Revert optimistic update
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      setError('Invalid item ID');
      return;
    }

    setData(prevData => prevData.filter(item => item.id !== id));
    
    try {
      const session = await fetchAuthSession();
      await del({
        apiName: 'myApi',
        path: `/crud/${id}`,
        options: {
          headers: {
            'Authorization': `Bearer ${session.tokens?.idToken?.toString()}`
          }
        }
      });
      setError('');
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete item');
      fetchData(); // Revert optimistic update
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
            {error && <p className="text-danger text-center mb-4">{error}</p>}
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Spinner size="lg" />
              </div>
            ) : data.length > 0 ? (
<Table aria-label="Dynamic data table">
  <TableHeader>
    <TableColumn>ID</TableColumn>
    {Array.from(new Set(data.flatMap(item => Object.keys(item))))
      .filter(key => key !== 'id')
      .map((column: string) => (
        <TableColumn key={column}>{column.toUpperCase()}</TableColumn>
      )) as unknown as ReactElement}
    <TableColumn>ACTIONS</TableColumn>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.id}</TableCell>
        {Array.from(new Set(data.flatMap(item => Object.keys(item))))
          .filter(key => key !== 'id')
          .map((column: string) => (
            <TableCell key={`${item.id}-${column}`}>
              {typeof item[column] === 'object' 
                ? JSON.stringify(item[column]) 
                : String(item[column] ?? '-')}
            </TableCell>
          )) as unknown as ReactElement}
        <TableCell>
          <div className="flex gap-2">
            <Button size="sm" color="primary" onPress={() => openEditModal(item)}>
              Edit
            </Button>
            <Button size="sm" color="danger" onPress={() => handleDelete(item.id)}>
              Delete
            </Button>
          </div>
        </TableCell>
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
                      value={value || ''}
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
