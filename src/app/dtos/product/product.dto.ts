export interface ProductDTO {
    id?: number;
    name: string;
    price: number;
    thumbnail: string;
    description: string;
    categoryNames?: string[]; // Mảng chứa tên danh mục
    categoryIds?: number[]; // Mảng chứa ID danh mục
    files?: File[]; // Danh sách file upload
    images?: ProductImageDTO[]; // Danh sách ảnh sản phẩm
}

export interface ProductImageDTO {
    id?: number;
    url: string;
}
