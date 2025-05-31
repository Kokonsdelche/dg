import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

interface ProductFormData {
        name: string;
        description: string;
        price: number;
        discountPrice?: number;
        category: string;
        subcategory?: string;
        brand?: string;
        material?: string;
        stock: number;
        sizes: Array<{ name: string; dimensions?: string; stock: number }>;
        colors: Array<{ name: string; hex: string; stock: number }>;
        tags: string[];
        isFeatured: boolean;
        isActive: boolean;
}

const AddProduct: React.FC = () => {
        const navigate = useNavigate();
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState('');
        const [success, setSuccess] = useState('');
        const [selectedImages, setSelectedImages] = useState<File[]>([]);

        const [formData, setFormData] = useState<ProductFormData>({
                name: '',
                description: '',
                price: 0,
                discountPrice: undefined,
                category: 'شال',
                subcategory: undefined,
                brand: undefined,
                material: undefined,
                stock: 0,
                sizes: [],
                colors: [],
                tags: [],
                isFeatured: false,
                isActive: true
        });

        const availableSizes = ['S', 'M', 'L', 'XL', 'Free Size'];
        const availableColors = [
                { name: 'قرمز', hex: '#ff0000' },
                { name: 'آبی', hex: '#0000ff' },
                { name: 'سبز', hex: '#00ff00' },
                { name: 'زرد', hex: '#ffff00' },
                { name: 'مشکی', hex: '#000000' },
                { name: 'سفید', hex: '#ffffff' },
                { name: 'صورتی', hex: '#ffc0cb' },
                { name: 'بنفش', hex: '#800080' },
                { name: 'نقره‌ای', hex: '#c0c0c0' },
                { name: 'طلایی', hex: '#ffd700' }
        ];
        const availableMaterials = ['کشمیر', 'نخ', 'ابریشم', 'پلی‌استر', 'ویسکوز', 'مخلوط'];

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                const { name, value, type } = e.target;

                if (type === 'checkbox') {
                        const target = e.target as HTMLInputElement;
                        setFormData(prev => ({
                                ...prev,
                                [name]: target.checked
                        }));
                } else if (type === 'number') {
                        setFormData(prev => ({
                                ...prev,
                                [name]: parseFloat(value) || 0
                        }));
                } else {
                        setFormData(prev => ({
                                ...prev,
                                [name]: value === '' ? undefined : value
                        }));
                }
        };

        const handleSizeChange = (sizeName: string) => {
                setFormData(prev => {
                        const exists = prev.sizes.find(s => s.name === sizeName);
                        if (exists) {
                                return {
                                        ...prev,
                                        sizes: prev.sizes.filter(s => s.name !== sizeName)
                                };
                        } else {
                                return {
                                        ...prev,
                                        sizes: [...prev.sizes, { name: sizeName, stock: 10 }]
                                };
                        }
                });
        };

        const handleColorChange = (colorName: string, colorHex: string) => {
                setFormData(prev => {
                        const exists = prev.colors.find(c => c.name === colorName);
                        if (exists) {
                                return {
                                        ...prev,
                                        colors: prev.colors.filter(c => c.name !== colorName)
                                };
                        } else {
                                return {
                                        ...prev,
                                        colors: [...prev.colors, { name: colorName, hex: colorHex, stock: 10 }]
                                };
                        }
                });
        };

        const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                setFormData(prev => ({
                        ...prev,
                        tags
                }));
        };

        const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) {
                        const files = Array.from(e.target.files);
                        setSelectedImages(files.slice(0, 5)); // Maximum 5 images
                }
        };

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault();
                setIsLoading(true);
                setError('');
                setSuccess('');

                try {
                        const formDataToSend = new FormData();

                        // Add product data
                        formDataToSend.append('productData', JSON.stringify(formData));

                        // Add images
                        selectedImages.forEach((image, index) => {
                                formDataToSend.append('images', image);
                        });

                        await adminAPI.createProduct(formDataToSend);
                        setSuccess('محصول با موفقیت اضافه شد');

                        setTimeout(() => {
                                navigate('/admin/products');
                        }, 2000);
                } catch (error: any) {
                        setError('خطا در افزودن محصول: ' + (error.response?.data?.message || error.message));
                } finally {
                        setIsLoading(false);
                }
        };

        return (
                <div className="min-h-screen bg-gray-50 py-8">
                        <div className="container mx-auto px-4">
                                <div className="max-w-4xl mx-auto">
                                        {/* Header */}
                                        <div className="mb-8">
                                                <div className="flex items-center gap-4">
                                                        <Link
                                                                to="/admin/products"
                                                                className="text-gray-600 hover:text-gray-800 text-2xl"
                                                        >
                                                                ←
                                                        </Link>
                                                        <div>
                                                                <h1 className="text-3xl font-bold text-gray-800">افزودن محصول جدید</h1>
                                                                <p className="text-gray-600 mt-1">اطلاعات محصول را کامل کنید</p>
                                                        </div>
                                                </div>
                                        </div>

                                        {error && (
                                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                                        {error}
                                                </div>
                                        )}

                                        {success && (
                                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                                                        {success}
                                                </div>
                                        )}

                                        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {/* Basic Information */}
                                                        <div className="space-y-6">
                                                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">اطلاعات اصلی</h3>

                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">نام محصول *</label>
                                                                        <input
                                                                                type="text"
                                                                                name="name"
                                                                                value={formData.name}
                                                                                onChange={handleInputChange}
                                                                                required
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                                placeholder="نام محصول را وارد کنید"
                                                                        />
                                                                </div>

                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات *</label>
                                                                        <textarea
                                                                                name="description"
                                                                                value={formData.description}
                                                                                onChange={handleInputChange}
                                                                                required
                                                                                rows={4}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                                placeholder="توضیحات محصول را بنویسید"
                                                                        />
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">قیمت (تومان) *</label>
                                                                                <input
                                                                                        type="number"
                                                                                        name="price"
                                                                                        value={formData.price}
                                                                                        onChange={handleInputChange}
                                                                                        required
                                                                                        min="0"
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                                />
                                                                        </div>

                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">موجودی *</label>
                                                                                <input
                                                                                        type="number"
                                                                                        name="stock"
                                                                                        value={formData.stock}
                                                                                        onChange={handleInputChange}
                                                                                        required
                                                                                        min="0"
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                                />
                                                                        </div>
                                                                </div>

                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی *</label>
                                                                        <select
                                                                                name="category"
                                                                                value={formData.category}
                                                                                onChange={handleInputChange}
                                                                                required
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                        >
                                                                                <option value="شال">شال</option>
                                                                                <option value="روسری">روسری</option>
                                                                                <option value="سایر">سایر</option>
                                                                        </select>
                                                                </div>
                                                        </div>

                                                        {/* Product Details */}
                                                        <div className="space-y-6">
                                                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">جزئیات محصول</h3>

                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">سایزها</label>
                                                                        <div className="flex flex-wrap gap-2">
                                                                                {availableSizes.map(size => (
                                                                                        <label key={size} className="flex items-center">
                                                                                                <input
                                                                                                        type="checkbox"
                                                                                                        checked={formData.sizes.some(s => s.name === size)}
                                                                                                        onChange={() => handleSizeChange(size)}
                                                                                                        className="ml-2"
                                                                                                />
                                                                                                <span className="text-sm">{size}</span>
                                                                                        </label>
                                                                                ))}
                                                                        </div>
                                                                </div>

                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">رنگ‌ها</label>
                                                                        <div className="flex flex-wrap gap-2">
                                                                                {availableColors.map((color, index) => (
                                                                                        <label key={color.name} className="flex items-center">
                                                                                                <input
                                                                                                        type="checkbox"
                                                                                                        checked={formData.colors.some(c => c.name === color.name)}
                                                                                                        onChange={() => handleColorChange(color.name, color.hex)}
                                                                                                        className="ml-2"
                                                                                                />
                                                                                                <span className="text-sm">{color.name}</span>
                                                                                        </label>
                                                                                ))}
                                                                        </div>
                                                                </div>

                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">جنس</label>
                                                                        <div className="flex flex-wrap gap-2">
                                                                                {availableMaterials.map(material => (
                                                                                        <label key={material} className="flex items-center">
                                                                                                <input
                                                                                                        type="radio"
                                                                                                        name="material"
                                                                                                        value={material}
                                                                                                        checked={formData.material === material}
                                                                                                        onChange={handleInputChange}
                                                                                                        className="ml-2"
                                                                                                />
                                                                                                <span className="text-sm">{material}</span>
                                                                                        </label>
                                                                                ))}
                                                                        </div>
                                                                </div>

                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">تصاویر محصول</label>
                                                                        <input
                                                                                type="file"
                                                                                multiple
                                                                                accept="image/*"
                                                                                onChange={handleImageChange}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                        />
                                                                        <p className="text-sm text-gray-500 mt-1">حداکثر 5 تصویر (هر کدام حداکثر 5MB)</p>

                                                                        {selectedImages.length > 0 && (
                                                                                <div className="mt-2">
                                                                                        <p className="text-sm text-gray-600">{selectedImages.length} تصویر انتخاب شده</p>
                                                                                </div>
                                                                        )}
                                                                </div>

                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">برند</label>
                                                                        <input
                                                                                type="text"
                                                                                name="brand"
                                                                                value={formData.brand || ''}
                                                                                onChange={handleInputChange}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                                placeholder="برند محصول"
                                                                        />
                                                                </div>

                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">زیردسته</label>
                                                                        <input
                                                                                type="text"
                                                                                name="subcategory"
                                                                                value={formData.subcategory || ''}
                                                                                onChange={handleInputChange}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                                placeholder="زیردسته محصول"
                                                                        />
                                                                </div>

                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">قیمت تخفیف‌دار (تومان)</label>
                                                                        <input
                                                                                type="number"
                                                                                name="discountPrice"
                                                                                value={formData.discountPrice || ''}
                                                                                onChange={handleInputChange}
                                                                                min="0"
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                                placeholder="در صورت وجود تخفیف"
                                                                        />
                                                                </div>

                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">برچسب‌ها</label>
                                                                        <input
                                                                                type="text"
                                                                                value={formData.tags.join(', ')}
                                                                                onChange={handleTagsChange}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                                placeholder="برچسب‌ها را با ویرگول جدا کنید (مثال: زیبا, مدرن, کیفیت بالا)"
                                                                        />
                                                                        <p className="text-sm text-gray-500 mt-1">
                                                                                برچسب‌های انتخاب شده: {formData.tags.join(', ') || 'هیچ برچسبی انتخاب نشده'}
                                                                        </p>
                                                                </div>

                                                                <div className="space-y-3">
                                                                        <label className="flex items-center">
                                                                                <input
                                                                                        type="checkbox"
                                                                                        name="isFeatured"
                                                                                        checked={formData.isFeatured}
                                                                                        onChange={handleInputChange}
                                                                                        className="ml-2"
                                                                                />
                                                                                <span className="text-sm font-medium text-gray-700">محصول ویژه</span>
                                                                        </label>

                                                                        <label className="flex items-center">
                                                                                <input
                                                                                        type="checkbox"
                                                                                        name="isActive"
                                                                                        checked={formData.isActive}
                                                                                        onChange={handleInputChange}
                                                                                        className="ml-2"
                                                                                />
                                                                                <span className="text-sm font-medium text-gray-700">فعال</span>
                                                                        </label>
                                                                </div>
                                                        </div>
                                                </div>

                                                {/* Submit Buttons */}
                                                <div className="mt-8 flex gap-4 justify-end">
                                                        <Link
                                                                to="/admin/products"
                                                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                        >
                                                                انصراف
                                                        </Link>
                                                        <button
                                                                type="submit"
                                                                disabled={isLoading}
                                                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                                                        >
                                                                {isLoading ? 'در حال ذخیره...' : 'ذخیره محصول'}
                                                        </button>
                                                </div>
                                        </form>
                                </div>
                        </div>
                </div>
        );
};

export default AddProduct; 