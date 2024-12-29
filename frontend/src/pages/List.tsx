import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCallback, useState } from 'react';
import { signOut } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { type DynamicData } from '../types';
import { useListItems, useDeleteItem, useUpdateItem, useCreateItem } from '../api/hooks';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Navbar } from "@/components/Navbar"
import { PageLayout, PageHeader, PageContent } from "@/components/PageLayout"

// Add dialog hook
const useDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false)
  };
};

const AppNavbar = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return (
    <nav className="border-b">
      <div className="container flex h-14 items-center justify-between">
        <h1 className="font-medium">Dynamic List</h1>
        <div className="flex items-center gap-4">
          <RouterLink 
            to="/"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Back to Dashboard
          </RouterLink>
          <Button 
            variant="destructive"
            size="sm"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
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
  const { isOpen, onOpen, onClose } = useDialog();
  const [selectedItem, setSelectedItem] = useState<DynamicData | null>(null);
  const [editForm, setEditForm] = useState<DynamicData>({} as DynamicData);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [newField, setNewField] = useState<FieldInput>({ name: '', value: '' });
  const [dynamicFields, setDynamicFields] = useState<{[key: string]: string}>({});

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
      await createMutation.mutateAsync(dynamicFields);
      onClose();
      setDynamicFields({});
    } catch (error) {
      console.error('Error creating item:', error);
    }
  }, [dynamicFields, createMutation]);

  const handleAddField = useCallback(() => {
    if (newField.name.trim()) {
      handleFieldChange(newField.name.trim(), newField.value);
      setNewField({ name: '', value: '' });
    }
  }, [newField]);

  const removeField = useCallback((fieldName: string) => {
    setDynamicFields(prev => {
      const newFields = { ...prev };
      delete newFields[fieldName];
      return newFields;
    });
  }, []);

  const handleFieldChange = useCallback((field: string, value: string) => {
    setDynamicFields(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleOpenCreate = useCallback(() => {
    setModalMode('create');
    setDynamicFields({});
    setNewField({ name: '', value: '' });
    onOpen();
  }, []);

  // Replace the loading state JSX with LoadingSpinner
  if (isLoading) {
    return <LoadingSpinner fullScreen />;
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
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(item)}
          >
            Edit
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(item.id)}
            className="text-destructive"
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
    <PageLayout>
      <Navbar 
        title="Dynamic List" 
        backLink={{ to: "/", label: "Back to Dashboard" }}
      />
      <PageContent>
        <PageHeader 
          title="Dynamic List"
          description="Manage your dynamic data entries"
        />
        
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Items List</CardTitle>
              <Button 
                onClick={handleOpenCreate} 
                size="sm"
              >
                Add New Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.key}>{column.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">
                      <span className="text-muted-foreground">
                        No items found. Add your first item to get started.
                      </span>
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id}>
                      {columns.map((column) => (
                        <TableCell key={`${item.id}-${column.key}`}>
                          {renderCell(item, column.key)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {modalMode === 'create' ? 'Add New Item' : 'Edit Item'}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {modalMode === 'create' 
                  ? 'Add a new item with custom fields and values'
                  : 'Modify the existing item fields and values'}
              </p>
            </DialogHeader>
            {modalMode === 'create' ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Field</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Field Name</label>
                        <Input
                          placeholder="Enter field name"
                          value={newField.name}
                          onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Field Value</label>
                        <Input
                          placeholder="Enter value"
                          value={newField.value}
                          onChange={(e) => setNewField(prev => ({ ...prev, value: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleAddField}
                      disabled={!newField.name.trim()}
                      variant="secondary"
                      className="w-full"
                    >
                      Add Field
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Added Fields {Object.keys(dynamicFields).length > 0 && 
                        `(${Object.keys(dynamicFields).length})`}
                    </span>
                    {Object.keys(dynamicFields).length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDynamicFields({})}
                        className="text-destructive"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {Object.entries(dynamicFields).map(([field, value]) => (
                      <div key={field} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <div className="font-medium">{field}</div>
                          <div className="text-sm text-muted-foreground">{value}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeField(field)}
                          className="text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(editForm)
                  .filter(([key]) => key !== 'id')
                  .map(([fieldName, value]) => (
                    <div key={fieldName} className="grid gap-2">
                      <label className="text-sm font-medium">{fieldName}</label>
                      <Input
                        value={value as string}
                        onChange={(e) => setEditForm(prev => ({
                          ...prev,
                          [fieldName]: e.target.value
                        }))}
                      />
                    </div>
                  ))}
              </div>
            )}
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={onClose}
                size="sm"
              >
                Cancel
              </Button>
              <Button 
                onClick={modalMode === 'create' ? handleCreate : handleUpdate}
                disabled={(modalMode === 'create' && Object.keys(dynamicFields).length === 0) ||
                         (modalMode === 'edit' && Object.keys(editForm).length <= 1)}
                size="sm"
              >
                {modalMode === 'create' ? 'Create' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContent>
    </PageLayout>
  );
}
