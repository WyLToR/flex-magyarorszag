import { ProductStatus, ProductType } from "../../helper";

export type SelectOption<T> = {
    value: T;
    label: string;
};

export type ProductFormState = {
    name: string;
    productType: ProductType;
    description: string;
    status: ProductStatus;
};

export const productTypeOptions: SelectOption<ProductType>[] = [
    { value: ProductType.Phone, label: "Phone" },
    { value: ProductType.Tablet, label: "Tablet" },
    { value: ProductType.Smartwatch, label: "Smartwatch" },
    { value: ProductType.Earbuds, label: "Earbuds" },
    { value: ProductType.Webcam, label: "Webcam" }
];

export const statusOptions: SelectOption<ProductStatus>[] = [
    { value: ProductStatus.Completed, label: "Completed" },
    { value: ProductStatus.InProgress, label: "In Progress" },
    { value: ProductStatus.Halted, label: "Halted" },
    { value: ProductStatus.Failed, label: "Failed" },
    { value: ProductStatus.Canceled, label: "Canceled" }
];

export const createInitialFormState = (): ProductFormState => ({
    name: "",
    productType: ProductType.Phone,
    description: "",
    status: ProductStatus.InProgress
});

export const createWebcamTemplateState = (): ProductFormState => ({
    name: "Webcam product",
    productType: ProductType.Webcam,
    description: "Webcam product description",
    status: ProductStatus.InProgress
});
