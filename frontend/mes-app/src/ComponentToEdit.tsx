import { JSX, FormEvent, useCallback, useEffect, useState } from "react";
import {
    PhoneRegular,
    TabletRegular,
    SmartwatchRegular,
    SurfaceEarbudsRegular,
    DeviceMeetingRoomRegular,
    EditRegular
} from "@fluentui/react-icons";
import {
    TableBody,
    TableCell,
    TableRow,
    Table,
    TableHeader,
    TableHeaderCell,
    TableCellLayout,
    Badge,
    Button
} from "@fluentui/react-components";
import type { JSXElement } from "@fluentui/react-components";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { Product, ProductStatus, ProductUpsertRequest, getProductStatusColor, ProductType } from "./helper";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");
const apiBaseUrl = "http://127.0.0.1:5001/api/products";

const productTypeOptions = [
    { value: ProductType.Phone, label: "Phone" },
    { value: ProductType.Tablet, label: "Tablet" },
    { value: ProductType.Smartwatch, label: "Smartwatch" },
    { value: ProductType.Earbuds, label: "Earbuds" },
    { value: ProductType.Webcam, label: "Webcam" }
];

const statusOptions = [
    { value: ProductStatus.Completed, label: "Completed" },
    { value: ProductStatus.InProgress, label: "In Progress" },
    { value: ProductStatus.Halted, label: "Halted" },
    { value: ProductStatus.Failed, label: "Failed" },
    { value: ProductStatus.Canceled, label: "Canceled" }
];

const getProductIcon = (productType: ProductType): JSX.Element => {
    switch (productType) {
        case ProductType.Phone:
            return <PhoneRegular />;
        case ProductType.Tablet:
            return <TabletRegular />;
        case ProductType.Smartwatch:
            return <SmartwatchRegular />;
        case ProductType.Earbuds:
            return <SurfaceEarbudsRegular />;
        case ProductType.Webcam:
            return <DeviceMeetingRoomRegular />;
        default:
            return <DeviceMeetingRoomRegular />;
    }
};

type ProductFormState = {
    name: string;
    productType: ProductType;
    description: string;
    status: ProductStatus;
};

const columns = [
    { columnKey: "product", label: "Product" },
    { columnKey: "type", label: "Type" },
    { columnKey: "status", label: "Status" },
    { columnKey: "description", label: "Description" },
    { columnKey: "created", label: "Created" },
    { columnKey: "modified", label: "Modified" },
    { columnKey: "lastUpdate", label: "Last Update" },
    { columnKey: "actions", label: "Actions" }
];

export const ComponentToEdit = (): JSXElement => {
    const [items, setItems] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [form, setForm] = useState<ProductFormState>({
        name: "",
        productType: ProductType.Phone,
        description: "",
        status: ProductStatus.InProgress
    });

    const resetToCreateMode = () => {
        setSelectedProductId(null);
        setForm({
            name: "",
            productType: ProductType.Phone,
            description: "",
            status: ProductStatus.InProgress
        });
    };

    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(apiBaseUrl);
            if (!response.ok) {
                throw new Error(`Failed to load products (${response.status})`);
            }

            const data: Product[] = await response.json();
            setItems(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load products.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleStartEdit = (product: Product) => {
        setSelectedProductId(product.id);
        setForm({
            name: product.name,
            productType: product.productType,
            description: product.description ?? "",
            status: product.status
        });
    };

    const handleInputChange = <K extends keyof ProductFormState>(field: K, value: ProductFormState[K]) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleCreateWebcamTemplate = () => {
        setSelectedProductId(null);
        setForm({
            name: "Webcam product",
            productType: ProductType.Webcam,
            description: "Webcam product description",
            status: ProductStatus.InProgress
        });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!form.name.trim()) {
            setError("Name is required.");
            return;
        }

        const payload: ProductUpsertRequest = {
            name: form.name.trim(),
            productType: form.productType,
            description: form.description.trim() ? form.description.trim() : null,
            status: form.status
        };

        const isEdit = selectedProductId !== null;
        const url = isEdit ? `${apiBaseUrl}/${selectedProductId}` : apiBaseUrl;
        const method = isEdit ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || `${method} failed (${response.status})`);
            }

            await loadProducts();
            resetToCreateMode();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed.");
        }
    };

    const handleDelete = async (product: Product) => {
        if (!window.confirm(`Delete "${product.name}"?`)) {
            return;
        }

        setError(null);
        try {
            const response = await fetch(`${apiBaseUrl}/${product.id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error(`Delete failed (${response.status})`);
            }

            await loadProducts();
            if (selectedProductId === product.id) {
                resetToCreateMode();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed.");
        }
    };

    return (
        <>
            <div style={{ backgroundColor: "#f0f0f0", color: "#000", padding: 10, marginBottom: 12 }}>Products</div>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 10,
                    marginBottom: 14,
                    padding: 12,
                    border: "1px solid #d0d0d0",
                    borderRadius: 8
                }}
            >
                <div style={{ gridColumn: "1 / -1", textAlign: "left", fontWeight: 600 }}>
                    {selectedProductId === null ? "Create Product" : `Edit Product #${selectedProductId}`}
                </div>
                <label style={{ textAlign: "left" }}>
                    Name
                    <input
                        value={form.name}
                        onChange={(event) => handleInputChange("name", event.target.value)}
                        style={{ display: "block", width: "100%", padding: 8, boxSizing: "border-box" }}
                        placeholder="Product name"
                    />
                </label>
                <label style={{ textAlign: "left" }}>
                    Type
                    <select
                        value={form.productType}
                        onChange={(event) => handleInputChange("productType", Number(event.target.value) as ProductType)}
                        style={{ display: "block", width: "100%", padding: 8, boxSizing: "border-box" }}
                    >
                        {productTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </label>
                <label style={{ textAlign: "left" }}>
                    Status
                    <select
                        value={form.status}
                        onChange={(event) => handleInputChange("status", Number(event.target.value) as ProductStatus)}
                        style={{ display: "block", width: "100%", padding: 8, boxSizing: "border-box" }}
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </label>
                <label style={{ textAlign: "left", gridColumn: "1 / -1" }}>
                    Description
                    <textarea
                        value={form.description}
                        onChange={(event) => handleInputChange("description", event.target.value)}
                        rows={2}
                        style={{ display: "block", width: "100%", padding: 8, boxSizing: "border-box", resize: "vertical" }}
                    />
                </label>
                <div style={{ display: "flex", gap: 8, gridColumn: "1 / -1" }}>
                    <Button type="submit" appearance="primary">
                        {selectedProductId === null ? "Create" : "Update"}
                    </Button>
                    <Button type="button" appearance="secondary" onClick={resetToCreateMode}>
                        Clear
                    </Button>
                    <Button type="button" appearance="subtle" onClick={handleCreateWebcamTemplate}>
                        Example: Webcam
                    </Button>
                </div>
            </form>

            {error && <div style={{ color: "#b10e1e", marginBottom: 10, textAlign: "left" }}>{error}</div>}
            {isLoading && <div style={{ marginBottom: 10, textAlign: "left" }}>Loading products...</div>}

            <Table aria-label="Products table" style={{ minWidth: "700px" }}>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHeaderCell key={column.columnKey}>
                                {column.label}
                            </TableHeaderCell>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((product: Product) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                <TableCellLayout>
                                    {product.name}
                                </TableCellLayout>
                            </TableCell>
                            <TableCell>
                                <TableCellLayout media={getProductIcon(product.productType)}>
                                    {ProductType[product.productType]}
                                </TableCellLayout>
                            </TableCell>
                            <TableCell>
                                <TableCellLayout>
                                    <Badge role="img" title={ProductStatus[product.status]} aria-label="Active" appearance="filled" color={getProductStatusColor(product.status)} />
                                </TableCellLayout>
                            </TableCell>
                            <TableCell>
                                <TableCellLayout>
                                    {product.description ?? "-"}
                                </TableCellLayout>
                            </TableCell>
                            <TableCell>
                                <TableCellLayout>
                                    {timeAgo.format(new Date(product.created))}
                                </TableCellLayout>
                            </TableCell>
                            <TableCell>
                                <TableCellLayout>
                                    {product.modifiedTime ? timeAgo.format(new Date(product.modifiedTime)) : "-"}
                                </TableCellLayout>
                            </TableCell>
                            <TableCell>
                                <TableCellLayout>
                                    {product.lastUpdate ?? "-"}
                                </TableCellLayout>
                            </TableCell>
                            <TableCell>
                                <TableCellLayout>
                                    <Button appearance="subtle" onClick={() => handleStartEdit(product)} icon={<EditRegular />}>
                                        Edit
                                    </Button>
                                    <Button appearance="subtle" onClick={() => handleDelete(product)}>
                                        Delete
                                    </Button>
                                </TableCellLayout>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};
