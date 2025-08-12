'use client';

import {
  Button,
  Card,
  CardBody,
  Input,
  Textarea,
  addToast,
} from '@/components/heroui';
import { uploadFile } from '@/services/files';
import { createProduct } from '@/services/product';
import { useRequest } from 'ahooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

export default function CreateProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    images: [] as File[],
  });
  const { loading, runAsync: createProductAsync } = useRequest(createProduct, {
    manual: true,
    onError: (error: Error) => {
      addToast({
        title: error.message || 'Error creating product',
        color: 'danger',
      });
    },
    onSuccess: () => {
      addToast({
        title: 'Product created successfully!',
        color: 'success',
      });
      router.push('/chef/products');
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        images: Array.from(e.target.files || []),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const images = await Promise.all(
      formData.images.map(async file => uploadFile(file))
    );
    const imagesLinks = images.map(image => image.secure_url);

    await createProductAsync({
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      images: imagesLinks,
    });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center font-bold text-3xl">
        Create New Product
      </h1>

      <Card className="mx-auto max-w-2xl">
        <CardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                id="name"
                name="name"
                label="Product Name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
                fullWidth
              />

              <Textarea
                id="description"
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                required
                minRows={4}
                fullWidth
              />

              <Input
                id="price"
                name="price"
                type="number"
                label="Price ($)"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                required
                fullWidth
              />

              <div className="rounded-lg border-2 border-gray-300 border-dashed p-6 text-center">
                <input
                  id="images"
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center">
                    <FiUpload className="mb-2 text-3xl text-gray-400" />
                    <p className="text-gray-500 text-sm">
                      Click to upload images
                    </p>
                    <p className="mt-1 text-gray-400 text-xs">
                      {formData.images.length > 0
                        ? `${formData.images.length} files selected`
                        : 'PNG, JPG up to 5MB'}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="flat" onPress={() => router.back()}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-customBlue to-customLightBlue text-white"
                isLoading={loading}
              >
                Create Product
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
