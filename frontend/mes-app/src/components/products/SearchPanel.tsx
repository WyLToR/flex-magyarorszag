import { FormEvent } from "react";
import { Button } from "@fluentui/react-components";
import type { JSXElement } from "@fluentui/react-components";

type SearchPanelProps = {
    searchText: string;
    activeSearch: string;
    onSearchTextChange: (value: string) => void;
    onSearchSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    onSearchClear: () => void;
};

const SEARCH_PLACEHOLDER = "Name, description, status, type or id";

export const SearchPanel = ({
    searchText,
    activeSearch,
    onSearchTextChange,
    onSearchSubmit,
    onSearchClear
}: SearchPanelProps): JSXElement => {
    return (
        <form
            onSubmit={onSearchSubmit}
            style={{
                display: "flex",
                gap: 8,
                alignItems: "end",
                marginBottom: 12
            }}
        >
            <label style={{ textAlign: "left", flex: 1 }}>
                Search
                <input
                    value={searchText}
                    onChange={(event) => onSearchTextChange(event.target.value)}
                    placeholder={SEARCH_PLACEHOLDER}
                    style={{ display: "block", width: "100%", padding: 8, boxSizing: "border-box" }}
                />
            </label>
            <Button type="submit" appearance="primary">
                Search
            </Button>
            <Button type="button" appearance="secondary" onClick={onSearchClear}>
                Clear
            </Button>
            {activeSearch && <div style={{ fontSize: 12, color: "#5a5a5a" }}>Active: {activeSearch}</div>}
        </form>
    );
};
