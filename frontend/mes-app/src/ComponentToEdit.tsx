import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { JSXElement } from "@fluentui/react-components";
import { Product, ProductUpsertRequest } from "./helper";
import {
    ProductFormState,
    createInitialFormState,
    createWebcamTemplateState
} from "./components/products/formTypes";
import { ProductEditorForm } from "./components/products/ProductEditorForm";
import { ProductsTable } from "./components/products/ProductsTable";
import { SearchPanel } from "./components/products/SearchPanel";

const API_BASE_URL = "http://127.0.0.1:5001/api/products";

const toFormState = (product: Product): ProductFormState => ({
    name: product.name,
    productType: product.productType,
    description: product.description ?? "",
    status: product.status
});

const toUpsertRequest = (form: ProductFormState): ProductUpsertRequest => ({
    name: form.name.trim(),
    productType: form.productType,
    description: form.description.trim() ? form.description.trim() : null,
    status: form.status
});

const getProductsUrl = (search: string): string => {
    const query = search.trim();
    if (!query) {
        return API_BASE_URL;
    }

    return `${API_BASE_URL}?search=${encodeURIComponent(query)}`;
};

const throwIfNotOk = async (response: Response, fallback: string): Promise<void> => {
    if (response.ok) {
        return;
    }

    const message = (await response.text()).trim();
    throw new Error(message || `${fallback} (${response.status})`);
};

const fetchProducts = async (search: string): Promise<Product[]> => {
    const response = await fetch(getProductsUrl(search));
    await throwIfNotOk(response, "Failed to load products");
    return response.json() as Promise<Product[]>;
};

const saveProduct = async (productId: number | null, payload: ProductUpsertRequest): Promise<void> => {
    const isEdit = productId !== null;
    const response = await fetch(isEdit ? `${API_BASE_URL}/${productId}` : API_BASE_URL, {
        method: isEdit ? "PUT" : "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    await throwIfNotOk(response, isEdit ? "Update failed" : "Create failed");
};

const removeProduct = async (productId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${productId}`, {
        method: "DELETE"
    });
    await throwIfNotOk(response, "Delete failed");
};

export const ComponentToEdit = (): JSXElement => {
    const [items, setItems] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [form, setForm] = useState<ProductFormState>(createInitialFormState);

    const hasActiveSearch = useMemo(() => activeSearch.trim().length > 0, [activeSearch]);

    const resetToCreateMode = useCallback(() => {
        setSelectedProductId(null);
        setForm(createInitialFormState());
    }, []);

    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await fetchProducts(activeSearch);
            setItems(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load products.");
        } finally {
            setIsLoading(false);
        }
    }, [activeSearch]);

    useEffect(() => {
        void loadProducts();
    }, [loadProducts]);

    const handleSearchSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextSearch = searchText.trim();

        if (nextSearch === activeSearch) {
            await loadProducts();
            return;
        }

        setActiveSearch(nextSearch);
    }, [activeSearch, loadProducts, searchText]);

    const handleSearchClear = useCallback(() => {
        if (!searchText && !activeSearch) {
            return;
        }

        setSearchText("");
        setActiveSearch("");
    }, [activeSearch, searchText]);

    const handleStartEdit = useCallback((product: Product) => {
        setSelectedProductId(product.id);
        setForm(toFormState(product));
    }, []);

    const handleFormChange = useCallback(<K extends keyof ProductFormState>(field: K, value: ProductFormState[K]) => {
        setForm((current) => ({ ...current, [field]: value }));
    }, []);

    const handleUseWebcamTemplate = useCallback(() => {
        setSelectedProductId(null);
        setForm(createWebcamTemplateState());
    }, []);

    const handleFormSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!form.name.trim()) {
            setError("Name is required.");
            return;
        }

        try {
            await saveProduct(selectedProductId, toUpsertRequest(form));
            await loadProducts();
            resetToCreateMode();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed.");
        }
    }, [form, loadProducts, resetToCreateMode, selectedProductId]);

    const handleDelete = useCallback(async (product: Product) => {
        if (!window.confirm(`Delete "${product.name}"?`)) {
            return;
        }

        setError(null);
        try {
            await removeProduct(product.id);
            await loadProducts();

            if (selectedProductId === product.id) {
                resetToCreateMode();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed.");
        }
    }, [loadProducts, resetToCreateMode, selectedProductId]);

    return (
        <>
            <div style={{ backgroundColor: "#f0f0f0", color: "#000", padding: 10, marginBottom: 12 }}>Products</div>

            <SearchPanel
                searchText={searchText}
                activeSearch={activeSearch}
                onSearchTextChange={setSearchText}
                onSearchSubmit={handleSearchSubmit}
                onSearchClear={handleSearchClear}
            />

            <ProductEditorForm
                form={form}
                selectedProductId={selectedProductId}
                onChange={handleFormChange}
                onSubmit={handleFormSubmit}
                onClear={resetToCreateMode}
                onUseWebcamTemplate={handleUseWebcamTemplate}
            />

            {error && <div style={{ color: "#b10e1e", marginBottom: 10, textAlign: "left" }}>{error}</div>}
            {isLoading && <div style={{ marginBottom: 10, textAlign: "left" }}>Loading products...</div>}

            {!isLoading && items.length === 0 && (
                <div style={{ marginBottom: 10, textAlign: "left", color: "#5a5a5a" }}>
                    {hasActiveSearch ? "No products match the current search." : "No products found."}
                </div>
            )}

            <ProductsTable items={items} onEdit={handleStartEdit} onDelete={handleDelete} />
        </>
    );
};
