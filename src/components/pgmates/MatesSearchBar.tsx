import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MatesSearchBarProps {
    search: string;
    onSearchChange: (val: string) => void;
    floorFilter: string;
    onFloorChange: (val: string) => void;
    floors: { id: string; label: string }[];
    totalCount: number;
    filteredCount: number;
}

export default function MatesSearchBar({
    search,
    onSearchChange,
    floorFilter,
    onFloorChange,
    floors,
    totalCount,
    filteredCount,
}: MatesSearchBarProps) {
    const hasFilters = search.length > 0 || floorFilter !== "ALL";

    const clearAll = () => {
        onSearchChange("");
        onFloorChange("ALL");
    };

    return (
        <div className="space-y-3">
            {/* Search + floor filter row */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 h-11 bg-card border-border focus-visible:ring-primary/30"
                    />
                    {search && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Floor filter pills */}
                {floors.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={() => onFloorChange("ALL")}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                                floorFilter === "ALL"
                                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                            }`}
                        >
                            All Floors
                        </button>
                        {floors.map((floor) => (
                            <button
                                key={floor.id}
                                onClick={() => onFloorChange(floor.id)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                                    floorFilter === floor.id
                                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                        : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                                }`}
                            >
                                {floor.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Results count + clear */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                    Showing{" "}
                    <span className="font-bold text-foreground">{filteredCount}</span>
                    {" "}of{" "}
                    <span className="font-bold text-foreground">{totalCount}</span>
                    {" "}housemates
                </p>
                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAll}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
                    >
                        <X className="h-3 w-3" /> Clear filters
                    </Button>
                )}
            </div>
        </div>
    );
}
