import { FormEvent } from "react";
import { Button } from "@fluentui/react-components";
import type { JSXElement } from "@fluentui/react-components";
import { ProductStatus, ProductType } from "../../helper";
import { ProductFormState, productTypeOptions, statusOptions } from "./formTypes";

type ProductEditorFormProps = {
    form: ProductFormState;
    selectedProductId: number | null;
    onChange: <K extends keyof ProductFormState>(field: K, value: ProductFormState[K]) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    onClear: () => void;
    onUseWebcamTemplate: () => void;
};

export const ProductEditorForm = ({
    form,
    selectedProductId,
    onChange,
    onSubmit,
    onClear,
    onUseWebcamTemplate
}: ProductEditorFormProps): JSXElement => {
    const isEditMode = selectedProductId !== null;
    const title = isEditMode ? `Edit Product #${selectedProductId}` : "Create Product";
    const submitLabel = isEditMode ? "Update" : "Create";

    return (
        <form
            onSubmit={onSubmit}
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
            <div style={{ gridColumn: "1 / -1", textAlign: "left", fontWeight: 600 }}>{title}</div>
            <label style={{ textAlign: "left" }}>
                Name
                <input
                    value={form.name}
                    onChange={(event) => onChange("name", event.target.value)}
                    style={{ display: "block", width: "100%", padding: 8, boxSizing: "border-box" }}
                    placeholder="Product name"
                />
            </label>
            <label style={{ textAlign: "left" }}>
                Type
                <select
                    value={form.productType}
                    onChange={(event) => onChange("productType", Number(event.target.value) as ProductType)}
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
                    onChange={(event) => onChange("status", Number(event.target.value) as ProductStatus)}
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
                    onChange={(event) => onChange("description", event.target.value)}
                    rows={2}
                    style={{ display: "block", width: "100%", padding: 8, boxSizing: "border-box", resize: "vertical" }}
                />
            </label>
            <div style={{ display: "flex", gap: 8, gridColumn: "1 / -1" }}>
                <Button type="submit" appearance="primary">
                    {submitLabel}
                </Button>
                <Button type="button" appearance="secondary" onClick={onClear}>
                    Clear
                </Button>
                <Button type="button" appearance="subtle" onClick={onUseWebcamTemplate}>
                    Example: Webcam
                </Button>
            </div>
        </form>
    );
};
