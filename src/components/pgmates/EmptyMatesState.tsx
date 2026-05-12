import { Users2 } from "lucide-react";

interface EmptyMatesStateProps {
    hasFilters: boolean;
}

export default function EmptyMatesState({ hasFilters }: EmptyMatesStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <Users2 className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <div>
                <p className="font-bold text-foreground">
                    {hasFilters ? "No matches found" : "No housemates yet"}
                </p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    {hasFilters
                        ? "Try adjusting your search or floor filter."
                        : "You're the first one here! Your housemates will appear once they join."}
                </p>
            </div>
        </div>
    );
}
