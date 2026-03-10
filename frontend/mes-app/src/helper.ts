export enum ProductType {
    Phone,
    Tablet,
    Smartwatch,
    Earbuds,
    Webcam
}

export enum ProductStatus {
    Completed,
    InProgress,
    Halted,
    Failed,
    Canceled
}

export interface Product {
    id: number;
    name: string;
    productType: ProductType;
    description: string | null;
    created: string;
    status: ProductStatus;
    modifiedTime: string | null;
    lastUpdate: string | null;
}

export interface ProductUpsertRequest {
    name: string;
    productType: ProductType;
    description: string | null;
    status: ProductStatus;
}

export const getProductStatusColor = (status: ProductStatus): 'brand' | 'danger' | 'important' | 'informative' | 'severe' | 'subtle' | 'success' | 'warning' => {
    switch (status) {
        case ProductStatus.Completed:
            return "success";
        case ProductStatus.InProgress:
            return "warning";
        case ProductStatus.Halted:
            return "important";
        case ProductStatus.Failed:
            return "severe";
        case ProductStatus.Canceled:
            return "brand";
        default:
            return "subtle";
    }
}
