import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/Navbar"
import { PageLayout, PageHeader, PageContent } from "@/components/PageLayout"
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DataTable } from "@/components/DataTable"
import { useListItems, useDeleteItem, useUpdateItem, useCreateItem } from '@/hooks/useItems';
import { useDialog } from '@/hooks/useDialog';
import { useItemForm } from '@/hooks/useItemForm';
import { ItemFormDialog } from '@/components/ItemFormDialog';
import { type ColumnDef, Row } from "@tanstack/react-table"
import { useMemo, useCallback } from 'react';
import { type DynamicData } from '@/types';
import { v4 as uuidv4 } from 'uuid';  // Add this import

export function List() {
  const { data, isLoading } = useListItems();
  const items = data || [];
  const { mutateAsync: deleteItem } = useDeleteItem();
  const { mutateAsync: updateItem } = useUpdateItem();
  const { mutateAsync: createItem } = useCreateItem();
  const { isOpen, onOpen, onClose } = useDialog();
  const {
    selectedItem,
    setSelectedItem,
    editForm,
    setEditForm,
    modalMode,
    setModalMode,
    dynamicFields,
    setDynamicFields,
    resetForm,
    newField,
    setNewField
  } = useItemForm();

  // Define handlers first
  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteItem(id);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }, [deleteItem]);

  const handleEdit = useCallback((item: DynamicData) => {
    setSelectedItem(item);
    setEditForm(item);
    setModalMode('edit');
    onOpen();
  }, [setSelectedItem, setEditForm, setModalMode, onOpen]);

  const handleUpdate = useCallback(async () => {
    if (!selectedItem?.id) return;
    try {
      await updateItem({ id: selectedItem.id, data: editForm });
      onClose();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  }, [selectedItem, editForm, updateItem, onClose]);

  const handleCreate = useCallback(async () => {
    if (Object.keys(dynamicFields).length === 0) {
      return;
    }
    
    const payload = {
      id: uuidv4(),
      ...dynamicFields
    };

    try {
      // First close the dialog
      onClose();
      
      // Then create the item
      await createItem(payload);
      
      // Finally reset the form state
      setDynamicFields({});
      setNewField({ name: '', value: '' });
      resetForm();
    } catch (error) {
      console.error('Error creating item:', error);
      // Reopen dialog if there's an error
      onOpen();
    }
  }, [createItem, dynamicFields, onClose, onOpen, resetForm, setDynamicFields, setNewField]);

  const handleAddField = useCallback(() => {
    if (newField.name.trim()) {
      setDynamicFields(prev => ({
        ...prev,
        [newField.name.trim()]: newField.value
      }));
      setNewField({ name: '', value: '' });
    }
  }, [newField, setDynamicFields, setNewField]);

  const removeField = useCallback((fieldName: string) => {
    setDynamicFields(prev => {
      const newFields = { ...prev };
      delete newFields[fieldName];
      return newFields;
    });
  }, [setDynamicFields]);

  const handleOpenCreate = useCallback(() => {
    setModalMode('create');
    resetForm();
    onOpen();
  }, [setModalMode, resetForm, onOpen]);

  // Then define memoized values that depend on handlers
  const columnKeys = useMemo(() => Array.from(new Set(
    items.flatMap((item: DynamicData) => 
      item ? Object.keys(item) : []
    )
  )).filter((key): key is string => key !== 'id'), [items]);

  const columns: ColumnDef<DynamicData>[] = useMemo(() => [
    ...columnKeys.map((key) => ({
      accessorKey: key,
      header: key.toUpperCase(),
      enableSorting: true,
    })),
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }: { row: Row<DynamicData> }) => {
        const item = row.original;
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
        )
      }
    }
  ], [columnKeys, handleEdit, handleDelete]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

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
              <Button onClick={handleOpenCreate} size="sm">
                Add New Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={items as DynamicData[]} />
          </CardContent>
        </Card>

        <ItemFormDialog
          isOpen={isOpen}
          onClose={onClose}
          mode={modalMode}
          editForm={editForm}
          setEditForm={setEditForm}
          dynamicFields={dynamicFields}
          setDynamicFields={setDynamicFields}
          handleAddField={handleAddField}
          removeField={removeField}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          newField={newField}
          setNewField={setNewField}
        />
      </PageContent>    </PageLayout>  );}
