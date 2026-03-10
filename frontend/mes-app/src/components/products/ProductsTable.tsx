import { JSX } from "react";
import {
    DeviceMeetingRoomRegular,
    EditRegular,
    PhoneRegular,
    SmartwatchRegular,
    SurfaceEarbudsRegular,
    TabletRegular
} from "@fluentui/react-icons";
import {
    Badge,
    Button,
    Table,
    TableBody,
    TableCell,
    TableCellLayout,
    TableHeader,
    TableHeaderCell,
    TableRow
} from "@fluentui/react-components";
import type { JSXElement } from "@fluentui/react-components";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { Product, ProductStatus, ProductType, getProductStatusColor } from "../../helper";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

type ProductsTableProps = {
    items: Product[];
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => Promise<void>;
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

const formatRelativeDate = (value: string | null): string => {
    if (!value) {
        return "-";
    }

    return timeAgo.format(new Date(value));
};

export const ProductsTable = ({ items, onEdit, onDelete }: ProductsTableProps): JSXElement => {
    return (
        <Table aria-label="Products table" style={{ minWidth: "700px" }}>
            <TableHeader>
                <TableRow>
                    {columns.map((column) => (
                        <TableHeaderCell key={column.columnKey}>{column.label}</TableHeaderCell>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>
                            <TableCellLayout>{product.name}</TableCellLayout>
                        </TableCell>
                        <TableCell>
                            <TableCellLayout media={getProductIcon(product.productType)}>
                                {ProductType[product.productType]}
                            </TableCellLayout>
                        </TableCell>
                        <TableCell>
                            <TableCellLayout>
                                <Badge
                                    role="img"
                                    title={ProductStatus[product.status]}
                                    aria-label="Status"
                                    appearance="filled"
                                    color={getProductStatusColor(product.status)}
                                />
                            </TableCellLayout>
                        </TableCell>
                        <TableCell>
                            <TableCellLayout>{product.description ?? "-"}</TableCellLayout>
                        </TableCell>
                        <TableCell>
                            <TableCellLayout>{formatRelativeDate(product.created)}</TableCellLayout>
                        </TableCell>
                        <TableCell>
                            <TableCellLayout>{formatRelativeDate(product.modifiedTime)}</TableCellLayout>
                        </TableCell>
                        <TableCell>
                            <TableCellLayout>{product.lastUpdate ?? "-"}</TableCellLayout>
                        </TableCell>
                        <TableCell>
                            <TableCellLayout>
                                <Button appearance="subtle" onClick={() => onEdit(product)} icon={<EditRegular />}>
                                    Edit
                                </Button>
                                <Button appearance="subtle" onClick={() => void onDelete(product)}>
                                    Delete
                                </Button>
                            </TableCellLayout>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
